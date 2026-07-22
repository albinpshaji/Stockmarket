import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Tuple

def calculate_xirr(cash_flows: List[Tuple[datetime, float]]) -> float:
    """
    Calculates Internal Rate of Return (IRR) for irregular cash flows (XIRR).
    Uses the Newton-Raphson numerical method to find the root of the NPV equation.
    Investments are negative cash flows; the final portfolio value is positive.
    """
    if not cash_flows or len(cash_flows) < 2:
        return 0.0
    t0 = cash_flows[0][0]
    years_and_flows = [((date - t0).days / 365.25, amount) for date, amount in cash_flows]
    
    # NPV formula
    def f(r):
        return sum(amount / ((1 + r) ** t) for t, amount in years_and_flows)
        
    # Derivative of NPV formula with respect to r
    def df_dr(r):
        return sum(-t * amount / ((1 + r) ** (t + 1)) for t, amount in years_and_flows)
        
    # Standard Newton-Raphson root-finding loop
    r = 0.1
    for _ in range(100):
        val = f(r)
        deriv = df_dr(r)
        if deriv == 0:
            break
        next_r = r - val / deriv
        if abs(next_r - r) < 1e-6:
            if -0.99 < next_r < 10.0:
                return next_r * 100
            break
        r = next_r
    return 0.0

def calculate_metrics(daily_df: pd.DataFrame, ticker: str) -> Dict[str, float]:
    """
    Calculates key investment performance and risk metrics.
    Includes: Total Invested, Current Value, Total Return (%), XIRR (%), Max Drawdown (%), and Sharpe Ratio.
    """
    if daily_df.empty:
        return {}
        
    total_invested = float(daily_df['cash_invested'].iloc[-1])
    current_value = float(daily_df['portfolio_value'].iloc[-1])
    
    total_return_pct = 0.0
    if total_invested > 0:
        total_return_pct = ((current_value - total_invested) / total_invested) * 100
        
    # Peak-to-trough drawdown calculation
    portfolio_values = daily_df['portfolio_value']
    running_max = portfolio_values.cummax()
    drawdowns = (portfolio_values - running_max.replace(0, 1.0)) / running_max.replace(0, 1.0)
    max_drawdown_pct = float(drawdowns.min()) * 100
    
    # Reconstruct cash flow list for XIRR calculation
    daily_df['Date'] = pd.to_datetime(daily_df['date'])
    daily_df['investment_diff'] = daily_df['cash_invested'].diff().fillna(daily_df['cash_invested'].iloc[0])
    
    cash_flows = []
    # Add negative cash flows when monthly investments are made
    for _, row in daily_df[daily_df['investment_diff'] > 0].iterrows():
        cash_flows.append((row['Date'], -float(row['investment_diff'])))
    # Add the positive terminal value of the portfolio at the end
    cash_flows.append((daily_df['Date'].iloc[-1], float(daily_df['portfolio_value'].iloc[-1])))
    
    xirr_pct = calculate_xirr(cash_flows)
    
    # Calculate Sharpe ratio of the underlying asset to avoid deposit distortions in portfolio returns.
    # Assumes a 6% annualized Indian risk-free rate.
    rf_daily = 0.06 / 252
    asset_returns = daily_df['price'].pct_change().dropna()
    if len(asset_returns) > 1 and asset_returns.std() > 0:
        sharpe_ratio = float((asset_returns.mean() - rf_daily) / asset_returns.std()) * np.sqrt(252)
    else:
        sharpe_ratio = 0.0

    # Extract initial and final monthly investment installment amounts
    investments = daily_df[daily_df['investment_diff'] > 0]['investment_diff']
    initial_installment = float(investments.iloc[0]) if not investments.empty else total_invested
    final_installment = float(investments.iloc[-1]) if not investments.empty else total_invested
        
    return {
        "total_invested": round(total_invested, 2),
        "current_value": round(current_value, 2),
        "total_return_pct": round(total_return_pct, 2),
        "xirr_pct": round(xirr_pct, 2),
        "max_drawdown_pct": round(max_drawdown_pct, 2),
        "sharpe_ratio": round(sharpe_ratio, 2),
        "initial_monthly_installment": round(initial_installment, 2),
        "final_monthly_installment": round(final_installment, 2)
    }

