// src/components/admin/AddMemberModal.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import './AddMemberModal.css';

export default function AddMemberModal({ group, onClose, onAdd }) {
  const { t } = useLanguage();
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState([{ name: '' }]);
  const [loading, setLoading] = useState(false);

  const handleAddField = () => {
    setMembers([...members, { name: '' }]);
  };

  const handleRemoveField = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index].name = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validMembers = members.filter(m => m.name.trim() !== '');
    
    for (const member of validMembers) {
      await onAdd({ name: member.name.trim() });
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FaUserPlus /> {t('addMembersTo')} {group.groupName || group.name}</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="members-inputs">
            {members.map((member, index) => (
              <div key={index} className="member-input-row">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder={`${t('memberName')} ${index + 1}`}
                  required
                />
                {members.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-field-btn"
                    onClick={() => handleRemoveField(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            type="button" 
            className="add-field-btn"
            onClick={handleAddField}
          >
            + {t('addAnotherMember')}
          </button>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? t('adding') : t('addMembers')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
