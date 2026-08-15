import React, { useState } from 'react';
import { PlusCircle, Search, LayoutGrid, Folder } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useProjects } from '../context/ProjectContext';
import { useTranslation } from 'react-i18next';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { Button } from '../components/ui/Button';
import type { Project } from '../types';

export const ProjectsPage: React.FC = () => {
 const { projects } = useProjects();
 const { t } = useTranslation();
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
 <LayoutGrid className="text-primary" />
 {t('projects.title')}
 </h1>
 <p className="text-slate-500 dark:text-slate-400 mt-1">{t('projects.subtitle')}</p>
 </div>
 <Button onClick={handleAddNew} icon={<PlusCircle size={20} />}>
 {t('projects.newProject')}
 </Button>
 </div>

 <div className="relative max-w-md">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Search size={18} className="text-slate-400" />
 </div>
 <input
 type="text"
 placeholder={t('projects.searchPlaceholder')}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-white dark:bg-[#1A1A1A] border border-border-color dark:border-border-color rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-slate-800 dark:text-slate-200"
 />
 </div>

 {projects.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border-color dark:border-border-color rounded-lg bg-slate-50/50 dark:bg-[#1A1A1A]/50">
 <div className="w-16 h-16 bg-[#E3F2FD] dark:bg-[#242424] text-primary rounded-full flex items-center justify-center mb-4">
 <Folder size={32} />
 </div>
 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('projects.noProjectsTitle')}</h3>
 <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
 {t('projects.noProjectsDesc')}
 </p>
 <Button onClick={handleAddNew} icon={<PlusCircle size={18} />}>
 {t('projects.createFirstProject')}
 </Button>
 </div>
 ) : filteredProjects.length === 0 ? (
 <div className="py-12 text-center text-slate-500 dark:text-slate-400">
 {t('projects.noMatch')}
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
