// src/components/user/GathaForm.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SUTRA_LIST, GATHA_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FaBook, FaPlus, FaRedo } from 'react-icons/fa';
import './GathaForm.css';

export default function GathaForm() {
  const { currentUser, selectedMember, userData } = useAuth();
  const { t } = useLanguage();
  const [gathaType, setGathaType] = useState(GATHA_TYPES.NEW);
  const [sutraName, setSutraName] = useState('');
  const [customSutra, setCustomSutra] = useState('');
  const [gathaNo, setGathaNo] = useState('');
  const [totalGatha, setTotalGatha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedMember) {
      toast.error(t('selectMemberFirst'));
      return;
    }

    const finalSutraName = sutraName === 'Other' ? customSutra : sutraName;

    if (!finalSutraName || !gathaNo || !totalGatha) {
      toast.error(t('fillAllFields'));
      return;
    }

    if (parseInt(gathaNo) > parseInt(totalGatha)) {
      toast.error(t('gathaNoCannotExceedTotal'));
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'gatha'), {
        userId: currentUser.uid,
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        groupName: userData.groupName || userData.name,
        type: gathaType,
        sutraName: finalSutraName,
        gathaNo: parseInt(gathaNo),
        totalGatha: parseInt(totalGatha),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });

      toast.success(t('gathaAddedSuccess'));
      
      // Reset form
      setSutraName('');
      setCustomSutra('');
      setGathaNo('');
      setTotalGatha('');
    } catch (error) {
      toast.error(t('failedToAddGatha'));
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="gatha-form">
      <div className="form-header">
        <FaBook className="form-icon" />
        <h3>{t('addGatha')}</h3>
      </div>

      <div className="gatha-type-selector">
        <button
          type="button"
          className={`type-btn ${gathaType === GATHA_TYPES.NEW ? 'active' : ''}`}
          onClick={() => setGathaType(GATHA_TYPES.NEW)}
        >
          <FaPlus /> {t('new')}
        </button>
        <button
          type="button"
          className={`type-btn ${gathaType === GATHA_TYPES.REVISION ? 'active' : ''}`}
          onClick={() => setGathaType(GATHA_TYPES.REVISION)}
        >
          <FaRedo /> {t('revision')}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('sutraName')}</label>
          <select 
            value={sutraName} 
            onChange={(e) => setSutraName(e.target.value)}
            required
          >
            <option value="">{t('selectSutra')}</option>
            {SUTRA_LIST.map((sutra) => (
              <option key={sutra.key} value={sutra.key}>{sutra.name}</option>
            ))}
          </select>
        </div>

        {sutraName === 'Other' && (
          <div className="form-group">
            <label>{t('customSutraName')}</label>
            <input
              type="text"
              value={customSutra}
              onChange={(e) => setCustomSutra(e.target.value)}
              placeholder={t('enterSutraName')}
              required
            />
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>{t('gathaNo')}</label>
            <input
              type="number"
              value={gathaNo}
              onChange={(e) => setGathaNo(e.target.value)}
              placeholder="e.g., 5"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('totalGatha')}</label>
            <input
              type="number"
              value={totalGatha}
              onChange={(e) => setTotalGatha(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !selectedMember} className="submit-btn">
          {loading ? t('adding') : t('addGatha')}
        </button>
      </form>
    </div>
  );
}
