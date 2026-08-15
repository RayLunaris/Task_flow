import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import type { Comment } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';

interface CommentListProps {
 comments: Comment[];
 onDelete: (commentId: string) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, onDelete }) => {
 const { user: currentUser, users } = useAuth();
 const { t } = useTranslation();

 const formatRelativeTime = (dateString: string) => {
 const date = new Date(dateString);
 const now = new Date();
 const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
 
 if (diffInSeconds < 60) return t('comments.justNow');
 if (diffInSeconds < 3600) return t('comments.minutesAgo', { count: Math.floor(diffInSeconds / 60) });
 if (diffInSeconds < 86400) return t('comments.hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
 if (diffInSeconds < 2592000) return t('comments.daysAgo', { count: Math.floor(diffInSeconds / 86400) });
 return date.toLocaleDateString();
 };

 // Highlight mentions in text
 const renderContent = (content: string) => {
 const parts = content.split(/(@\w+)/g);
 return parts.map((part, i) => {
 if (part.startsWith('@')) {
 return (
 <span key={i} className="font-bold text-[#0D47A1] dark:text-primary bg-[#E3F2FD] dark:bg-blue-900/40 px-1 rounded">
 {part}
 </span>
 );
 }
 return <span key={i}>{part}</span>;
 });
 };

 if (comments.length === 0) {
 return (
 <div className="text-center py-8">
 <p className="text-slate-500 dark:text-slate-400 text-sm">{t('comments.noComments')}</p>
 </div>
 );
 }

 // Sort by oldest first for standard chat flow
 const sortedComments = [...comments].sort((a, b) => 
 new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
 );

 return (
 <div className="space-y-4">
 <AnimatePresence>
 {sortedComments.map(comment => {
 const author = users.find(u => u.id === comment.userId);
 const isOwner = currentUser?.id === comment.userId;
 
 return (
 <motion.div 
 key={comment.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="flex gap-3 group"
 >
 {/* Avatar */}
 <Avatar 
 name={author ? author.name : 'Unknown User'} 
 src={author?.avatar} 
 size="sm" 
 className="shrink-0 mt-1" 
 />

 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
 {author ? author.name : 'Unknown User'}
 </span>
 <span className="text-[10px] text-slate-400">
 {formatRelativeTime(comment.createdAt)}
 </span>
 
 {isOwner && (
 <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
 <button 
 onClick={() => {
 if(confirm(t('comments.deleteConfirm'))) onDelete(comment.id);
 }}
 className="text-slate-400 hover:text-pink-600 p-1 rounded"
 title={t('comments.deleteComment')}
 >
 <Trash2 size={14} />
 </button>
 </div>
 )}
 </div>

 <div className="bg-slate-50 dark:bg-[#242424]/50 rounded-lg rounded-tl-none p-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-border-color">
 <p className="whitespace-pre-wrap leading-relaxed">
 {renderContent(comment.content)}
 </p>
 </div>
 </div>
 </motion.div>
 );
 })}
 </AnimatePresence>
 </div>
 );
};
