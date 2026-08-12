import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { ProgressBar } from '../ui/ProgressBar';

import { useTranslation } from 'react-i18next';

export const GamificationPanel: React.FC = () => {
  const { progress, getLevelInfo } = useGamification();
  const { t, i18n } = useTranslation();
  const currentLevelInfo = getLevelInfo(progress.totalPoints);
  
  // better calc for XP
  let prevLevelPoints = 0;
  if (currentLevelInfo.level > 1) {
    // We can just define the array here or fetch from context
    const LEVELS = [0, 100, 300, 600, 1000];
    prevLevelPoints = LEVELS[currentLevelInfo.level - 1] || 0;
  }
  
  const xpInCurrentLevel = progress.totalPoints - prevLevelPoints;
  const xpNeededForNext = currentLevelInfo.nextLevelPoints ? (currentLevelInfo.nextLevelPoints - prevLevelPoints) : 1;
  const progressPercent = currentLevelInfo.nextLevelPoints ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 transition-colors duration-300">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
          <span className="text-3xl font-black">{currentLevelInfo.level}</span>
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{t(`levels.${currentLevelInfo.level}`)}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center sm:justify-start gap-2">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            {progress.totalPoints} {t('dashboard.totalXp')}
            {progress.streakDays > 0 && (
              <span className="ml-2 flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-500/20 px-2 py-0.5 rounded-full text-xs font-bold">
                🔥 {t('dashboard.dayStreak', { days: progress.streakDays })}
              </span>
            )}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
              <span>{t('dashboard.level', { level: currentLevelInfo.level })}</span>
              {currentLevelInfo.nextLevelPoints && (
                <span>{t('dashboard.level', { level: currentLevelInfo.level + 1 })} ({currentLevelInfo.nextLevelPoints} XP)</span>
              )}
            </div>
            <ProgressBar progress={progressPercent} color="bg-gradient-to-r from-purple-500 to-pink-500" className="h-3" />
            <div className="text-right text-xs text-slate-400 dark:text-slate-500 font-medium">
              {currentLevelInfo.nextLevelPoints ? t('dashboard.xpToNext', { xp: currentLevelInfo.nextLevelPoints - progress.totalPoints }) : t('dashboard.maxLevel')}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 transition-colors duration-300">
          <Trophy className="text-yellow-500" /> {t('dashboard.yourBadges')}
        </h3>
        
        {progress.badges.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800 border-dashed transition-colors duration-300">
            <Trophy size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('dashboard.noBadges')}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t('dashboard.noBadgesHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {progress.badges.map(badge => (
              <div key={badge.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  {badge.icon}
                </div>
                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{badge.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium bg-slate-50 dark:bg-slate-800 py-1 rounded">
                  {t('dashboard.unlocked', { date: new Date(badge.unlockedAt).toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US') })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
