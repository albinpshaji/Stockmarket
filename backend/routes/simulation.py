from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import requests
from backend.services.data_service import fetch_historical_data
from backend.services.simulation_service import simulate_sip
from backend.services.metrics_service import calculate_metrics

router = APIRouter(prefix="/api")

class SimulationRequest(BaseModel):
    ticker: str = Field(..., description="Stock/Index ticker symbol (e.g., RELIANCE, TCS, ^NSEI)")
    monthly_amount: float = Field(..., gt=0, description="Monthly investment amount in INR")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")

@router.post("/simulate")
async def run_simulation(req: SimulationRequest):
    """
    Runs the monthly SIP backtesting simulation for a given ticker and date range.
    """
    try:
        # Fetch, clean, and run monthly SIP simulation
        df = fetch_historical_data(req.ticker, req.start_date, req.end_date)
        sim_df = simulate_sip(df, req.monthly_amount)
        
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
            
            # Prioritize Indian markets (.NS / .BO) or major indexes (like ^NSEI)
            if symbol.endswith(".NS") or symbol.endswith(".BO") or symbol.startswith("^"):
                # Strip the suffix for cleaner user experience if it is .NS
                display_symbol = symbol[:-3] if symbol.endswith(".NS") else symbol
                results.append({
                    "symbol": display_symbol,
                    "name": name,
                    "yahoo_symbol": symbol
                })
                
        return results
    except Exception:
        # Fallback to empty list in case Yahoo autocomplete fails
        return []
