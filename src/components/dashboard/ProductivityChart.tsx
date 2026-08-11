import React, { useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, ListTodo, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

export const ProductivityChart: React.FC = () => {
  const { tasks } = useTasks();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const { chartData, totalActive, totalCompletedThisWeek, completionRate } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const active = tasks.filter(t => !t.completed).length;

    let completedThisWeek = 0;
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let totalTasksThisWeek = 0; // tasks created or due this week or completed this week?
    // Simplified: completion rate of all tasks? Or just completion rate overall?
    const totalAll = tasks.length;
    const completedAll = tasks.filter(t => t.completed).length;
    const rate = totalAll === 0 ? 0 : Math.round((completedAll / totalAll) * 100);

    const data = last7Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const count = tasks.filter(t => {
        if (!t.completed || !t.completedAt) return false;
        const compDate = new Date(t.completedAt).toISOString().split('T')[0];
        if (compDate === dateStr) {
          completedThisWeek++;
          return true;
        }
        return false;
      }).length;

      return {
        name: date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'short' }),
        Selesai: count,
      };
    });

    return {
      chartData: data,
      totalActive: active,
      totalCompletedThisWeek: completedThisWeek,
      completionRate: rate,
    };
  }, [tasks, i18n.language]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 transition-colors duration-300">
        <Activity className="text-teal-500" /> {t('dashboard.productivitySummary')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('dashboard.activeTasks')}</p>
            <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{totalActive}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-500/20 text-teal-500 dark:text-teal-400 rounded-full flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('dashboard.completed7Days')}</p>
            <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{totalCompletedThisWeek}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 rounded-full flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('dashboard.completionRate')}</p>
            <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{completionRate}%</p>
          </div>
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
