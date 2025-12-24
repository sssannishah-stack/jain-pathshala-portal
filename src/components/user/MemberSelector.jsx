import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaUser, FaCheck } from 'react-icons/fa';
import './MemberSelector.css';

export default function MemberSelector() {
  const { userData, selectedMember, setSelectedMember } = useAuth();
  const { t } = useLanguage();

  if (!userData?.members || userData.members.length <= 1) {
    return null;
  }

  return (
    <div className="member-selector">
      <h3>{t('selectMember')}</h3>
      <div className="member-cards">
        {userData.members.map((member, index) => (
          <div
            key={member.id || index}
            className={`member-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
            onClick={() => setSelectedMember(member)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setSelectedMember(member)}
          >
            <div className="member-avatar">
              <FaUser />
            </div>
            <span className="member-name">{member.name}</span>
            {selectedMember?.id === member.id && (
              <FaCheck className="check-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
