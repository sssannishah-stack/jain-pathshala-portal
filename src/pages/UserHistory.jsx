// src/pages/UserHistory.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import MemberSelector from '../components/user/MemberSelector';
import HistoryTable from '../components/user/HistoryTable';
import { useLanguage } from '../contexts/LanguageContext';
import { FaCalendar, FaBook } from 'react-icons/fa';
import './UserHistory.css';

export default function UserHistory() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="user-history">
      <Navbar />
      
      <div className="history-content">
        <h1>📜 {t('history')}</h1>
        
        <MemberSelector />

        <div className="history-tabs">
          <button 
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <FaCalendar /> {t('attendance')}
          </button>
          <button 
            className={`tab ${activeTab === 'gatha' ? 'active' : ''}`}
            onClick={() => setActiveTab('gatha')}
          >
            <FaBook /> {t('gatha')}
          </button>
        </div>

        <HistoryTable type={activeTab} />
      </div>
    </div>
  );
}
