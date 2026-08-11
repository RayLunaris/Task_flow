import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'subTasks'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow_tasks', []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'subTasks'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks: [],
      priority: taskData.priority || 'medium',
      category: taskData.category || 'General',
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const isCompleted = !task.completed;
          return {
            ...task,
            completed: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        clearCompletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
