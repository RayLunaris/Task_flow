import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Palette, 
  Code2, 
  Rocket, 
  Megaphone, 
  Briefcase, 
  FolderGit2, 
  Crown,
  Users
} from 'lucide-react';
import clsx from 'clsx';
import type { Department, User, UserRole, UserStatus } from '../../types';
import { getDepartmentColorStyles } from '../../utils/departmentData';
import { MemberCard } from './MemberCard';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';

interface DepartmentDetailViewProps {
  department: Department;
  onBack: () => void;
  onInviteToDepartment: (deptName: string) => void;
  onEditMember: (member: User) => void;
  onOpenRoleMatrix: () => void;
}

export const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({
  department,
  onBack,
  onInviteToDepartment,
  onEditMember,
  onOpenRoleMatrix,
}) => {
  const { users, user: currentUser } = useAuth();
  const { tasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const styles = getDepartmentColorStyles(department.color);

  // All members belonging to this department
  const deptMembers = useMemo(() => {
    return users.filter(u => {
      // User belongs to this department and is a team member
      const matchesDept = (u.department || '').trim().toLowerCase() === department.name.trim().toLowerCase();
      const isTeam = u.id === currentUser?.id || (u.status && u.status !== 'none');
      return matchesDept && isTeam;
    });
  }, [users, department.name, currentUser]);

  // Lead user
  const leadUser = department.leadId 
    ? users.find(u => u.id === department.leadId) 
    : deptMembers.find(m => m.role === 'manager' || m.role === 'admin') || deptMembers[0];

  // Tasks in this department
  const deptMemberIds = deptMembers.map(m => m.id);
  const deptTasks = tasks.filter(t => t.assigneeIds?.some(id => deptMemberIds.includes(id)));
  const activeTasks = deptTasks.filter(t => t.status !== 'done' && !t.completed);
  const doneTasks = deptTasks.filter(t => t.status === 'done' || t.completed);

  // Filtered members by search and status
  const filteredMembers = useMemo(() => {
    return deptMembers.filter(m => {
      const matchesSearch = 
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || (m.status || 'active') === statusFilter;
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [deptMembers, searchQuery, statusFilter, roleFilter]);

  const canAddMember = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const getIconComponent = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'palette': return <Palette size={26} />;
      case 'code2': case 'code': return <Code2 size={26} />;
      case 'rocket': return <Rocket size={26} />;
      case 'megaphone': return <Megaphone size={26} />;
      case 'briefcase': return <Briefcase size={26} />;
      case 'users': return <Users size={26} />;
      default: return <FolderGit2 size={26} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Back Nav & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary hover:border-primary/50 shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-primary" />
          <span>Kembali ke Semua Tim / Divisi</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenRoleMatrix}
            icon={<ShieldCheck size={16} className="text-primary" />}
            className="text-xs sm:text-sm"
          >
            Matrix Hak Akses
          </Button>

          {canAddMember && (
            <Button
              type="button"
              onClick={() => onInviteToDepartment(department.name)}
              icon={<UserPlus size={16} />}
              className="text-xs sm:text-sm shadow-md"
            >
              Undang ke Tim Ini
            </Button>
          )}
        </div>
      </div>

      {/* Division Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "rounded-3xl p-6 sm:p-7 border bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden",
          styles.border
        )}
      >
        {/* Accent strip */}
        <div 
          className="absolute top-0 left-0 right-0 h-2" 
          style={{ backgroundColor: styles.accent }} 
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={clsx(
              "w-16 h-16 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0",
              styles.bg,
              styles.text
            )}>
              {getIconComponent(department.icon)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                  {department.name}
                </h2>
                <span className={clsx("text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase", styles.badge)}>
                  Divisi Tim
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                {department.description || `Kelompok kerja yang bertanggung jawab atas tugas dan kolaborasi divisi ${department.name}.`}
              </p>

              {leadUser && (
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Crown size={12} className="text-amber-500" />
                    Ketua Tim:
                  </span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Avatar name={leadUser.name} src={leadUser.avatar} size="sm" className="w-5 h-5 text-[9px]" />
                    <span>{leadUser.name}</span>
                    <span className="text-[10px] text-slate-400">({leadUser.title || leadUser.role})</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto flex-shrink-0">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Anggota</p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">{deptMembers.length}</p>
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-center">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Tugas Aktif</p>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">{activeTasks.length}</p>
            </div>
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Selesai</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{doneTasks.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Internal Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder={`Cari anggota tim ${department.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active (Resmi Bergabung)</option>
            <option value="invited">Invited (Menunggu Respon)</option>
            <option value="declined">Declined (Ditolak)</option>
            <option value="inactive">Inactive (Nonaktif)</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Semua Peran</option>
            <option value="admin">Admin / Owner</option>
            <option value="manager">Project Manager</option>
            <option value="member">Team Member</option>
            <option value="client">Client / Viewer</option>
          </select>
        </div>
      </div>

      {/* Members Grid in This Department */}
      {filteredMembers.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={onEditMember}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <div className={clsx(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm",
            styles.bg,
            styles.text
          )}>
            {getIconComponent(department.icon)}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {deptMembers.length === 0 ? `Belum Ada Anggota di Tim ${department.name}` : 'Tidak Ada Anggota yang Cocok dengan Filter'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
            {deptMembers.length === 0 
              ? `Undang anggota akun baru atau pindahkan anggota yang sudah ada ke divisi ${department.name} untuk memulai kolaborasi.`
              : 'Coba sesuaikan kata kunci pencarian atau reset filter status/peran.'}
          </p>

          {canAddMember && deptMembers.length === 0 && (
            <Button
              type="button"
              onClick={() => onInviteToDepartment(department.name)}
              icon={<UserPlus size={16} />}
              className="mx-auto shadow-md"
            >
              Undang Anggota Pertama ke Tim Ini
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
