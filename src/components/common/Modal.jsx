import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaHistory, 
  FaHome, 
  FaChartBar,
  FaUsers,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, userRole, userData, logout, selectedMember } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      toast.success(t('logout') + '!');
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      toast.error(t('somethingWrong'));
    }
  }

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!currentUser) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🙏</span>
          <span className="brand-text">{t('appName')}</span>
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-user">
            <FaUser className="user-icon" />
            <span className="user-name">
              {userRole === 'admin' 
                ? userData?.name 
                : selectedMember?.name || t('selectMember')}
            </span>
          </div>

          <div className="navbar-links">
            {userRole === 'admin' ? (
              // Admin Navigation
              <>
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHome /> {t('dashboard')}
                </Link>
                <Link 
                  to="/admin/reports" 
                  className={`nav-link ${isActive('/admin/reports') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaChartBar /> {t('reports')}
                </Link>
              </>
            ) : (
              // User Navigation
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHome /> {t('dashboard')}
                </Link>
                <Link 
                  to="/history" 
                  className={`nav-link ${isActive('/history') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHistory /> {t('history')}
                </Link>
              </>
            )}
          </div>

          <div className="navbar-actions">
            <LanguageSelector />
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
