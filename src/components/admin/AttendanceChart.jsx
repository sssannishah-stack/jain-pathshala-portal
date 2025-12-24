// src/components/admin/AttendanceChart.jsx
import React from 'react';
import './Charts.css';

export default function AttendanceChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.attendance), 10);
  
  return (
    <div className="bar-chart">
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="bar-container">
            <div 
              className="bar attendance-bar"
              style={{ 
                height: `${(item.attendance / maxValue) * 100}%`,
                minHeight: item.attendance > 0 ? '20px' : '0'
              }}
            >
              <span className="bar-value">{item.attendance}</span>
            </div>
            <span className="bar-label">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color attendance"></span>
          <span>Days Present</span>
        </div>
      </div>
    </div>
  );
}
