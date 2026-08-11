export function getDueDateStatus(dueDateStr: string | undefined): { label: string; color: 'red' | 'yellow' | 'normal', formattedDate: string } | null {
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

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const formattedDate = dueDay.toLocaleDateString('id-ID', options);

  if (diffDays < 0) {
    return {
      label: `Terlambat ${Math.abs(diffDays)} hari`,
      color: 'red',
      formattedDate
    };
  } else if (diffDays === 0) {
    return {
      label: 'Hari ini',
      color: 'yellow',
      formattedDate
    };
  } else if (diffDays <= 3) {
    return {
      label: `${diffDays} hari lagi`,
      color: 'yellow',
      formattedDate
    };
  } else {
    return {
      label: `${diffDays} hari lagi`,
      color: 'normal',
      formattedDate
    };
  }
}
