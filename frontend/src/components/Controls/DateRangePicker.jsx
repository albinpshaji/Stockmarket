import React from 'react';

const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      width: '100%'
    }}>
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          fontWeight: 500
        }}>
          Start Date
        </label>
        <input
          type="date"
          className="input-field"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          fontWeight: 500
        }}>
          End Date
        </label>
        <input
          type="date"
          className="input-field"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
