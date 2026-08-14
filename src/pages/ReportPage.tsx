import React, { useState } from 'react';
import { FileText, Download, Printer, Filter, FileSpreadsheet } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../context/ProjectContext';
import { useMilestones } from '../context/MilestoneContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { exportTasksToExcel } from '../utils/exportUtils';

export const ReportPage: React.FC = () => {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { milestones } = useMilestones();
  const { users } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [reportType, setReportType] = useState<'project_tasks' | 'member_productivity' | 'overdue'>('project_tasks');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataToExport = {
      reportType,
      generatedAt: new Date().toISOString(),
      data: tasks.filter(t => selectedProjectId === 'all' || t.projectId === selectedProjectId)
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `taskflow_report_${reportType}_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportExcel = () => {
    exportTasksToExcel({
      tasks: reportData,
      projects,
      users,
      milestones,
      language: i18n.language
    });
  };

  // Generate Report Data
  const reportData = (() => {
    let data = tasks.filter(t => selectedProjectId === 'all' || t.projectId === selectedProjectId);
    
    if (reportType === 'overdue') {
      data = data.filter(t => t.dueDate && new Date(t.dueDate).getTime() < new Date().setHours(0,0,0,0) && t.status !== 'done');
    }
    
    return data;
  })();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-primary" />
            {t('report.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('report.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Printer size={16} />} onClick={handlePrint}>
            {t('report.print')}
          </Button>
          <Button variant="secondary" icon={<Download size={16} />} onClick={handleExportJSON}>
            {t('report.exportJson')}
          </Button>
          <Button variant="primary" icon={<FileSpreadsheet size={16} />} onClick={handleExportExcel}>
            {t('report.exportExcel')}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 print:hidden">
        <div className="flex-1 flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="project_tasks">{t('report.typeProject')}</option>
            <option value="member_productivity">{t('report.typeMember')}</option>
            <option value="overdue">{t('report.typeOverdue')}</option>
          </select>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">{t('analytics.allProjects')}</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden print:shadow-none print:border-none">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center print:border-b-2 print:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              {reportType === 'project_tasks' ? t('report.typeProject') : reportType === 'member_productivity' ? t('report.typeMember') : t('report.typeOverdue')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Generated on {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{reportData.length}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">{t('report.totalTasks')}</p>
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <th className="p-4">{t('report.taskName')}</th>
                <th className="p-4">{t('filter.status')}</th>
                <th className="p-4">{t('filter.priority')}</th>
                <th className="p-4">{t('report.assignees')}</th>
                <th className="p-4">{t('filter.dueDate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No data found for the selected criteria.
                  </td>
                </tr>
              ) : (
                reportData.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors print:break-inside-avoid">
                    <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {task.title}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs font-bold uppercase rounded-md ${
                        task.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        task.status === 'review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs">
                      {task.priority}
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2">
                        {task.assigneeIds?.map(id => {
                          const u = users.find(u => u.id === id);
                          if (!u) return null;
                          return (
                            <div key={id} title={u.name} className="w-6 h-6 rounded-full bg-[#E3F2FD] text-[#0D47A1] flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-800 z-10">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          );
                        })}
                        {(!task.assigneeIds || task.assigneeIds.length === 0) && (
                          <span className="text-xs text-slate-400">{t('report.unassigned')}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
