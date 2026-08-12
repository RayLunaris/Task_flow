import React, { useState } from 'react';
import { Columns, Folder } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { KanbanBoard } from '../components/kanban/KanbanBoard';

export const KanbanPage: React.FC = () => {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.length > 0 ? projects[0].id : '');

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Columns className="text-purple-500" />
            Kanban Board
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize and manage workflow stages</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
            Project:
          </label>
          <div className="relative">
            <Folder size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium text-slate-800 dark:text-slate-100 appearance-none shadow-sm"
            >
              <option value="">Global (All Projects)</option>
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
