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
              onClick={() => handleSelect(preset)}
              style={{
                padding: '12px 10px',
                background: active ? 'rgba(59, 130, 246, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                border: active ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: active ? '0 0 10px rgba(59, 130, 246, 0.12)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{preset.label}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {preset.yearsAgo} Yrs • ₹{preset.amount}/mo
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PresetStrategies;
