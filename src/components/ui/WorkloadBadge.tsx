import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WorkloadBadgeProps {
  taskCount: number;
  variant?: 'compact' | 'pill' | 'detailed';
  className?: string;
  showIcon?: boolean;
}

export const getWorkloadStatus = (count: number) => {
  if (count >= 7) {
    return {
      status: 'overcapacity' as const,
      label: 'Overcapacity',
      labelId: 'Kelebihan Beban',
      color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60',
      dotColor: 'bg-red-500',
      icon: AlertTriangle,
    };
  }
  if (count >= 4) {
    return {
      status: 'moderate' as const,
      label: 'Moderate',
      labelId: 'Sedang',
      color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
      dotColor: 'bg-amber-500',
      icon: Activity,
    };
  }
  return {
    status: 'optimal' as const,
    label: 'Optimal',
    labelId: 'Optimal',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    dotColor: 'bg-emerald-500',
    icon: CheckCircle2,
  };
};

export const WorkloadBadge: React.FC<WorkloadBadgeProps> = ({
  taskCount,
  variant = 'pill',
  className,
  showIcon = true,
}) => {
  const info = getWorkloadStatus(taskCount);
  const Icon = info.icon;

  if (variant === 'compact') {
    return (
      <span
        title={`${taskCount} active tasks (${info.label})`}
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border',
            info.color,
            className
          )
        )}
      >
        <span className={clsx('w-1.5 h-1.5 rounded-full', info.dotColor)} />
        <span>{taskCount}</span>
      </span>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={twMerge(
          clsx(
            'flex items-center justify-between p-2.5 rounded-xl border text-xs',
            info.color,
            className
          )
        )}
      >
        <div className="flex items-center gap-2">
          {showIcon && <Icon size={15} />}
          <span className="font-semibold">{info.label}</span>
        </div>
        <span className="font-bold font-mono">{taskCount} active tasks</span>
      </div>
    );
  }

  // Default: 'pill'
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          info.color,
          className
        )
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full animate-pulse', info.dotColor)} />
      <span>
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'} • {info.label}
      </span>
    </span>
  );
};
