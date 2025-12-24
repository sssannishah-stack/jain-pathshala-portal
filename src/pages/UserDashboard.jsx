// src/pages/UserDashboard.jsx
import React from 'react';
import Navbar from '../components/common/Navbar';
import MemberSelector from '../components/user/MemberSelector';
import AttendanceForm from '../components/user/AttendanceForm';
import GathaForm from '../components/user/GathaForm';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './UserDashboard.css';

export default function UserDashboard() {
  const { userData, selectedMember } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="user-dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>🙏 {t('jaiJinendra')}</h1>
          <p>{t('welcome')}, {userData?.groupName || userData?.name}</p>
        </div>

        <MemberSelector />

        {selectedMember ? (
          <div className="forms-container">
            <AttendanceForm />
            <GathaForm />
          </div>
        ) : (
          userData?.members?.length > 1 && (
            <div className="select-member-prompt">
              <p>{t('selectMemberToContinue')}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
