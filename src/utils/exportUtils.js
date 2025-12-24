import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// Export to PDF
export const exportToPDF = (data, title, columns, filename) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(102, 126, 234);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 14, 30);
  
  // Add table
  doc.autoTable({
    startY: 40,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.key] || '-')),
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 246, 250],
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} - Jain Pathshala Attendance Portal`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`${filename}.pdf`);
};

// Export to Excel
export const exportToExcel = (data, title, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  // Add column widths
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2
  }));
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, `${filename}.xlsx`);
};

// Generate Attendance Report Data
export const generateAttendanceReportData = (records, language = 'en') => {
  return records.map(record => ({
    'Date': format(new Date(record.date), 'dd MMM yyyy'),
    'Member Name': record.memberName,
    'Group': record.groupName || '-',
    'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1),
    'Approved Date': record.approvedAt ? format(new Date(record.approvedAt), 'dd MMM yyyy') : '-'
  }));
};

// Generate Gatha Report Data
export const generateGathaReportData = (records, language = 'en') => {
  return records.map(record => ({
    'Date': format(new Date(record.date), 'dd MMM yyyy'),
    'Member Name': record.memberName,
    'Group': record.groupName || '-',
    'Type': record.type === 'new' ? 'New' : 'Revision',
    'Sutra Name': record.sutraName,
    'Gatha No.': record.gathaNo,
    'Total Gatha': record.totalGatha,
    'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1)
  }));
};

// Generate Monthly Summary Data
export const generateMonthlySummaryData = (students, month, year) => {
  return students.map(student => ({
    'Student Name': student.name,
    'Group': student.groupName || '-',
    'Total Classes': student.totalClasses || 0,
    'Present Days': student.presentDays || 0,
    'Attendance %': student.totalClasses > 0 
      ? ((student.presentDays / student.totalClasses) * 100).toFixed(1) + '%' 
      : '0%',
    'New Gatha': student.newGatha || 0,
    'Revision Gatha': student.revisionGatha || 0,
    'Total Gatha': (student.newGatha || 0) + (student.revisionGatha || 0)
  }));
};
