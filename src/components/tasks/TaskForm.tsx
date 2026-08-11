import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

export const TaskForm: React.FC = () => {
  const { addTask, categories, selectedCategory } = useTasks();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState(selectedCategory || (categories.length > 0 ? categories[0].name : 'Pribadi'));
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory(selectedCategory || (categories.length > 0 ? categories[0].name : 'Pribadi'));
    setDueDate('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 transition-colors duration-300">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={t('taskForm.placeholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-400 font-medium p-0 outline-none text-slate-800 dark:text-slate-100"
          autoFocus
        />
        
        {title && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              placeholder={t('taskForm.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 resize-none min-h-[80px]"
            />
            
            <div className="flex flex-wrap gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="high">🔴 {t('priority.high')}</option>
                <option value="medium">🟡 {t('priority.medium')}</option>
                <option value="low">🟢 {t('priority.low')}</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            disabled={!title.trim()}
            icon={<PlusCircle size={18} />}
            className={!title.trim() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {t('taskForm.addTask')}
          </Button>
        </div>
      </div>
    </form>
  );
};
