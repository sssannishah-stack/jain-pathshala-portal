// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaPray, FaGlobe } from 'react-icons/fa';
import LanguageSelector from '../components/common/LanguageSelector';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success(t('loginSuccess'));
    } catch (error) {
      toast.error(t('invalidCredentials'));
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="language-toggle">
        <LanguageSelector />
      </div>

      <div className="login-container">
        <div className="login-header">
          <FaPray className="logo-icon" />
          <h1>{t('appName')}</h1>
          <p>{t('attendancePortal')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>

        <div className="login-footer">
          <p>🙏 {t('jaiJinendra')} 🙏</p>
        </div>
      </div>
    </div>
  );
}
