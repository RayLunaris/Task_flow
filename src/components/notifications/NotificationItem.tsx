import React from 'react';
import { 
 Bell, 
 CheckCircle, 
 Clock, 
 MessageSquare, 
 Flag, 
 Trash2,
 CheckSquare,
 Users,
 Check,
 X,
 Briefcase
} from 'lucide-react';
import clsx from 'clsx';
import type { Notification } from '../../types';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui/Button';

interface NotificationItemProps {
 notification: Notification;
 onRead: (id: string) => void;
 onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, onDelete }) => {
 const { t } = useTranslation();
 const { respondToTeamInvite } = useNotifications();

 const formatRelativeTime = (dateString: string) => {
 const date = new Date(dateString);
 const now = new Date();
 const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
 
 if (diffInSeconds < 60) return t('notifications.justNow', 'Baru saja');
 if (diffInSeconds < 3600) return t('notifications.minutesAgo', { count: Math.floor(diffInSeconds / 60) });
 if (diffInSeconds < 86400) return t('notifications.hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
 if (diffInSeconds < 2592000) return t('notifications.daysAgo', { count: Math.floor(diffInSeconds / 86400) });
 return date.toLocaleDateString();
 };
 
 const getIcon = (type: Notification['type']) => {
 switch(type) {
 case 'task_assigned': return <CheckSquare size={16} className="text-primary" />;
 case 'deadline_near': return <Clock size={16} className="text-orange-500" />;
 case 'comment': return <MessageSquare size={16} className="text-primary" />;
 case 'approval': return <CheckCircle size={16} className="text-teal-500" />;
 case 'milestone': return <Flag size={16} className="text-pink-500" />;
 case 'team_invite': return <Users size={16} className="text-primary" />;
 default: return <Bell size={16} className="text-slate-500" />;
 }
 };

 const getBgColor = (type: Notification['type']) => {
 switch(type) {
 case 'task_assigned': return 'bg-subtle dark:bg-blue-900/30';
 case 'deadline_near': return 'bg-orange-100 dark:bg-orange-900/30';
 case 'comment': return 'bg-[#E3F2FD] dark:bg-blue-900/30';
 case 'approval': return 'bg-teal-100 dark:bg-teal-900/30';
 case 'milestone': return 'bg-pink-100 dark:bg-pink-900/30';
 case 'team_invite': return 'bg-indigo-100 dark:bg-indigo-900/40';
 default: return 'bg-slate-100 dark:bg-[#242424]';
 }
 };

 const isTeamInvite = notification.type === 'team_invite' && notification.inviteStatus;

 return (
 <div 
 className={clsx(
 "group p-4 flex gap-3.5 border-b border-slate-100 dark:border-border-color transition-colors",
 !notification.isRead ? "bg-[#E3F2FD]/30 dark:bg-blue-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
 )}
 onMouseEnter={() => {
 if (!notification.isRead && !isTeamInvite) onRead(notification.id);
 }}
 >
 <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs", getBgColor(notification.type))}>
 {getIcon(notification.type)}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-2 mb-1">
 <h4 className={clsx(
 "text-sm truncate",
 !notification.isRead ? "font-bold text-slate-800 dark:text-slate-100" : "font-semibold text-slate-700 dark:text-slate-300"
 )}>
 {notification.title}
 </h4>
 <span className="text-[10px] font-medium text-slate-400 shrink-0">
 {formatRelativeTime(notification.createdAt)}
 </span>
 </div>

 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
 {notification.message}
 </p>

 {/* Team Invite Interactive Actions */}
 {isTeamInvite && (
 <div className="mt-2.5 p-3 rounded-lg bg-white dark:bg-[#1A1A1A]/80 border border-border-color/80 dark:border-border-color shadow-xs">
 {notification.inviteData && (
 <div className="flex flex-wrap items-center gap-2 mb-2.5 text-[11px] text-slate-500 dark:text-slate-400">
 <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
 <Briefcase size={12} className="text-primary" />
 {notification.inviteData.title || notification.inviteData.role}
 </span>
 <span>•</span>
 <span className="font-medium text-slate-600 dark:text-slate-400">
 Divisi: {notification.inviteData.department}
 </span>
 <span>•</span>
 <span>Oleh: <strong>{notification.inviteData.inviterName}</strong></span>
 </div>
 )}

 {notification.inviteStatus === 'pending' ? (
 <div className="flex items-center gap-2 pt-1">
 <Button
 type="button"
 size="sm"
 onClick={() => respondToTeamInvite(notification.id, 'accept')}
 icon={<Check size={14} />}
 className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 text-xs shadow-xs"
 >
 Gabung Tim
 </Button>
 <Button
 type="button"
 size="sm"
 variant="secondary"
 onClick={() => respondToTeamInvite(notification.id, 'decline')}
 icon={<X size={14} />}
 className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 text-xs"
 >
 Tolak
 </Button>
 </div>
 ) : notification.inviteStatus === 'accepted' ? (
 <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
 <Check size={14} strokeWidth={3} />
 <span>Anda telah bergabung dengan tim ini</span>
 </div>
 ) : (
 <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
 <X size={14} />
 <span>Undangan ditolak</span>
 </div>
 )}
 </div>
 )}
 </div>

 <div className="shrink-0 flex items-start">
 {!notification.isRead && !isTeamInvite && (
 <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2 group-hover:opacity-0 transition-opacity" />
 )}
 <button 
 onClick={() => onDelete(notification.id)}
 className="p-1.5 text-slate-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
 title={t('notifications.delete', 'Hapus')}
 >
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 );
};
