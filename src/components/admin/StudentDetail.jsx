// src/components/admin/StudentDetail.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaBook, 
  FaCheck, 
  FaTimes, 
  FaClock,
  FaChartBar,
  FaFileExcel,
  FaFilePdf
} from 'react-icons/fa';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import AttendanceChart from './AttendanceChart';
import GathaProgressChart from './GathaProgressChart';
import './StudentDetail.css';

export default function StudentDetail({ student, onBack }) {
  const { t } = useLanguage();
  const [attendance, setAttendance] = useState([]);
  const [gatha, setGatha] = useState([]);
  const [stats, setStats] = useState({
    totalAttendance: 0,
    approvedAttendance: 0,
    totalGatha: 0,
    newGatha: 0,
    revisionGatha: 0,
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, [student]);

  async function fetchStudentData() {
    try {
      // Fetch attendance
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('memberId', '==', student.id),
        orderBy('createdAt', 'desc')
      );
      const attendanceSnap = await getDocs(attendanceQuery);
      const attendanceData = attendanceSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAttendance(attendanceData);

      // Fetch gatha
      const gathaQuery = query(
        collection(db, 'gatha'),
        where('memberId', '==', student.id),
        orderBy('createdAt', 'desc')
      );
      const gathaSnap = await getDocs(gathaQuery);
      const gathaData = gathaSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGatha(gathaData);

      // Calculate stats
      const approvedAttendance = attendanceData.filter(a => a.status === 'approved');
      const approvedGatha = gathaData.filter(g => g.status === 'approved');
      const newGathaCount = approvedGatha
        .filter(g => g.type === 'new')
        .reduce((sum, g) => sum + (g.totalGatha || 0), 0);
      const revisionCount = approvedGatha
        .filter(g => g.type === 'revision')
        .reduce((sum, g) => sum + (g.totalGatha || 0), 0);

      // Calculate monthly data for charts
      const last6Months = eachMonthOfInterval({
        start: subMonths(new Date(), 5),
        end: new Date()
      });

      const monthlyData = last6Months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        const monthAttendance = approvedAttendance.filter(a => {
          const date = new Date(a.date);
          return date >= monthStart && date <= monthEnd;
        }).length;

        const monthGatha = approvedGatha
          .filter(g => {
            const date = new Date(g.date);
            return date >= monthStart && date <= monthEnd;
          })
          .reduce((sum, g) => sum + (g.totalGatha || 0), 0);

        return {
          month: format(month, 'MMM yyyy'),
          attendance: monthAttendance,
          gatha: monthGatha
        };
      });

      setStats({
        totalAttendance: attendanceData.length,
        approvedAttendance: approvedAttendance.length,
        totalGatha: approvedGatha.length,
        newGatha: newGathaCount,
        revisionGatha: revisionCount,
        monthlyData
      });

    } catch (error) {
      console.error('Error fetching student data:', error);
    }
    setLoading(false);
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheck className="approved" />;
      case 'rejected': return <FaTimes className="rejected" />;
      default: return <FaClock className="pending" />;
    }
  };

  const handleExportReport = (type) => {
    const data = {
      student: student.name,
      group: student.groupName,
      stats,
      attendance: attendance.filter(a => a.status === 'approved'),
      gatha: gatha.filter(g => g.status === 'approved')
    };

    if (type === 'excel') {
      exportToExcel(data, `report_${student.name}`);
    } else {
      exportToPDF(data, 'report', student.name);
    }
  };

  const filteredAttendance = selectedMonth 
    ? attendance.filter(a => format(new Date(a.date), 'yyyy-MM') === selectedMonth)
    : attendance;

  const filteredGatha = selectedMonth
    ? gatha.filter(g => format(new Date(g.date), 'yyyy-MM') === selectedMonth)
    : gatha;

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="student-detail">
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> {t('backToStudents')}
      </button>

      <div className="student-header">
        <div className="student-info">
          <h2>{student.name}</h2>
          <p className="group-name">{student.groupName}</p>
        </div>
        <div className="export-actions">
          <button onClick={() => handleExportReport('excel')} className="export-btn">
            <FaFileExcel /> {t('exportExcel')}
          </button>
          <button onClick={() => handleExportReport('pdf')} className="export-btn">
            <FaFilePdf /> {t('exportPDF')}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card attendance-stat">
          <FaCalendar className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.approvedAttendance}</span>
            <span className="stat-label">{t('daysPresent')}</span>
          </div>
        </div>
        <div className="stat-card new-gatha-stat">
          <FaBook className="stat-icon" />
          <div 
