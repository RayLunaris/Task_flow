import React from 'react';
import { Shield, Clock, AlertTriangle, Monitor } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useActivity();
  const { user, users } = useAuth();
  const { t } = useTranslation();

  // Basic authorization check
  if (user?.role !== 'admin') {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center h-full">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('audit.accessDenied')}</h2>
        <p className="text-slate-500">{t('audit.accessDeniedDesc')}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="text-purple-600" />
            {t('audit.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('audit.subtitle')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <th className="p-4">{t('audit.timestamp')}</th>
                <th className="p-4">{t('audit.user')}</th>
                <th className="p-4">{t('audit.action')}</th>
                <th className="p-4">{t('audit.ip')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    {t('audit.noLogs')}
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => {
                  const logUser = users.find((u) => u.id === log.userId);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                            {logUser?.name.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {logUser?.name || 'Unknown User'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-800 dark:text-slate-200 font-medium">
                        {log.action}
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-mono flex items-center gap-1">
                        <Monitor size={14} />
                        {log.ip || 'Unknown'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
