import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FaCalendarCheck, FaCheckCircle, FaHourglass } from 'react-icons/fa';
import './AttendanceForm.css';

export default function AttendanceForm() {
  const { currentUser, selectedMember, userData } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (selectedMember) {
      checkTodayAttendance();
    } else {
      setCheckingStatus(false);
    }
  }, [selectedMember]);

  async function checkTodayAttendance() {
    setCheckingStatus(true);
    try {
      const q = query(
        collection(db, 'attendance'),
        where('memberId', '==', selectedMember.id),
        where('date', '==', today)
      );
      
      const snapshot = await getDocs(q);
      setAlreadyMarked(!snapshot.empty);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
    setCheckingStatus(false);
  }

  async function handleMarkAttendance() {
    if (!selectedMember) {
      toast.error(t('selectMemberFirst'));
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'attendance'), {
        userId: currentUser.uid,
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        groupName: userData.groupName || userData.name,
        date: today,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      toast.success(t('attendanceMarked'));
      setAlreadyMarked(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(t('somethingWrong'));
    }
    setLoading(false);
  }

  const formatDate = () => {
    const date = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    
    if (language === 'hi') {
      return date.toLocaleDateString('hi-IN', options);
    } else if (language === 'gu') {
      return date.toLocaleDateString('gu-IN', options);
    }
    return date.toLocaleDateString('en-IN', options);
  };

  return (
    <div className="attendance-form card">
      <div className="form-header">
        <FaCalendarCheck className="form-icon" />
        <h3>{t('markAttendance')}</h3>
      </div>
      
      <div className="date-display">
        <span>{t('todayDate')}:</span>
        <strong>{formatDate()}</strong>
      </div>

      {checkingStatus ? (
        <div className="checking-status">
          <FaHourglass className="spin" />
          <span>{t('loading')}</span>
        </div>
      ) : alreadyMarked ? (
        <div className="already-marked">
          <FaCheckCircle className="success-icon" />
          <span>{t('alreadyMarked')}</span>
        </div>
      ) : (
        <button 
          onClick={handleMarkAttendance} 
          disabled={loading || !selectedMember}
          className="mark-btn btn btn-success"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              {t('loading')}
            </>
          ) : (
            <>
              <FaCalendarCheck />
              {t('markPresent')}
            </>
          )}
        </button>
      )}

      {!selectedMember && !checkingStatus && (
        <p className="hint-text">{t('selectMemberFirst')}</p>
      )}
    </div>
  );
}
