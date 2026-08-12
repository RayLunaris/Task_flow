import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { BarChart2, PieChart as PieChartIcon, Activity, Users, Filter } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const AnalyticsPage: React.FC = () => {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { users } = useAuth();
  const { t } = useTranslation();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return selectedProjectId === 'all' ? tasks : tasks.filter(t => t.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  // Task Distribution by Status
  const statusData = useMemo(() => {
    const counts = { todo: 0, in_progress: 0, review: 0, done: 0 };
    filteredTasks.forEach(t => {
      counts[t.status]++;
    });
    return [
      { name: 'To Do', value: counts.todo, color: '#94a3b8' },
      { name: 'In Progress', value: counts.in_progress, color: '#3b82f6' },
      { name: 'Review', value: counts.review, color: '#f59e0b' },
      { name: 'Done', value: counts.done, color: '#10b981' },
    ];
  }, [filteredTasks]);

  // Task Distribution by Priority
  const priorityData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, urgent: 0 };
    filteredTasks.forEach(t => {
      counts[t.priority]++;
    });
    return [
      { name: 'Low', value: counts.low, color: '#3b82f6' },
      { name: 'Medium', value: counts.medium, color: '#eab308' },
      { name: 'High', value: counts.high, color: '#f97316' },
      { name: 'Urgent', value: counts.urgent, color: '#ef4444' },
    ];
  }, [filteredTasks]);

  // Team Workload
  const workloadData = useMemo(() => {
    return users.map(user => {
      const userTasks = filteredTasks.filter(t => t.assigneeIds?.includes(user.id) && t.status !== 'done');
      return {
        name: user.name,
        tasks: userTasks.length
      };
    }).filter(d => d.tasks > 0);
  }, [users, filteredTasks]);

  // Completion Trend (Last 7 days)
  const trendData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const created = filteredTasks.filter(t => t.createdAt.startsWith(dateStr)).length;
      const completed = filteredTasks.filter(t => t.completedAt?.startsWith(dateStr)).length;
      
      data.push({
        date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        created,
        completed
      });
    }
    return data;
  }, [filteredTasks]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="text-purple-600" />
            {t('analytics.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('analytics.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <Filter size={18} className="text-slate-400 ml-2" />
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none pr-4"
          >
            <option value="all">{t('analytics.allProjects')}</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="text-blue-500" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t('analytics.taskByStatus')}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-orange-500" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t('analytics.taskByPriority')}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => percent && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-purple-500" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t('analytics.completionTrend')}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="created" name="Created" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-green-500" size={20} />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t('analytics.teamWorkload')}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} width={80} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="tasks" name="Active Tasks" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
