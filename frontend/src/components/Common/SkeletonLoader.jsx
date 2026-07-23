import React from 'react';

const SkeletonLoader = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', width: '100%' }}>
      {/* Chart Skeleton */}
      <div className="glass-card" style={{
        minHeight: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div className="skeleton-box" style={{ width: '220px', height: '24px', borderRadius: '12px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="skeleton-box" style={{ width: '80px', height: '32px', borderRadius: '9999px' }} />
            <div className="skeleton-box" style={{ width: '100px', height: '32px', borderRadius: '9999px' }} />
          </div>
        </div>
        <div className="skeleton-box" style={{ width: '100%', height: '320px', borderRadius: '16px' }} />
      </div>

      {/* Metrics Grid Skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        width: '100%'
      }}>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '125px',
            padding: '20px'
          }}>
            <div>
              <div className="skeleton-box" style={{ width: '60%', height: '14px', borderRadius: '6px', marginBottom: '12px' }} />
              <div className="skeleton-box" style={{ width: '85%', height: '28px', borderRadius: '8px' }} />
            </div>
            <div className="skeleton-box" style={{ width: '45%', height: '12px', borderRadius: '6px', marginTop: '14px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
