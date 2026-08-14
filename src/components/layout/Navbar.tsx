import React, { useState } from 'react';
import { CheckSquare, Globe, Sun, Moon, LogOut, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
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
    <header className="bg-transparent sticky top-0 z-20 pt-6 px-6 transition-colors duration-300">
      <div className="w-full h-[52px] flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          <button className="text-lg font-bold font-heading text-navy dark:text-slate-100 border-b-2 border-primary pb-1">Dashboard</button>
          
          <div className="hidden lg:flex items-center ml-4 bg-white dark:bg-slate-800 rounded-full border border-border-color px-3 py-1.5 w-[250px] shadow-sm">
            <span className="text-muted mr-2 text-xs">🔍</span>
            <input type="text" placeholder="Search or type command" className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-slate-200 placeholder:text-muted" />
          </div>
        </div>
        
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2 text-primary">
          <CheckSquare size={20} strokeWidth={2.5} />
          <span className="font-bold text-navy">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-border-color mr-2">
            <button 
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'text-muted hover:text-slate-300'}`}
            >
              <Sun size={14} /> Light
            </button>
            <button 
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted hover:text-navy'}`}
            >
              <Moon size={14} /> Dark
            </button>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 p-2 rounded-full bg-white shadow-sm border border-border-color text-muted hover:text-primary transition-colors"
            title="Toggle Language"
          >
            <Globe size={16} />
          </button>

          <div className="relative">
            <button 
              onClick={() => {
                navigate('/notifications');
                setShowProfileMenu(false);
              }}
              className="relative p-1.5 rounded-md text-muted hover:text-navy hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute 1 top-0.5 right-0.5 w-2 h-2 bg-danger rounded-full" />
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-2 py-1 transition-colors">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 shadow-sm border border-border-color rounded-full text-[11px] font-bold text-navy dark:text-slate-200 hover:bg-slate-50 transition-colors">
              <span className="text-primary">↓</span> Export data <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[9px] ml-1">xls</span>
            </button>
          </div>

          {/* Hidden avatar on desktop because it's in sidebar, but we keep it here for mobile, or wait we can keep it here for simplicity or follow design precisely. I'll keep it here for dropdown. */}
          <div className="relative md:hidden">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
              }}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white font-bold text-xs"
            >
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-border-color dark:border-slate-800 py-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-border-color dark:border-slate-800">
                  <p className="text-sm font-semibold text-navy dark:text-slate-200 truncate">{user?.name}</p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-subtle text-primary border border-primary/20">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-subtle dark:hover:bg-slate-800 flex items-center gap-2"
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
