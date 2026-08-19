import React, { useState, useMemo } from 'react';

import { useWorkspace } from '../../context/WorkspaceContext';
import { useTasks } from '../../hooks/useTasks';
import { Avatar } from '../ui/Avatar';
import { WorkloadBadge, getWorkloadStatus } from '../ui/WorkloadBadge';
import { Search, Filter, Zap } from 'lucide-react';
import clsx from 'clsx';

export const TeamWorkloadTab: React.FC = () => {
 const { workspaceUsers: users } = useWorkspace();
 const { tasks } = useTasks();

 const [departmentFilter, setDepartmentFilter] = useState<string>('all');
 const [searchQuery, setSearchQuery] = useState('');

 const today = new Date().toISOString().split('T')[0];

 // Calculate member stats
 const memberWorkloadStats = useMemo(() => {
 return users
 .filter(u => u.status === 'active')
 .map(member => {
 const memberTasks = tasks.filter(t => t.assigneeIds?.includes(member.id));
 const total = memberTasks.length;
 const doneTasks = memberTasks.filter(t => t.status === 'done' || t.completed);
 const activeTasks = memberTasks.filter(t => t.status !== 'done' && !t.completed);
 const reviewTasks = memberTasks.filter(t => t.status === 'review');
 const overdueTasks = activeTasks.filter(t => t.dueDate && t.dueDate < today);

 // On-time completion rate: completed tasks that were finished on or before due date
 const onTimeDone = doneTasks.filter(t => {
 if (!t.dueDate || !t.completedAt) return true;
 return t.completedAt.split('T')[0] <= t.dueDate;
 }).length;

 const onTimeRate = doneTasks.length > 0 ? Math.round((onTimeDone / doneTasks.length) * 100) : 100;
 const workload = getWorkloadStatus(activeTasks.length);

 return {
 member,
 total,
 activeCount: activeTasks.length,
 doneCount: doneTasks.length,
 reviewCount: reviewTasks.length,
 overdueCount: overdueTasks.length,
 onTimeRate,
 workload,
 };
 });
 }, [users, tasks, today]);

 // Unique departments for filter
 const departments = useMemo(() => {
 const deps = new Set(users.map(u => u.department || 'General'));
 return Array.from(deps);
 }, [users]);

 // Filtered stats
 const filteredMembers = useMemo(() => {
 return memberWorkloadStats.filter(({ member }) => {
 const matchSearch = 
 member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 member.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 member.department?.toLowerCase().includes(searchQuery.toLowerCase());
 
 const matchDept = departmentFilter === 'all' || (member.department || 'General') === departmentFilter;

 return matchSearch && matchDept;
 });
 }, [memberWorkloadStats, searchQuery, departmentFilter]);

 // Find most available members (capacity recommendation)
 const availableMembers = useMemo(() => {
 return [...memberWorkloadStats]
 .filter(m => m.member.role !== 'client' && m.member.status === 'active')
 .sort((a, b) => a.activeCount - b.activeCount)
 .slice(0, 3);
 }, [memberWorkloadStats]);

 // Max active tasks for progress bar scaling (minimum 10 for clean percentage)
 const maxActive = Math.max(10, ...memberWorkloadStats.map(m => m.activeCount));

 return (
 <div className="space-y-6">
 {/* Capacity Recommendation Banner */}
 <div className="/10 /10 to-transparent dark:/30 dark:/20 p-5 rounded-lg border border-blue-200/60 dark:border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
 <Zap size={20} />
 </div>
 <div>
 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
 Rekomendasi Alokasi Tugas (Workload Balancing)
 </h3>
 <p className="text-xs text-slate-600 dark:text-slate-400">
 Anggota dengan kapasitas paling siap menerima delegasi tugas baru saat ini:
 </p>
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 {availableMembers.map(({ member, activeCount }) => (
 <div
 key={member.id}
 className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1A1A1A] border border-border-color dark:border-border-color shadow-xs"
 >
 <Avatar name={member.name} src={member.avatar} size="xs" />
 <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{member.name.split(' ')[0]}</span>
 <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
 {activeCount} task
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Filter & Search Bar */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
 <div className="relative flex-1 max-w-md">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
 <Search size={16} />
 </div>
 <input
 type="text"
 placeholder="Cari anggota atau departemen..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-white dark:bg-[#1A1A1A] border border-border-color dark:border-border-color rounded-lg py-2 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
 />
 </div>

 <div className="flex items-center gap-2">
 <Filter size={16} className="text-slate-400" />
 <select
 value={departmentFilter}
 onChange={(e) => setDepartmentFilter(e.target.value)}
 className="bg-white dark:bg-[#1A1A1A] border border-border-color dark:border-border-color rounded-lg py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-700 dark:text-slate-200 font-medium"
 >
 <option value="all">Semua Departemen ({departments.length})</option>
 {departments.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>
 </div>

 {/* Workload Distribution Cards */}
 <div className="space-y-3">
 {filteredMembers.map(({ member, activeCount, doneCount, reviewCount, overdueCount, onTimeRate }) => {
 const percentCapacity = Math.min(100, Math.round((activeCount / maxActive) * 100));

 return (
 <div
 key={member.id}
 className="bg-white dark:bg-[#1A1A1A] rounded-lg border border-border-color dark:border-border-color shadow-sm p-5 hover:border-primary/40 transition-all"
 >
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 {/* User Info */}
 <div className="flex items-center gap-3.5 min-w-[240px]">
 <Avatar name={member.name} src={member.avatar} size="md" />
 <div>
 <div className="flex items-center gap-2">
 <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{member.name}</h4>
 <span className={clsx(
 'text-[10px] uppercase font-bold px-2 py-0.5 rounded-full',
 member.role === 'admin' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' :
 member.role === 'manager' ? 'bg-subtle text-primary dark:bg-blue-950 dark:text-primary' :
 member.role === 'client' ? 'bg-purple-100 text-primary dark:bg-purple-950 dark:text-purple-300' :
 'bg-slate-100 text-slate-700 dark:bg-[#242424] dark:text-slate-300'
 )}>
 {member.role}
 </span>
 </div>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
 {member.title || 'Team Member'} • <span className="font-medium text-slate-700 dark:text-slate-300">{member.department || 'General'}</span>
 </p>
 </div>
 </div>

 {/* Capacity Progress Bar */}
 <div className="flex-1 lg:max-w-md space-y-1.5">
 <div className="flex items-center justify-between text-xs">
 <span className="font-semibold text-slate-600 dark:text-slate-300">Beban Kerja Aktif</span>
 <WorkloadBadge taskCount={activeCount} variant="compact" />
 </div>
 <div className="w-full bg-slate-100 dark:bg-[#242424] h-2.5 rounded-full overflow-hidden">
 <div
 className={clsx(
 'h-full rounded-full transition-all duration-500',
 activeCount >= 7 ? 'bg-red-500' : activeCount >= 4 ? 'bg-amber-500' : 'bg-emerald-500'
 )}
 style={{ width: `${Math.max(5, percentCapacity)}%` }}
 />
 </div>
 </div>

 {/* Task Breakdown Badges */}
 <div className="grid grid-cols-4 gap-2 text-center text-xs shrink-0">
 <div className="bg-slate-50 dark:bg-[#242424]/50 p-2 rounded-lg border border-slate-100 dark:border-border-color">
 <span className="block font-black text-slate-800 dark:text-slate-100 text-sm">{activeCount}</span>
 <span className="text-[10px] text-slate-500 uppercase font-semibold">Aktif</span>
 </div>
 <div className="bg-subtle dark:bg-blue-950/30 p-2 rounded-lg border border-blue-100 dark:border-blue-900/40">
 <span className="block font-black text-primary dark:text-primary text-sm">{reviewCount}</span>
 <span className="text-[10px] text-primary dark:text-primary uppercase font-semibold">Review</span>
 </div>
 <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
 <span className="block font-black text-emerald-600 dark:text-emerald-400 text-sm">{doneCount}</span>
 <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Selesai</span>
 </div>
 <div className={`p-2 rounded-lg border ${
 overdueCount > 0 
 ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/40' 
 : 'bg-slate-50 dark:bg-[#242424]/50 border-slate-100 dark:border-border-color'
 }`}>
 <span className={`block font-black text-sm ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
 {overdueCount}
 </span>
 <span className="text-[10px] text-slate-500 uppercase font-semibold">Overdue</span>
 </div>
 </div>

 {/* Productivity On-Time Rate */}
 <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-border-color min-w-[110px]">
 <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">On-Time Rate</span>
 <span className={clsx(
 'text-base font-black',
 onTimeRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
 onTimeRate >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
 )}>
 {onTimeRate}%
 </span>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
};
