import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Flag, 
  Trash2,
  CheckSquare
} from 'lucide-react';
import clsx from 'clsx';
import type { Notification } from '../../types';
import { useTranslation } from 'react-i18next';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, onDelete }) => {
  const { t } = useTranslation();

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('notifications.justNow');
    if (diffInSeconds < 3600) return t('notifications.minutesAgo', { count: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400) return t('notifications.hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
    if (diffInSeconds < 2592000) return t('notifications.daysAgo', { count: Math.floor(diffInSeconds / 86400) });
    return date.toLocaleDateString();
  };
  
  const getIcon = (type: Notification['type']) => {
    switch(type) {
      case 'task_assigned': return <CheckSquare size={16} className="text-blue-500" />;
      case 'deadline_near': return <Clock size={16} className="text-orange-500" />;
      case 'comment': return <MessageSquare size={16} className="text-primary" />;
      case 'approval': return <CheckCircle size={16} className="text-teal-500" />;
      case 'milestone': return <Flag size={16} className="text-pink-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch(type) {
      case 'task_assigned': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'deadline_near': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'comment': return 'bg-[#E3F2FD] dark:bg-blue-900/30';
      case 'approval': return 'bg-teal-100 dark:bg-teal-900/30';
      case 'milestone': return 'bg-pink-100 dark:bg-pink-900/30';
      default: return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div 
      className={clsx(
        "group p-4 flex gap-3 border-b border-slate-100 dark:border-slate-800 transition-colors",
        !notification.isRead ? "bg-[#E3F2FD]/40 dark:bg-blue-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
      onMouseEnter={() => {
        if (!notification.isRead) onRead(notification.id);
      }}
    >
      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0", getBgColor(notification.type))}>
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={clsx(
          "text-sm mb-1 truncate",
          !notification.isRead ? "font-bold text-slate-800 dark:text-slate-100" : "font-medium text-slate-700 dark:text-slate-300"
        )}>
          {notification.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
          {notification.message}
        </p>
        <span className="text-[10px] font-medium text-slate-400">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>

      <div className="shrink-0 flex items-start">
        {!notification.isRead && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2 group-hover:opacity-0 transition-opacity" />
        )}
        <button 
          onClick={() => onDelete(notification.id)}
          className="p-1.5 text-slate-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 opacity-0 group-hover:opacity-100 transition-all"
          title={t('notifications.delete')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
