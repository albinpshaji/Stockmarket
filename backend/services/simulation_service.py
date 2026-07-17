import pandas as pd

def simulate_sip(df: pd.DataFrame, monthly_amount: float) -> pd.DataFrame:
    """
    Simulates a monthly Systematic Investment Plan (SIP).
    Invests a fixed amount on the first trading day of every calendar month
    and calculates daily cash invested and portfolio value.
    """
    cash_invested = 0.0
    units_held = 0.0
    results = []
    last_year_month = None
    
    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']
        current_year_month = (date.year, date.month)
        
        # If we enter a new month, buy units at the current closing price
        if current_year_month != last_year_month:
            cash_invested += monthly_amount
            units_held += monthly_amount / price
            last_year_month = current_year_month
            
        portfolio_value = units_held * price
        
        results.append({
            'date': date.strftime('%Y-%m-%d'),
            'cash_invested': round(cash_invested, 2),
            'portfolio_value': round(portfolio_value, 2),
            'price': round(price, 2),
            'units_held': round(units_held, 6)
        })
        
    return pd.DataFrame(results)
