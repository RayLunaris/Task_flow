import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../ui/Button';

export const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('Pribadi');
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
    setCategory('Pribadi');
    setDueDate('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-400 font-medium p-0 outline-none"
          autoFocus
        />
        
        {title && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              placeholder="Add description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none min-h-[80px]"
            />
            
            <div className="flex flex-wrap gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-slate-700 font-medium"
              >
                <option value="high">🔴 Tinggi (High)</option>
                <option value="medium">🟡 Sedang (Medium)</option>
                <option value="low">🟢 Rendah (Low)</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-slate-700 font-medium"
              >
                <option value="Pribadi">Pribadi</option>
                <option value="Kerja">Kerja</option>
                <option value="Sekolah">Sekolah</option>
                <option value="Belanja">Belanja</option>
                <option value="Kesehatan">Kesehatan</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-slate-700 font-medium"
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
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
};
