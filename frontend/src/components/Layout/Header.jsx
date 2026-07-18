import React from 'react';

const Header = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px 0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <header style={{
        width: '100%',
        padding: '12px 28px',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '9999px', /* Floating pill header */
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
        <nav className="desktop-nav" style={{ display: 'flex', gap: '28px' }}>
          {['Platform', 'Strategies', 'Resources', 'About'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                textDecoration: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#0f172a'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {link}
            </a>
          ))}
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
