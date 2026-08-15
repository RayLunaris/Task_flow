import React from 'react';
import { Trophy, Star, ChevronRight, Zap, Flame, Target } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const containerVariants: any = {
 hidden: { opacity: 0 },
 show: {
 opacity: 1,
 transition: { staggerChildren: 0.1 }
 }
};

const itemVariants: any = {
 hidden: { opacity: 0, y: 15 },
 show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};


const BadgeIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'flame': return <Flame size={20} className="text-orange-500" />;
    case 'zap': return <Zap size={20} className="text-yellow-500" />;
    case 'target': return <Target size={20} className="text-red-500" />;
    case 'trophy': return <Trophy size={20} className="text-yellow-600" />;
    default: return <Trophy size={20} className="text-primary" />;
  }
};

export const GamificationPanel: React.FC = () => {
 const { progress, getLevelInfo } = useGamification();
 const { t } = useTranslation();
 const currentLevelInfo = getLevelInfo(progress.totalPoints);
 
 let prevLevelPoints = 0;
 if (currentLevelInfo.level > 1) {
 const LEVELS = [0, 100, 300, 600, 1000];
 prevLevelPoints = LEVELS[currentLevelInfo.level - 1] || 0;
 }
 
 const xpInCurrentLevel = progress.totalPoints - prevLevelPoints;
 const xpNeededForNext = currentLevelInfo.nextLevelPoints ? (currentLevelInfo.nextLevelPoints - prevLevelPoints) : 1;
 const progressPercent = currentLevelInfo.nextLevelPoints ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;

 return (
 <motion.div 
 variants={containerVariants}
 initial="hidden"
 animate="show"
 className="space-y-8"
 >
 <motion.div variants={itemVariants} className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-border-color dark:border-border-color overflow-hidden relative group">
 <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
 <div className="p-6 flex flex-col items-center sm:items-start gap-5">
 <div className="flex items-center gap-4 w-full justify-between">
 <div className="w-14 h-14 bg-slate-50 dark:bg-[#242424]/50 rounded-lg border border-border-color dark:border-border-color flex items-center justify-center relative overflow-hidden group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors">
 <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:scale-110 transition-transform duration-300">{currentLevelInfo.level}</span>
 </div>
 {progress.streakDays > 0 && (
 <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-semibold">
 <Zap size={14} className="fill-orange-500" /> {progress.streakDays} Day Streak
 </div>
 )}
 </div>
 
 <div className="w-full">
 <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{t(`levels.${currentLevelInfo.level}`)}</h2>
 <div className="flex items-center gap-2 mt-1 mb-6">
 <Star size={14} className="text-slate-400" />
 <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{progress.totalPoints} XP Total</span>
 </div>
 
 <div className="space-y-2.5 w-full">
 <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
 <span>Level {currentLevelInfo.level}</span>
 {currentLevelInfo.nextLevelPoints && (
 <span>Level {currentLevelInfo.level + 1}</span>
 )}
 </div>
 <div className="h-2 w-full bg-slate-100 dark:bg-[#242424] rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${progressPercent}%` }}
 transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
 className="h-full bg-primary rounded-full"
 />
 </div>
 <div className="text-right text-xs text-slate-500 dark:text-slate-400">
 {currentLevelInfo.nextLevelPoints ? `${currentLevelInfo.nextLevelPoints - progress.totalPoints} XP to next level` : 'Max Level'}
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 <motion.div variants={itemVariants}>
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
 <Trophy size={16} className="text-slate-400" /> Your Badges
 </h3>
 <button className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center">
 View all <ChevronRight size={14} />
 </button>
 </div>
 
 {progress.badges.length === 0 ? (
 <div className="bg-slate-50 dark:bg-[#1A1A1A]/50 rounded-lg p-8 text-center border border-border-color dark:border-border-color border-dashed">
 <Trophy size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
 <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No badges earned yet</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-3">
 {progress.badges.map((badge) => (
 <motion.div 
 key={badge.id}
 whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)' }}
 className="bg-white dark:bg-[#1A1A1A] p-4 rounded-lg border border-border-color dark:border-border-color text-left transition-all"
 >
 <div className="w-10 h-10 bg-slate-50 dark:bg-[#242424] rounded-lg flex items-center justify-center mb-3 text-xl border border-slate-100 dark:border-border-color">
 {<BadgeIcon icon={badge.icon} />}
 </div>
 <h4 className="font-semibold text-slate-900 dark:text-slate-50 text-sm tracking-tight">{badge.name}</h4>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{badge.description}</p>
 </motion.div>
 ))}
 </div>
 )}
 </motion.div>
 </motion.div>
 );
};
