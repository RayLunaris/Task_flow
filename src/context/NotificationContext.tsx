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
  respondToTeamInvite: (notificationId: string, action: 'accept' | 'decline') => void;
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

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-alex-invite',
    userId: 'member-1', // Alex Rivera
    type: 'team_invite',
    title: 'Undangan Bergabung ke Tim TaskFlow',
    message: 'Sarah Connor (Admin) mengundang Anda untuk bergabung ke tim sebagai Senior Frontend Developer (Engineering).',
    isRead: false,
    inviteStatus: 'pending',
    inviteData: {
      inviterId: 'admin-1',
      inviterName: 'Sarah Connor',
      role: 'member',
      department: 'Engineering',
      title: 'Senior Frontend Developer'
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allNotifications, setAllNotifications] = useLocalStorage<Notification[]>('taskflow_notifications', SEED_NOTIFICATIONS);
  const { user, acceptTeamInvite, declineTeamInvite } = useAuth();

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

  const respondToTeamInvite = (notificationId: string, action: 'accept' | 'decline') => {
    const notif = allNotifications.find(n => n.id === notificationId);
    if (!notif) return;

    // 1. Update notification inviteStatus & isRead
    setAllNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, inviteStatus: action === 'accept' ? 'accepted' : 'declined', isRead: true } 
          : n
      )
    );

    // 2. Update user status in AuthContext
    if (user) {
      if (action === 'accept') {
        acceptTeamInvite(user.id);
      } else {
        declineTeamInvite(user.id);
      }
    }

    // 3. Send feedback notification to the inviter
    const inviterId = notif.inviteData?.inviterId || 'admin-1';
    if (user) {
      const feedbackNotif: Notification = {
        id: uuidv4(),
        userId: inviterId,
        type: 'team_invite',
        title: action === 'accept' ? 'Undangan Tim Diterima! 🎉' : 'Undangan Tim Ditolak',
        message: action === 'accept'
          ? `${user.name} telah menerima undangan dan resmi bergabung dengan tim TaskFlow!`
          : `${user.name} menolak undangan bergabung ke tim.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setAllNotifications(prev => [feedbackNotif, ...prev]);
    }
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

  // Welcome notification for new users
  useEffect(() => {
    if (user && userNotifications.length === 0) {
      addNotification({
        userId: user.id,
        type: 'task_assigned',
        title: 'Selamat Datang di TaskFlow Business!',
        message: 'Akun Anda telah siap. Mulai kelola proyek dan kolaborasi tugas bersama tim.',
      });
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ 
      notifications: sortedNotifications, 
      unreadCount, 
      addNotification, 
      respondToTeamInvite,
      markAsRead, 
      markAllAsRead, 
      deleteNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
