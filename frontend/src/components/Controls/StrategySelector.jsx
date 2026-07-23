import React, { useState } from 'react';

const StrategySelector = ({ 
  strategy, 
  setStrategy, 
  drawdownSteps, 
  setDrawdownSteps,
  stepUpPercent,
  setStepUpPercent,
  interestRate = 6.5,
  setInterestRate,
  enableDividend = false,
  setEnableDividend,
  dividendYield = 1.5,
  setDividendYield,
  lowPE = 18,
  setLowPE,
  highPE = 24,
  setHighPE,
  secondaryTicker = 'GC=F',
  setSecondaryTicker,
  lookbackMonths = 12,
  setLookbackMonths
}) => {
  const handleStepChange = (index, field, value) => {
    const updated = [...drawdownSteps];
    updated[index] = {
      ...updated[index],
      [field]: Number(value)
    };
    setDrawdownSteps(updated);
  };

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const catalogData = [
    {
      category: "Core & Systematic",
      strategies: [
        { id: "NORMAL", name: "Normal Monthly SIP", badge: "Popular", desc: "Fixed Rupee Cost Averaging installment every month." },
        { id: "STEP_UP", name: "Annual Step-Up SIP", badge: "Growth", desc: "Escalates monthly contribution percentage annually with income growth." }
      ]
    },
    {
      category: "Valuation & Dip Buying",
      strategies: [
        { id: "DRAWDOWN", name: "Drawdown-Based SIP", badge: "Value", desc: "Increases monthly SIP allocation when price declines from peak." },
        { id: "PE_VALUATION", name: "PE-Ratio Valuation SIP", badge: "Value", desc: "Allocates aggressively in low PE markets & saves cash in high PE." }
      ]
    },
    {
      category: "Tactical & Momentum",
      strategies: [
        { id: "DUAL_MOMENTUM", name: "Gary Antonacci's Dual Momentum", badge: "Quant", desc: "Rotates between primary asset, secondary hedge (Gold), and safe FD." }
      ]
    },
    {
      category: "Fixed Income & Cash",
      strategies: [
        { id: "BANK_FD", name: "Bank RD / FD Baseline", badge: "Safe", desc: "Zero price-risk baseline with guaranteed annual compounding." }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          fontWeight: 500
        }}>
          Investment Strategy
        </label>
        <button
          type="button"
          onClick={() => setCatalogOpen(!catalogOpen)}
          style={{
            background: catalogOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--color-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s'
          }}
        >
          {catalogOpen ? '✕ Close Catalog' : '🔍 All Strategies (Catalog)'}
        </button>
      </div>

      {/* Categorized Strategy Catalog Drawer / Modal */}
      {catalogOpen && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          padding: '14px',
          boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search 100+ strategies (e.g. PE, Momentum, Step-Up)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(0,0,0,0.1)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
            {catalogData.map((cat, idx) => {
              const filtered = cat.strategies.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.desc.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filtered.length === 0) return null;

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                    {cat.category}
                  </span>
                  {filtered.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setStrategy(s.id);
                        setCatalogOpen(false);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: strategy === s.id ? 'rgba(59, 130, 246, 0.08)' : 'rgba(0,0,0,0.02)',
                        border: strategy === s.id ? '1.5px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{s.name}</span>
                          <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '9999px', background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)', fontWeight: 600 }}>{s.badge}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s.desc}</span>
                      </div>
                      <button style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: strategy === s.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
                        color: strategy === s.id ? '#ffffff' : '#0f172a',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        {strategy === s.id ? 'Active' : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Strategy Toggle Tab Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        background: 'rgba(0,0,0,0.03)',
        borderRadius: '16px',
        padding: '6px',
        border: '1px solid rgba(0,0,0,0.05)',
        gap: '6px'
      }}>
        <button
          onClick={() => setStrategy('NORMAL')}
          style={{
            padding: '9px 4px',
            border: 'none',
            borderRadius: '12px',
            background: strategy === 'NORMAL' ? '#ffffff' : 'transparent',
            color: strategy === 'NORMAL' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: strategy === 'NORMAL' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
            border: strategy === 'NORMAL' ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent'
          }}
        >
          Normal
        </button>
        <button
          onClick={() => setStrategy('STEP_UP')}
          style={{
            padding: '9px 4px',
            border: 'none',
            borderRadius: '12px',
            background: strategy === 'STEP_UP' ? '#ffffff' : 'transparent',
            color: strategy === 'STEP_UP' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: strategy === 'STEP_UP' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
            border: strategy === 'STEP_UP' ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent'
          }}
        >
          Step-Up
        </button>
        <button
          onClick={() => setStrategy('DRAWDOWN')}
          style={{
            padding: '9px 4px',
            border: 'none',
            borderRadius: '12px',
            background: strategy === 'DRAWDOWN' ? '#ffffff' : 'transparent',
            color: strategy === 'DRAWDOWN' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: strategy === 'DRAWDOWN' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
            border: strategy === 'DRAWDOWN' ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent'
          }}
        >
          Drawdown
        </button>
        <button
          onClick={() => setStrategy('PE_VALUATION')}
          style={{
            padding: '9px 4px',
            border: 'none',
            borderRadius: '12px',
            background: strategy === 'PE_VALUATION' ? '#ffffff' : 'transparent',
            color: strategy === 'PE_VALUATION' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: strategy === 'PE_VALUATION' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
            border: strategy === 'PE_VALUATION' ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent'
          }}
        >
          PE Value
        </button>
        <button
          onClick={() => setStrategy('DUAL_MOMENTUM')}
          style={{
            padding: '9px 4px',
            border: 'none',
            borderRadius: '12px',
            background: strategy === 'DUAL_MOMENTUM' ? '#ffffff' : 'transparent',
            color: strategy === 'DUAL_MOMENTUM' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: strategy === 'DUAL_MOMENTUM' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
            border: strategy === 'DUAL_MOMENTUM' ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent'
          }}
        >
          Momentum
        </button>
        <button
          onClick={() => setStrategy('BANK_FD')}
          style={{
            padding: '9px 4px',
            border: 'none',
            borderRadius: '12px',
            background: strategy === 'BANK_FD' ? '#ffffff' : 'transparent',
            color: strategy === 'BANK_FD' ? '#0f172a' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: strategy === 'BANK_FD' ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
            border: strategy === 'BANK_FD' ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent'
          }}
        >
          Bank RD
        </button>
      </div>


      {/* Bank RD / FD Configuration Panel */}
      {strategy === 'BANK_FD' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'rgba(245, 158, 11, 0.04)',
          border: '1px solid rgba(245, 158, 11, 0.18)',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '4px'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Guaranteed compounding bank deposit baseline (zero price risk/drawdown).
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Bank Interest Rate
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate && setInterestRate(Math.max(0, Math.min(20, Number(e.target.value))))}
                step="0.1"
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
                max="20"
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>% p.a.</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(0,0,0,0.08)'
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
        </div>
      )}


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

      {/* PE Ratio / Valuation-Based SIP Configuration Panel */}
      {strategy === 'PE_VALUATION' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'rgba(59, 130, 246, 0.04)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '4px'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Scales monthly investments dynamically based on market valuation signals (Low PE = Aggressive Buy, High PE = Cash Reserve).
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Low PE Cutoff (Cheap ➔ 200% Buy + Deploy Reserve)
            </span>
            <input
              type="number"
              value={lowPE}
              onChange={(e) => setLowPE && setLowPE(Number(e.target.value))}
              style={{
                width: '56px',
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'center',
                background: '#ffffff'
              }}
              min="5"
              max="40"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              High PE Cutoff (Expensive ➔ 50% Buy + Save Reserve)
            </span>
            <input
              type="number"
              value={highPE}
              onChange={(e) => setHighPE && setHighPE(Number(e.target.value))}
              style={{
                width: '56px',
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'center',
                background: '#ffffff'
              }}
              min="15"
              max="80"
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '12px',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Annual Step-Up Base Increment
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

          <div style={{
            fontSize: '0.72rem',
            color: '#0369a1',
            background: 'rgba(14, 165, 233, 0.06)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(14, 165, 233, 0.15)',
            fontWeight: 500,
            lineHeight: 1.4
          }}>
            <strong>Valuation Rules:</strong><br />
            • PE &lt; {lowPE}: Invest <strong>200%</strong> + Deploy Cash Reserve<br />
            • {lowPE} ≤ PE ≤ {highPE}: Invest <strong>100%</strong> Base<br />
            • PE &gt; {highPE}: Invest <strong>50%</strong> + Save 50% in Cash Reserve
          </div>
        </div>
      )}

      {/* Dual Momentum Configuration Panel */}
      {strategy === 'DUAL_MOMENTUM' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'rgba(236, 72, 153, 0.04)',
          border: '1px solid rgba(236, 72, 153, 0.18)',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '4px'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Gary Antonacci's Dual Momentum rotates between two assets using 12-month trailing returns, with a risk-free rate filter as a safe haven.
          </p>

          {/* Secondary Ticker Input */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Second Asset Ticker
            </span>
            <input
              type="text"
              value={secondaryTicker}
              onChange={(e) => setSecondaryTicker && setSecondaryTicker(e.target.value.toUpperCase())}
              placeholder="GC=F"
              style={{
                width: '90px',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textAlign: 'center',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Quick Ticker Presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button type="button" className="quick-chip" onClick={() => setSecondaryTicker && setSecondaryTicker('GC=F')} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>Gold (GC=F)</button>
            <button type="button" className="quick-chip" onClick={() => setSecondaryTicker && setSecondaryTicker('GOLDBEES')} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>GoldBEES</button>
            <button type="button" className="quick-chip" onClick={() => setSecondaryTicker && setSecondaryTicker('^BSESN')} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>Sensex</button>
          </div>

          {/* Lookback Period */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Lookback Period
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[3, 6, 9, 12].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setLookbackMonths && setLookbackMonths(m)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: lookbackMonths === m ? '1.5px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(0,0,0,0.08)',
                    background: lookbackMonths === m ? 'rgba(236, 72, 153, 0.08)' : '#ffffff',
                    color: lookbackMonths === m ? '#be185d' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>

          {/* Risk-Free Rate */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Risk-Free Rate (FD Benchmark)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate && setInterestRate(Math.max(0, Math.min(20, Number(e.target.value))))}
                step="0.1"
                style={{
                  width: '60px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  background: '#ffffff'
                }}
                min="0"
                max="20"
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>% p.a.</span>
            </div>
          </div>

          {/* Annual Step-Up */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Annual Step-Up
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

          {/* Decision Logic Diagram */}
          <div style={{
            fontSize: '0.72rem',
            color: '#9d174d',
            background: 'rgba(236, 72, 153, 0.06)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(236, 72, 153, 0.15)',
            fontWeight: 500,
            lineHeight: 1.5
          }}>
            <strong>Monthly Decision Logic:</strong><br />
            1. Compare {lookbackMonths}-month returns: Primary vs {secondaryTicker}<br />
            2. Winner return &gt; {interestRate}% FD? → <strong>Invest in Winner</strong><br />
            3. Winner return ≤ {interestRate}% FD? → <strong>Park in Safe Haven (FD)</strong>
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

      {/* Dividend Reinvestment (DRIP) Card - Only applicable for stock/index market strategies */}
      {strategy !== 'BANK_FD' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: enableDividend ? 'rgba(139, 92, 246, 0.05)' : 'rgba(0,0,0,0.02)',
          border: enableDividend ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(0,0,0,0.06)',
          borderRadius: '16px',
          padding: '14px 16px',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: enableDividend ? '#6d28d9' : '#0f172a' }}>
                Dividend Reinvestment (DRIP)
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Reinvest dividend yield payouts back into purchasing extra units
              </span>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setEnableDividend && setEnableDividend(!enableDividend)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '9999px',
                background: enableDividend ? '#8b5cf6' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s ease',
                padding: '2px'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ffffff',
                transform: enableDividend ? 'translateX(20px)' : 'translateX(0px)',
                transition: 'transform 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          {enableDividend && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px dashed rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Est. Dividend Yield
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    value={dividendYield}
                    onChange={(e) => setDividendYield && setDividendYield(Math.max(0, Math.min(15, Number(e.target.value))))}
                    step="0.1"
                    style={{
                      width: '60px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      background: '#ffffff'
                    }}
                    min="0"
                    max="15"
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>% p.a.</span>
                </div>
              </div>

              {/* Quick Benchmark Preset Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => setDividendYield && setDividendYield(1.5)}
                  style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                >
                  Nifty 50 (1.5%)
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => setDividendYield && setDividendYield(2.5)}
                  style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                >
                  Bluechip (2.5%)
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => setDividendYield && setDividendYield(5.0)}
                  style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                >
                  High Div PSUs (5.0%)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategySelector;

