import React from 'react';

const StrategySelector = ({ 
  strategy, 
  setStrategy, 
  drawdownSteps, 
  setDrawdownSteps,
  stepUpPercent,
  setStepUpPercent 
}) => {
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
        border: '1px solid rgba(0,0,0,0.04)',
        gap: '4px'
      }}>
        <button
          onClick={() => setStrategy('NORMAL')}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: '9999px',
            background: strategy === 'NORMAL' ? '#ffffff' : 'transparent',
            color: strategy === 'NORMAL' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: strategy === 'NORMAL' ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'
          }}
        >
          Normal SIP
        </button>
        <button
          onClick={() => setStrategy('STEP_UP')}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: '9999px',
            background: strategy === 'STEP_UP' ? '#ffffff' : 'transparent',
            color: strategy === 'STEP_UP' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: strategy === 'STEP_UP' ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'
          }}
        >
          Step-Up SIP
        </button>
        <button
          onClick={() => setStrategy('DRAWDOWN')}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: '9999px',
            background: strategy === 'DRAWDOWN' ? '#ffffff' : 'transparent',
            color: strategy === 'DRAWDOWN' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: strategy === 'DRAWDOWN' ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'
          }}
        >
          Drawdown
        </button>
      </div>

      {/* Step-Up SIP Configuration Panel */}
      {strategy === 'STEP_UP' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'rgba(16, 185, 129, 0.04)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '4px'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Automatically increase your monthly investment installment every 12 months as your income grows.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Annual Step-Up Increment
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                value={stepUpPercent}
                onChange={(e) => setStepUpPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                style={{
                  width: '64px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  background: '#ffffff'
                }}
                min="0"
                max="100"
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>% / yr</span>
            </div>
          </div>

          {/* Dynamic Annual Step-Up Projection Note */}
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--color-primary)',
            background: 'rgba(59, 130, 246, 0.05)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            fontWeight: 500,
            lineHeight: 1.4
          }}>
            <strong>Annual Escalation Preview:</strong><br />
            Yr 1: Base ➔ Yr 2: +{stepUpPercent}% ➔ Yr 3: +{(stepUpPercent * 2.1).toFixed(0)}% ➔ Yr 5: +{(((1 + stepUpPercent/100)**4 - 1)*100).toFixed(0)}%
          </div>
        </div>
      )}


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
            Increase monthly installment dynamically as the price falls from its historical peak, with optional annual step-up growth.
          </p>

          {/* Optional Step-Up input within Drawdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '10px',
            borderBottom: '1px dashed rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Annual Step-Up Base
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                value={stepUpPercent}
                onChange={(e) => setStepUpPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                style={{
                  width: '56px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  background: '#ffffff'
                }}
                min="0"
                max="100"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>% / yr</span>
            </div>
          </div>
          
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
