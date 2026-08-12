import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ActivityLog, AuditLog } from '../types';
import { useAuth } from './AuthContext';

interface ActivityContextType {
  activities: ActivityLog[];
  auditLogs: AuditLog[];
  logActivity: (action: string, targetType: ActivityLog['targetType'], targetId: string, targetName: string, metadata?: Record<string, unknown>) => void;
  logAudit: (action: string, ip?: string) => void;
  getTaskActivities: (taskId: string) => ActivityLog[];
  getProjectActivities: (projectId: string) => ActivityLog[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useLocalStorage<ActivityLog[]>('taskflow_activities', []);
  const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('taskflow_audit_logs', []);
  const { user } = useAuth();

  const logActivity = (action: string, targetType: ActivityLog['targetType'], targetId: string, targetName: string, metadata?: Record<string, unknown>) => {
    if (!user) return;
    
    const newLog: ActivityLog = {
      id: uuidv4(),
      userId: user.id,
      action,
      targetType,
      targetId,
      targetName,
      metadata,
      createdAt: new Date().toISOString(),
    };
    
    setActivities(prev => [newLog, ...prev]);
  };

  const logAudit = (action: string, ip?: string) => {
    if (!user) return;
    
    const newLog: AuditLog = {
      id: uuidv4(),
      userId: user.id,
      action,
      ip: ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getTaskActivities = (taskId: string) => {
    return activities.filter(a => a.targetType === 'task' && a.targetId === taskId);
  };

  const getProjectActivities = (projectId: string) => {
    return activities.filter(a => a.targetType === 'project' && a.targetId === projectId);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        auditLogs,
        logActivity,
        logAudit,
        getTaskActivities,
        getProjectActivities
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
