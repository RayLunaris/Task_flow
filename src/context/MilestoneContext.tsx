import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Milestone } from '../types';

interface MilestoneContextType {
 milestones: Milestone[];
 addMilestone: (milestone: Partial<Milestone>) => void;
 updateMilestone: (id: string, updates: Partial<Milestone>) => void;
 deleteMilestone: (id: string) => void;
}

const MilestoneContext = createContext<MilestoneContextType | undefined>(undefined);

export const useMilestones = () => {
 const context = useContext(MilestoneContext);
 if (!context) {
 throw new Error('useMilestones must be used within a MilestoneProvider');
 }
 return context;
};

export const MilestoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [milestones, setMilestones] = useLocalStorage<Milestone[]>('taskflow_milestones', []);

 const addMilestone = (milestoneData: Partial<Milestone>) => {
 const newMilestone: Milestone = {
 id: uuidv4(),
 projectId: milestoneData.projectId || '',
 name: milestoneData.name || 'New Milestone',
 description: milestoneData.description || '',
 targetDate: milestoneData.targetDate || new Date().toISOString().split('T')[0],
 status: milestoneData.status || 'not_started',
 taskIds: milestoneData.taskIds || [],
 createdAt: new Date().toISOString(),
 };
 setMilestones(prev => [newMilestone, ...prev]);
 };

 const updateMilestone = (id: string, updates: Partial<Milestone>) => {
 setMilestones(prev => 
 prev.map(m => 
 m.id === id 
 ? { ...m, ...updates } 
 : m
 )
 );
 };

 const deleteMilestone = (id: string) => {
 setMilestones(prev => prev.filter(m => m.id !== id));
 };

 return (
 <MilestoneContext.Provider value={{ milestones, addMilestone, updateMilestone, deleteMilestone }}>
 {children}
 </MilestoneContext.Provider>
 );
};
