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


def simulate_drawdown_sip(df: pd.DataFrame, monthly_amount: float, drawdown_steps: list, step_up_percent: float = 0.0) -> pd.DataFrame:
    """
    Simulates a Drawdown-Based Systematic Investment Plan (SIP).
    Increases the monthly investment amount dynamically on the first trading day of each month
    based on the decline (drawdown) of the closing price from the running peak,
    with support for annual step-up increments.
    """
    # Sort steps by drawdown descending (e.g. 40% threshold checked first)
    sorted_steps = sorted(drawdown_steps or [], key=lambda x: x.get('drawdown', 0), reverse=True)
    
    cash_invested = 0.0
    units_held = 0.0
    running_peak = 0.0
    results = []
    last_year_month = None
    months_elapsed = 0
    
    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']
        
        if price > running_peak:
            running_peak = price
            
        current_year_month = (date.year, date.month)
        
        # If entering a new month, evaluate drawdown and invest
        if current_year_month != last_year_month:
            if last_year_month is not None:
                months_elapsed += 1

            # Calculate escalated baseline monthly amount (Step-Up)
            step_multiplier = (1.0 + (step_up_percent / 100.0)) ** (months_elapsed // 12)
            current_base_amount = monthly_amount * step_multiplier

            # Calculate drawdown percentage from peak
            if running_peak > 0:
                current_drawdown = ((running_peak - price) / running_peak) * 100.0
            else:
                current_drawdown = 0.0
                
            # Determine appropriate investment multiplier
            multiplier = 0.0
            for step in sorted_steps:
                if current_drawdown >= step.get('drawdown', 0):
                    multiplier = step.get('multiplier', 0) / 100.0
                    break  
                    
            actual_amount = current_base_amount * (1.0 + multiplier)
            cash_invested += actual_amount
            units_held += actual_amount / price
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



def simulate_step_up_sip(df: pd.DataFrame, monthly_amount: float, step_up_percent: float = 10.0) -> pd.DataFrame:
    """
    Simulates a Step-Up (Escalating) Systematic Investment Plan (SIP).
    Increases the monthly investment amount by step_up_percent every 12 months.
    """
    cash_invested = 0.0
    units_held = 0.0
    results = []
    last_year_month = None
    months_elapsed = 0

    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']
        current_year_month = (date.year, date.month)

        if current_year_month != last_year_month:
            if last_year_month is not None:
                months_elapsed += 1
            
            step_multiplier = (1.0 + (step_up_percent / 100.0)) ** (months_elapsed // 12)
            current_monthly_amount = monthly_amount * step_multiplier

            cash_invested += current_monthly_amount
            units_held += current_monthly_amount / price
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


def simulate_bank_fd_sip(df: pd.DataFrame, monthly_amount: float, interest_rate: float = 6.5, step_up_percent: float = 0.0) -> pd.DataFrame:
    """
    Simulates a Bank Recurring Deposit / Fixed Deposit (RD / FD) SIP Strategy.
    Deposits a monthly installment (with optional annual step-up) on the first trading day of every month.
    Compounds interest daily at the specified annual rate (default 6.5% p.a.).
    """
    cash_invested = 0.0
    portfolio_value = 0.0
    results = []
    last_year_month = None
    last_date = None
    months_elapsed = 0

    daily_interest_rate = (1.0 + (interest_rate / 100.0)) ** (1.0 / 365.25) - 1.0

    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']

        # Compound interest for elapsed calendar days since last trading day
        if last_date is not None:
            days_passed = (date - last_date).days
            if days_passed > 0:
                portfolio_value *= ((1.0 + daily_interest_rate) ** days_passed)

        current_year_month = (date.year, date.month)

        if current_year_month != last_year_month:
            if last_year_month is not None:
                months_elapsed += 1

            step_multiplier = (1.0 + (step_up_percent / 100.0)) ** (months_elapsed // 12)
            current_monthly_amount = monthly_amount * step_multiplier

            cash_invested += current_monthly_amount
            portfolio_value += current_monthly_amount
            last_year_month = current_year_month

        last_date = date

        results.append({
            'date': date.strftime('%Y-%m-%d'),
            'cash_invested': round(cash_invested, 2),
            'portfolio_value': round(portfolio_value, 2),
            'price': round(price, 2),
            'units_held': 1.0
        })

    return pd.DataFrame(results)


