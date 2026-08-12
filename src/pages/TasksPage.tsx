import React from 'react';
import { useTranslation } from 'react-i18next';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskList } from '../components/tasks/TaskList';

export const TasksPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('app.greeting')}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t('app.subtitle')}</p>
      </div>
      
      <TaskForm />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('app.yourTasks')}</h2>
        <TaskFilterBar />
        <TaskList />
      </div>
    </div>
  );
};
