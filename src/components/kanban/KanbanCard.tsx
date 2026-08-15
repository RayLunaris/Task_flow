import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, Paperclip, MessageCircle, CheckSquare, Repeat } from 'lucide-react';
import clsx from 'clsx';
import type { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

interface KanbanCardProps {
 task: Task;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
 const { users } = useAuth();
 
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: task.id, data: { type: 'Task', task } });

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 };

 const priorityColors = {
 low: 'bg-subtle text-primary dark:bg-blue-900/30 dark:text-primary',
 medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
 high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
 urgent: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
 };

 const isOverdue = task.dueDate && new Date(task.dueDate).getTime() < new Date().setHours(0,0,0,0) && task.status !== 'done';
 const completedSubtasks = task.subTasks.filter(s => s.completed).length;

 return (
 <div
 ref={setNodeRef}
 style={style}
 className={clsx(
 "relative bg-white dark:bg-[#242424] rounded-lg p-3 shadow-sm border border-border-color dark:border-border-color mb-3 group",
 isDragging ? "opacity-50 z-50 ring-2 ring-primary" : "hover:shadow-md transition-shadow"
 )}
 >
 <div 
 {...attributes} 
 {...listeners}
 className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-l-xl transition-all"
 >
 <GripVertical size={14} />
 </div>

 <div className="pl-4">
 <div className="flex justify-between items-start mb-2 gap-2">
 <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded", priorityColors[task.priority])}>
 {task.priority}
 </span>
 {task.category && (
 <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[80px]">
 {task.category}
 </span>
 )}
 {task.isRecurring && (
 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-subtle text-primary dark:bg-blue-900/30 dark:text-primary">
 <Repeat size={10} />
 </span>
 )}
 </div>

 <h4 className={clsx(
 "text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight",
 task.completed && "line-through text-slate-500 dark:text-slate-500"
 )}>
 {task.title}
 </h4>

 <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
 {task.dueDate && (
 <div className={clsx("flex items-center gap-1", isOverdue && "text-pink-600 font-medium")}>
 <Clock size={12} />
 <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
 </div>
 )}
 {task.subTasks.length > 0 && (
 <div className="flex items-center gap-1">
 <CheckSquare size={12} />
 <span>{completedSubtasks}/{task.subTasks.length}</span>
 </div>
 )}
 {task.comments?.length > 0 && (
 <div className="flex items-center gap-1">
 <MessageCircle size={12} />
 <span>{task.comments.length}</span>
 </div>
 )}
 {task.attachments?.length > 0 && (
 <div className="flex items-center gap-1">
 <Paperclip size={12} />
 <span>{task.attachments.length}</span>
 </div>
 )}
 </div>

 {task.assigneeIds && task.assigneeIds.length > 0 && (
 <div className="flex items-center gap-1">
 {task.assigneeIds.map(id => {
 const u = users.find(user => user.id === id);
 if (!u) return null;
 return (
 <Avatar
 key={id}
 name={u.name}
 src={u.avatar}
 size="xs"
 title={u.name}
 className="w-6 h-6 border border-white dark:border-border-color"
 />
 );
 })}
 </div>
 )}
 </div>
 </div>
 );
};
