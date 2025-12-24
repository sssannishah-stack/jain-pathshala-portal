// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import PendingApprovals from '../components/admin/PendingApprovals';
import StudentsList from '../components/admin/StudentsList';
import StudentDetail from '../components/admin/StudentDetail';
import MonthlyReport from '../components/admin/MonthlyReport';
import { useLanguage } from '../contexts/LanguageContext';
import { FaClipboardList, FaUsers, FaChartBar } from 'react-icons/fa';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('approvals');
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>👨‍🏫 {t('adminDashboard')}</h1>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeView === 'approvals' ? 'active' : ''}`}
            onClick={() => { setActiveView('approvals'); setSelectedStudent(null); }}
          >
            <FaClipboardList /> {t('pendingApprovals')}
          </button>
          <button 
            className={`tab ${activeView === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveView('students'); setSelectedStudent(null); }}
          >
            <FaUsers /> {t('students')}
          </button>
          <button 
            className={`tab ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveView('reports'); setSelectedStudent(null); }}
          >
            <FaChartBar /> {t('reports')}
          </button>
        </div>

        <div className="admin-view">
          {activeView === 'approvals' && <PendingApprovals />}
          
          {activeView === 'students' && !selectedStudent && (
            <StudentsList onSelectStudent={setSelectedStudent} />
          )}
          
          {activeView === 'students' && selectedStudent && (
            <StudentDetail 
              student={selectedStudent} 
              onBack={() => setSelectedStudent(null)} 
            />
          )}

          {activeView === 'reports' && <MonthlyReport />}
        </div>
      </div>
    </div>
  );
}
