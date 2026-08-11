import React, { useState } from 'react';
import { Trash2, Edit2, Check, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../ui/Badge';
import { getDueDateStatus } from '../../utils/dateUtils';
import { ProgressBar } from '../ui/ProgressBar';
import { SubTaskItem } from './SubTaskItem';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask, addSubTask, toggleSubTask, deleteSubTask, categories } = useTasks();
  const dueDateStatus = getDueDateStatus(task.dueDate);
  const [isSubTasksOpen, setIsSubTasksOpen] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const totalSubTasks = task.subTasks.length;
  const progress = totalSubTasks === 0 ? 0 : Math.round((completedSubTasks / totalSubTasks) * 100);

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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={clsx(
        'group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300',
        task.completed
          ? 'bg-slate-50 border-slate-200'
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200'
      )}
    >
      <button
        onClick={() => toggleTaskCompletion(task.id)}
        className={clsx(
          'mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
          task.completed
            ? 'bg-purple-500 border-purple-500 text-white'
            : 'border-slate-300 hover:border-purple-400 text-transparent'
        )}
      >
        <Check size={14} className={task.completed ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={clsx(
            'text-lg font-semibold truncate transition-colors',
            task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={clsx(
              'mt-1 text-sm line-clamp-2 transition-colors',
              task.completed ? 'text-slate-400 line-through' : 'text-slate-500'
            )}
          >
            {task.description}
          </p>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          {task.priority === 'high' && <Badge variant="priority-high">🔴 High</Badge>}
          {task.priority === 'medium' && <Badge variant="priority-medium">🟡 Medium</Badge>}
          {task.priority === 'low' && <Badge variant="priority-low">🟢 Low</Badge>}
          <Badge variant="category" color={categoryColor}>{task.category}</Badge>
          {dueDateStatus && (
            <Badge variant={`due-${dueDateStatus.color}` as any}>
              {dueDateStatus.color === 'red' ? '🔴' : dueDateStatus.color === 'yellow' ? '🟡' : '⚪'} {dueDateStatus.formattedDate} ({dueDateStatus.label})
            </Badge>
          )}
        </div>

        {totalSubTasks > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-medium">Progress ({completedSubTasks}/{totalSubTasks})</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar progress={progress} color="bg-teal-500" />
          </div>
        )}

        {/* Sub Tasks Section */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <button
            onClick={() => setIsSubTasksOpen(!isSubTasksOpen)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            {isSubTasksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {totalSubTasks > 0 ? 'Sub-tasks' : 'Add sub-task'}
          </button>

          {isSubTasksOpen && (
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
                      placeholder="Add new sub-task..."
                      value={newSubTaskTitle}
                      onChange={(e) => setNewSubTaskTitle(e.target.value)}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300"
                    />
                    <button
                      type="submit"
                      disabled={!newSubTaskTitle.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50 p-1 rounded-md transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
