// src/components/admin/PendingApprovals.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FaCheck, 
  FaTimes, 
  FaCalendar, 
  FaBook, 
  FaCheckDouble,
  FaTimesCircle 
} from 'react-icons/fa';
import './PendingApprovals.css';

export default function PendingApprovals() {
  const { t } = useLanguage();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [gathaRecords, setGathaRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Fetch pending attendance
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubAttendance = onSnapshot(attendanceQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAttendanceRecords(data);
    });

    // Fetch pending gatha
    const gathaQuery = query(
      collection(db, 'gatha'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubGatha = onSnapshot(gathaQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGathaRecords(data);
      setLoading(false);
    });

    return () => {
      unsubAttendance();
      unsubGatha();
    };
  }, []);

  // Reset selection when tab changes
  useEffect(() => {
    setSelectedRecords([]);
    setSelectAll(false);
  }, [activeTab]);

  const currentRecords = activeTab === 'attendance' ? attendanceRecords : gathaRecords;
  const collectionName = activeTab === 'attendance' ? 'attendance' : 'gatha';

  const handleSelectRecord = (id) => 
