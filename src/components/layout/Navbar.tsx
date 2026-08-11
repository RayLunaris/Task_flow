import React from 'react';
import { CheckSquare, Star, Globe, Sun, Moon } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

export const Navbar: React.FC = () => {
  const { progress } = useGamification();
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <CheckSquare size={28} strokeWidth={2.5} />
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

          {/* Level indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
              {progress.level}
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {progress.totalPoints}
            </span>
          </div>

          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">
            R
          </div>
        </div>
      </div>
    </header>
  );
};

