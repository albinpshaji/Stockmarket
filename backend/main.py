from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(
    title="SIP Backtesting API",
    description="Simulate Systematic Investment Plans against real historical market data",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the React frontend (Vite dev server) to call the API
# ---------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health-check endpoint
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["Health"])
async def health_check():
    """Return service status and server timestamp."""
    return {
        "status": "healthy",
        "service": "SIP Backtesting API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
