// src/components/admin/GathaProgressChart.jsx
import React from 'react';
import './Charts.css';

export default function GathaProgressChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.gatha), 10);
  
  // Calculate cumulative progress
  let cumulative = 0;
  const progressData = data.map(item => {
    cumulative += item.gatha;
    return { ...item, cumulative };
  });
  
  return (
    <div className="progress-chart">
      <div className="line-chart">
        <svg viewBox="0 0 600 300" className="chart-svg">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line 
              key={percent}
              x1="50" 
              y1={250 - (percent * 2)} 
              x2="580" 
              y2={250 - (percent * 2)}
              stroke="#eee"
              strokeWidth="1"
            />
          ))}
          
          {/* Line path */}
          <polyline
            fill="none"
            stroke="#667eea"
            strokeWidth="3"
            points={progressData.map((item, index) => {
              const x = 50 + (index * (530 / (progressData.length - 1 || 1)));
              const y = 250 - ((item.gatha / maxValue) * 200);
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {progressData.map((item, index) => {
            const x = 50 + (index * (530 / (progressData.length - 1 || 1)));
            const y = 250 - ((item.gatha / maxValue) * 200);
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="6" fill="#667eea" />
                <text x={x} y={y - 15} textAnchor="middle" className="chart-text">
                  {item.gatha}
                </text>
                <text x={x} y={280} textAnchor="middle" className="chart-label">
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="progress-summary">
        <div className="summary-item">
          <span className="summary-value">{cumulative}</span>
          <span className="summary-label">Total Gatha Learned</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">
            {Math.round(cumulative / data.length)}
          </span>
          <span className="summary-label">Avg per Month</span>
        </div>
      </div>
    </div>
  );
}
