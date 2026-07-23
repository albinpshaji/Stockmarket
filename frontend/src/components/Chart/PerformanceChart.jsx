import React, { useState, useMemo } from 'react';
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
  const [viewMode, setViewMode] = useState('GROWTH'); // 'GROWTH' or 'GAIN'

  if (!data || data.length === 0) return null;

  // Downsample chart points if dataset is large (> 300 points) for smooth 60fps rendering
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Process data to compute net_gain
    const processed = data.map(item => ({
      ...item,
      net_gain: Math.round(item.portfolio_value - item.cash_invested)
    }));

    if (processed.length <= 300) return processed;

    const step = Math.ceil(processed.length / 300);
    const sampled = [];
    for (let i = 0; i < processed.length; i += step) {
      sampled.push(processed[i]);
    }
    if (sampled[sampled.length - 1] !== processed[processed.length - 1]) {
      sampled.push(processed[processed.length - 1]);
    }
    return sampled;
  }, [data]);

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
      const row = payload[0].payload;
      const dateStr = formatDate(row.date);
      const profit = row.portfolio_value - row.cash_invested;
      const profitPct = row.cash_invested > 0 ? ((profit / row.cash_invested) * 100).toFixed(1) : '0';

      return (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          fontSize: '0.85rem',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
          minWidth: '200px'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '8px', color: '#0f172a', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '4px' }}>
            {dateStr}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ color: 'var(--color-primary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cash Invested:</span>
              <strong>{formatCurrency(row.cash_invested)}</strong>
            </div>
            <div style={{ color: 'var(--color-accent)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Portfolio Value:</span>
              <strong>{formatCurrency(row.portfolio_value)}</strong>
            </div>
            <div style={{
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px dashed rgba(0,0,0,0.08)',
              color: profit >= 0 ? 'var(--color-accent)' : 'var(--color-danger)',
              display: 'flex',
              justify: 'space-between',
              fontWeight: 600
            }}>
              <span>Net Profit ({profitPct}%):</span>
              <span>{profit >= 0 ? '+' : ''}{formatCurrency(profit)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const shouldAnimate = data.length <= 300;

  return (
    <div style={{ width: '100%', marginTop: '10px' }}>
      {/* Chart View Toggle Bar */}
      <div style={{
        display: 'flex',
        justify: 'flex-end',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '9999px',
          padding: '3px',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('GROWTH')}
            style={{
              padding: '4px 14px',
              border: 'none',
              borderRadius: '9999px',
              background: viewMode === 'GROWTH' ? '#ffffff' : 'transparent',
              color: viewMode === 'GROWTH' ? '#0f172a' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'GROWTH' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Portfolio vs Capital
          </button>
          <button
            type="button"
            onClick={() => setViewMode('GAIN')}
            style={{
              padding: '4px 14px',
              border: 'none',
              borderRadius: '9999px',
              background: viewMode === 'GAIN' ? '#ffffff' : 'transparent',
              color: viewMode === 'GAIN' ? '#0f172a' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'GAIN' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Net Profit Curve
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: '380px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
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
              <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
            {viewMode === 'GROWTH' ? (
              <>
                <Area
                  type="monotone"
                  name="Cash Invested"
                  dataKey="cash_invested"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInvested)"
                  dot={false}
                  isAnimationActive={shouldAnimate}
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
                  isAnimationActive={shouldAnimate}
                />
              </>
            ) : (
              <Area
                type="monotone"
                name="Net Profit (Gain)"
                dataKey="net_gain"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorGain)"
                dot={false}
                isAnimationActive={shouldAnimate}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;

