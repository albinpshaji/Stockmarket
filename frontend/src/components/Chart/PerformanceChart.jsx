import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const PerformanceChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (tickItem) => {
    try {
      const date = new Date(tickItem);
      return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    } catch (e) {
      return tickItem;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dateStr = formatDate(payload[0].payload.date);
      return (
        <div className="glass-card" style={{
          padding: '12px 18px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          fontSize: '0.9rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>{dateStr}</p>
          <p style={{ color: 'var(--color-primary)', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <span>Invested:</span>
            <strong>{formatCurrency(payload[0].value)}</strong>
          </p>
          <p style={{ color: 'var(--color-accent)', display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '4px' }}>
            <span>Portfolio:</span>
            <strong>{formatCurrency(payload[1].value)}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '400px', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.12}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.04)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="var(--text-secondary)"
            fontSize={11}
            tickLine={false}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            name="Cash Invested"
            dataKey="cash_invested"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorInvested)"
            dot={false}
          />
          <Area
            type="monotone"
            name="Portfolio Value"
            dataKey="portfolio_value"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
