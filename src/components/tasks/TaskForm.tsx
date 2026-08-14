import React, { useState, useMemo } from 'react';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../../context/ProjectContext';
import { useMilestones } from '../../context/MilestoneContext';

export const TaskForm: React.FC = () => {
  const { addTask, categories, selectedCategory, tasks } = useTasks();
  const { user, users } = useAuth();
  const { projects } = useProjects();
  const { milestones } = useMilestones();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low' | 'urgent'>('medium');
  const [category, setCategory] = useState(selectedCategory || (categories.length > 0 ? categories[0].name : 'Pribadi'));
  const [projectId, setProjectId] = useState<string>('');
  const [milestoneId, setMilestoneId] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>(user?.id || '');
  const [reviewerId, setReviewerId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurringInterval, setRecurringInterval] = useState(1);

  // Compute workload count for all active users
  const userWorkloadMap = useMemo(() => {
    const map: Record<string, number> = {};
    const activeTasks = tasks.filter(t => t.status !== 'done' && !t.completed);
    users.forEach(u => {
      map[u.id] = activeTasks.filter(t => t.assigneeIds?.includes(u.id)).length;
    });
    return map;
  }, [tasks, users]);

  const selectedAssigneeWorkload = assigneeId ? userWorkloadMap[assigneeId] || 0 : 0;
  const isAssigneeOverloaded = selectedAssigneeWorkload >= 7;

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
      assigneeIds: assigneeId ? [assigneeId] : (user ? [user.id] : []),
      reviewerId: reviewerId || undefined,
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
    setReviewerId('');
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
          placeholder={t('taskForm.placeholder', 'Tambahkan tugas baru... (Tekan Enter untuk menyimpan)')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-400 font-medium p-0 outline-none text-slate-800 dark:text-slate-100"
          autoFocus
        />
        
        {title && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              placeholder={t('taskForm.description', 'Tambahkan deskripsi atau instruksi pengerjaan...')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none min-h-[80px]"
            />

            {/* Overcapacity Warning Banner */}
            {isAssigneeOverloaded && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle size={15} className="text-red-500 shrink-0" />
                <span>
                  <strong>Perhatian:</strong> Anggota yang dipilih saat ini memiliki <strong>{selectedAssigneeWorkload} tugas aktif</strong> (Overcapacity). Pertimbangkan untuk mendelegasikan ke anggota lain.
                </span>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Priority */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low' | 'urgent')}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 {t('priority.high', 'Tinggi')}</option>
                <option value="medium">🟡 {t('priority.medium', 'Sedang')}</option>
                <option value="low">🔵 {t('priority.low', 'Rendah')}</option>
              </select>

              {/* Assignee with Workload Indicator */}
              <div className="flex items-center gap-1.5">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium max-w-[200px]"
                >
                  <option value="">Pilih Pelaksana (Assignee)</option>
                  {users.filter(u => u.status !== 'inactive' && u.role !== 'client').map((u) => {
                    const count = userWorkloadMap[u.id] || 0;
                    const dot = count >= 7 ? '🔴' : count >= 4 ? '🟡' : '🟢';
                    return (
                      <option key={u.id} value={u.id}>
                        {dot} {u.name} ({count} task) - {u.department || 'General'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Reviewer */}
              <select
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium max-w-[180px]"
              >
                <option value="">Reviewer (Opsional)</option>
                {users.filter(u => u.status !== 'inactive' && (u.role === 'admin' || u.role === 'manager')).map((u) => (
                  <option key={u.id} value={u.id}>
                    🔍 {u.name} ({u.role})
                  </option>
                ))}
              </select>

              {/* Category */}
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

              {/* Project & Milestone */}
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

              {/* Due Date */}
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              />

              {/* Recurring */}
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
            {t('taskForm.addTask', 'Simpan & Tugaskan')}
          </Button>
        </div>
      </div>
    </form>
  );
};
