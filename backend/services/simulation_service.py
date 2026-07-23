import pandas as pd

def simulate_sip(df: pd.DataFrame, monthly_amount: float, dividend_yield_percent: float = 0.0) -> pd.DataFrame:
    """
    Simulates a monthly Systematic Investment Plan (SIP).
    Invests a fixed amount on the first trading day of every calendar month
    and calculates daily cash invested, portfolio value, and reinvested dividends.
    """
    cash_invested = 0.0
    units_held = 0.0
    dividends_reinvested = 0.0
    results = []
    last_year_month = None
    monthly_div_rate = (dividend_yield_percent / 100.0) / 12.0
    
    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']
        current_year_month = (date.year, date.month)
        
        # If we enter a new month, process dividend reinvestment & buy units
        if current_year_month != last_year_month:
            # 1. Dividend Reinvestment (DRIP) on existing held units
            if monthly_div_rate > 0 and units_held > 0:
                div_cash = units_held * price * monthly_div_rate
                units_held += div_cash / price
                dividends_reinvested += div_cash

            # 2. Out-of-pocket monthly SIP deposit
            cash_invested += monthly_amount
            units_held += monthly_amount / price
            last_year_month = current_year_month
            
        portfolio_value = units_held * price
        
        results.append({
            'date': date.strftime('%Y-%m-%d'),
            'cash_invested': round(cash_invested, 2),
            'portfolio_value': round(portfolio_value, 2),
            'price': round(price, 2),
            'units_held': round(units_held, 6),
            'dividends_reinvested': round(dividends_reinvested, 2)
        })
        
    return pd.DataFrame(results)


def simulate_drawdown_sip(df: pd.DataFrame, monthly_amount: float, drawdown_steps: list, step_up_percent: float = 0.0, dividend_yield_percent: float = 0.0) -> pd.DataFrame:
    """
    Simulates a Drawdown-Based Systematic Investment Plan (SIP).
    Increases the monthly investment amount dynamically on the first trading day of each month
    based on the decline (drawdown) of the closing price from the running peak,
    with support for annual step-up increments and dividend reinvestment.
    """
    sorted_steps = sorted(drawdown_steps or [], key=lambda x: x.get('drawdown', 0), reverse=True)
    
    cash_invested = 0.0
    units_held = 0.0
    dividends_reinvested = 0.0
    running_peak = 0.0
    results = []
    last_year_month = None
    months_elapsed = 0
    monthly_div_rate = (dividend_yield_percent / 100.0) / 12.0
    
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

            # 1. Dividend Reinvestment (DRIP)
            if monthly_div_rate > 0 and units_held > 0:
                div_cash = units_held * price * monthly_div_rate
                units_held += div_cash / price
                dividends_reinvested += div_cash

            # 2. Calculate escalated baseline monthly amount (Step-Up)
            step_multiplier = (1.0 + (step_up_percent / 100.0)) ** (months_elapsed // 12)
            current_base_amount = monthly_amount * step_multiplier

            # 3. Calculate drawdown percentage from peak
            if running_peak > 0:
                current_drawdown = ((running_peak - price) / running_peak) * 100.0
            else:
                current_drawdown = 0.0
                
            # 4. Determine appropriate investment multiplier
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
            'units_held': round(units_held, 6),
            'dividends_reinvested': round(dividends_reinvested, 2)
        })
        
    return pd.DataFrame(results)



def simulate_step_up_sip(df: pd.DataFrame, monthly_amount: float, step_up_percent: float = 10.0, dividend_yield_percent: float = 0.0) -> pd.DataFrame:
    """
    Simulates a Step-Up (Escalating) Systematic Investment Plan (SIP).
    Increases the monthly investment amount by step_up_percent every 12 months.
    Reinvests dividends at specified dividend_yield_percent p.a.
    """
    cash_invested = 0.0
    units_held = 0.0
    dividends_reinvested = 0.0
    results = []
    last_year_month = None
    months_elapsed = 0
    monthly_div_rate = (dividend_yield_percent / 100.0) / 12.0

    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']
        current_year_month = (date.year, date.month)

        if current_year_month != last_year_month:
            if last_year_month is not None:
                months_elapsed += 1
            
            # 1. Dividend Reinvestment (DRIP)
            if monthly_div_rate > 0 and units_held > 0:
                div_cash = units_held * price * monthly_div_rate
                units_held += div_cash / price
                dividends_reinvested += div_cash

            # 2. Step-up deposit
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
            'units_held': round(units_held, 6),
            'dividends_reinvested': round(dividends_reinvested, 2)
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


def simulate_pe_valuation_sip(
    df: pd.DataFrame, 
    monthly_amount: float, 
    low_pe_threshold: float = 18.0, 
    high_pe_threshold: float = 24.0, 
    step_up_percent: float = 0.0, 
    dividend_yield_percent: float = 0.0
) -> pd.DataFrame:
    """
    Simulates a PE Ratio / Valuation-Based Dynamic Systematic Investment Plan (SIP).
    - Undervalued (PE < 18 / Discount to 200-DMA): Invests 200% base SIP + deploys Cash Reserve.
    - Fair Value (18 <= PE <= 24): Invests 100% base SIP.
    - Overvalued (PE > 24 / Premium to 200-DMA): Invests 50% base SIP, saves 50% into Cash Reserve.
    """
    cash_invested = 0.0
    units_held = 0.0
    cash_reserve = 0.0
    dividends_reinvested = 0.0
    results = []
    last_year_month = None
    months_elapsed = 0
    monthly_div_rate = (dividend_yield_percent / 100.0) / 12.0

    # Pre-calculate 200-day Simple Moving Average (SMA_200) for valuation band tracking
    df = df.copy()
    df['SMA_200'] = df['Close'].rolling(window=200, min_periods=1).mean()

    # Map PE threshold parameters to valuation ratio proxy (baseline fair PE ~20)
    baseline_pe = 20.0
    low_ratio = low_pe_threshold / baseline_pe    # e.g., 18/20 = 0.90
    high_ratio = high_pe_threshold / baseline_pe  # e.g., 24/20 = 1.20

    for _, row in df.iterrows():
        date = row['Date']
        price = row['Close']
        sma_200 = row['SMA_200']
        current_year_month = (date.year, date.month)

        if current_year_month != last_year_month:
            if last_year_month is not None:
                months_elapsed += 1

            # 1. Dividend Reinvestment (DRIP)
            if monthly_div_rate > 0 and units_held > 0:
                div_cash = units_held * price * monthly_div_rate
                units_held += div_cash / price
                dividends_reinvested += div_cash

            # 2. Base Step-Up Amount
            step_multiplier = (1.0 + (step_up_percent / 100.0)) ** (months_elapsed // 12)
            current_base_amount = monthly_amount * step_multiplier

            # 3. Calculate Valuation Signal Ratio
            val_ratio = price / sma_200 if sma_200 > 0 else 1.0

            # 4. Valuation Band Allocation & Cash Reserve Routing
            if val_ratio < low_ratio:
                # Undervalued (Low PE): 200% Base deposit + deploy entire accrued Cash Reserve
                actual_amount = (current_base_amount * 2.0) + cash_reserve
                cash_reserve = 0.0
            elif val_ratio > high_ratio:
                # Overvalued (High PE): 50% Base deposit + save 50% into Cash Reserve
                actual_amount = current_base_amount * 0.5
                uninvested = current_base_amount * 0.5
                cash_reserve += uninvested
            else:
                # Fair Value: Standard 100% Base deposit
                actual_amount = current_base_amount

            cash_invested += actual_amount
            units_held += actual_amount / price
            last_year_month = current_year_month

        portfolio_value = units_held * price

        results.append({
            'date': date.strftime('%Y-%m-%d'),
            'cash_invested': round(cash_invested, 2),
            'portfolio_value': round(portfolio_value, 2),
            'price': round(price, 2),
            'units_held': round(units_held, 6),
            'dividends_reinvested': round(dividends_reinvested, 2)
        })

    return pd.DataFrame(results)


def simulate_dual_momentum_sip(
    df_primary: pd.DataFrame,
    df_secondary: pd.DataFrame,
    monthly_amount: float,
    lookback_months: int = 12,
    risk_free_rate: float = 6.5,
    step_up_percent: float = 0.0,
    dividend_yield_percent: float = 0.0
) -> pd.DataFrame:
    """
    Simulates Gary Antonacci's Dual Momentum Strategy SIP.
    
    Monthly decision logic:
    1. Relative Momentum: Compare trailing N-month returns of Primary vs Secondary asset.
    2. Absolute Momentum Filter: If winner's return > risk-free rate, invest in winner.
       Otherwise, park SIP in safe-haven (Bank FD compounding).
    3. On asset switch: sell all units of old asset, convert to cash, buy new asset.
    """
    # Merge both asset DataFrames on date, using inner join to keep only overlapping dates
    df_p = df_primary[['Date', 'Close']].copy()
    df_p.columns = ['Date', 'Close_Primary']
    df_s = df_secondary[['Date', 'Close']].copy()
    df_s.columns = ['Date', 'Close_Secondary']

    merged = pd.merge(df_p, df_s, on='Date', how='inner').sort_values('Date').reset_index(drop=True)

    if merged.empty:
        return pd.DataFrame()

    cash_invested = 0.0
    units_held = 0.0
    safe_haven_value = 0.0  # Bank FD compounding balance
    dividends_reinvested = 0.0
    results = []
    last_year_month = None
    months_elapsed = 0
    monthly_div_rate = (dividend_yield_percent / 100.0) / 12.0

    # Daily interest rate for safe haven (Bank FD)
    daily_interest_rate = (1.0 + (risk_free_rate / 100.0)) ** (1.0 / 365.25) - 1.0
    # Monthly risk-free return for absolute momentum comparison
    monthly_rf_return = (1.0 + (risk_free_rate / 100.0)) ** (1.0 / 12.0) - 1.0

    # Current allocation state: "PRIMARY", "SECONDARY", or "SAFE_HAVEN"
    current_asset = "PRIMARY"  # Default during warmup period

    # Build a price lookup by (year, month) for trailing return calculation
    # Store the closing price on the first trading day of each month
    monthly_prices_primary = {}
    monthly_prices_secondary = {}
    last_date = None

    for idx, row in merged.iterrows():
        date = row['Date']
        price_p = row['Close_Primary']
        price_s = row['Close_Secondary']
        current_year_month = (date.year, date.month)

        # Compound safe haven for elapsed calendar days
        if last_date is not None and safe_haven_value > 0:
            days_passed = (date - last_date).days
            if days_passed > 0:
                safe_haven_value *= ((1.0 + daily_interest_rate) ** days_passed)

        if current_year_month != last_year_month:
            if last_year_month is not None:
                months_elapsed += 1

            # Record first-of-month prices for lookback calculation
            monthly_prices_primary[months_elapsed] = price_p
            monthly_prices_secondary[months_elapsed] = price_s

            # Step-up calculation
            step_multiplier = (1.0 + (step_up_percent / 100.0)) ** (months_elapsed // 12)
            current_monthly_amount = monthly_amount * step_multiplier

            # Dividend Reinvestment (DRIP) - only when holding equity assets
            if monthly_div_rate > 0 and units_held > 0 and current_asset != "SAFE_HAVEN":
                current_price = price_p if current_asset == "PRIMARY" else price_s
                div_cash = units_held * current_price * monthly_div_rate
                units_held += div_cash / current_price
                dividends_reinvested += div_cash

            # --- Dual Momentum Decision ---
            if months_elapsed >= lookback_months:
                lookback_idx = months_elapsed - lookback_months
                prev_price_p = monthly_prices_primary.get(lookback_idx)
                prev_price_s = monthly_prices_secondary.get(lookback_idx)

                if prev_price_p and prev_price_p > 0 and prev_price_s and prev_price_s > 0:
                    return_p = (price_p - prev_price_p) / prev_price_p
                    return_s = (price_s - prev_price_s) / prev_price_s
                    # Risk-free return over the lookback period
                    rf_return = (1.0 + monthly_rf_return) ** lookback_months - 1.0

                    # 1. Relative Momentum: pick the winner
                    if return_p >= return_s:
                        winner = "PRIMARY"
                        winner_return = return_p
                    else:
                        winner = "SECONDARY"
                        winner_return = return_s

                    # 2. Absolute Momentum Filter
                    if winner_return > rf_return:
                        target_asset = winner
                    else:
                        target_asset = "SAFE_HAVEN"
                else:
                    target_asset = current_asset  # Not enough data, hold current
            else:
                # Warmup period: default to Primary asset
                target_asset = "PRIMARY"

            # --- Asset Switching (Sell old, Buy new) ---
            if target_asset != current_asset:
                # Liquidate current position to cash
                if current_asset == "SAFE_HAVEN":
                    switch_cash = safe_haven_value
                    safe_haven_value = 0.0
                else:
                    # Sell all equity units at current market price
                    sell_price = price_p if current_asset == "PRIMARY" else price_s
                    switch_cash = units_held * sell_price
                    units_held = 0.0

                # Buy into new target asset
                if target_asset == "SAFE_HAVEN":
                    safe_haven_value += switch_cash
                else:
                    buy_price = price_p if target_asset == "PRIMARY" else price_s
                    units_held = switch_cash / buy_price

                current_asset = target_asset

            # --- Invest this month's SIP into current asset ---
            cash_invested += current_monthly_amount
            if current_asset == "SAFE_HAVEN":
                safe_haven_value += current_monthly_amount
            else:
                buy_price = price_p if current_asset == "PRIMARY" else price_s
                units_held += current_monthly_amount / buy_price

            last_year_month = current_year_month

        # --- Daily portfolio value ---
        if current_asset == "SAFE_HAVEN":
            portfolio_value = safe_haven_value
            display_price = 0.0  # No equity price when in safe haven
        else:
            current_price = price_p if current_asset == "PRIMARY" else price_s
            portfolio_value = units_held * current_price
            display_price = current_price

        last_date = date

        results.append({
            'date': date.strftime('%Y-%m-%d'),
            'cash_invested': round(cash_invested, 2),
            'portfolio_value': round(portfolio_value, 2),
            'price': round(display_price, 2),
            'units_held': round(units_held, 6),
            'dividends_reinvested': round(dividends_reinvested, 2),
            'current_asset': current_asset
        })

    return pd.DataFrame(results)
