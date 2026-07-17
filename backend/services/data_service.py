import pandas as pd
import yfinance as yf

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
    Downloads historical adjusted closing prices from Yahoo Finance and
    standardizes the DataFrame to ['Date', 'Close'] columns.
    """
    formatted_symbol = format_ticker(ticker)
    try:
        df = yf.download(
            formatted_symbol, 
            start=start_date, 
            end=end_date, 
            progress=False
        )
        if df.empty:
            raise ValueError(f"No historical data found for '{formatted_symbol}'")
            
        df = df.reset_index()
        # Handle multi-index columns returned by yfinance in some configurations
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
            raise ValueError(f"No valid pricing data remaining for '{formatted_symbol}'")
        return df

    except Exception as e:
        raise RuntimeError(f"Failed to fetch data for ticker '{formatted_symbol}': {str(e)}")
