import pandas as pd
import yfinance as yf
import time
from datetime import datetime

# In-memory dictionary cache: (ticker, start, end) -> (timestamp, DataFrame)
DATA_CACHE = {}
CACHE_TTL_SECONDS = 3600  # 1 hour TTL

def format_ticker(ticker: str) -> str:
    """
    Formats the ticker symbol for Yahoo Finance Indian Market conventions.
    Appends '.NS' (National Stock Exchange) for raw equities if no suffix is present.
    """
    ticker = ticker.strip().upper()
    if ticker.startswith("^") or "." in ticker or "-" in ticker:
        return ticker
    return f"{ticker}.NS"

def fetch_historical_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Downloads historical adjusted closing prices from Yahoo Finance with validation,
    in-memory caching (1-hour TTL), and standardizes the DataFrame.
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
    cache_key = (formatted_symbol, start_date, end_date)
    current_time = time.time()

    # 2. Check Cache
    if cache_key in DATA_CACHE:
        cached_time, cached_df = DATA_CACHE[cache_key]
        if current_time - cached_time < CACHE_TTL_SECONDS:
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
        DATA_CACHE[cache_key] = (current_time, df)
        return df

    except Exception as e:
        if "timeout" in str(e).lower():
            raise RuntimeError(f"Connection timeout fetching data for '{formatted_symbol}'. Yahoo Finance may be rate-limiting requests.")
        raise RuntimeError(f"Failed to fetch data for ticker '{formatted_symbol}': {str(e)}")
