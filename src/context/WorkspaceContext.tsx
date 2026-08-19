import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import type { Workspace } from '../types';

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  createWorkspace: (name: string) => void;
  switchWorkspace: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  // Load workspaces from local storage on mount
  useEffect(() => {
    const savedWorkspaces = localStorage.getItem('taskflow_workspaces');
    if (savedWorkspaces) {
      setWorkspaces(JSON.parse(savedWorkspaces));
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('taskflow_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Ensure default workspace exists for the user
  useEffect(() => {
    if (!user) return;
    
    // Check if there are any workspaces for this user
    let userWorkspaces = workspaces.filter(w => w.ownerId === user.id || w.memberIds.includes(user.id));
    
    if (userWorkspaces.length === 0 && workspaces.length > 0) {
      // It's possible workspaces exist but none for this user (in a real app)
      // Here we will just create one for them
    }
    
    if (workspaces.length === 0 || userWorkspaces.length === 0) {
      // Create default workspace
      const pendingName = localStorage.getItem('pending_workspace_name');
      if (pendingName) {
        localStorage.removeItem('pending_workspace_name');
      }
      const defaultWorkspace: Workspace = {
        id: uuidv4(),
        name: pendingName || `${user.name}'s Workspace`,
        ownerId: user.id,
        memberIds: [user.id],
        createdAt: new Date().toISOString()
      };
      setWorkspaces(prev => [...prev, defaultWorkspace]);
      userWorkspaces = [defaultWorkspace];
    }

    // Determine active workspace
    if (!activeWorkspaceId) {
      const targetId = user.lastActiveWorkspaceId || userWorkspaces[0]?.id;
      if (targetId && workspaces.find(w => w.id === targetId)) {
        setActiveWorkspaceId(targetId);
      } else if (userWorkspaces.length > 0) {
        setActiveWorkspaceId(userWorkspaces[0].id);
      }
    }
  }, [user, workspaces.length, activeWorkspaceId]);

  const createWorkspace = (name: string) => {
    if (!user) return;
    const newWorkspace: Workspace = {
      id: uuidv4(),
      name,
      ownerId: user.id,
      memberIds: [user.id],
      createdAt: new Date().toISOString()
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    switchWorkspace(newWorkspace.id);
  };

  const switchWorkspace = (id: string) => {
    const workspace = workspaces.find(w => w.id === id);
    if (workspace && user) {
      setActiveWorkspaceId(id);
      updateUser(user.id, { lastActiveWorkspaceId: id });
    }
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || null;

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, createWorkspace, switchWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
