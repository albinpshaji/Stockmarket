import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TickerInput from './components/Controls/TickerInput';
import AmountSlider from './components/Controls/AmountSlider';
import DateRangePicker from './components/Controls/DateRangePicker';
import PresetStrategies from './components/Controls/PresetStrategies';
import PerformanceChart from './components/Chart/PerformanceChart';
import MetricsGrid from './components/Metrics/MetricsGrid';

const App = () => {
  const [ticker, setTicker] = useState('');
  const [amount, setAmount] = useState(10000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Initialize variables from URL parameters or defaults
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTicker = params.get('ticker');
    const urlAmount = params.get('amount');
    const urlStart = params.get('start');
    const urlEnd = params.get('end');

    const today = new Date();
    const defaultEnd = today.toISOString().split('T')[0];
    const startYear = today.getFullYear() - 5;
    const defaultStart = new Date(startYear, today.getMonth(), today.getDate())
      .toISOString()
      .split('T')[0];

    setTicker(urlTicker || '^NSEI');
    setAmount(urlAmount ? Number(urlAmount) : 10000);
    setStartDate(urlStart || defaultStart);
    setEndDate(urlEnd || defaultEnd);
  }, []);

  const handleSimulate = async () => {
    if (!ticker) {
      setError('Please enter a valid stock ticker symbol.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post('http://localhost:8000/api/simulate', {
        ticker: ticker,
        monthly_amount: amount,
        start_date: startDate,
        end_date: endDate
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Failed to run simulation. Please check the ticker symbol and date range.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setTicker(preset.ticker);
    setAmount(preset.amount);
    setStartDate(preset.startDate);
    setEndDate(preset.endDate);
  };

  // Run simulation on load once dates/ticker are pre-populated
  useEffect(() => {
    if (startDate && endDate && ticker) {
      handleSimulate();
    }
  }, [startDate, endDate, ticker]);

  // Export time-series data to CSV
  const handleExportCSV = () => {
    if (!result || !result.timeseries) return;
    
    const headers = ['Date', 'Close Price (INR)', 'Cash Invested (INR)', 'Portfolio Value (INR)', 'Units Held'];
    const rows = result.timeseries.map(row => [
      row.date,
      row.price,
      row.cash_invested,
      row.portfolio_value,
      row.units_held
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RupeeSIP_Backtest_${result.ticker}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share URL simulation mapping
  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?ticker=${ticker}&amount=${amount}&start=${startDate}&end=${endDate}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '30px',
          alignItems: 'start'
        }} className="responsive-grid">
          
          {/* Controls Panel */}
          <div className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              Simulation Variables
            </h3>
            
            <TickerInput selectedTicker={ticker} setSelectedTicker={setTicker} />
            <AmountSlider amount={amount} setAmount={setAmount} />
            <DateRangePicker 
              startDate={startDate} 
              setStartDate={setStartDate} 
              endDate={endDate} 
              setEndDate={setEndDate} 
            />
            
            <PresetStrategies onSelectPreset={handleSelectPreset} />
            
            <button 
              className="btn-primary" 
              onClick={handleSimulate}
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>

          {/* Results Visualizer Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
            {error && (
              <div className="glass-card" style={{
                borderColor: 'var(--color-danger)',
                background: 'rgba(239, 68, 68, 0.05)',
                color: 'var(--text-primary)',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ color: 'var(--color-danger)', marginBottom: '8px' }}>Simulation Error</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{error}</p>
                <button 
                  className="btn-primary" 
                  onClick={handleSimulate} 
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-danger)',
                    color: 'var(--color-danger)',
                    boxShadow: 'none',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    marginTop: '12px'
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="glass-card" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: '16px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(255,255,255,0.05)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Fetching historical data and running simulation...
                </p>
              </div>
            ) : (
              result && (
                <>
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                        Performance Visualizer ({result.ticker})
                      </h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={handleShare}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          {copied ? 'Copied!' : 'Share'}
                        </button>
                        <button
                          onClick={handleExportCSV}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>
                    <PerformanceChart data={result.timeseries} />
                  </div>
                  
                  <MetricsGrid metrics={result.metrics} />
                </>
              )
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Insert responsive layout utility rule directly */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (min-width: 850px) {
          .responsive-grid {
            grid-template-columns: 350px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
