import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';
import type { Task } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
 id: string;
 title: string;
 tasks: Task[];
 color: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, color }) => {
 const { setNodeRef, isOver } = useDroppable({
 id: id,
 data: { type: 'Column', status: id },
 });

 return (
 <div className="flex flex-col flex-shrink-0 w-[280px] sm:w-80 bg-slate-50 dark:bg-[#1A1A1A]/50 rounded-lg overflow-hidden border border-border-color dark:border-border-color h-full max-h-full">
 <div className={clsx("p-4 border-b border-border-color dark:border-border-color", color)}>
 <div className="flex items-center justify-between">
 <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
 <span className="bg-white/50 dark:bg-black/20 text-xs font-bold px-2 py-0.5 rounded-full">
 {tasks.length}
 </span>
 </div>
 </div>
 
 <div 
 ref={setNodeRef}
 className={clsx(
 "flex-1 p-3 overflow-y-auto transition-colors",
 isOver ? "bg-slate-100 dark:bg-[#242424]" : ""
 )}
 >
 <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
 {tasks.map(task => (
 <KanbanCard key={task.id} task={task} />
 ))}
 </SortableContext>
 </div>
 </div>
 );
};
