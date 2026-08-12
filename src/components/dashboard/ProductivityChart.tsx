import React, { useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

export const ProductivityChart: React.FC = () => {
  const { tasks } = useTasks();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const { chartData, totalTasks, totalCompleted, totalInProgress, totalOverdue } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const inProgress = tasks.filter(t => t.status === 'in_progress' || t.status === 'review').length;
    
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDay = new Date(task.dueDate);
      dueDay.setHours(0, 0, 0, 0);
      return dueDay.getTime() < today.getTime();
    }).length;

    const getLocalYYYYMMDD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const data = last7Days.map(date => {
      const dateStr = getLocalYYYYMMDD(date);
      const count = tasks.filter(t => {
        if (!t.completed || !t.completedAt) return false;
        const compDate = getLocalYYYYMMDD(new Date(t.completedAt));
        return compDate === dateStr;
      }).length;

      return {
        name: date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'short' }),
        Selesai: count,
      };
    });

    return {
      chartData: data,
      totalTasks: total,
      totalCompleted: completed,
      totalInProgress: inProgress,
      totalOverdue: overdue,
    };
  }, [tasks, i18n.language]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 transition-colors duration-300">
        <Activity className="text-teal-500" /> {t('dashboard.productivitySummary')}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-colors duration-300">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">TOTAL TASK</p>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{totalTasks}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-colors duration-300">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">COMPLETED</p>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{totalCompleted}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-colors duration-300">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">IN PROGRESS</p>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{totalInProgress}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-colors duration-300">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">OVERDUE</p>
          <p className="text-2xl font-black text-red-500 dark:text-red-400">{totalOverdue}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <h4 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">{t('dashboard.last7Days')}</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                }}
              />
              <Bar dataKey="Selesai" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
