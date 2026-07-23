import React from 'react';

const PresetStrategies = ({ currentTicker, currentAmount, onSelectPreset }) => {
  const presets = [
    {
      label: 'Nifty 50 Index',
      ticker: '^NSEI',
      amount: 10000,
      yearsAgo: 10,
      description: 'Benchmark Indian Stock Market index'
    },
    {
      label: 'Sensex Index',
      ticker: '^BSESN',
      amount: 10000,
      yearsAgo: 10,
      description: '30 blue-chip stocks on BSE'
    },
    {
      label: 'Reliance Industries',
      ticker: 'RELIANCE',
      amount: 5000,
      yearsAgo: 5,
      description: 'Energy, retail, telecom giant'
    },
    {
      label: 'TCS (Tata Consultancy)',
      ticker: 'TCS',
      amount: 5000,
      yearsAgo: 5,
      description: 'India\'s leading IT services exporter'
    }
  ];

  const handleSelect = (preset) => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const startYear = today.getFullYear() - preset.yearsAgo;
    const start = new Date(startYear, today.getMonth(), today.getDate())
      .toISOString()
      .split('T')[0];
      
    onSelectPreset({
      label: preset.label,
      ticker: preset.ticker,
      amount: preset.amount,
      startDate: start,
      endDate: end
    });
  };

  const isPresetActive = (preset) => {
    const cleanCurrent = currentTicker ? currentTicker.replace('.NS', '').trim().toUpperCase() : '';
    const cleanPreset = preset.ticker.replace('.NS', '').trim().toUpperCase();
    return cleanCurrent === cleanPreset && currentAmount === preset.amount;
  };

  return (
    <div style={{ width: '100%' }}>
      <label style={{
        display: 'block',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginBottom: '10px',
        fontWeight: 500
      }}>
        Popular Presets
      </label>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px'
      }}>
        {presets.map((preset) => {
          const active = isPresetActive(preset);
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelect(preset)}
              style={{
                padding: '12px 12px',
                background: active ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.7)',
                border: active ? '1.5px solid var(--color-primary)' : '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                boxShadow: active ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 2px 5px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: active ? 'var(--color-primary)' : '#0f172a' }}>{preset.label}</span>
                {active && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700 }}>✓</span>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {preset.yearsAgo} Yrs • ₹{preset.amount.toLocaleString('en-IN')}/mo
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


export default PresetStrategies;
