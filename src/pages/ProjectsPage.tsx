import React, { useState } from 'react';
import { PlusCircle, Search, LayoutGrid, Folder } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useProjects } from '../context/ProjectContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { Button } from '../components/ui/Button';
import type { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <LayoutGrid className="text-purple-500" />
            Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your team projects and workspaces</p>
        </div>
        <Button onClick={handleAddNew} icon={<PlusCircle size={20} />}>
          New Project
        </Button>
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 text-sm text-slate-800 dark:text-slate-200"
        />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-full flex items-center justify-center mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Projects Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Create your first project to start organizing tasks for your team.
          </p>
          <Button onClick={handleAddNew} icon={<PlusCircle size={18} />}>
            Create Project
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          No projects match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} onEdit={handleEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ProjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectToEdit={projectToEdit} 
      />
    </div>
  );
};
