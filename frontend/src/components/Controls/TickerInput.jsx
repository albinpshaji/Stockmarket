import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TickerInput = ({ selectedTicker, setSelectedTicker }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Sync display query with selected ticker
  useEffect(() => {
    if (selectedTicker) {
      setQuery(selectedTicker);
    }
  }, [selectedTicker]);

  // Handle outside clicks to close autocomplete dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch suggestions with debounce-like behavior
  useEffect(() => {
    if (query.length < 2 || query === selectedTicker) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/tickers/search?q=${query}`);
        setSuggestions(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching autocomplete:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedTicker]);

  const handleSelect = (ticker) => {
    setSelectedTicker(ticker.symbol);
    setQuery(ticker.symbol);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <label style={{
        display: 'block',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
        fontWeight: 500
      }}>
        Search Stock / Index Ticker
      </label>
      <input
        type="text"
        className="input-field"
        placeholder="Enter stock name (e.g. RELIANCE, TCS, Nifty)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute',
          right: '12px',
          bottom: '12px',
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      )}
      {showDropdown && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          maxHeight: '220px',
          overflowY: 'auto',
          zIndex: 50,
          listStyle: 'none',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          {suggestions.map((item) => (
            <li
              key={item.yahoo_symbol}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.symbol}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '70%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TickerInput;
