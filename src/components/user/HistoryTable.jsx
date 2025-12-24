// src/components/user/HistoryTable.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { format } from 'date-fns';
import { FaCheck, FaClock, FaTimes, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import './HistoryTable.css';

export default function HistoryTable({ type }) {
  const { selectedMember } = useAuth();
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (!selectedMember) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const collectionName = type === 'attendance' ? 'attendance' : 'gatha';
    
    const q = query(
      collection(db, collectionName),
      where('memberId', '==', selectedMember.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedMember, type]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheck className="status-icon approved" />;
      case 'rejected':
        return <FaTimes className="status-icon rejected" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const filteredRecords = records.filter(record => {
    // Status filter
    if (filterStatus !== 'all' && record.status !== filterStatus) {
      return false;
    }
    
    // Date range filter
    if (dateRange.start && new Date(record.date) < new Date(dateRange.start)) {
      return false;
    }
    if (dateRange.end && new Date(record.date) > new Date(dateRange.end)) {
      return false;
    }
    
    return true;
  });

  const handleExportExcel = () => {
    const data = filteredRecords.map(record => ({
      Date: format(new Date(record.date), 'dd MMM yyyy'),
      ...(type === 'gatha' && {
        Type: record.type === 'new' ? 'New' : 'Revision',
        Sutra: record.sutraName,
        'Gatha No': record.gathaNo,
        'Total Gatha': record.totalGatha
      }),
      Status: record.status
    }));
    
    exportToExcel(data, `${type}_history_${selectedMember.name}`);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredRecords, type, selectedMember.name);
  };

  if (loading) return <div className="loading">{t('loading')}</div>;

  if (!selectedMember) {
    return <div className="no-data">{t('selectMemberToViewHistory')}</div>;
  }

  return (
    <div className="history-table-container">
      <div className="history-controls">
        <div className="filter-group">
          <label>{t('status')}:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">{t('all')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="approved">{t('approved')}</option>
            <option value="rejected">{t('rejected')}</option>
          </select>
        </div>

        <div className="filter-group">
          
