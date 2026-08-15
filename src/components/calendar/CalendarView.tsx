import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../tasks/TaskCard';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const CalendarView: React.FC = () => {
 const { tasks } = useTasks();
 const { t } = useTranslation();
 const [currentDate, setCurrentDate] = useState(new Date());
 const [selectedDate, setSelectedDate] = useState<Date>(new Date());

 // Generate calendar days
 const calendarDays = useMemo(() => {
 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();
 
 const firstDay = new Date(year, month, 1);
 const lastDay = new Date(year, month + 1, 0);
 
 const daysInMonth = lastDay.getDate();
 const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
 
 const days: { date: Date; isCurrentMonth: boolean }[] = [];
 
 // Previous month padding
 const prevMonthLastDay = new Date(year, month, 0).getDate();
 for (let i = startingDayOfWeek - 1; i >= 0; i--) {
 days.push({
 date: new Date(year, month - 1, prevMonthLastDay - i),
 isCurrentMonth: false,
 });
 }
 
 // Current month days
 for (let i = 1; i <= daysInMonth; i++) {
 days.push({
 date: new Date(year, month, i),
 isCurrentMonth: true,
 });
 }
 
 // Next month padding to complete the grid (42 cells max)
 const remainingCells = 42 - days.length;
 for (let i = 1; i <= remainingCells; i++) {
 days.push({
 date: new Date(year, month + 1, i),
 isCurrentMonth: false,
 });
 }
 
 return days;
 }, [currentDate]);

 const tasksForSelectedDate = useMemo(() => {
 return tasks.filter(task => {
 if (!task.dueDate) return false;
 const d = new Date(task.dueDate);
 return d.getFullYear() === selectedDate.getFullYear() &&
 d.getMonth() === selectedDate.getMonth() &&
 d.getDate() === selectedDate.getDate();
 });
 }, [tasks, selectedDate]);

 const getTaskDots = (date: Date) => {
 const dayTasks = tasks.filter(task => {
 if (!task.dueDate) return false;
 const d = new Date(task.dueDate);
 return d.getFullYear() === date.getFullYear() &&
 d.getMonth() === date.getMonth() &&
 d.getDate() === date.getDate();
 });

 if (dayTasks.length === 0) return null;

 // Show up to 3 dots with colors based on category/priority
 const dots = dayTasks.slice(0, 3).map((t, i) => (
 <div 
 key={i} 
 className={clsx(
 "w-1.5 h-1.5 rounded-full",
 t.completed ? "bg-slate-300 dark:bg-slate-600" : "bg-primary"
 )} 
 />
 ));
 return (
 <div className="flex gap-0.5 justify-center mt-1">
 {dots}
 {dayTasks.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />}
 </div>
 );
 };

 const prevMonth = () => {
 setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
 };

 const nextMonth = () => {
 setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
 };

 const WEEKDAYS = [
 t('calendar.days.sun'), t('calendar.days.mon'), t('calendar.days.tue'),
 t('calendar.days.wed'), t('calendar.days.thu'), t('calendar.days.fri'),
 t('calendar.days.sat')
 ];

 return (
 <div className="flex flex-col lg:flex-row gap-6">
 
 {/* Calendar Grid */}
 <div className="flex-1 bg-white dark:bg-[#1A1A1A] p-6 rounded-lg border border-slate-100 dark:border-border-color shadow-sm transition-colors duration-300">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
 <CalendarIcon className="text-primary" /> 
 {t(`calendar.months.${currentDate.getMonth()}`)} {currentDate.getFullYear()}
 </h2>
 <div className="flex gap-2">
 <button 
 onClick={prevMonth}
 className="p-2 bg-slate-50 dark:bg-[#242424] hover:bg-[#E3F2FD] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary rounded-lg transition-colors"
 >
 <ChevronLeft size={20} />
 </button>
 <button 
 onClick={nextMonth}
 className="p-2 bg-slate-50 dark:bg-[#242424] hover:bg-[#E3F2FD] dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary rounded-lg transition-colors"
 >
 <ChevronRight size={20} />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-7 gap-2 mb-2">
 {WEEKDAYS.map(day => (
 <div key={day} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-2">
 {day}
 </div>
 ))}
 </div>

 <div className="grid grid-cols-7 gap-2">
 {calendarDays.map((dayObj, i) => {
 const isToday = dayObj.date.toDateString() === new Date().toDateString();
 const isSelected = dayObj.date.toDateString() === selectedDate.toDateString();
 
 return (
 <button
 key={i}
 onClick={() => setSelectedDate(dayObj.date)}
 className={clsx(
 "min-h-[4rem] p-2 rounded-lg flex flex-col items-center justify-start transition-all border",
 !dayObj.isCurrentMonth && "text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-[#242424]/30 border-transparent",
 dayObj.isCurrentMonth && !isSelected && "text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1A1A1A] border-slate-100 dark:border-border-color hover:border-[#90CAF9] dark:hover:border-primary hover:bg-[#E3F2FD]/50 dark:hover:bg-slate-800/50",
 isSelected && "bg-primary text-white border-primary shadow-sm"
 )}
 >
 <span className={clsx(
 "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
 isToday && !isSelected && "bg-[#E3F2FD] dark:bg-[#242424] text-[#0D47A1] dark:text-primary",
 isToday && isSelected && "bg-white/20"
 )}>
 {dayObj.date.getDate()}
 </span>
 <div className="mt-auto">
 {getTaskDots(dayObj.date)}
 </div>
 </button>
 );
 })}
 </div>
 </div>

 {/* Selected Date Tasks */}
 <div className="w-full lg:w-[350px] flex flex-col">
 <div className="bg-[#E3F2FD] dark:bg-[#242424]/80 p-6 rounded-t-3xl border border-b-0 border-[#90CAF9]/40 dark:border-border-color transition-colors duration-300">
 <h3 className="text-sm font-bold text-primary dark:text-primary uppercase tracking-wider mb-1">
 {t('calendar.schedule')}
 </h3>
 <p className="text-2xl font-black text-[#0D47A1] dark:text-blue-200">
 {selectedDate.getDate()} {t(`calendar.months.${selectedDate.getMonth()}`)}
 </p>
 </div>
 
 <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-border-color rounded-b-3xl p-4 flex-1 shadow-sm min-h-[300px] transition-colors duration-300">
 {tasksForSelectedDate.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 p-6">
 <CalendarIcon size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
 <p className="font-medium">{t('calendar.noTasks')}</p>
 <p className="text-xs mt-1">{t('calendar.noTasksHint')}</p>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 {tasksForSelectedDate.map(task => (
 <TaskCard key={task.id} task={task} />
 ))}
 </div>
 )}
 </div>
 </div>

 </div>
 );
};
