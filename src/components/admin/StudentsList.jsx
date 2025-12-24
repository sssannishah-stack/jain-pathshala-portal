// src/components/admin/StudentsList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaUsers, FaUser, FaChevronRight, FaPlus, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AddMemberModal from './AddMemberModal';
import './StudentsList.css';

export default function StudentsList({ onSelectStudent }) {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'user'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('failedToFetchUsers'));
    }
    setLoading(false);
  }

  async function handleAddMember(userId, memberData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        members: arrayUnion({
          id: `member_${Date.now()}`,
          name: memberData.name,
          createdAt: new Date().toISOString()
        })
      });
      
      toast.success(t('memberAddedSuccessfully'));
      fetchUsers(); // Refresh the list
      setShowAddModal(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(t('failedToAddMember'));
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const groupMatch = (user.groupName || user.name || '').toLowerCase().includes(searchLower);
    const memberMatch = user.members?.some(m => m.name.toLowerCase().includes(searchLower));
    return groupMatch || memberMatch;
  });

  const totalMembers = users.reduce((sum, user) => sum + (user.members?.length || 0), 0);

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="students-list">
      <div className="students-header">
        <h2><FaUsers /> {t('allStudents')}</h2>
        <div className="header-stats">
          <span>{users.length} {t('groups')}</span>
          <span>{totalMembers} {t('totalMembers')}</span>
        </div>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input 
