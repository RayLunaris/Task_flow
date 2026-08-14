import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const AssignedTasksWidget = () => {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const assigned = tasks.filter(t => t.assigneeIds?.includes(user?.id || '') && !t.completed);
  const displayAssigned = assigned.slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Penugasan Saya</h3>
        {assigned.length > 0 && (
          <button onClick={() => navigate('/my-tasks')} className="text-[11px] text-primary hover:underline font-medium">Lihat Semua</button>
        )}
      </div>
      
      <div className="space-y-2">
        {displayAssigned.length === 0 ? (
          <div className="text-center text-xs text-muted py-4">Tidak ada penugasan.</div>
        ) : (
          displayAssigned.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-2 hover:bg-subtle dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-border-color group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <CheckSquare size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{t.title}</p>
                <p className="text-[10px] text-muted truncate">{t.dueDate ? format(new Date(t.dueDate), 'MMM d, yyyy') : 'No due date'}</p>
              </div>
              <Badge variant={`priority-${t.priority}` as any}>{t.priority}</Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export const MiniCalendarWidget = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { tasks } = useTasks();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const hasTask = (day: Date) => {
    return tasks.some(t => t.dueDate && isSameDay(new Date(t.dueDate), day) && !t.completed);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{format(currentDate, 'MMMM yyyy')}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-subtle rounded-md"><ChevronLeft size={16} /></button>
          <button onClick={nextMonth} className="p-1 hover:bg-subtle rounded-md"><ChevronRight size={16} /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] font-semibold text-muted">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Empty cells for offset */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="p-1" />
        ))}
        {days.map(day => {
          const today = isToday(day);
          const active = hasTask(day);
          return (
            <div key={day.toString()} className="flex justify-center items-center">
              <div className={`relative flex items-center justify-center w-7 h-7 text-xs rounded-full ${
                today ? 'bg-primary text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-subtle'
              }`}>
                {format(day, 'd')}
                {active && !today && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
