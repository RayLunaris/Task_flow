import React, { useState, useEffect } from 'react';
import { User, Settings, Globe, Moon, Sun, Save, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  
  // App Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });
  
  const [language, setLanguage] = useState(i18n.language || 'id');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Sync language state if changed elsewhere (e.g. Navbar)
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  // Apply theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  // Apply language changes
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser(user.id, { name, department });
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="text-primary" />
          {t('settings.title')}
        </h1>
        <p className="text-slate-500 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
            <User className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.userProfile')}</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.fullName')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.department')}
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.email')}
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" icon={<Save size={16} />}>
                  {t('settings.saveProfile')}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
            <Settings className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.preferences')}</h2>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#E3F2FD] text-[#0D47A1] dark:bg-blue-900/50 dark:text-blue-400' : 'bg-orange-100 text-orange-600'}`}>
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{t('settings.appearance')}</p>
                  <p className="text-xs text-slate-500">{t('settings.appearanceDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{t('settings.language')}</p>
                  <p className="text-xs text-slate-500">{t('settings.languageDesc')}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{t('settings.notifications')}</p>
                  <p className="text-xs text-slate-500">{t('settings.notificationsDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${notificationsEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
