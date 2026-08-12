import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, Mail, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import type { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';

interface MemberCardProps {
  member: User;
  onEdit: (member: User) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit }) => {
  const { user: currentUser, deleteUser } = useAuth();
  const { tasks } = useTasks();
  const [showMenu, setShowMenu] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin && member.id !== currentUser?.id;

  // Calculate workload
  const memberTasks = tasks.filter(t => t.assigneeIds?.includes(member.id));
  
  const today = new Date().toISOString().split('T')[0];
  
  const doneTasks = memberTasks.filter(t => t.status === 'done' || t.completed).length;
  const overdueTasks = memberTasks.filter(t => 
    t.dueDate && t.dueDate < today && t.status !== 'done' && !t.completed
  ).length;
  const activeTasks = memberTasks.length - doneTasks - overdueTasks;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md p-5 flex flex-col transition-all duration-300 relative group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
            {member.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {member.name || 'Unknown User'}
              {member.id === currentUser?.id && (
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">You</span>
              )}
            </h3>
            <span className={clsx(
              "text-xs px-2 py-0.5 rounded-full font-bold uppercase inline-block mt-1",
              member.role === 'admin' ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" :
              member.role === 'manager' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
            )}>
              {member.role}
            </span>
          </div>
        </div>
        
        {(canEdit || canDelete) && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-10 animate-in fade-in slide-in-from-top-2">
                {canEdit && (
                  <button
                    onClick={() => { setShowMenu(false); onEdit(member); }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => { 
                      setShowMenu(false); 
                      if(confirm(`Are you sure you want to delete ${member.name}?`)) {
                        deleteUser(member.id);
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Mail size={14} />
          <span className="truncate">{member.email || 'No email'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Calendar size={14} />
          <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workload</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
            <div className="text-lg font-black text-blue-600 dark:text-blue-400">{activeTasks}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center gap-1">
              <Clock size={10} /> Active
            </div>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-2">
            <div className="text-lg font-black text-teal-600 dark:text-teal-400">{doneTasks}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center gap-1">
              <CheckCircle2 size={10} /> Done
            </div>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2">
            <div className="text-lg font-black text-pink-600 dark:text-pink-400">{overdueTasks}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center gap-1">
              <AlertCircle size={10} /> Overdue
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
