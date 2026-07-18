import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TickerInput = ({ selectedTicker, selectedTickerName, onTickerSelect }) => {
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
    onTickerSelect(ticker.symbol, ticker.name);
    setQuery(ticker.symbol);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // If the user starts typing, clean the selected name to prevent outdated labels
    if (value !== selectedTicker) {
      onTickerSelect(value, '');
    }
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
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter stock name (e.g. RELIANCE, TCS, Nifty)"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          style={{ paddingRight: '40px' }}
        />
        {loading && (
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(0,0,0,0.05)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        )}
      </div>
      
      {/* Show friendly name underneath the search box */}
      {selectedTickerName && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-accent)',
          marginTop: '6px',
          paddingLeft: '10px',
          fontWeight: 500
        }}>
          Selected: {selectedTickerName}
        </div>
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '16px',
          maxHeight: '220px',
          overflowY: 'auto',
          zIndex: 150,
          listStyle: 'none',
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.15)',
          padding: '6px 0'
        }}>
          {suggestions.map((item) => (
            <li
              key={item.yahoo_symbol}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px 18px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                borderBottom: '1px solid rgba(0, 0, 0, 0.02)',
                transition: 'background 0.2s',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontWeight: 600 }}>{item.symbol}</span>
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
