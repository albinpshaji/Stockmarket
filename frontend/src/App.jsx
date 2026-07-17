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
  const [ticker, setTicker] = useState('^NSEI');
  const [amount, setAmount] = useState(10000);
  
  // Set default dates: Start date is 5 years ago, End date is today
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    
    const startYear = today.getFullYear() - 5;
    const start = new Date(startYear, today.getMonth(), today.getDate())
      .toISOString()
      .split('T')[0];
      
    setStartDate(start);
    setEndDate(end);
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

  // Run default simulation on mount once dates are set
  useEffect(() => {
    if (startDate && endDate) {
      handleSimulate();
    }
  }, [startDate, endDate]);

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
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                      Performance Visualizer ({result.ticker})
                    </h3>
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
