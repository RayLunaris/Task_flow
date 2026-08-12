import React from 'react';
import { CalendarView } from '../components/calendar/CalendarView';

export const CalendarPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CalendarView />
    </div>
  );
};
