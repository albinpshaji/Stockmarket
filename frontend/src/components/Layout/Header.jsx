import React from 'react';

const Header = () => {
  return (
    <header style={{
      width: '100%',
      padding: '20px 40px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(10, 14, 23, 0.5)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff',
          fontSize: '1.2rem',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
        }}>
          ₹
        </div>
        <span style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          background: 'linear-gradient(to right, #ffffff, #9ca3af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Outfit', sans-serif"
        }}>
          RupeeSIP
        </span>
      </div>
      <div style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '6px 12px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.02)'
      }}>
        NSE / BSE Backtest
      </div>
    </header>
  );
};

export default Header;
