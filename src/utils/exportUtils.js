// src/utils/exportUtils.js
import { format } from 'date-fns';

// Export to Excel (CSV format - opens in Excel)
export function exportToExcel(data, filename) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  let csvContent = '';
  
  // Handle different data structures
  if (Array.isArray(data)) {
    // Get headers from first object
    const headers = Object.keys(data[0]);
    csvContent += headers.join(',') + '\n';
    
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });
  } else {
    // Handle report object
    csvContent = generateReportCSV(data);
  }

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateReportCSV(data) {
  let csv = '';
  
  // Student info
  csv += `Student Report\n`;
  csv += `Name,${data.student}\n`;
  csv += `Group,${data.group}\n`;
  csv += `\n`;
  
  // Stats
  csv += `Statistics\n`;
  csv += `Days Present,${data.stats.approvedAttendance}\n`;
  csv += `New Gatha,${data.stats.newGatha}\n`;
  csv += `Revision Gatha,${data.stats.revisionGatha}\n`;
  csv += `Total Gatha,${data.stats.newGatha + data.stats.revisionGatha}\n`;
  csv += `\n`;
  
  // Attendance
  csv += `Attendance History\n`;
  csv += `Date\n`;
  data.attendance.forEach(a => {
    csv += `${format(new Date(a.date), 'dd MMM yyyy')}\n`;
  });
  csv += `\n`;
  
  // Gatha
  csv += `Gatha History\n`;
  csv += `Date,Type,Sutra,Gatha No,Total Gatha\n`;
  data.gatha.forEach(g => {
    csv += `${format(new Date(g.date), 'dd MMM yyyy')},${g.type},${g.sutraName},${g.gathaNo},${g.totalGatha}\n`;
  });
  
  return csv;
}

// Export to PDF (using browser print)
export function exportToPDF(data, type, name) {
  const printWindow = window.open('', '_blank');
  
  let content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${type} History - ${name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #667eea;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }
        h2 {
          color: #444;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background: #667eea;
          color: white;
        }
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        .stats {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }
        .stat-box {
          background: #f5f5f5;
          padding: 15px 25px;
          border-radius: 8px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
        }
        .badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 12px;
        }
        .badge-new {
          background: #d4edda;
          color: #155724;
        }
        .badge-revision {
          background: #fff3cd;
          color: #856404;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <h1>🙏 Jain Pathshala - ${name}</h1>
      <p>Generated on: ${format(new Date(), 'dd MMMM yyyy, hh:mm a')}</p>
  `;

  if (type === 'report' && data.stats) {
    content += `
      <div class="stats">
        <div class="stat-box">
          <div class="stat-value">${data.stats.approvedAttendance}</div>
          <div class="stat-label">Days Present</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${data.stats.newGatha}</div>
          <div class="stat-label">New Gatha</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${data.stats.revisionGatha}</div>
          <div class="stat-label">Revision Gatha</div>
        </div>
      </div>

      <h2>Attendance History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.attendance.map(a => `
            <tr>
              <td>${format(new Date(a.date), 'dd MMM yyyy')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>Gatha History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Sutra</th>
            <th>Gatha</th>
          </tr>
        </thead>
        <tbody>
          ${data.gatha.map(g => `
            <tr>
              <td>${format(new Date(g.date), 'dd MMM yyyy')}</td>
              <td><span class="badge badge-${g.type}">${g.type}</span></td>
              <td>${g.sutraName}</td>
              <td>${g.gathaNo}/${g.totalGatha}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (Array.isArray(data)) {
    content += `
      <h2>${type === 'attendance' ? 'Attendance' : 'Gatha'} History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            ${type === 'gatha' ? `
              <th>Type</th>
              <th>Sutra</th>
              <th>Gatha No</th>
              <th>Total</th>
            ` : ''}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(record => `
            <tr>
              <td>${format(new Date(record.date), 'dd MMM yyyy')}</td>
              ${type === 'gatha' ? `
                <td><span class="badge badge-${record.type}">${record.type}</span></td>
                <td>${record.sutraName}</td>
                <td>${record.gathaNo}</td>
                <td>${record.totalGatha}</td>
              ` : ''}
              <td>${record.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  content += `
      <div class="footer">
        <p>Jain Pathshala Attendance Portal</p>
        <p>🙏 Jai Jinendra 🙏</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}

// Export Monthly Report to PDF
export function exportMonthlyReportPDF(reportData, month) {
  const printWindow = window.open('', '_blank');
  
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Report - ${reportData.month}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #667eea;
          text-align: center;
        }
        .summary {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          flex-wrap: wrap;
        }
        .summary-box {
          background: #f5f5f5;
          padding: 20px 30px;
          border-radius: 10px;
          text-align: center;
          margin: 10px;
        }
        .summary-value {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
        }
        .summary-label {
          color: #666;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background: #667eea;
          color: white;
        }
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        tfoot {
          font-weight: bold;
          background: #eee;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #999;
        }
      </style>
    </head>
    <body>
      <h1>🙏 Jain Pathshala</h1>
      <h2 style="text-align: center;">Monthly Report - ${reportData.month}</h2>
      
      <div class="summary">
        <div class="summary-box">
          <div class="summary-value">${reportData.members.length}</div>
          <div class="summary-label">Total Students</div>
        </div>
        <div class="summary-box">
          <div class="summary-value">${reportData.totals.attendanceDays}</div>
          <div class="summary-label">Total Attendance</div>
        </div>
        <div class="summary-box">
          <div class="summary-value">${reportData.totals.newGatha}</div>
          <div class="summary-label">New Gatha</div>
        </div>
        <div class="summary-box">
          <div class="summary-value">${reportData.totals.revisionGatha}</div>
          <div class="summary-label">Revision Gatha</div>
        </div>
      </div>

      <h3>Detailed Report</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Group</th>
            <th>Days Present</th>
            <th>New Gatha</th>
            <th>Revision</th>
            <th>Total Gatha</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.members.map((m, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${m.name}</td>
              <td>${m.groupName}</td>
              <td>${m.attendanceDays}</td>
              <td>${m.newGatha}</td>
              <td>${m.revisionGatha}</td>
              <td><strong>${m.totalGatha}</strong></td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">TOTAL</td>
            <td>${reportData.totals.attendanceDays}</td>
            <td>${reportData.totals.newGatha}</td>
            <td>${reportData.totals.revisionGatha}</td>
            <td>${reportData.totals.totalGatha}</td>
          </tr>
        </tfoot>
      </table>

      <div class="footer">
        <p>Generated on: ${format(new Date(), 'dd MMMM yyyy, hh:mm a')}</p>
        <p>🙏 Jai Jinendra 🙏</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}
