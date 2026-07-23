import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        zIndex: visible ? 999 : 'auto'
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{
          position: 'absolute',
          bottom: '135%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '210px',
          padding: '10px 14px',
          background: '#0f172a',
          color: '#ffffff',
          fontSize: '0.75rem',
          lineHeight: '1.4',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.35)',
          zIndex: 9999,
          pointerEvents: 'none',
          textAlign: 'center',
          fontWeight: 400
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: '#0f172a transparent transparent transparent'
          }} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;

