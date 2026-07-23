import React from 'react';
import Tooltip from '../Common/Tooltip';

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

  const profit = (metrics.current_value || 0) - (metrics.total_invested || 0);

  const cards = [
    {
      title: 'Total Invested',
      value: formatINR(metrics.total_invested),
      subtext: 'Total cash deployed',
      color: 'var(--text-primary)',
      tooltip: 'Sum of all monthly cash deposits made over the backtest duration.'
    },
    {
      title: 'Current Portfolio Value',
      value: formatINR(metrics.current_value),
      subtext: profit >= 0 ? `+${formatINR(profit)} Profit` : `${formatINR(profit)} Loss`,
      color: 'var(--color-accent)',
      badgeColor: profit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      tooltip: 'Current valuation of accumulated stock units calculated at market closing prices.'
    },
    {
      title: 'Total Return',
      value: `${metrics.total_return_pct >= 0 ? '+' : ''}${metrics.total_return_pct}%`,
      subtext: 'Absolute return percentage',
      color: getMetricColor(metrics.total_return_pct),
      tooltip: 'Simple total gain percentage: ((Final Value - Total Cash) / Total Cash) * 100.'
    },
    {
      title: 'Annualized Return (XIRR)',
      value: `${metrics.xirr_pct >= 0 ? '+' : ''}${metrics.xirr_pct}%`,
      subtext: 'SIP internal rate of return',
      color: getMetricColor(metrics.xirr_pct),
      tooltip: 'Extended Internal Rate of Return (XIRR). Accounts for cash flow timing of monthly installments.'
    },
    {
      title: 'Max Drawdown',
      value: `${metrics.max_drawdown_pct}%`,
      subtext: 'Peak-to-trough drop',
      color: 'var(--color-danger)',
      tooltip: 'Largest percentage decline from historical portfolio peak to trough during the timeline.'
    },
    {
      title: 'Sharpe Ratio',
      value: metrics.sharpe_ratio,
      subtext: 'Risk-adjusted return',
      color: metrics.sharpe_ratio >= 1 ? 'var(--color-accent)' : metrics.sharpe_ratio >= 0 ? 'var(--text-primary)' : 'var(--color-danger)',
      tooltip: 'Risk-adjusted return ratio relative to Indian 6% risk-free rate (>1.0 is considered strong).'
    },
    ...(metrics.final_monthly_installment ? [{
      title: 'Final Monthly SIP',
      value: formatINR(metrics.final_monthly_installment),
      subtext: metrics.initial_monthly_installment && metrics.initial_monthly_installment !== metrics.final_monthly_installment
        ? `Started at ${formatINR(metrics.initial_monthly_installment)} / mo`
        : 'Monthly installment allocation',
      color: 'var(--color-primary)',
      tooltip: 'Monthly investment installment amount reached at the end of the simulation timeline.'
    }] : []),
    ...(metrics.dividends_reinvested && metrics.dividends_reinvested > 0 ? [{
      title: 'Dividends Reinvested',
      value: formatINR(metrics.dividends_reinvested),
      subtext: 'Compounded DRIP yield',
      color: '#8b5cf6',
      tooltip: 'Total cumulative dividend cash earned and automatically reinvested into buying additional stock units.'
    }] : [])
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
          minHeight: '130px',
          padding: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <h4 style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}>
                {card.title}
              </h4>
              {card.tooltip && (
                <Tooltip text={card.tooltip}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.05)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'help'
                  }}>
                    ?
                  </span>
                </Tooltip>
              )}
            </div>
            <p style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              color: card.color,
              marginTop: '8px',
              fontFamily: "'Outfit', sans-serif"
            }}>
              {card.value}
            </p>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginTop: '12px',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};


export default MetricsGrid;
