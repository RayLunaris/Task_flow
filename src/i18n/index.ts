import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './locales/id.json';
import en from './locales/en.json';

// Get initial language from localStorage or default to 'id'
const savedLang = typeof window !== 'undefined' ? window.localStorage.getItem('taskflow_lang') : 'id';

i18n
 .use(initReactI18next)
 .init({
 resources: {
 en: { translation: en },
 id: { translation: id },
 },
 lng: savedLang || 'id',
 fallbackLng: 'id',
 interpolation: {
 escapeValue: false, // React already does escaping
 },
 });

// Save to localStorage when language changes
i18n.on('languageChanged', (lng) => {
 if (typeof window !== 'undefined') {
 window.localStorage.setItem('taskflow_lang', lng);
 }
});

export default i18n;
