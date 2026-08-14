import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Copy, 
  UserX, 
  UserCheck, 
  UserMinus,
  Briefcase 
} from 'lucide-react';
import clsx from 'clsx';
import type { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../ui/Avatar';
import { WorkloadBadge } from '../ui/WorkloadBadge';

interface MemberCardProps {
  member: User;
  onEdit: (member: User) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit }) => {
  const { user: currentUser, deleteUser, toggleUserStatus, resendInvite, removeFromTeam } = useAuth();
  const { tasks } = useTasks();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin && member.id !== currentUser?.id;

  // Calculate workload
  const memberTasks = tasks.filter(t => t.assigneeIds?.includes(member.id));
  const today = new Date().toISOString().split('T')[0];
  
  const doneTasks = memberTasks.filter(t => t.status === 'done' || t.completed).length;
  const activeTasksList = memberTasks.filter(t => t.status !== 'done' && !t.completed);
  const overdueTasks = activeTasksList.filter(t => t.dueDate && t.dueDate < today).length;
  const activeTasks = activeTasksList.length;

  const handleCopyInvite = () => {
    const { inviteLink } = resendInvite(member.id);
    if (inviteLink && navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleResend = () => {
    const { inviteLink } = resendInvite(member.id);
    alert(`Undangan berhasil dikirim ulang!\nLink: ${inviteLink}`);
    setShowMenu(false);
  };

  const isSelf = member.id === currentUser?.id;
  const isInvited = member.status === 'invited';
  const isDeclined = member.status === 'declined';
  const isInactive = member.status === 'inactive';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={clsx(
        "rounded-2xl border shadow-sm hover:shadow-md p-5 flex flex-col transition-all duration-300 relative group",
        isInactive || isDeclined
          ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-80"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      )}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar name={member.name || 'U'} src={member.avatar} size="md" className="w-12 h-12 text-lg" />
            <span className={clsx(
              "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900",
              isInvited ? "bg-amber-500" : isDeclined ? "bg-red-500" : isInactive ? "bg-slate-400" : "bg-emerald-500"
            )} />
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-snug">
              <span className="truncate max-w-[150px]">{member.name || 'Unknown User'}</span>
              {isSelf && (
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-extrabold uppercase">
                  {t('team.you', 'You')}
                </span>
              )}
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[170px]">
              {member.title || (member.role === 'admin' ? 'Workspace Admin' : member.role === 'manager' ? 'Project Manager' : member.role === 'client' ? 'Client Viewer' : 'Team Member')}
            </p>

            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={clsx(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                member.role === 'admin' ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" :
                member.role === 'manager' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                member.role === 'client' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
              )}>
                {t(`auth.roles.${member.role}`, member.role)}
              </span>

              {isInvited && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <Clock size={10} /> Menunggu
                </span>
              )}
              {isDeclined && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  Ditolak
                </span>
              )}
              {isInactive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Nonaktif
                </span>
              )}
            </div>
          </div>
        </div>
        
        {(canEdit || canDelete) && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-20 animate-in fade-in slide-in-from-top-2">
                {isInvited && (
                  <>
                    <button
                      onClick={handleCopyInvite}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Copy size={14} className="text-primary" /> 
                      {copiedLink ? 'Link Tersalin! ✅' : 'Salin Link Undangan'}
                    </button>
                    <button
                      onClick={handleResend}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Send size={14} className="text-blue-500" /> Kirim Ulang Email
                    </button>
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-1" />
                  </>
                )}

                {canEdit && (
                  <button
                    onClick={() => { setShowMenu(false); onEdit(member); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 size={14} /> {t('team.edit', 'Edit Anggota')}
                  </button>
                )}

                {!isSelf && isAdmin && (
                  <>
                    <button
                      onClick={() => { setShowMenu(false); toggleUserStatus(member.id); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      {isInactive ? (
                        <>
                          <UserCheck size={14} className="text-emerald-500" /> Aktifkan Akun
                        </>
                      ) : (
                        <>
                          <UserX size={14} className="text-amber-500" /> Nonaktifkan Akun
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => { 
                        setShowMenu(false); 
                        if(confirm(`Keluarkan ${member.name} dari tim? (Akun pengguna tidak akan terhapus dari sistem)`)) {
                          removeFromTeam(member.id);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <UserMinus size={14} /> Keluarkan dari Tim
                    </button>
                  </>
                )}

                {canDelete && (
                  <>
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-1" />
                    <button
                      onClick={() => { 
                        setShowMenu(false); 
                        if(confirm(t('team.deleteConfirm', { name: member.name }))) {
                          deleteUser(member.id);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={14} /> Hapus Pengguna
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details (Department & Email) */}
      <div className="space-y-1.5 mb-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Briefcase size={13} className="text-slate-400 shrink-0" />
          <span className="truncate font-medium text-slate-700 dark:text-slate-300">{member.department || 'General'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
      </div>

      {/* Workload Indicator Badge */}
      <div className="mb-4">
        <WorkloadBadge taskCount={activeTasks} variant="pill" />
      </div>

      {/* Workload Mini Grid */}
      <div className="mt-auto pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2">
            <div className="text-base font-black text-blue-600 dark:text-blue-400">{activeTasks}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center gap-1">
              <Clock size={10} /> Aktif
            </div>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-2">
            <div className="text-base font-black text-teal-600 dark:text-teal-400">{doneTasks}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center gap-1">
              <CheckCircle2 size={10} /> Selesai
            </div>
          </div>
          <div className={`rounded-xl p-2 ${overdueTasks > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-800/40'}`}>
            <div className={`text-base font-black ${overdueTasks > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>{overdueTasks}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center gap-1">
              <AlertCircle size={10} /> Overdue
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
