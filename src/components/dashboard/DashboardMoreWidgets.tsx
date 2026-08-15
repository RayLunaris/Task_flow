import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { format, addDays, subDays, startOfToday, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const AssignedTasksWidget = () => {
 const { tasks } = useTasks();
 const { user } = useAuth();
 const { t } = useTranslation();
 const navigate = useNavigate();
 
 const assigned = tasks.filter(t => t.assigneeIds?.includes(user?.id || '') && !t.completed);
 const displayAssigned = assigned.slice(0, 5);

 return (
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-sm text-[#1E293B] dark:text-[#E4E4E7]">{t('dashboard.myAssignments')}</h3>
 {assigned.length > 0 && (
 <button onClick={() => navigate('/my-tasks')} className="text-[11px] text-[#0D9488] hover:underline font-bold">
 {t('common.viewAll')}
 </button>
 )}
 </div>
 
 <div className="space-y-2">
 {displayAssigned.length === 0 ? (
 <div className="text-center text-xs text-[#64748B] py-4">{t('dashboard.noAssignments')}</div>
 ) : (
 displayAssigned.map(task => (
 <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] rounded-md transition-colors border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#333333] group">
 <div className="text-[#0D9488] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
 <CheckSquare size={16} strokeWidth={2} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-medium text-[#1E293B] dark:text-[#E4E4E7] truncate">{task.title}</p>
 <p className="text-[10px] text-[#64748B] truncate">{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : t('dashboard.noDueDate')}</p>
 </div>
 <Badge variant={`priority-${task.priority}` as any}>{task.priority}</Badge>
 </div>
 ))
 )}
 </div>
 </Card>
 );
};

export const MiniCalendarWidget = () => {
 const [startDate, setStartDate] = React.useState(startOfToday());
 const { tasks } = useTasks();
 
 const endDate = addDays(startDate, 6);
 const days = eachDayOfInterval({ start: startDate, end: endDate });

 const nextWeek = () => setStartDate(addDays(startDate, 7));
 const prevWeek = () => setStartDate(subDays(startDate, 7));
 const goToday = () => setStartDate(startOfToday());

 const hasTask = (day: Date) => {
 return tasks.some(t => t.dueDate && isSameDay(new Date(t.dueDate), day) && !t.completed);
 };

 return (
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-sm text-[#1E293B] dark:text-[#E4E4E7]">
 {format(startDate, 'MMM yyyy')}
 </h3>
 <div className="flex items-center gap-2">
 {!isSameDay(startDate, startOfToday()) && (
 <button onClick={goToday} className="text-[10px] font-bold text-[#0D9488] hover:underline">
 Today
 </button>
 )}
 <div className="flex gap-1">
 <button onClick={prevWeek} className="p-1 hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] rounded-md text-[#64748B] hover:text-[#1E293B]"><ChevronLeft size={16} /></button>
 <button onClick={nextWeek} className="p-1 hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] rounded-md text-[#64748B] hover:text-[#1E293B]"><ChevronRight size={16} /></button>
 </div>
 </div>
 </div>
 
 <div className="flex justify-between items-center w-full">
 {days.map(day => {
 const today = isToday(day);
 const active = hasTask(day);
 return (
 <div key={day.toString()} className="flex flex-col items-center gap-2">
 <span className="text-[10px] font-semibold text-[#64748B] uppercase">
 {format(day, 'EEE')}
 </span>
 <div className={`relative flex items-center justify-center w-8 h-8 text-xs rounded-full border ${
 today 
 ? 'bg-[#0D9488] text-white border-[#0D9488] font-bold' 
 : 'bg-transparent border-transparent text-[#1E293B] dark:text-[#E4E4E7] hover:border-[#E5E7EB] dark:hover:border-[#333333] hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A]'
 }`}>
 {format(day, 'd')}
 {active && !today && (
 <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0D9488]" />
 )}
 </div>
 </div>
 );
 })}
 </div>
 </Card>
 );
};
