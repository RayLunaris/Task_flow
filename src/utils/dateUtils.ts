export function getDueDateStatus(dueDateStr: string | undefined): { key: string; days?: number; color: 'red' | 'yellow' | 'normal', date: Date } | null {
  if (!dueDateStr) return null;

  const dueDate = new Date(dueDateStr);
  dueDate.setHours(23, 59, 59, 999); // Set to end of the day

  const now = new Date();
  
  // Strip time from now for accurate day difference if we want strict day diff
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDay = new Date(dueDateStr);
  dueDay.setHours(0, 0, 0, 0);

  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      key: 'taskCard.overdue',
      days: Math.abs(diffDays),
      color: 'red',
      date: dueDay
    };
  } else if (diffDays === 0) {
    return {
      key: 'taskCard.dueToday',
      color: 'yellow',
      date: dueDay
    };
  } else if (diffDays <= 3) {
    return {
      key: 'taskCard.dueDays',
      days: diffDays,
      color: 'yellow',
      date: dueDay
    };
  } else {
    return {
      key: 'taskCard.dueDays',
      days: diffDays,
      color: 'normal',
      date: dueDay
    };
  }
}
