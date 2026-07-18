# RupeeSIP — Indian Stock Market SIP Backtesting Dashboard

RupeeSIP is a full-stack interactive web application that allows users to test investment strategies (specifically monthly Systematic Investment Plans) against real historical Indian stock market data. 

Users can tweak tickers, monthly amounts, and investment timelines, immediately rendering responsive line charts that contrast cash invested against final portfolio growth alongside key risk-reward metrics like CAGR, Sharpe Ratio, and Maximum Drawdown.

---

## 🚀 Key Features

*   📈 **Interactive Data Visualization**: Smooth area charts (contrasting total invested cash vs. portfolio valuation over time) using Recharts.
*   📊 **Financial Risk Metrics**: Automatically calculates absolute return (%), annualized returns (XIRR), Maximum Drawdown (%), and annualized Sharpe Ratio.
*   🇮🇳 **Indian Market Focus**: Formatted for Indian currency (₹) and numbering systems (Lakhs/Crores). Automatically suffixes stock inputs with `.NS` (NSE) for ease of search.
*   💾 **Ledger Export**: Download complete transaction and price histories as a CSV ledger.
*   🔗 **Instant Sharing**: Click "Share" to copy a URL containing all parameters (ticker, amount, dates) to pre-load the exact simulation for others.
*   ⚡ **Backend Caching**: In-memory caching with 1-hour TTL avoids redundant Yahoo Finance API requests and accelerates duplicate simulations.

---

## 🛠️ Tech Stack

```
┌───────────────────────────────────────────────┐
│                  FRONTEND                     │
│   Vite + React · Recharts · Axios · HTML5 CSS │
│   Dark Glassmorphism Theme · Inter/Outfit Fonts│
├───────────────────────────────────────────────┤
│                    API                        │
│   FastAPI · Pydantic · CORS · requests        │
├───────────────────────────────────────────────┤
│                  BACKEND                      │
│   yfinance (NSE suffix handler) · NumPy       │
│   Pandas (SIP Engine) · Newton-Raphson XIRR   │
└───────────────────────────────────────────────┘
```

---

## 🏃 Getting Started

Follow these steps to run the application locally.

### 1. Backend Setup
The backend runs on Python 3 and FastAPI.

```bash
# Go to the backend folder
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate venv and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Run the server on port 8000
uvicorn main:app --reload --port 8000
```
*The backend API will now be live at `http://localhost:8000`. You can inspect the health check at `http://localhost:8000/api/health`.*

### 2. Frontend Setup
The frontend runs on Node.js and Vite + React.

```bash
# Open a new terminal tab, navigate to the frontend folder
cd frontend

# Install package dependencies
npm install

# Run the Vite development server
npm run dev
```
*The frontend application will now be live at `http://localhost:5173`.*

---

## 📁 Repository Structure

```
├── backend/
│   ├── routes/
│   │   └── simulation.py      # /simulate, /search, /popular endpoints
│   ├── services/
│   │   ├── data_service.py     # Yahoo Finance fetcher & TTL cache
│   │   ├── metrics_service.py  # Calculates CAGR, Sharpe, Drawdown, XIRR
│   │   └── simulation_service.py# Daily transaction calculations
│   ├── main.py                # FastAPI entry point & CORS
│   └── requirements.txt        # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Chart/
    │   │   │   └── PerformanceChart.jsx # Recharts Area Chart
    │   │   ├── Controls/
    │   │   │   ├── AmountSlider.jsx     # Formatted slider (INR)
    │   │   │   ├── DateRangePicker.jsx  # Start/End date forms
    │   │   │   ├── PresetStrategies.jsx # Quick-select defaults
    │   │   │   └── TickerInput.jsx      # Autocomplete search
    │   │   └── Layout/
    │   │       ├── Header.jsx           # Premium sticky header
    │   │       └── Footer.jsx           # Disclaimer layout
    │   ├── App.jsx            # State coordinator & API client
    │   └── index.css          # Dark-mode design system stylesheet
    └── index.html             # HTML entry point (SEO optimized)
```
