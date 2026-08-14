
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CheckSquare, RefreshCw, Users, Bell, Check, X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const { t } = useTranslation();
  const actions = [
    { icon: CheckSquare, label: t('dashboard.quickActions.manageTasks'), color: 'text-primary bg-primary/10' },
    { icon: RefreshCw, label: t('dashboard.quickActions.sync'), color: 'text-info bg-info/10' },
    { icon: Users, label: t('dashboard.quickActions.collaborate'), color: 'text-success bg-success/10' },
  ];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {actions.map((act, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-lg border border-transparent hover:border-border-color hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
            <div className={`p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform ${act.color}`}>
              <act.icon size={20} />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center">{act.label}</span>
          </div>
        ))}
      </div>
    </Card>
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
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Bell size={16} className="text-muted" /> {t('dashboard.recentNotifications')}
        </h3>
        <button onClick={() => navigate('/notifications')} className="text-[11px] text-primary hover:underline font-medium">
          {t('common.viewAll')}
        </button>
      </div>
      <div className="space-y-3">
        {recent.length === 0 ? (
          <div className="text-center text-xs text-muted py-4">{t('dashboard.noNotifications')}</div>
        ) : (
          recent.map(n => (
            <div key={n.id} className="flex items-start gap-3 p-2 hover:bg-subtle dark:hover:bg-slate-800 rounded-lg transition-colors group">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" style={{ opacity: n.isRead ? 0.2 : 1 }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                <p className="text-[10px] text-muted truncate">{n.message}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!n.isRead && (
                  <button onClick={() => markAsRead(n.id)} className="p-1 hover:bg-white rounded text-primary" title={t('notifications.markRead')}>
                    <Check size={12} />
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)} className="p-1 hover:bg-white rounded text-danger" title={t('notifications.delete')}>
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
        <h3 className="font-semibold text-sm">{t('dashboard.todayTasks')}</h3>
        <div className="flex items-center gap-3">
          <Badge variant="category">{t('dashboard.completedTasks', { completed, total })}</Badge>
          {todayTasks.length > 0 && (
            <button onClick={() => navigate('/my-tasks')} className="text-[11px] text-primary hover:underline font-medium">
              {t('common.viewAll')}
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">{t('common.progress')}</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="space-y-2">
        {displayTasks.length === 0 ? (
          <div className="text-center text-xs text-muted py-6">{t('dashboard.noTasksToday')}</div>
        ) : (
          displayTasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-2 border border-border-color rounded-lg">
              <input type="checkbox" checked={t.completed} readOnly className="rounded border-border-color text-primary focus:ring-primary" />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${t.completed ? 'line-through text-muted' : 'text-slate-700 dark:text-slate-200'}`}>
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

export const ProjectStatsWidget = () => {
  const { projects } = useProjects();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const activeProjects = projects.filter(p => p.status === 'active');
  const total = projects.length;
  const active = activeProjects.length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{t('dashboard.projectStats')}</h3>
        <button onClick={() => navigate('/projects')} className="text-[11px] text-primary hover:underline font-medium">
          {t('common.viewAll')}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-subtle dark:bg-slate-800/50 rounded-lg border border-border-color">
          <p className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">{t('dashboard.totalProjects')}</p>
          <p className="text-xl font-bold text-navy dark:text-slate-100">{total}</p>
        </div>
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-[10px] text-primary mb-1 uppercase tracking-wider font-semibold">{t('dashboard.activeProjects')}</p>
          <p className="text-xl font-bold text-primary">{active}</p>
        </div>
      </div>
      <div className="space-y-3">
        {activeProjects.slice(0, 2).map(p => (
          <div key={p.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
              <span className="text-muted">{p.progress}%</span>
            </div>
            <ProgressBar progress={p.progress} color={p.color ? `bg-[${p.color}]` : 'bg-primary'} />
          </div>
        ))}
      </div>
    </Card>
  );
};



