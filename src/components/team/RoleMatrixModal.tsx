import React from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Check, Minus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PermissionRow {
  category: string;
  feature: string;
  featureId: string;
  admin: boolean | string;
  manager: boolean | string;
  member: boolean | string;
  client: boolean | string;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const permissions: PermissionRow[] = [
    {
      category: 'Workspace & Team',
      feature: 'Manage Team Members (Invite & Deactivate)',
      featureId: 'manageTeam',
      admin: true,
      manager: 'Invite only',
      member: false,
      client: false,
    },
    {
      category: 'Workspace & Team',
      feature: 'Change User Roles & Access Permissions',
      featureId: 'changeRoles',
      admin: true,
      manager: false,
      member: false,
      client: false,
    },
    {
      category: 'Projects',
      feature: 'Create & Edit Projects',
      featureId: 'createProjects',
      admin: true,
      manager: true,
      member: false,
      client: false,
    },
    {
      category: 'Projects',
      feature: 'Delete & Archive Projects',
      featureId: 'deleteProjects',
      admin: true,
      manager: false,
      member: false,
      client: false,
    },
    {
      category: 'Tasks & Milestones',
      feature: 'Create & Assign Tasks to Others',
      featureId: 'assignTasks',
      admin: true,
      manager: true,
      member: 'Self only',
      client: false,
    },
    {
      category: 'Tasks & Milestones',
      feature: 'Set Milestones & Deadlines',
      featureId: 'setMilestones',
      admin: true,
      manager: true,
      member: false,
      client: false,
    },
    {
      category: 'Tasks & Milestones',
      feature: 'Execute Tasks, Checklists & Attachments',
      featureId: 'executeTasks',
      admin: true,
      manager: true,
      member: true,
      client: false,
    },
    {
      category: 'Collaboration',
      feature: 'Submit Task for Review / Approval',
      featureId: 'submitReview',
      admin: true,
      manager: true,
      member: true,
      client: false,
    },
    {
      category: 'Approval Flow',
      feature: 'Approve or Request Revision on Work',
      featureId: 'approveWork',
      admin: true,
      manager: true,
      member: false,
      client: 'Deliverables only',
    },
    {
      category: 'Collaboration',
      feature: 'Comments & @Mentions in Task Cards',
      featureId: 'comments',
      admin: true,
      manager: true,
      member: true,
      client: true,
    },
    {
      category: 'Analytics & Audit',
      feature: 'View Workload Balancing & Team Analytics',
      featureId: 'teamAnalytics',
      admin: true,
      manager: true,
      member: 'Own stats',
      client: 'Dashboard only',
    },
    {
      category: 'Analytics & Audit',
      feature: 'Access Security Audit Logs & Export Data',
      featureId: 'auditLogs',
      admin: true,
      manager: false,
      member: false,
      client: false,
    },
  ];

  const renderBadge = (val: boolean | string) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <Check size={14} strokeWidth={3} />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
          <Minus size={14} strokeWidth={2} />
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
        {val}
      </span>
    );
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {t('roleMatrix.title', 'Role & Permission Matrix')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('roleMatrix.subtitle', 'Understand the authorization levels and capabilities for each role.')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Role Descriptions Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-pink-200/70 dark:border-pink-900/40">
              <span className="font-bold text-pink-600 dark:text-pink-400 uppercase text-[10px] tracking-wider block mb-1">
                Admin / Owner
              </span>
              <p className="text-slate-600 dark:text-slate-400">Akses penuh mengelola workspace, tim, proyek, dan audit log.</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200/70 dark:border-blue-900/40">
              <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-wider block mb-1">
                Project Manager
              </span>
              <p className="text-slate-600 dark:text-slate-400">Membuat task, membagi beban kerja, milestone, dan review approval.</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200/70 dark:border-teal-900/40">
              <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px] tracking-wider block mb-1">
                Team Member
              </span>
              <p className="text-slate-600 dark:text-slate-400">Mengerjakan tugas miliknya, komentar, dan submit review.</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-200/70 dark:border-purple-900/40">
              <span className="font-bold text-purple-600 dark:text-purple-400 uppercase text-[10px] tracking-wider block mb-1">
                Client / Viewer
              </span>
              <p className="text-slate-600 dark:text-slate-400">Memantau dashboard progress dan memberikan persetujuan deliverable.</p>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Hak Akses / Wewenang</th>
                  <th className="pb-3 text-center w-28 text-pink-600 dark:text-pink-400">Admin</th>
                  <th className="pb-3 text-center w-28 text-blue-600 dark:text-blue-400">Manager</th>
                  <th className="pb-3 text-center w-28 text-teal-600 dark:text-teal-400">Member</th>
                  <th className="pb-3 text-center w-32 text-purple-600 dark:text-purple-400">Client / Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {permissions.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-2 text-slate-800 dark:text-slate-200">
                      <span className="font-medium">{row.feature}</span>
                      <span className="block text-[11px] text-slate-400 font-mono mt-0.5">{row.category}</span>
                    </td>
                    <td className="py-3 text-center">{renderBadge(row.admin)}</td>
                    <td className="py-3 text-center">{renderBadge(row.manager)}</td>
                    <td className="py-3 text-center">{renderBadge(row.member)}</td>
                    <td className="py-3 text-center">{renderBadge(row.client)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info size={14} className="text-primary" />
              <span>Peran dapat diubah sewaktu-waktu oleh Administrator di menu Edit Anggota.</span>
            </div>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return null;
};
