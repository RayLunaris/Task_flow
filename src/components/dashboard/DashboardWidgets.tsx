import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Bell, Check, X, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';

import { useNotifications } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { isToday, isBefore, startOfToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const QuickStats = () => {
 const { t } = useTranslation();
 const { tasks } = useTasks();
 const { user } = useAuth();
 
 const myTasks = tasks.filter(t => t.assigneeIds?.includes(user?.id || ''));
 const total = myTasks.length;
 const completed = myTasks.filter(t => t.completed).length;
 const overdue = myTasks.filter(t => !t.completed && t.dueDate && isBefore(new Date(t.dueDate), startOfToday())).length;

 const stats = [
 { value: total, label: t('dashboard.stats.total', 'Total Tasks'), color: 'text-[#1E293B]', icon: FileText },
 { value: completed, label: t('dashboard.stats.completed', 'Completed'), color: 'text-[#0D9488]', icon: CheckCircle2 },
 { value: overdue, label: t('dashboard.stats.overdue', 'Overdue'), color: 'text-red-600', icon: Clock },
 ];

 return (
 <div className="grid grid-cols-3 gap-4">
 {stats.map((stat, idx) => (
 <Card key={idx} className="p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#0D9488] transition-colors group">
 <span className={`text-2xl font-bold ${stat.color} mb-1 group-hover:scale-110 transition-transform`}>{stat.value}</span>
 <div className="flex items-center gap-1.5 text-[#64748B]">
 <stat.icon size={12} />
 <span className="text-[11px] font-medium text-center">{stat.label}</span>
 </div>
 </Card>
 ))}
 </div>
 );
};

export const RecentNotifications = () => {
 const { notifications, markAsRead, deleteNotification } = useNotifications();
 const { t } = useTranslation();
 const navigate = useNavigate();
 const recent = notifications.slice(0, 5);

 return (
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-sm flex items-center gap-2 text-[#1E293B] dark:text-[#E4E4E7]">
 <Bell size={16} className="text-[#0D9488]" /> {t('dashboard.recentNotifications')}
 </h3>
 <button onClick={() => navigate('/notifications')} className="text-[11px] text-[#0D9488] hover:underline font-bold">
 {t('common.viewAll')}
 </button>
 </div>
 <div className="space-y-3">
 {recent.length === 0 ? (
 <div className="text-center text-xs text-[#64748B] py-4">{t('dashboard.noNotifications')}</div>
 ) : (
 recent.map(n => (
 <div key={n.id} className="flex items-start gap-3 p-2 hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] rounded-md transition-colors group">
 <div className="w-2 h-2 mt-1.5 rounded-full bg-[#0D9488] flex-shrink-0" style={{ opacity: n.isRead ? 0.2 : 1 }} />
 <div className="flex-1 min-w-0">
 <p className="text-xs font-medium text-[#1E293B] dark:text-[#E4E4E7] truncate">{n.title}</p>
 <p className="text-[10px] text-[#64748B] truncate">{n.message}</p>
 </div>
 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 {!n.isRead && (
 <button onClick={() => markAsRead(n.id)} className="p-1 hover:bg-[#FFFFFF] dark:hover:bg-[#242424] rounded text-[#0D9488] border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#333333]" title={t('notifications.markRead')}>
 <Check size={12} />
 </button>
 )}
 <button onClick={() => deleteNotification(n.id)} className="p-1 hover:bg-[#FFFFFF] dark:hover:bg-[#242424] rounded text-red-500 border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#333333]" title={t('notifications.delete')}>
 <X size={12} />
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 </Card>
 );
};

export const TodayTasksWidget = () => {
 const { tasks } = useTasks();
 const { user } = useAuth();
 const { t } = useTranslation();
 const navigate = useNavigate();
 
 const todayTasks = tasks.filter(t => {
 if (!t.assigneeIds?.includes(user?.id || '')) return false;
 if (!t.dueDate) return false;
 return isToday(new Date(t.dueDate));
 });

 const displayTasks = todayTasks.slice(0, 5);
 const completed = todayTasks.filter(t => t.completed).length;
 const total = todayTasks.length;
 const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

 return (
 <Card>
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-sm text-[#1E293B] dark:text-[#E4E4E7]">{t('dashboard.todayTasks')}</h3>
 <div className="flex items-center gap-3">
 <Badge variant="category">{t('dashboard.completedTasks', { completed, total })}</Badge>
 {todayTasks.length > 0 && (
 <button onClick={() => navigate('/my-tasks')} className="text-[11px] text-[#0D9488] hover:underline font-bold">
 {t('common.viewAll')}
 </button>
 )}
 </div>
 </div>
 
 <div className="mb-4">
 <div className="flex justify-between text-xs mb-1">
 <span className="text-[#64748B]">{t('common.progress')}</span>
 <span className="font-bold text-[#0D9488]">{progress}%</span>
 </div>
 <ProgressBar progress={progress} color="bg-[#0D9488]" />
 </div>

 <div className="space-y-2">
 {displayTasks.length === 0 ? (
 <div className="text-center text-xs text-[#64748B] py-6">{t('dashboard.noTasksToday')}</div>
 ) : (
 displayTasks.map(t => (
 <div key={t.id} className="flex items-center gap-3 p-2 border border-[#E5E7EB] dark:border-[#333333] rounded-md hover:border-[#0D9488] transition-colors">
 <input type="checkbox" checked={t.completed} readOnly className="rounded border-[#E5E7EB] text-[#0D9488] focus:ring-[#0D9488]" />
 <div className="flex-1 min-w-0">
 <p className={`text-xs font-medium truncate ${t.completed ? 'line-through text-[#94A3B8]' : 'text-[#1E293B] dark:text-[#E4E4E7]'}`}>
 {t.title}
 </p>
 </div>
 <Badge variant={`priority-${t.priority}` as any}>{t.priority}</Badge>
 </div>
 ))
 )}
 </div>
 </Card>
 );
};
