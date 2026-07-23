from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import requests
from services.data_service import fetch_historical_data
from services.simulation_service import (
    simulate_sip, simulate_drawdown_sip, simulate_step_up_sip, simulate_bank_fd_sip, simulate_pe_valuation_sip,
    simulate_dual_momentum_sip
)
from services.metrics_service import calculate_metrics

router = APIRouter(prefix="/api")

class DrawdownStep(BaseModel):
    drawdown: float = Field(..., ge=0, le=100, description="Percentage decline from historical peak (e.g. 10.0 for 10% drop)")
    multiplier: float = Field(..., ge=-100, description="SIP contribution percentage multiplier (e.g. 50.0 for +50% increase)")

class SimulationRequest(BaseModel):
    ticker: str = Field(..., description="Stock/Index ticker symbol (e.g., RELIANCE, TCS, ^NSEI)")
    monthly_amount: float = Field(..., ge=0.0, description="Monthly investment amount in INR")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    strategy: str = Field("NORMAL", description="Investment strategy type: NORMAL, DRAWDOWN, STEP_UP, BANK_FD, PE_VALUATION, or DUAL_MOMENTUM")
    drawdown_steps: Optional[List[DrawdownStep]] = Field(None, description="Custom thresholds for DRAWDOWN strategy")
    step_up_percent: Optional[float] = Field(0.0, ge=0.0, le=100.0, description="Annual step up percentage for STEP_UP strategy")
    interest_rate: Optional[float] = Field(6.5, ge=0.0, le=100.0, description="Annual interest rate percentage for BANK_FD or Dual Momentum safe-haven")
    dividend_yield: Optional[float] = Field(0.0, ge=0.0, le=100.0, description="Annual dividend yield percentage for DRIP reinvestment")
    low_pe_threshold: Optional[float] = Field(18.0, ge=0.0, le=200.0, description="Undervalued PE cutoff threshold")
    high_pe_threshold: Optional[float] = Field(24.0, ge=0.0, le=200.0, description="Overvalued PE cutoff threshold")
    secondary_ticker: Optional[str] = Field(None, description="Second asset ticker for Dual Momentum (e.g., GC=F for Gold)")
    lookback_months: Optional[int] = Field(12, ge=1, le=60, description="Momentum lookback period in months")

@router.post("/simulate")
async def run_simulation(req: SimulationRequest):
    """
    Runs the monthly SIP backtesting simulation for a given ticker and date range.
    Supports regular fixed monthly SIP, drawdown-based dynamic scaling, annual step-up SIP, Bank RD/FD, Dividend Reinvestment (DRIP), and PE-Valuation SIP.
    """
    try:
        # Fetch clean historical daily prices
        df = fetch_historical_data(req.ticker, req.start_date, req.end_date)
        div_yield = req.dividend_yield if req.dividend_yield is not None else 0.0
        step_up = req.step_up_percent if req.step_up_percent is not None else 0.0
        
        # Execute the chosen strategy simulation
        if req.strategy == "DUAL_MOMENTUM":
            secondary_ticker = req.secondary_ticker or "GC=F"
            df_secondary = fetch_historical_data(secondary_ticker, req.start_date, req.end_date)
            lookback = req.lookback_months if req.lookback_months is not None else 12
            rf_rate = req.interest_rate if req.interest_rate is not None else 6.5
            sim_df = simulate_dual_momentum_sip(
                df, df_secondary, req.monthly_amount,
                lookback_months=lookback,
                risk_free_rate=rf_rate,
                step_up_percent=step_up,
                dividend_yield_percent=div_yield
            )
        elif req.strategy == "DRAWDOWN" and req.drawdown_steps:
            steps_dict = [step.dict() for step in req.drawdown_steps]
            sim_df = simulate_drawdown_sip(df, req.monthly_amount, steps_dict, step_up, div_yield)
        elif req.strategy == "STEP_UP":
            step_up_val = req.step_up_percent if req.step_up_percent is not None else 10.0
            sim_df = simulate_step_up_sip(df, req.monthly_amount, step_up_val, div_yield)
        elif req.strategy == "PE_VALUATION":
            low_pe = req.low_pe_threshold if req.low_pe_threshold is not None else 18.0
            high_pe = req.high_pe_threshold if req.high_pe_threshold is not None else 24.0
            sim_df = simulate_pe_valuation_sip(df, req.monthly_amount, low_pe, high_pe, step_up, div_yield)
        elif req.strategy == "BANK_FD":
            rate = req.interest_rate if req.interest_rate is not None else 6.5
            sim_df = simulate_bank_fd_sip(df, req.monthly_amount, rate, step_up)
        else:
            sim_df = simulate_sip(df, req.monthly_amount, div_yield)





            
        # Calculate key return and risk metrics
        metrics = calculate_metrics(sim_df, req.ticker)
        
        # Convert daily simulation DataFrame to a list of dicts for JSON serialization
        timeseries = sim_df.to_dict(orient="records")
        
        return {
            "ticker": req.ticker,
            "metrics": metrics,
            "timeseries": timeseries
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tickers/popular")
async def get_popular_tickers():
    """
    Returns a predefined list of popular Indian market stocks and indices.
    """
    return [
        {"symbol": "^NSEI", "name": "Nifty 50 (Index)"},
        {"symbol": "^BSESN", "name": "Sensex (Index)"},
        {"symbol": "RELIANCE", "name": "Reliance Industries Ltd."},
        {"symbol": "TCS", "name": "Tata Consultancy Services Ltd."},
        {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd."},
        {"symbol": "INFY", "name": "Infosys Ltd."},
        {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd."},
        {"symbol": "SBIN", "name": "State Bank of India"},
    ]

@router.get("/tickers/search")
async def search_tickers(q: str):
    """
    Queries Yahoo Finance search autocomplete endpoint to find matching stocks.
    Filters results to prioritize Indian markets (.NS and .BO suffix).
    """
    if not q or len(q) < 2:
        return []
        
    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={q}&quotesCount=10"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code != 200:
            return []
            
        data = response.json()
        quotes = data.get("quotes", [])
        
        results = []
        for quote in quotes:
            symbol = quote.get("symbol", "")
            name = quote.get("shortname", quote.get("longname", ""))
            
            if symbol.endswith(".NS") or symbol.endswith(".BO") or symbol.startswith("^"):
                display_symbol = symbol[:-3] if symbol.endswith(".NS") else symbol
                results.append({
                    "symbol": display_symbol,
                    "name": name,
                    "yahoo_symbol": symbol
                })
                
        return results
    except Exception:
        return []

@router.get("/strategies")
async def get_strategies_catalog():
    """
    Returns the complete catalog of investment strategies grouped by category,
    enabling dynamic strategy discovery and scalable UI rendering.
    """
    return [
        {
            "category": "Core & Systematic",
            "strategies": [
                {
                    "id": "NORMAL",
                    "name": "Normal Monthly SIP",
                    "short_name": "Normal",
                    "description": "Fixed Rupee Cost Averaging installment every month.",
                    "badge": "Popular",
                    "is_quick_preset": True
                },
                {
                    "id": "STEP_UP",
                    "name": "Annual Step-Up SIP",
                    "short_name": "Step-Up",
                    "description": "Escalates monthly contribution percentage annually with career income growth.",
                    "badge": "Growth",
                    "is_quick_preset": True
                }
            ]
        },
        {
            "category": "Valuation & Dip Buying",
            "strategies": [
                {
                    "id": "DRAWDOWN",
                    "name": "Drawdown-Based SIP",
                    "short_name": "Drawdown",
                    "description": "Increases monthly SIP allocation when price declines from historical peaks.",
                    "badge": "Value",
                    "is_quick_preset": True
                },
                {
                    "id": "PE_VALUATION",
                    "name": "PE-Ratio Valuation SIP",
                    "short_name": "PE Value",
                    "description": "Allocates aggressively in low PE markets and saves in cash reserve during high PE markets.",
                    "badge": "Value",
                    "is_quick_preset": True
                }
            ]
        },
        {
            "category": "Tactical & Momentum",
            "strategies": [
                {
                    "id": "DUAL_MOMENTUM",
                    "name": "Gary Antonacci's Dual Momentum",
                    "short_name": "Momentum",
                    "description": "Rotates between primary asset, secondary hedge asset (e.g., Gold), and risk-free FD based on 12M momentum.",
                    "badge": "Quant",
                    "is_quick_preset": True
                }
            ]
        },
        {
            "category": "Fixed Income & Cash",
            "strategies": [
                {
                    "id": "BANK_FD",
                    "name": "Bank RD / FD Baseline",
                    "short_name": "Bank RD",
                    "description": "Zero price-risk baseline with guaranteed annual compounding.",
                    "badge": "Safe",
                    "is_quick_preset": True
                }
            ]
        }
    ]

