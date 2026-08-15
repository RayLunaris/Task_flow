import React, { createContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { UserProgress, Badge, Task } from '../types';

interface GamificationContextType {
 progress: UserProgress;
 awardPointsForTask: (task: Task) => void;
 checkAndAwardBadges: (tasks: Task[]) => void;
 getLevelInfo: (points: number) => { level: number; name: string; nextLevelPoints: number | null };
}

export const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const LEVELS = [
 { level: 1, name: 'Pemula / Rookie', points: 0 },
 { level: 2, name: 'Pelajar / Learner', points: 100 },
 { level: 3, name: 'Produktif / Productive', points: 300 },
 { level: 4, name: 'Ahli / Expert', points: 600 },
 { level: 5, name: 'Master', points: 1000 },
];

const DEFAULT_PROGRESS: UserProgress = {
 totalPoints: 0,
 level: 1,
 badges: [],
 streakDays: 0,
 lastActiveDate: new Date().toISOString(),
 completedTasksHistory: [],
};

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [progress, setProgress] = useLocalStorage<UserProgress>('taskflow_progress', DEFAULT_PROGRESS);

 const getLevelInfo = (points: number) => {
 let currentLevel = LEVELS[0];
 let nextLevelPoints: number | null = null;
 
 for (let i = 0; i < LEVELS.length; i++) {
 if (points >= LEVELS[i].points) {
 currentLevel = LEVELS[i];
 nextLevelPoints = LEVELS[i + 1] ? LEVELS[i + 1].points : null;
 }
 }
 return { level: currentLevel.level, name: currentLevel.name, nextLevelPoints };
 };

 const updateStreak = (currentProgress: UserProgress) => {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const lastActive = new Date(currentProgress.lastActiveDate);
 lastActive.setHours(0, 0, 0, 0);

 const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
 
 let newStreak = currentProgress.streakDays;
 if (diffDays === 1) {
 newStreak += 1;
 } else if (diffDays > 1) {
 newStreak = 1; // Reset streak if missed a day, but today is active
 } else if (diffDays === 0) {
 // Still same day, no change to streak
 newStreak = Math.max(1, currentProgress.streakDays);
 }
 return newStreak;
 };

 // Called when a task is marked completed
 const awardPointsForTask = (task: Task) => {
 let pointsEarned = 0;
 
 // Base points by priority
 if (task.priority === 'low') pointsEarned += 10;
 else if (task.priority === 'medium') pointsEarned += 20;
 else if (task.priority === 'high') pointsEarned += 30;

 // Deadline bonus
 if (task.dueDate) {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const dueDay = new Date(task.dueDate);
 dueDay.setHours(0, 0, 0, 0);
 if (today.getTime() <= dueDay.getTime()) {
 pointsEarned += 10;
 }
 }

 setProgress((prev) => {
 const newTotal = prev.totalPoints + pointsEarned;
 const levelInfo = getLevelInfo(newTotal);
 
 const newStreak = updateStreak(prev);
 const todayStr = new Date().toISOString().split('T')[0];
 
 const updatedHistory = [...prev.completedTasksHistory];
 const todayIndex = updatedHistory.findIndex(h => h.date === todayStr);
 if (todayIndex >= 0) {
 updatedHistory[todayIndex].completed += 1;
 } else {
 updatedHistory.push({ date: todayStr, completed: 1, created: 0 }); // created tracking not strict for MVP gamification
 }

 return {
 ...prev,
 totalPoints: newTotal,
 level: levelInfo.level,
 streakDays: newStreak,
 lastActiveDate: new Date().toISOString(),
 completedTasksHistory: updatedHistory
 };
 });
 };

 // Badges Logic
 const checkAndAwardBadges = (tasks: Task[]) => {
 setProgress((prev) => {
 let newBadges = [...prev.badges];
 const addBadge = (badge: Badge) => {
 if (!newBadges.find(b => b.id === badge.id)) {
 newBadges.push(badge);
 }
 };

 // 1. Streak 7 Hari
 if (prev.streakDays >= 7) {
 addBadge({ id: 'streak-7', name: 'Streak 7 Hari', description: 'Aktif 7 hari berturut-turut', icon: '🔥', unlockedAt: new Date().toISOString() });
 }

 // 2. Kilat (5 tugas 1 hari)
 const todayStr = new Date().toISOString().split('T')[0];
 const todayRecord = prev.completedTasksHistory.find(h => h.date === todayStr);
 if (todayRecord && todayRecord.completed >= 5) {
 addBadge({ id: 'kilat', name: 'Kilat', description: 'Menyelesaikan 5 tugas dalam 1 hari', icon: '⚡', unlockedAt: new Date().toISOString() });
 }

 // 3. Tepat Waktu (10 tugas sebelum deadline)
 const onTimeTasks = tasks.filter(t => t.completed && t.dueDate && t.completedAt && new Date(t.completedAt).setHours(0,0,0,0) <= new Date(t.dueDate).setHours(0,0,0,0));
 if (onTimeTasks.length >= 10) {
 addBadge({ id: 'tepat-waktu', name: 'Tepat Waktu', description: '10 tugas selesai sebelum deadline', icon: '🎯', unlockedAt: new Date().toISOString() });
 }

 // 4. Sempurna (20 tugas selesai - simplified logic instead of "1 week all tasks" which is complex to measure)
 if (tasks.filter(t => t.completed).length >= 20) {
 addBadge({ id: 'sempurna', name: 'Sempurna', description: 'Menyelesaikan 20 tugas total', icon: '🏆', unlockedAt: new Date().toISOString() });
 }

 if (newBadges.length > prev.badges.length) {
 return { ...prev, badges: newBadges };
 }
 return prev;
 });
 };

 // Update streak on mount just in case
 useEffect(() => {
 setProgress(prev => ({
 ...prev,
 streakDays: updateStreak(prev),
 lastActiveDate: new Date().toISOString()
 }));
 }, []);

 return (
 <GamificationContext.Provider value={{ progress, awardPointsForTask, checkAndAwardBadges, getLevelInfo }}>
 {children}
 </GamificationContext.Provider>
 );
};
