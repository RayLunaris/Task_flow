import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Category, ChecklistTemplate } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGamification } from '../hooks/useGamification';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import { calculateNextDueDate } from '../utils/recurringUtils';

export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterPriority = 'all' | 'high' | 'medium' | 'low';
export type FilterDueDate = 'all' | 'today' | 'week' | 'overdue';
export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'name';
export type SortOrder = 'asc' | 'desc';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string | null;
  filterStatus: FilterStatus;
  filterPriority: FilterPriority;
  filterDueDate: FilterDueDate;
  sortBy: SortBy;
  sortOrder: SortOrder;
  checklistTemplates: ChecklistTemplate[];
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
  addSubTask: (taskId: string, title: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  saveChecklistTemplate: (name: string, items: Omit<import('../types').ChecklistItem, 'completed'>[]) => void;
  deleteChecklistTemplate: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  startTimer: (taskId: string, userId: string) => void;
  stopTimer: (taskId: string, userId: string) => void;
  setSelectedCategory: (categoryName: string | null) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setFilterPriority: (priority: FilterPriority) => void;
  setFilterDueDate: (dueDate: FilterDueDate) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Pribadi', color: '#7C3AED' },
  { id: '2', name: 'Kerja', color: '#EC4899' },
  { id: '3', name: 'Sekolah', color: '#14B8A6' },
  { id: '4', name: 'Belanja', color: '#F97316' },
  { id: '5', name: 'Kesehatan', color: '#3B82F6' },
];

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow_tasks', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('taskflow_categories', DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterDueDate, setFilterDueDate] = useState<FilterDueDate>('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc'); // Default to newest first
  const [checklistTemplates, setChecklistTemplates] = useLocalStorage<ChecklistTemplate[]>('taskflow_checklist_templates', []);

  const { awardPointsForTask, checkAndAwardBadges } = useGamification();
  const { user } = useAuth();
  const { logActivity, logAudit } = useActivity();

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: taskData.subTasks || [],
      priority: taskData.priority || 'medium',
      category: taskData.category || 'Pribadi',
      assigneeIds: taskData.assigneeIds || (user ? [user.id] : []),
      reporterId: user?.id || 'unknown',
      status: taskData.status || 'todo',
      checklists: taskData.checklists || [],
      attachments: taskData.attachments || [],
      comments: taskData.comments || [],
      timeEntries: taskData.timeEntries || [],
      isRecurring: taskData.isRecurring || false,
      needsApproval: taskData.needsApproval || false,
      order: tasks.length,
      dueDate: taskData.dueDate,
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity('Created task', 'task', newTask.id, newTask.title);
    logAudit('User created a new task');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      let createdRecurringTask: Task | null = null;
      let completedTask: Task | null = null;

      const updatedTasks = newTasks.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
          
          // Check if it was just marked as done by status update (e.g., drag and drop to Done column)
          if (updates.status === 'done' && task.status !== 'done') {
            updatedTask.completed = true;
            updatedTask.completedAt = new Date().toISOString();
            completedTask = updatedTask;

            if (task.isRecurring && task.recurringConfig) {
              const nextDueDate = calculateNextDueDate(task.dueDate || new Date().toISOString().split('T')[0], task.recurringConfig);
              createdRecurringTask = {
                ...task,
                id: uuidv4(),
                dueDate: nextDueDate,
                completed: false,
                completedAt: undefined,
                status: 'todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                subTasks: task.subTasks.map(st => ({ ...st, completed: false })),
                checklists: task.checklists.map(cl => ({ ...cl, completed: false })),
                comments: [],
              };
            }
          }
          // If status moved from done to something else
          else if (updates.status && updates.status !== 'done' && task.status === 'done') {
             updatedTask.completed = false;
             updatedTask.completedAt = undefined;
             logActivity('Reopened task', 'task', task.id, task.title);
          } else if (updates.status && updates.status !== task.status) {
             logActivity(`Changed status to ${updates.status}`, 'task', task.id, task.title);
          }

          return updatedTask;
        }
        return task;
      });

      if (createdRecurringTask) {
        updatedTasks.push(createdRecurringTask);
      }

      const ct = completedTask as Task | null;
      if (ct) {
        logActivity('Completed task', 'task', ct.id, ct.title);
        setTimeout(() => {
          awardPointsForTask(ct);
          checkAndAwardBadges(updatedTasks);
        }, 0);
      }

      return updatedTasks;
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      logActivity('Deleted task', 'task', id, taskToDelete.title);
      logAudit('User deleted a task');
    }
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Update order field
      return result.map((task, index) => ({ ...task, order: index }));
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) => {
      let isNewlyCompleted = false;
      let completedTask: Task | null = null;
      
      const newTasks = prev.map((task) => {
        if (task.id === id) {
          const isCompleted = !task.completed;
          if (isCompleted) {
            isNewlyCompleted = true;
          }
          const updatedTask = {
            ...task,
            completed: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
          if (isCompleted) completedTask = updatedTask;
          return updatedTask;
        }
        return task;
      });

      const ct = completedTask as Task | null;
      if (isNewlyCompleted && ct) {
        if (ct.isRecurring && ct.recurringConfig) {
          const nextDueDate = calculateNextDueDate(ct.dueDate || new Date().toISOString().split('T')[0], ct.recurringConfig);
          // Auto-generate the next task instance
          const nextTask: Task = {
            ...ct,
            id: uuidv4(),
            dueDate: nextDueDate,
            completed: false,
            completedAt: undefined,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subTasks: ct.subTasks.map(st => ({ ...st, completed: false })),
            checklists: ct.checklists ? ct.checklists.map(cl => ({ ...cl, completed: false })) : [],
            comments: [], // Don't carry over comments
          };
          newTasks.push(nextTask);
        }

        // Run gamification logic asynchronously to not block state update immediately, or just call it directly
        setTimeout(() => {
          awardPointsForTask(ct);
          checkAndAwardBadges(newTasks);
        }, 0);
      }

      return newTasks;
    });
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const addSubTask = (taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          if (task.subTasks.length >= 10) return task; // max 10
          return {
            ...task,
            subTasks: [
              ...task.subTasks,
              { id: uuidv4(), title, completed: false },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subTasks: task.subTasks.map((st) =>
              st.id === subTaskId ? { ...st, completed: !st.completed } : st
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subTasks: task.subTasks.filter((st) => st.id !== subTaskId),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  };

  const saveChecklistTemplate = (name: string, items: Omit<import('../types').ChecklistItem, 'completed'>[]) => {
    setChecklistTemplates((prev) => [
      ...prev,
      { id: uuidv4(), name, items },
    ]);
  };

  const deleteChecklistTemplate = (id: string) => {
    setChecklistTemplates((prev) => prev.filter(t => t.id !== id));
  };

  const addCategory = (name: string, color: string) => {
    setCategories((prev) => [...prev, { id: uuidv4(), name, color }]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const startTimer = (taskId: string, userId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // Stop any currently running timer for this user
        const newEntries = task.timeEntries.map(entry => {
          if (entry.userId === userId && !entry.endAt) {
            return { ...entry, endAt: new Date().toISOString(), duration: Math.floor((Date.now() - new Date(entry.startAt).getTime()) / 1000) };
          }
          return entry;
        });

        return {
          ...task,
          timeEntries: [
            ...newEntries,
            {
              id: uuidv4(),
              taskId,
              userId,
              startAt: new Date().toISOString()
            }
          ]
        };
      }
      return task;
    }));
  };

  const stopTimer = (taskId: string, userId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newEntries = task.timeEntries.map(entry => {
          if (entry.userId === userId && !entry.endAt) {
            return { ...entry, endAt: new Date().toISOString(), duration: Math.floor((Date.now() - new Date(entry.startAt).getTime()) / 1000) };
          }
          return entry;
        });
        return { ...task, timeEntries: newEntries };
      }
      return task;
    }));
  };


  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        selectedCategory,
        filterStatus,
        filterPriority,
        filterDueDate,
        sortBy,
        sortOrder,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        toggleTaskCompletion,
        clearCompletedTasks,
        addSubTask,
        toggleSubTask,
        deleteSubTask,
        addCategory,
        deleteCategory,
        startTimer,
        stopTimer,
        setSelectedCategory,
        setFilterStatus,
        setFilterPriority,
        setFilterDueDate,
        setSortBy,
        setSortOrder,
        checklistTemplates,
        saveChecklistTemplate,
        deleteChecklistTemplate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
