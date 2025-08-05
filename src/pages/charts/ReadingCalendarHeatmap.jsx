import React from 'react';
import CalendarHeatmap from '@/components/calendar/CalendarHeatmap.jsx';

export default function ReadingCalendarHeatmapPage() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-xl font-bold mb-4">Daily Reading Calendar</h1>
      <CalendarHeatmap />
    </div>
  );
}
