import React from 'react';
import Heatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useDailyReading from '@/hooks/useDailyReading';

export default function CalendarHeatmap() {
  const { data } = useDailyReading();
  if (!data || data.length === 0) return null;

  const dates = data.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...dates));
  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - 1);
  const endDate = new Date(Math.max(...dates));

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 0);
  const values = data.map((d) => ({ date: d.date, count: d.minutes }));
  const classForValue = (value) => {
    if (!value || !value.count || maxMinutes === 0) return 'reading-scale-0';
    const level = Math.ceil((value.count / maxMinutes) * 4);
    return `reading-scale-${level}`;
  };

  const legendScale = [0, 1, 2, 3, 4];

  return (
    <div>
      <Heatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={classForValue}
      />
      <div
        className="flex items-center gap-1 mt-2 text-xs"
        data-testid="reading-legend"
      >
        <span>Less</span>
        {legendScale.map((level) => (
          <div key={level} className={`w-3 h-3 reading-scale-${level}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
