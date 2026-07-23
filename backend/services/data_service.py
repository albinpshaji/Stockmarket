import os
import json
import time
from datetime import datetime
import pandas as pd
import yfinance as yf

# In-memory dictionary cache fallback: (ticker, start, end) -> (timestamp, DataFrame)
DATA_CACHE = {}
CACHE_TTL_SECONDS = 86400  # 24 hours TTL

REDIS_CLIENT = None
try:
    import redis
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    client = redis.Redis.from_url(redis_url, socket_timeout=1.0, socket_connect_timeout=1.0)
    client.ping()
    REDIS_CLIENT = client
except Exception:
    REDIS_CLIENT = None

def format_ticker(ticker: str) -> str:
    """
    Formats the ticker symbol for Yahoo Finance Indian Market conventions.
    Appends '.NS' (National Stock Exchange) for raw equities if no suffix is present.
    """
    ticker = ticker.strip().upper()
    if ticker.startswith("^") or "." in ticker or "-" in ticker or "=" in ticker:
        return ticker
    return f"{ticker}.NS"

def get_cached_df(formatted_symbol: str, start_date: str, end_date: str):
    cache_key = (formatted_symbol, start_date, end_date)
    redis_key = f"rupeesip:data:{formatted_symbol}:{start_date}:{end_date}"

    if REDIS_CLIENT:
        try:
            cached_data = REDIS_CLIENT.get(redis_key)
            if cached_data:
                records = json.loads(cached_data.decode("utf-8"))
                df = pd.DataFrame(records)
                df["Date"] = pd.to_datetime(df["Date"])
                return df
        except Exception:
            pass

    if cache_key in DATA_CACHE:
        cached_time, cached_df = DATA_CACHE[cache_key]
        if time.time() - cached_time < CACHE_TTL_SECONDS:
            return cached_df.copy()

    return None

def set_cached_df(formatted_symbol: str, start_date: str, end_date: str, df: pd.DataFrame):
    cache_key = (formatted_symbol, start_date, end_date)
    redis_key = f"rupeesip:data:{formatted_symbol}:{start_date}:{end_date}"

    DATA_CACHE[cache_key] = (time.time(), df.copy())

    if REDIS_CLIENT:
        try:
            df_copy = df.copy()
            df_copy["Date"] = df_copy["Date"].dt.strftime("%Y-%m-%d")
            records_json = json.dumps(df_copy.to_dict(orient="records"))
            REDIS_CLIENT.set(redis_key, records_json, ex=CACHE_TTL_SECONDS)
        except Exception:
            pass

def fetch_historical_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Downloads historical adjusted closing prices from Yahoo Finance with validation,
    Redis/in-memory persistent caching, and standardizes the DataFrame.
    """
    # 1. Input Date Validations
    try:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise ValueError("Invalid date format. Must be YYYY-MM-DD.")
        
    if start_dt >= end_dt:
        raise ValueError("Start date must be strictly before the end date.")
        
    if end_dt > datetime.now():
        raise ValueError("End date cannot be in the future.")

    formatted_symbol = format_ticker(ticker)

    # 2. Check Cache
    cached_df = get_cached_df(formatted_symbol, start_date, end_date)
    if cached_df is not None:
        return cached_df.copy()

    # 3. Fetch data from Yahoo Finance
    try:
        df = yf.download(
            formatted_symbol, 
            start=start_date, 
            end=end_date, 
            progress=False,
            timeout=10  # 10s download timeout
        )
        if df.empty:
            raise ValueError(f"No historical data found for '{formatted_symbol}' between {start_date} and {end_date}.")
            
        df = df.reset_index()
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] for col in df.columns]
            
        df.columns = [str(col).strip().title() for col in df.columns]
        
        # Identify adjusted close or fallback to close
        close_col = next((c for c in ['Adj Close', 'Adj_Close', 'Close'] if c in df.columns), None)
        if not close_col:
            raise ValueError(f"Could not find closing price column for '{formatted_symbol}'")
            
        df = df[['Date', close_col]].copy()
        df.columns = ['Date', 'Close']
        df['Date'] = pd.to_datetime(df['Date'])
        df['Close'] = pd.to_numeric(df['Close'], errors='coerce')
        df = df.dropna().sort_values('Date').reset_index(drop=True)
        
        if df.empty:
            raise ValueError(f"No valid pricing data remaining for '{formatted_symbol}' after cleaning.")
            
        # 4. Save to Cache
        set_cached_df(formatted_symbol, start_date, end_date, df)
        return df

    except Exception as e:
        if "timeout" in str(e).lower():
            raise RuntimeError(f"Connection timeout fetching data for '{formatted_symbol}'. Yahoo Finance may be rate-limiting requests.")
        raise RuntimeError(f"Failed to fetch data for ticker '{formatted_symbol}': {str(e)}")

