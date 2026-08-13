import React, { useState } from 'react';
import { CheckSquare, Star, Globe, Sun, Moon, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { progress } = useGamification();
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <CheckSquare size={24} strokeWidth={2.5} />
          <span className="text-xl font-bold font-heading tracking-tight text-slate-800 dark:text-slate-100">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Language"
          >
            <Globe size={16} className="text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">{i18n.language}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => {
                navigate('/notifications');
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell size={16} className="text-slate-500 dark:text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Level indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm">
              {progress.level}
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {progress.totalPoints}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

