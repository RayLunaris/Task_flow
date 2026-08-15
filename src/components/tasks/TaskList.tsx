import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from './TaskCard';
import { useTranslation } from 'react-i18next';
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
 useSensor,
 useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
 SortableContext,
 sortableKeyboardCoordinates,
 verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const TaskList: React.FC = () => {
 const { tasks, selectedCategory, filterStatus, filterPriority, filterDueDate, sortBy, sortOrder, reorderTasks } = useTasks();
 const { t } = useTranslation();

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

 const filteredAndSortedTasks = useMemo(() => {
 let result = tasks;

 // 1. Filter by Category
 if (selectedCategory) {
 result = result.filter(task => task.category === selectedCategory);
 }

 // 2. Filter by Status
 if (filterStatus !== 'all') {
 result = result.filter(task => 
 filterStatus === 'completed' ? task.completed : !task.completed
 );
 }

 // 3. Filter by Priority
 if (filterPriority !== 'all') {
 result = result.filter(task => task.priority === filterPriority);
 }

 // 4. Filter by Due Date
 if (filterDueDate !== 'all') {
 result = result.filter(task => {
 if (!task.dueDate) return false;
 
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const dueDay = new Date(task.dueDate);
 dueDay.setHours(0, 0, 0, 0);
 
 const diffTime = dueDay.getTime() - today.getTime();
 const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

 if (filterDueDate === 'overdue') return diffDays < 0 && !task.completed;
 if (filterDueDate === 'today') return diffDays === 0;
 if (filterDueDate === 'week') return diffDays >= 0 && diffDays <= 7;
 
 return true;
 });
 }

 // 5. Sort
 result = [...result].sort((a, b) => {
 let comparison = 0;
 // If we are not filtering or sorting by anything else, we use the user-defined order
 if (sortBy === 'createdAt') {
 // Fallback to order property if available and sorting is default
 if (a.order !== undefined && b.order !== undefined && sortOrder === 'asc') {
 return a.order - b.order;
 }
 comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
 } else if (sortBy === 'dueDate') {
 const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
 const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
 comparison = dateA - dateB;
 } else if (sortBy === 'priority') {
 const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
 comparison = priorityWeight[a.priority as keyof typeof priorityWeight] - priorityWeight[b.priority as keyof typeof priorityWeight];
 } else if (sortBy === 'name') {
 comparison = a.title.localeCompare(b.title);
 }

 return sortOrder === 'asc' ? comparison : -comparison;
 });

 return result;
 }, [tasks, selectedCategory, filterStatus, filterPriority, filterDueDate, sortBy, sortOrder]);

 const handleDragEnd = (event: DragEndEvent) => {
 const { active, over } = event;
 
 if (over && active.id !== over.id) {
 const oldIndex = tasks.findIndex(t => t.id === active.id);
 const newIndex = tasks.findIndex(t => t.id === over.id);
 
 reorderTasks(oldIndex, newIndex);
 }
 };

 if (filteredAndSortedTasks.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
 <div className="bg-[#E3F2FD] dark:bg-[#242424] p-6 rounded-full mb-4">
 <ClipboardList size={48} className="text-primary" />
 </div>
 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('taskList.noTasks')}</h3>
 <p className="text-slate-500 dark:text-slate-400 max-w-sm">
 {selectedCategory 
 ? t('taskList.noTasksCategory', { category: selectedCategory })
 : tasks.length > 0 
 ? t('taskList.noTasksFilter')
 : t('taskList.cleanSlate')}
 </p>
 </div>
 );
 }

 // Only allow drag and drop if we are not heavily filtered or sorted
 const isDragEnabled = sortBy === 'createdAt' && filterStatus === 'all' && filterPriority === 'all' && filterDueDate === 'all' && !selectedCategory;

 return (
 <DndContext 
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={handleDragEnd}
 >
 <div className="flex flex-col gap-3">
 <SortableContext 
 items={filteredAndSortedTasks.map(t => t.id)}
 strategy={verticalListSortingStrategy}
 >
 <AnimatePresence initial={false}>
 {filteredAndSortedTasks.map((task) => (
 <TaskCard key={task.id} task={task} isDragEnabled={isDragEnabled} />
 ))}
 </AnimatePresence>
 </SortableContext>
 </div>
 </DndContext>
 );
};
