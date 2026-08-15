import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import { 
 QuickStats, 
 RecentNotifications, 
 TodayTasksWidget
} from '../components/dashboard/DashboardWidgets';
import { AssignedTasksWidget, MiniCalendarWidget } from '../components/dashboard/DashboardMoreWidgets';
import { TaskForm } from '../components/tasks/TaskForm';
import { isBefore, addDays, startOfToday } from 'date-fns';

export const DashboardPage: React.FC = () => {
 const { user } = useAuth();
 const { tasks } = useTasks();
 const { t } = useTranslation();
 
 const upcomingTasksCount = React.useMemo(() => {
   const today = startOfToday();
   const nextWeek = addDays(today, 7);
   return tasks.filter(task => {
     if (!task.assigneeIds?.includes(user?.id || '')) return false;
     if (task.completed || !task.dueDate) return false;
     const due = new Date(task.dueDate);
     return !isBefore(due, today) && isBefore(due, nextWeek);
   }).length;
 }, [tasks, user?.id]);
 
 return (
 <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="mb-8 flex flex-col xl:flex-row gap-6 items-start xl:items-center">
 <div className="flex-1">
 <h1 className="text-2xl font-bold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] mb-1">
 {t('dashboard.welcomeHeading', { name: user?.name?.split(' ')[0] || 'User' })}
 </h1>
 <p className="text-[#64748B] text-sm">
 Anda memiliki <span className="font-bold text-[#1E293B] dark:text-[#E4E4E7]">{upcomingTasksCount}</span> tugas dengan tenggat waktu dalam 7 hari ke depan.
 </p>
 </div>
 <div className="w-full xl:w-1/2">
 <QuickStats />
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 {/* Kolom Utama (8 kolom) */}
 <div className="lg:col-span-8 flex flex-col gap-6">
 <TodayTasksWidget />
 <AssignedTasksWidget />
 </div>

 {/* Kolom Samping (4 kolom) */}
 <div className="lg:col-span-4 flex flex-col gap-6">
 <TaskForm />
 <MiniCalendarWidget />
 <RecentNotifications />
 </div>
 </div>
 </div>
 );
};
