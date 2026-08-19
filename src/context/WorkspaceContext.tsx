import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Workspace, PublicUser } from '../types';

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  workspaceUsers: PublicUser[];
  createWorkspace: (name: string) => void;
  switchWorkspace: (id: string) => void;
  inviteUserToWorkspace: (userId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, users, updateUser } = useAuth();
  const [workspaces, setWorkspaces] = useLocalStorage<Workspace[]>('taskflow_workspaces', []);
  const [activeWorkspaceId, setActiveWorkspaceId] = useLocalStorage<string | null>('taskflow_active_workspace', null);

  // Ensure default workspace exists for the user
  useEffect(() => {
    if (!user) return;
    
    // Find workspaces this user belongs to
    let userWorkspaces = workspaces.filter(w => w.ownerId === user.id || w.memberIds.includes(user.id));
    
    // Only create a default workspace if the user truly has none
    if (userWorkspaces.length === 0) {
      // Check for pending workspace name from registration flow
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
      setWorkspaces([...workspaces, defaultWorkspace]);
      userWorkspaces = [defaultWorkspace];
    }

    // Determine active workspace — restore from persisted ID or pick user's first
    if (!activeWorkspaceId || !workspaces.find(w => w.id === activeWorkspaceId)) {
      const targetId = user.lastActiveWorkspaceId || userWorkspaces[0]?.id;
      if (targetId && userWorkspaces.find(w => w.id === targetId)) {
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

  const workspaceUsers = useMemo(() => {
    if (!activeWorkspace) return [];
    return users.filter(u => activeWorkspace.memberIds.includes(u.id) || activeWorkspace.ownerId === u.id);
  }, [activeWorkspace, users]);

  const inviteUserToWorkspace = (userId: string) => {
    if (!activeWorkspace) return;
    if (activeWorkspace.memberIds.includes(userId)) return;
    
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspace.id) {
        return { ...w, memberIds: [...w.memberIds, userId] };
      }
      return w;
    }));
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, workspaceUsers, createWorkspace, switchWorkspace, inviteUserToWorkspace }}>
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
