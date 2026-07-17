import React from 'react';

const MetricsGrid = ({ metrics }) => {
  if (!metrics) return null;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getMetricColor = (val, isPercentage = true) => {
    if (isPercentage) {
      return val >= 0 ? 'var(--color-accent)' : 'var(--color-danger)';
    }
    return 'var(--text-primary)';
  };

  const cards = [
    {
      title: 'Total Invested',
      value: formatINR(metrics.total_invested),
      subtext: 'Accumulated capital',
      color: 'var(--text-primary)'
    },
    {
      title: 'Current Portfolio Value',
      value: formatINR(metrics.current_value),
      subtext: 'Current market value',
      color: 'var(--color-accent)'
    },
    {
      title: 'Total Return',
      value: `${metrics.total_return_pct >= 0 ? '+' : ''}${metrics.total_return_pct}%`,
      subtext: 'Absolute returns',
      color: getMetricColor(metrics.total_return_pct)
    },
    {
      title: 'Annualized Return (XIRR)',
      value: `${metrics.xirr_pct >= 0 ? '+' : ''}${metrics.xirr_pct}%`,
      subtext: 'SIP internal rate of return',
      color: getMetricColor(metrics.xirr_pct)
    },
    {
      title: 'Max Drawdown',
      value: `${metrics.max_drawdown_pct}%`,
      subtext: 'Peak-to-trough drop',
      color: 'var(--color-danger)'
    },
    {
      title: 'Sharpe Ratio',
      value: metrics.sharpe_ratio,
      subtext: 'Risk-adjusted return',
      color: metrics.sharpe_ratio >= 1 ? 'var(--color-accent)' : metrics.sharpe_ratio >= 0 ? 'var(--text-primary)' : 'var(--color-danger)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      width: '100%',
      marginTop: '20px'
    }}>
      {cards.map((card) => (
        <div key={card.title} className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500
            }}>
              {card.title}
            </h4>
            <p style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: card.color,
              marginTop: '8px',
              fontFamily: "'Outfit', sans-serif"
            }}>
              {card.value}
            </p>
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginTop: '12px'
          }}>
            {card.subtext}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
