import React, { useState, useRef } from 'react';
import { Trash2, Edit2, Check, ChevronDown, Plus, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../ui/Badge';
import { getDueDateStatus } from '../../utils/dateUtils';
import { ProgressBar } from '../ui/ProgressBar';
import { SubTaskItem } from './SubTaskItem';
import { EditTaskModal } from './EditTaskModal';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

interface TaskCardProps {
 task: Task;
 isDragEnabled?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isDragEnabled = false }) => {
 const { toggleTaskCompletion, deleteTask, addSubTask, toggleSubTask, deleteSubTask, categories } = useTasks();
 const { t, i18n } = useTranslation();
 
 const dueDateStatus = getDueDateStatus(task.dueDate);
 const [isSubTasksOpen, setIsSubTasksOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
 const buttonRef = useRef<HTMLButtonElement>(null);

 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: task.id, disabled: !isDragEnabled });

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 zIndex: isDragging ? 10 : 1,
 opacity: isDragging ? 0.5 : 1,
 };

 const completedSubTasks = task.subTasks.filter(st => st.completed).length;
 const totalSubTasks = task.subTasks.length;
 const progress = totalSubTasks === 0 ? 0 : Math.round((completedSubTasks / totalSubTasks) * 100);

 const handleToggleCompletion = () => {
 if (!task.completed && buttonRef.current) {
 // Fire mini confetti with accent color
 const rect = buttonRef.current.getBoundingClientRect();
 const x = (rect.left + rect.width / 2) / window.innerWidth;
 const y = (rect.top + rect.height / 2) / window.innerHeight;

 confetti({
 particleCount: 30,
 spread: 60,
 origin: { x, y },
 colors: ['#0D9488', '#0F766E', '#E4E4E7', '#27272A'],
 disableForReducedMotion: true,
 zIndex: 100
 });
 }
 toggleTaskCompletion(task.id);
 };

 const handleAddSubTask = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newSubTaskTitle.trim() || totalSubTasks >= 10) return;
 addSubTask(task.id, newSubTaskTitle.trim());
 setNewSubTaskTitle('');
 };

 const taskCategory = categories.find(c => c.name === task.category);
 const categoryColor = taskCategory?.color;

 return (
 <motion.div
 ref={setNodeRef}
 style={style}
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9 }}
 whileHover={{ scale: 1.01 }}
 transition={{ type: "spring", stiffness: 400, damping: 30 }}
 className={clsx(
 'group flex items-start gap-3 p-4 rounded-lg border transition-colors duration-300 shadow-sm',
 'bg-[#FFFFFF] dark:bg-[#242424] border-[#E4E4E7] dark:border-[#333333]'
 )}
 >
 {isDragEnabled && (
 <div 
 {...attributes} 
 {...listeners}
 className="mt-1 p-1 text-[#71717A] hover:text-[#0D9488] cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
 >
 <GripVertical size={16} />
 </div>
 )}

 <motion.button
 ref={buttonRef}
 whileTap={{ scale: 0.8 }}
 onClick={handleToggleCompletion}
 className={clsx(
 'mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
 task.completed
 ? 'bg-[#0D9488] border-[#0D9488] text-white'
 : 'border-[#E4E4E7] dark:border-[#333333] hover:border-[#0D9488] text-transparent'
 )}
 >
 <motion.div
 initial={false}
 animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
 transition={{ type: "spring", stiffness: 500, damping: 30 }}
 >
 <Check size={14} strokeWidth={3} />
 </motion.div>
 </motion.button>

 <div className="flex-1 min-w-0">
 <h3
 className={clsx(
 'text-lg font-semibold truncate transition-colors duration-300',
 task.completed ? 'text-[#A1A1AA] line-through opacity-70' : 'text-[#27272A] dark:text-[#E4E4E7]'
 )}
 >
 {task.title}
 </h3>
 {task.description && (
 <p
 className={clsx(
 'mt-1 text-sm line-clamp-2 transition-colors duration-300',
 task.completed ? 'text-[#A1A1AA] line-through opacity-70' : 'text-[#71717A]'
 )}
 >
 {task.description}
 </p>
 )}
 
 <div className="mt-3 flex flex-wrap items-center gap-2">
 {task.status === 'review' && (
 <Badge variant="category" color="#2563EB">
 ⏱️ Waiting Review
 </Badge>
 )}
 {task.priority === 'urgent' && <Badge variant="priority-high">Urgent</Badge>}
 {task.priority === 'high' && <Badge variant="priority-high">{t('priority.high')}</Badge>}
 {task.priority === 'medium' && <Badge variant="priority-medium">{t('priority.medium')}</Badge>}
 {task.priority === 'low' && <Badge variant="priority-low">{t('priority.low')}</Badge>}
 <Badge variant="category" color={categoryColor}>{task.category}</Badge>
 {dueDateStatus && (
 <Badge variant={`due-${dueDateStatus.color}` as any}>
 {dueDateStatus.date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })} ({t(dueDateStatus.key, { days: dueDateStatus.days })})
 </Badge>
 )}
 {task.isRecurring && (
 <Badge variant="category" color="#71717A">🔁 {t('common.recurring') || 'Berulang'}</Badge>
 )}
 </div>

 {totalSubTasks > 0 && (
 <div className="mt-4">
 <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5">
 <span className="font-medium">{t('taskCard.progress')} ({completedSubTasks}/{totalSubTasks})</span>
 <span>{progress}%</span>
 </div>
 <ProgressBar progress={progress} color="bg-[#0D9488]" />
 </div>
 )}

 {/* Sub Tasks Section */}
 <div className="mt-4 border-t border-[#E4E4E7] dark:border-[#333333] pt-3">
 <button
 onClick={() => setIsSubTasksOpen(!isSubTasksOpen)}
 className="flex items-center gap-2 text-sm text-[#71717A] hover:text-[#0D9488] font-medium transition-colors"
 >
 <motion.div
 initial={false}
 animate={{ rotate: isSubTasksOpen ? 180 : 0 }}
 transition={{ duration: 0.2 }}
 >
 <ChevronDown size={16} />
 </motion.div>
 {totalSubTasks > 0 ? t('taskCard.subTasks') : t('taskCard.addSubTask')}
 </button>

 <motion.div
 initial={false}
 animate={{ height: isSubTasksOpen ? 'auto' : 0, opacity: isSubTasksOpen ? 1 : 0 }}
 className="overflow-hidden"
 >
 <div className="mt-3 space-y-1">
 {task.subTasks.map((st) => (
 <SubTaskItem
 key={st.id}
 subTask={st}
 onToggle={(subTaskId) => toggleSubTask(task.id, subTaskId)}
 onDelete={(subTaskId) => deleteSubTask(task.id, subTaskId)}
 />
 ))}

 {totalSubTasks < 10 && (
 <form onSubmit={handleAddSubTask} className="flex items-center gap-2 mt-2">
 <div className="relative flex-1">
 <input
 type="text"
 placeholder={t('taskCard.newSubTask')}
 value={newSubTaskTitle}
 onChange={(e) => setNewSubTaskTitle(e.target.value)}
 className="w-full text-sm bg-[#FFFFFF] dark:bg-[#242424] border border-[#E4E4E7] dark:border-[#333333] rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] text-[#27272A] dark:text-[#E4E4E7]"
 />
 <button
 type="submit"
 disabled={!newSubTaskTitle.trim()}
 className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0D9488] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0D9488]/10 p-1 rounded-md transition-colors"
 >
 <Plus size={16} />
 </button>
 </div>
 </form>
 )}
 </div>
 </motion.div>
 </div>
 </div>

 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() => setIsEditModalOpen(true)}
 className="p-2 text-[#71717A] hover:text-[#0D9488] hover:bg-[#0D9488]/10 rounded-lg transition-colors"
 title={t('common.edit')}
 >
 <Edit2 size={16} />
 </button>
 <button
 onClick={() => deleteTask(task.id)}
 className="p-2 text-[#71717A] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors"
 title={t('common.delete')}
 >
 <Trash2 size={16} />
 </button>
 </div>
 
 <EditTaskModal 
 task={task} 
 isOpen={isEditModalOpen} 
 onClose={() => setIsEditModalOpen(false)} 
 />
 </motion.div>
 );
};
