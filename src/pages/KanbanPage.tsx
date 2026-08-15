import React, { useState } from 'react';
import { Columns, Folder } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useTranslation } from 'react-i18next';
import { KanbanBoard } from '../components/kanban/KanbanBoard';

export const KanbanPage: React.FC = () => {
 const { projects } = useProjects();
 const { t } = useTranslation();
 const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.length > 0 ? projects[0].id : '');

 return (
 <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in- duration-500">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
 <div>
 <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
 <Columns className="text-primary" />
 {t('kanban.title')}
 </h1>
 <p className="text-slate-500 dark:text-slate-400 mt-1">{t('kanban.subtitle')}</p>
 </div>

 <div className="flex items-center gap-3">
 <label className="text-sm font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
 {t('kanban.project')}:
 </label>
 <div className="relative">
 <Folder size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <select
 value={selectedProjectId}
 onChange={(e) => setSelectedProjectId(e.target.value)}
 className="w-full sm:w-64 bg-white dark:bg-[#1A1A1A] border border-border-color dark:border-border-color rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-medium text-slate-800 dark:text-slate-100 appearance-none shadow-sm"
 >
 <option value="">{t('kanban.globalAll')}</option>
 {projects.map(p => (
 <option key={p.id} value={p.id}>{p.name}</option>
 ))}
 </select>
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-hidden">
 <KanbanBoard projectId={selectedProjectId} />
 </div>
 </div>
 );
};
