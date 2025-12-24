import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Loading.css';

export default function Loading({ fullScreen = true, text }) {
  const { t } = useLanguage();

  const content = (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">{text || t('loading')}</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  return content;
}
