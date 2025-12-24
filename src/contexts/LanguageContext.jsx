import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../utils/translations';
import { LANGUAGES } from '../utils/constants';

const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Get saved language or default to English
    const saved = localStorage.getItem('language');
    return saved && Object.values(LANGUAGES).includes(saved) ? saved : LANGUAGES.EN;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction for RTL languages if needed
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => getTranslation(language, key);

  const changeLanguage = (newLang) => {
    if (Object.values(LANGUAGES).includes(newLang)) {
      setLanguage(newLang);
    }
  };

  const getLanguageName = (lang) => {
    const names = {
      en: 'English',
      hi: 'हिंदी',
      gu: 'ગુજરાતી'
    };
    return names[lang] || lang;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    translations: translations[language],
    getLanguageName,
    availableLanguages: Object.values(LANGUAGES)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
