import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Notification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allNotifications, setAllNotifications] = useLocalStorage<Notification[]>('taskflow_notifications', []);
  const { user } = useAuth();

  // Only show notifications for the logged in user
  const userNotifications = user ? allNotifications.filter(n => n.userId === user.id) : [];
  
  // Sort by newest first
  const sortedNotifications = [...userNotifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = sortedNotifications.filter(n => !n.isRead).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: uuidv4(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setAllNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setAllNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    setAllNotifications(prev => 
      prev.map(n => n.userId === user.id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setAllNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Add a fake notification for testing if the user is new and has no notifications
  useEffect(() => {
    if (user && userNotifications.length === 0) {
      addNotification({
        userId: user.id,
        type: 'task_assigned',
        title: 'Welcome to TaskFlow Business!',
        message: 'Your account is ready. Start creating projects and delegating tasks.',
      });
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ 
      notifications: sortedNotifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
