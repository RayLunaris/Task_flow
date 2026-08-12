import React, { useState } from 'react';
import { Flag, Plus, Folder } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useProjects } from '../context/ProjectContext';
import { useMilestones } from '../context/MilestoneContext';
import { MilestoneTimeline } from '../components/milestones/MilestoneTimeline';
import { MilestoneFormModal } from '../components/milestones/MilestoneFormModal';
import type { Milestone } from '../types';

export const MilestonePage: React.FC = () => {
  const { projects } = useProjects();
  const { milestones } = useMilestones();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.length > 0 ? projects[0].id : '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [milestoneToEdit, setMilestoneToEdit] = useState<Milestone | null>(null);

  const projectMilestones = milestones.filter(m => m.projectId === selectedProjectId);

  const handleEdit = (milestone: Milestone) => {
    setMilestoneToEdit(milestone);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setMilestoneToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Flag className="text-purple-500" />
            Milestones
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track key project deliverables and target dates</p>
        </div>
        
        <Button onClick={handleAddNew} icon={<Plus size={20} />} disabled={projects.length === 0}>
          Add Milestone
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <Folder size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No Projects Found</h3>
          <p className="text-slate-500">You need to create a project first before you can add milestones.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Project to View Timeline:
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 font-medium text-slate-800 dark:text-slate-100"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-4 sm:p-8 border border-slate-100 dark:border-slate-800/50">
            <MilestoneTimeline milestones={projectMilestones} onEdit={handleEdit} />
          </div>
        </div>
      )}

      <MilestoneFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestoneToEdit={milestoneToEdit}
        defaultProjectId={selectedProjectId}
      />
    </div>
  );
};
