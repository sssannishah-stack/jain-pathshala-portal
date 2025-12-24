// src/components/admin/MonthlyReport.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { FaFileExcel, FaFilePdf, FaCalendarAlt, FaChartPie } from 'react-icons/fa';
import { exportToExcel, exportMonthlyReportPDF } from '../../utils/exportUtils';
import './MonthlyReport.css';

export default function MonthlyReport() {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, [selectedMonth]);

  async function generateReport() {
    setLoading(true);
    try {
      const monthDate = parseISO(`${selectedMonth}-01`);
      const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

      // Fetch all users
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'user'));
      const usersSnap = await getDocs(usersQuery);
      const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch attendance for the month
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('status', '==', 'approved'),
        orderBy('date')
      );
      const attendanceSnap = await getDocs(attendanceQuery);
      const allAttendance = attendanceSnap.docs
        .map(doc => doc.data())
        .filter(a => a.date >= monthStart && a.date <= monthEnd);

      // Fetch gatha for the month
      const gathaQuery = query(
        collection(db, 'gatha'),
        where('status', '==', 'approved'),
        orderBy('date')
      );
      const gathaSnap = await getDocs(gathaQuery);
      const allGatha = gathaSnap.docs
        .map(doc => doc.data())
        .filter(g => g.date >= monthStart && g.date <= monthEnd);

      // Process data by member
      const memberReports = [];
      
      users.forEach(user => {
        user.members?.forEach(member => {
          const memberAttendance = allAttendance.filter(a => a.memberId === member.id);
          const memberGatha = allGatha.filter(g => g.memberId === member.id);
          
          const newGatha = memberGatha
            .filter(g => g.type === 'new')
            .reduce((sum, g) => sum + g.totalGatha, 0);
          const revisionGatha = memberGatha
            .filter(g => g.type === 'revision')
            .reduce((sum, g) => sum + g.totalGatha, 0);

          memberReports.push({
            name: member.name,
            groupName: user.groupName || user.name,
            attendanceDays: memberAttendance.length,
            newGatha,
            revisionGatha,
            totalGatha: newGatha + revisionGatha
          });
        });
      });

      // Sort by total gatha (descending)
      memberReports.sort((a, b) => b.totalGatha - a.totalGatha);

      // Calculate totals
      const totals = memberReports.reduce((acc, m) => ({
        attendanceDays: acc.attendanceDays + m.attendanceDays,
        newGatha: acc.newGatha + m.newGatha,
        revisionGatha: acc.revisionGatha + m.revisionGatha,
        totalGatha: acc.totalGatha + m.totalGatha
      }), { attendanceDays: 0, newGatha: 0, revisionGatha: 0, totalGatha: 0 });

      setReportData({
        month: format(monthDate, 'MMMM yyyy'),
        members: memberReports,
        totals,
        topPerformers: memberReports.slice(0, 3)
      });

    } catch (error) {
      console.error('Error generating report:', error);
    }
    setLoading(false);
  }

  const handleExportExcel = () => {
    if (!reportData) return;
    
    const data = reportData.members.map(m => ({
      'Name': m.name,
      'Group': m.groupName,
      'Days Present': m.attendanceDays,
      'New Gatha': m.newGatha,
      'Revision Gatha': m.revisionGatha,
      'Total Gatha': m.totalGatha
    }));
    
    exportToExcel(data, `Monthly_Report_${selectedMonth}`);
  };

  const handleExportPDF = () => {
    if (!reportData) return;
    exportMonthlyReportPDF(reportData, selectedMonth);
  };

  return (
    <div className="monthly-report">
      <div className="report-header">
        <h2><FaCalendarAlt /> {t('monthlyReport')}</h2>
        
        <div className="report-controls">
          <input 
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-picker"
          />
          
          <div className="export-buttons">
            <button onClick={handleExportExcel} className="export-btn excel" disabled={!reportData}>
              <FaFileExcel /> Excel
            </button>
            <button onClick={handleExportPDF} className="export-btn pdf" disabled={!reportData}>
              <FaFilePdf /> PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('generatingReport')}</div>
      ) : reportData ? (
        <>
          <div className="report-summary">
            <div className="summary-card">
              <h4>{t('totalStudents')}</h4>
              <span className="value">{reportData.members.length}</span>
            </div>
            <div className="summary-card">
              <h4>{t('totalAttendance')}</h4>
              <span className="value">{reportData.totals.attendanceDays}</span>
            </div>
            <div className="summary-card">
              <h4>{t('newGatha')}</h4>
              <span className="value">{reportData.totals.newGatha}</span>
            </div>
            <div className="summary-card">
              <h4>{t('revisionGatha')}</h4>
              <span className="value">{reportData.totals.revisionGatha}</span>
            </div>
          </div>

          {reportData.topPerformers.length > 0 && (
            <div className="top-performers">
              <h3><FaChartPie /> {t('topPerformers')}</h3>
              <div className="performers-list">
                {reportData.topPerformers.map((performer, index) => (
                  <div key={index} className={`performer-card rank-${index + 1}`}>
                    <span className="rank">#{index + 1}</span>
                    <div className="performer-info">
                      <h4>{performer.name}</h4>
                      <p>{performer.groupName}</p>
                    </div>
                    <div className="performer-stats">
                      <span>{performer.totalGatha} {t('gatha')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="report-table-container">
            <h3>{t('detailedReport')}</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('name')}</th>
                  <th>{t('group')}</th>
                  <th>{t('daysPresent')}</th>
                  <th>{t('newGatha')}</th>
                  <th>{t('revisionGatha')}</th>
                  <th>{t('totalGatha')}</th>
                </tr>
              </thead>
              <tbody>
                {reportData.members.map((member, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.groupName}</td>
                    <td>{member.attendanceDays}</td>
                    <td>{member.newGatha}</td>
                    <td>{member.revisionGatha}</td>
                    <td><strong>{member.totalGatha}</strong></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>{t('total')}</strong></td>
                  <td><strong>{reportData.totals.attendanceDays}</strong></td>
                  <td><strong>{reportData.totals.newGatha}</strong></td>
                  <td><strong>{reportData.totals.revisionGatha}</strong></td>
                  <td><strong>{reportData.totals.totalGatha}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <div className="no-data">{t('noDataAvailable')}</div>
      )}
    </div>
  );
}
