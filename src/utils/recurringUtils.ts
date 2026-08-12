import type { RecurringConfig } from '../types';

export const calculateNextDueDate = (currentDueDate: string, config: RecurringConfig): string => {
  const date = new Date(currentDueDate);
  
  if (isNaN(date.getTime())) {
    // If no current due date or invalid, start from today
    date.setTime(new Date().getTime());
  }

  const interval = config.interval || 1;

  switch (config.frequency) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + (7 * interval));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;
    case 'custom':
      // Basic custom implementation, assume daily interval for now if not specified
      date.setDate(date.getDate() + interval);
      break;
  }

  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD
};
