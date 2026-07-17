import React from 'react';

const AmountSlider = ({ amount, setAmount }) => {
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSliderChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleTextChange = (e) => {
    const val = Number(e.target.value.replace(/[^0-9]/g, ''));
    setAmount(val);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <label style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          fontWeight: 500
        }}>
          Monthly SIP Amount
        </label>
        <span style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--color-accent)',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {formatINR(amount)}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          type="range"
          min="500"
          max="100000"
          step="500"
          value={amount || 500}
          onChange={handleSliderChange}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255,255,255,0.1)',
            outline: 'none',
            cursor: 'pointer',
            accentColor: 'var(--color-primary)'
          }}
        />
        <input
          type="text"
          className="input-field"
          value={amount}
          onChange={handleTextChange}
          style={{
            width: '100px',
            padding: '8px 12px',
            fontSize: '0.85rem',
            textAlign: 'right'
          }}
        />
      </div>
    </div>
  );
};

export default AmountSlider;
