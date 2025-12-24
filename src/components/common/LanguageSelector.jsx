import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaGlobe, FaCheck, FaChevronDown } from 'react-icons/fa';
import './LanguageSelector.css';

export default function LanguageSelector() {
  const { language, setLanguage, getLanguageName, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <FaGlobe className="globe-icon" />
        <span>{getLanguageName(language)}</span>
        <FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="language-dropdown" role="listbox">
          {availableLanguages.map((lang) => (
            <li
              key={lang}
              className={`language-option ${language === lang ? 'selected' : ''}`}
              onClick={() => handleSelect(lang)}
              role="option"
              aria-selected={language === lang}
            >
              <span className="lang-name">{getLanguageName(lang)}</span>
              {language === lang && <FaCheck className="check-icon" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
