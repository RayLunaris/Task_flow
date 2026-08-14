import React from 'react';
import { Users, UserCheck, Clock, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';

export const TeamStatsSummary: React.FC = () => {
  const { users, user: currentUser } = useAuth();
  const { tasks } = useTasks();

  const teamMembers = users.filter(u => u.id === currentUser?.id || (u.status && u.status !== 'none'));
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(u => u.status === 'active' || u.id === currentUser?.id).length;
  const pendingInvites = teamMembers.filter(u => u.status === 'invited').length;
  
  // Calculate unique departments
  const departments = new Set(teamMembers.map(u => u.department || 'General')).size;

  // Workload calculations
  const activeTasks = tasks.filter(t => t.status !== 'done' && !t.completed);
  let overloadedCount = 0;

  teamMembers.forEach(u => {
    const userTaskCount = activeTasks.filter(t => t.assigneeIds?.includes(u.id)).length;
    if (userTaskCount >= 7) overloadedCount++;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Team */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center flex-shrink-0">
          <Users size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Anggota</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalMembers}</span>
            <span className="text-[11px] text-slate-400 font-medium">({departments} Departemen)</span>
          </div>
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <UserCheck size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Anggota Aktif</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{activeMembers}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}% Active
            </span>
          </div>
        </div>
      </div>

      {/* Pending Invites */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Undangan Tertunda</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{pendingInvites}</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Pending invite</span>
          </div>
        </div>
      </div>

      {/* Workload Health */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          overloadedCount > 0 
            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400' 
            : 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400'
        }`}>
          <Activity size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kapasitas Kerja</p>
          <div className="flex items-baseline gap-2">
            {overloadedCount > 0 ? (
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                ⚠️ {overloadedCount} Overload
              </span>
            ) : (
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                🟢 Distribusi Sehat
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-medium">({activeTasks.length} task aktif)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
