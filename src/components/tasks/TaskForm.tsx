import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../../context/ProjectContext';
import { useMilestones } from '../../context/MilestoneContext';

export const TaskForm: React.FC = () => {
  const { addTask, categories, selectedCategory } = useTasks();
  const { projects } = useProjects();
  const { milestones } = useMilestones();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low' | 'urgent'>('medium');
  const [category, setCategory] = useState(selectedCategory || (categories.length > 0 ? categories[0].name : 'Pribadi'));
  const [projectId, setProjectId] = useState<string>('');
  const [milestoneId, setMilestoneId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurringInterval, setRecurringInterval] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      projectId: projectId || undefined,
      milestoneId: milestoneId || undefined,
      dueDate: dueDate || undefined,
      isRecurring,
      recurringConfig: isRecurring ? {
        frequency: recurringFrequency,
        interval: recurringInterval,
      } : undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory(selectedCategory || (categories.length > 0 ? categories[0].name : 'Pribadi'));
    setProjectId('');
    setMilestoneId('');
    setDueDate('');
    setIsRecurring(false);
    setRecurringFrequency('daily');
    setRecurringInterval(1);
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
              className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none min-h-[80px]"
            />
            
            <div className="flex flex-wrap gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low' | 'urgent')}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 {t('priority.high')}</option>
                <option value="medium">🟡 {t('priority.medium')}</option>
                <option value="low">🔵 {t('priority.low')}</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-2">
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    setMilestoneId('');
                  }}
                  className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium max-w-[150px]"
                >
                  <option value="">No Project</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>

                {projectId && (
                  <select
                    value={milestoneId}
                    onChange={(e) => setMilestoneId(e.target.value)}
                    className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium max-w-[150px]"
                  >
                    <option value="">No Milestone</option>
                    {milestones.filter(m => m.projectId === projectId).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              />
              <div className="flex items-center gap-4 w-full mt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span>🔁 Recurring Task</span>
                </label>

                {isRecurring && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <span className="text-sm text-slate-500">Repeat every</span>
                    <input
                      type="number"
                      min="1"
                      value={recurringInterval}
                      onChange={(e) => setRecurringInterval(Number(e.target.value) || 1)}
                      className="w-16 text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-center"
                    />
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as any)}
                      className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800"
                    >
                      <option value="daily">Day(s)</option>
                      <option value="weekly">Week(s)</option>
                      <option value="monthly">Month(s)</option>
                    </select>
                  </div>
                )}
              </div>
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
