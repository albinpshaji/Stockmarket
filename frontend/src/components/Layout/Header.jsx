import React, { useState, useRef, useEffect } from 'react';

const Header = ({ strategy, setStrategy }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleStrategyClick = (type) => {
    setStrategy(type);
    setDropdownOpen(false);
    // Trigger smooth-scroll and highlight flash
    window.location.hash = 'strategies';
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px 0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 200
    }}>
      <header style={{
        width: '100%',
        padding: '12px 28px',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.05)'
      }}>
        {/* Logo block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            color: '#fff',
            fontSize: '0.95rem'
          }}>
            ₹
          </div>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0f172a',
            fontFamily: "'Outfit', sans-serif"
          }}>
            RupeeSIP
          </span>
        </div>

        {/* Center menu links */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#platform" className="nav-link">Platform</a>
          
          {/* Strategies Dropdown Toggle */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="nav-link"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: dropdownOpen ? '#0f172a' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0'
              }}
            >
              Strategies
              <span style={{
                fontSize: '0.65rem',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                display: 'inline-block'
              }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '12px',
                width: '240px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.15)',
                padding: '10px 0',
                zIndex: 210,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <button
                  onClick={() => handleStrategyClick('NORMAL')}
                  className={`dropdown-item ${strategy === 'NORMAL' ? 'active' : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>Normal Monthly SIP</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fixed allocation every month</span>
                </button>
                
                <button
                  onClick={() => handleStrategyClick('STEP_UP')}
                  className={`dropdown-item ${strategy === 'STEP_UP' ? 'active' : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>Step-Up SIP</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Increase contribution annually</span>
                </button>

                <button
                  onClick={() => handleStrategyClick('DRAWDOWN')}
                  className={`dropdown-item ${strategy === 'DRAWDOWN' ? 'active' : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>Drawdown-Based SIP</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Buy the Dip allocation model</span>
                </button>

                <button
                  onClick={() => handleStrategyClick('BANK_FD')}
                  className={`dropdown-item ${strategy === 'BANK_FD' ? 'active' : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>Bank RD / FD Benchmark</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Guaranteed 6.5% p.a. bank compounding</span>
                </button>


                {/* Extensibility placeholder items showing capability for future strategies */}
                <div style={{
                  borderTop: '1px solid rgba(0,0,0,0.04)',
                  margin: '6px 0',
                  padding: '6px 14px 2px 14px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Coming Soon
                </div>
                
                <div className="dropdown-item disabled">
                  <span style={{ fontWeight: 600 }}>PE-Valuation SIP</span>
                  <span style={{ fontSize: '0.7rem' }}>Buy index based on PE ratios</span>
                </div>

              </div>
            )}
          </div>
          
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        {/* Right action button */}
        <button style={{
          background: 'transparent',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '8px 20px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: '#0f172a',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0,0,0,0.02)';
          e.target.style.borderColor = 'rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.borderColor = 'rgba(0,0,0,0.08)';
        }}
        >
          Contact Us
        </button>
      </header>

      <style>{`
        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          fontSize: 0.85rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #0f172a;
        }
        .dropdown-item {
          width: 100%;
          border: none;
          background: transparent;
          text-align: left;
          padding: 10px 18px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: #0f172a;
          transition: background 0.2s;
        }
        .dropdown-item:hover:not(.disabled) {
          background: rgba(0, 0, 0, 0.02);
        }
        .dropdown-item.active {
          background: rgba(59, 130, 246, 0.04);
          border-left: 3px solid var(--color-primary);
        }
        .dropdown-item.disabled {
          opacity: 0.45;
          cursor: not-allowed;
          color: var(--text-secondary);
        }
        @media (max-width: 650px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
