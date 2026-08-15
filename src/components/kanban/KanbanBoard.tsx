import React, { useState } from 'react';
import { 
 DndContext, 
 DragOverlay, 
 closestCorners, 
 KeyboardSensor, 
 PointerSensor, 
 useSensor, 
 useSensors
} from '@dnd-kit/core';
import type {
 DragStartEvent, 
 DragOverEvent, 
 DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from 'react-i18next';

interface KanbanBoardProps {
 projectId: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
 const { tasks, updateTask, toggleTaskCompletion } = useTasks();
 const { t } = useTranslation();

 const COLUMNS = [
 { id: 'todo', title: t('kanban.columns.todo'), color: 'bg-slate-100 text-slate-800 dark:bg-[#242424] dark:text-slate-100' },
 { id: 'in_progress', title: t('kanban.columns.in_progress'), color: 'bg-subtle text-blue-800 dark:bg-blue-900/40 dark:text-blue-100' },
 { id: 'review', title: t('kanban.columns.review'), color: 'bg-[#E3F2FD] text-[#0D47A1] dark:bg-blue-900/30 dark:text-primary' },
 { id: 'done', title: t('kanban.columns.done'), color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100' },
 ];
 
 // Get tasks for this project (or all if projectId is empty)
 const boardTasks = tasks.filter(t => projectId ? t.projectId === projectId : true);
 
 const [activeTask, setActiveTask] = useState<Task | null>(null);

 const sensors = useSensors(
 useSensor(PointerSensor, {
 activationConstraint: {
 distance: 5,
 },
 }),
 useSensor(KeyboardSensor, {
 coordinateGetter: sortableKeyboardCoordinates,
 })
 );

 const handleDragStart = (event: DragStartEvent) => {
 const { active } = event;
 const task = boardTasks.find(t => t.id === active.id);
 if (task) setActiveTask(task);
 };

 const handleDragOver = (event: DragOverEvent) => {
 const { over } = event;
 if (!over) return;
 
 // We only handle reordering here if we want to visually update.
 // For simplicity, we can do the actual update in handleDragEnd.
 };

 const handleDragEnd = (event: DragEndEvent) => {
 setActiveTask(null);
 const { active, over } = event;
 if (!over) return;

 const activeId = active.id;

 // Find the task we are dragging
 const activeTask = boardTasks.find(t => t.id === activeId);
 if (!activeTask) return;

 // Find what we dragged over
 const overType = over.data.current?.type;
 const overStatus = overType === 'Column' ? over.id : over.data.current?.task?.status;

 if (overStatus && activeTask.status !== overStatus) {
 // Update task status
 updateTask(activeTask.id, { status: overStatus as Task['status'] });
 
 // If moved to done and not completed, or moved out of done and is completed
 if (overStatus === 'done' && !activeTask.completed) {
 toggleTaskCompletion(activeTask.id);
 } else if (overStatus !== 'done' && activeTask.completed) {
 toggleTaskCompletion(activeTask.id);
 }
 }
 };

 return (
 <div className="h-[calc(100vh-250px)] min-h-[500px]">
 <DndContext
 sensors={sensors}
 collisionDetection={closestCorners}
 onDragStart={handleDragStart}
 onDragOver={handleDragOver}
 onDragEnd={handleDragEnd}
 >
 <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
 {COLUMNS.map(col => (
 <KanbanColumn 
 key={col.id}
 id={col.id}
 title={col.title}
 color={col.color}
 tasks={boardTasks.filter(t => t.status === col.id).sort((a, b) => a.order - b.order)}
 />
 ))}
 </div>

 <DragOverlay>
 {activeTask ? <KanbanCard task={activeTask} /> : null}
 </DragOverlay>
 </DndContext>
 </div>
 );
};
