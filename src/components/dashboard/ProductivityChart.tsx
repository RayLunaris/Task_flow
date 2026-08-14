import React, { useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, LayoutList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

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

export const ProductivityChart: React.FC = () => {
  const { tasks } = useTasks();
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  const { chartData, totalTasks, totalCompleted, totalInProgress, totalOverdue } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
        count,
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

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: LayoutList, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
    { label: 'Completed', value: totalCompleted, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'In Progress', value: totalInProgress, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Overdue', value: totalOverdue, icon: AlertCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex flex-col justify-between"
          >
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${stat.bg}`}>
               <stat.icon size={16} className={stat.color} />
             </div>
             <div>
               <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stat.value}</p>
               <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
             </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
             Task Activity (Last 7 Days)
           </h3>
           <div className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
             Completed
           </div>
        </div>
        
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }} dy={16} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }} />
              <Tooltip 
                cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                  fontWeight: 500,
                  fontSize: '13px',
                  padding: '8px 12px'
                }}
                itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#334155' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#2196F3' : (theme === 'dark' ? '#334155' : '#e2e8f0')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};
