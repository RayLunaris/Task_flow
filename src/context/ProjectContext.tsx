import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Project } from '../types';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';

interface ProjectContextType {
 projects: Project[];
 addProject: (project: Partial<Project>) => void;
 updateProject: (id: string, updates: Partial<Project>) => void;
 deleteProject: (id: string) => void;
 getProjectProgress: (projectId: string) => { total: number; completed: number; percentage: number };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
 const context = useContext(ProjectContext);
 if (!context) {
 throw new Error('useProjects must be used within a ProjectProvider');
 }
 return context;
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [allProjects, setProjects] = useLocalStorage<Project[]>('taskflow_projects', []);
 const { user } = useAuth();
 const { activeWorkspace } = useWorkspace();

 const projects = React.useMemo(() => {
   if (!activeWorkspace) return [];
   return allProjects.filter(p => p.workspaceId === activeWorkspace.id || !p.workspaceId);
 }, [allProjects, activeWorkspace]);
 
 const getProjectProgress = (projectId: string) => {
 try {
 const storedTasks = localStorage.getItem('taskflow_tasks');
 const allTasks = storedTasks ? JSON.parse(storedTasks) : [];
 const projectTasks = allTasks.filter((t: any) => t.projectId === projectId);
 const total = projectTasks.length;
 const completed = projectTasks.filter((t: any) => t.completed).length;
 const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
 
 return { total, completed, percentage };
 } catch {
 return { total: 0, completed: 0, percentage: 0 };
 }
 };

 const addProject = (projectData: Partial<Project>) => {
 if (!activeWorkspace) return;
 const newProject: Project = {
 id: uuidv4(),
 workspaceId: activeWorkspace.id,
 name: projectData.name || 'New Project',
 description: projectData.description || '',
 color: projectData.color || '#2196F3',
 icon: projectData.icon,
 status: projectData.status || 'active',
 progress: projectData.progress || 0,
 clientId: projectData.clientId,
 memberIds: projectData.memberIds || (user ? [user.id] : []),
 managerId: projectData.managerId || (user ? user.id : 'unknown'),
 startDate: projectData.startDate,
 dueDate: projectData.dueDate,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 };
 setProjects(prev => [newProject, ...prev]);
 };

 const updateProject = (id: string, updates: Partial<Project>) => {
 setProjects(prev => 
 prev.map(p => 
 p.id === id 
 ? { ...p, ...updates, updatedAt: new Date().toISOString() } 
 : p
 )
 );
 };

 const deleteProject = (id: string) => {
 setProjects(prev => prev.filter(p => p.id !== id));
 };

 return (
 <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProjectProgress }}>
 {children}
 </ProjectContext.Provider>
 );
};
