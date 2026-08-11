import React from 'react';
import { Trophy, Star, Target, Zap, Activity } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { ProgressBar } from '../ui/ProgressBar';
import clsx from 'clsx';

export const GamificationPanel: React.FC = () => {
  const { progress, getLevelInfo } = useGamification();
  const currentLevelInfo = getLevelInfo(progress.totalPoints);
  
  const xpPercentage = currentLevelInfo.nextLevelPoints 
    ? ((progress.totalPoints - (currentLevelInfo.level === 1 ? 0 : getLevelInfo(progress.totalPoints - 1).nextLevelPoints! === currentLevelInfo.nextLevelPoints ? 0 /* fallback */ : 0)) / (currentLevelInfo.nextLevelPoints)) * 100 // simplified for now
    : 100;

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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-200">
          <span className="text-3xl font-black">{currentLevelInfo.level}</span>
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{currentLevelInfo.name}</h2>
          <p className="text-slate-500 mb-4 flex items-center justify-center sm:justify-start gap-2">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            {progress.totalPoints} Total XP
            {progress.streakDays > 0 && (
              <span className="ml-2 flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full text-xs font-bold">
                🔥 {progress.streakDays} Day Streak
              </span>
            )}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Level {currentLevelInfo.level}</span>
              {currentLevelInfo.nextLevelPoints && (
                <span>Level {currentLevelInfo.level + 1} ({currentLevelInfo.nextLevelPoints} XP)</span>
              )}
            </div>
            <ProgressBar progress={progressPercent} color="bg-gradient-to-r from-purple-500 to-pink-500" className="h-3" />
            <div className="text-right text-xs text-slate-400 font-medium">
              {currentLevelInfo.nextLevelPoints ? `${currentLevelInfo.nextLevelPoints - progress.totalPoints} XP to next level` : 'Max Level Reached!'}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Your Badges
        </h3>
        
        {progress.badges.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 border-dashed">
            <Trophy size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">You haven't unlocked any badges yet.</p>
            <p className="text-sm text-slate-400 mt-1">Complete tasks and keep your streak to earn them!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {progress.badges.map(badge => (
              <div key={badge.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  {badge.icon}
                </div>
                <h4 className="font-bold text-slate-700 text-sm">{badge.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{badge.description}</p>
                <div className="text-[10px] text-slate-400 mt-2 font-medium bg-slate-50 py-1 rounded">
                  Unlocked {new Date(badge.unlockedAt).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
