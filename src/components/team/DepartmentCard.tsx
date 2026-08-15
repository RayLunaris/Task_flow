import React from 'react';
import { motion } from 'framer-motion';
import { 
 Palette, 
 Code2, 
 Rocket, 
 Megaphone, 
 Briefcase, 
 Users, 
 ArrowRight, 
 CheckCircle2, 
 Clock, 
 FolderGit2,
 Crown
} from 'lucide-react';
import clsx from 'clsx';
import type { Department, PublicUser } from '../../types';
import { getDepartmentColorStyles } from '../../utils/departmentData';
import { Avatar } from '../ui/Avatar';
import { useTasks } from '../../hooks/useTasks';

interface DepartmentCardProps {
 department: Department;
 members: PublicUser[];
 allUsers: PublicUser[];
 onSelect: (department: Department) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
 department,
 members,
 allUsers,
 onSelect,
}) => {
 const { tasks } = useTasks();
 const styles = getDepartmentColorStyles(department.color);

 // Calculate department tasks
 const memberIds = members.map(m => m.id);
 const deptTasks = tasks.filter(t => t.assigneeIds?.some(id => memberIds.includes(id)));
 const activeTasks = deptTasks.filter(t => t.status !== 'done' && !t.completed);
 const doneTasks = deptTasks.filter(t => t.status === 'done' || t.completed);

 // Find team lead
 const leadUser = department.leadId 
 ? allUsers.find(u => u.id === department.leadId) 
 : members.find(m => m.role === 'manager' || m.role === 'admin') || members[0];

 const getIconComponent = (iconName?: string) => {
 switch (iconName?.toLowerCase()) {
 case 'palette': return <Palette size={22} />;
 case 'code2': case 'code': return <Code2 size={22} />;
 case 'rocket': return <Rocket size={22} />;
 case 'megaphone': return <Megaphone size={22} />;
 case 'briefcase': return <Briefcase size={22} />;
 case 'users': return <Users size={22} />;
 default: return <FolderGit2 size={22} />;
 }
 };

 return (
 <motion.div
 layout
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 whileHover={{ y: -5 }}
 onClick={() => onSelect(department)}
 className={clsx(
 "group cursor-pointer rounded-lg p-5 border bg-white dark:bg-[#1A1A1A] transition-all duration-300 shadow-sm hover:shadow-sm flex flex-col justify-between relative overflow-hidden",
 styles.border
 )}
 >
 {/* Top Accent Gradient Bar */}
 <div 
 className="absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
 style={{ backgroundColor: styles.accent }}
 />

 <div>
 {/* Header with Icon & Member Count Badge */}
 <div className="flex items-start justify-between gap-3 mb-3.5">
 <div className={clsx(
 "w-12 h-12 rounded-lg flex items-center justify-center shadow-xs transition-transform group-hover:scale-105",
 styles.bg,
 styles.text
 )}>
 {getIconComponent(department.icon)}
 </div>

 <span className={clsx(
 "text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
 styles.badge
 )}>
 {members.length} {members.length === 1 ? 'Anggota' : 'Anggota'}
 </span>
 </div>

 {/* Division Title & Description */}
 <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors mb-1.5 line-clamp-1">
 {department.name}
 </h3>
 <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
 {department.description || `Divisi ${department.name} berfokus pada kolaborasi dan pelaksanaan tugas proyek.`}
 </p>

 {/* Team Lead Info if available */}
 {leadUser && (
 <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#242424]/50 border border-slate-100 dark:border-border-color/80 mb-4">
 <Avatar name={leadUser.name || 'L'} src={leadUser.avatar} size="sm" className="w-6 h-6 text-[10px]" />
 <div className="min-w-0 flex-1">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
 <Crown size={10} className="text-amber-500" />
 Team Lead
 </p>
 <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
 {leadUser.name}
 </p>
 </div>
 </div>
 )}
 </div>

 {/* Footer: Member Avatars & Task Counters + CTA */}
 <div className="pt-3 border-t border-slate-100 dark:border-border-color space-y-3">
 {/* Avatars stack & task counts */}
 <div className="flex items-center justify-between">
 {/* Avatar stack */}
 <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
 {members.slice(0, 4).map((member) => (
 <div key={member.id} className="ring-2 ring-white dark:ring-slate-900 rounded-full" title={member.name}>
 <Avatar name={member.name} src={member.avatar} size="sm" className="w-7 h-7 text-xs" />
 </div>
 ))}
 {members.length > 4 && (
 <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-[#242424] text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
 +{members.length - 4}
 </div>
 )}
 {members.length === 0 && (
 <span className="text-[11px] text-slate-400 italic">Belum ada anggota</span>
 )}
 </div>

 {/* Active Tasks Pill */}
 <div className="flex items-center gap-2 text-xs font-semibold">
 <span className="text-primary dark:text-primary bg-subtle dark:bg-blue-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
 <Clock size={11} /> {activeTasks.length} Aktif
 </span>
 <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
 <CheckCircle2 size={11} /> {doneTasks.length} Selesai
 </span>
 </div>
 </div>

 {/* Action Button */}
 <div className="flex items-center justify-between text-xs font-bold text-primary pt-1 group-hover:translate-x-1 transition-transform">
 <span>Lihat Anggota Tim</span>
 <ArrowRight size={14} />
 </div>
 </div>
 </motion.div>
 );
};
