import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '40px 20px',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      marginTop: 'auto',
      fontSize: '0.85rem',
      color: 'var(--text-secondary)'
    }}>
      <p style={{ marginBottom: '8px' }}>
        RupeeSIP © {new Date().getFullYear()} — Backtest investment strategies against real market data.
      </p>
      <p style={{ fontSize: '0.75rem', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
        Disclaimer: This tool is for educational purposes only. Past performance does not guarantee future results. 
        Data fetched dynamically from Yahoo Finance API.
      </p>
    </footer>
  );
};

export default Footer;
