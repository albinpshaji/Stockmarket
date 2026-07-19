import React from 'react';

const StrategySelector = ({ strategy, setStrategy, drawdownSteps, setDrawdownSteps }) => {
  const handleStepChange = (index, field, value) => {
    const updated = [...drawdownSteps];
    updated[index] = {
      ...updated[index],
      [field]: Number(value)
    };
    setDrawdownSteps(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <label style={{
        display: 'block',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        fontWeight: 500
      }}>
        Investment Strategy
      </label>
      
      {/* Strategy Toggle Tab Buttons */}
      <div style={{
        display: 'flex',
        background: 'rgba(0,0,0,0.03)',
        borderRadius: '9999px',
        padding: '4px',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <button
          onClick={() => setStrategy('NORMAL')}
          style={{
            flex: 1,
            padding: '8px 16px',
            border: 'none',
            borderRadius: '9999px',
            background: strategy === 'NORMAL' ? '#ffffff' : 'transparent',
            color: strategy === 'NORMAL' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: strategy === 'NORMAL' ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'
          }}
        >
          Normal SIP
        </button>
        <button
          onClick={() => setStrategy('DRAWDOWN')}
          style={{
            flex: 1,
            padding: '8px 16px',
            border: 'none',
            borderRadius: '9999px',
            background: strategy === 'DRAWDOWN' ? '#ffffff' : 'transparent',
            color: strategy === 'DRAWDOWN' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: strategy === 'DRAWDOWN' ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'
          }}
        >
          Drawdown-Based
        </button>
      </div>

      {/* Drawdown Step Configuration Panel */}
      {strategy === 'DRAWDOWN' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'rgba(59, 130, 246, 0.03)',
          border: '1px solid rgba(59, 130, 246, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '4px'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Increase monthly installment dynamically as the price falls from its historical peak.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {drawdownSteps.map((step, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '55%' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Decline ≥
                  </span>
                  <input
                    type="number"
                    value={step.drawdown}
                    onChange={(e) => handleStepChange(index, 'drawdown', e.target.value)}
                    style={{
                      width: '50px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      background: '#ffffff'
                    }}
                    min="0"
                    max="100"
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>%</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', width: '45%' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    SIP +
                  </span>
                  <input
                    type="number"
                    value={step.multiplier}
                    onChange={(e) => handleStepChange(index, 'multiplier', e.target.value)}
                    style={{
                      width: '60px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      background: '#ffffff'
                    }}
                    min="-100"
                    max="1000"
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategySelector;
