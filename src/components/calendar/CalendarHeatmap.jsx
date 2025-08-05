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

  // compute start date including empty days for week alignment
  const startWithEmptyDays = new Date(startDate);
  startWithEmptyDays.setDate(startWithEmptyDays.getDate() - startDate.getDay());

  // group minutes by month
  const monthTotals = {};
  const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  for (let d = new Date(startMonth); d <= endMonth; d.setMonth(d.getMonth() + 1)) {
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthTotals[key] = 0;
  }
  data.forEach((d) => {
    const dt = new Date(d.date);
    const key = `${dt.getFullYear()}-${dt.getMonth()}`;
    monthTotals[key] += d.minutes;
  });
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 0);
  const values = data.map((d) => ({ date: d.date, count: d.minutes }));
  const classForValue = (value) => {
    if (!value || !value.count || maxMinutes === 0) return 'reading-scale-0';
    const level = Math.ceil((value.count / maxMinutes) * 4);
    return `reading-scale-${level}`;
  };

  const transformDayElement = (element, value, index) => {
    const date = new Date(startWithEmptyDays);
    date.setDate(startWithEmptyDays.getDate() + index);
    if (date.getDate() === 1) {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      return (
        <g key={key}>
          <text x={element.props.x} y={element.props.y - 2} className="text-xs">
            {monthNames[date.getMonth()]}
          </text>
          {element}
          <text x={element.props.x} y={element.props.y + 12} className="text-xs">
            {monthTotals[key]}
          </text>
        </g>
      );
    }
    return element;
  };

  const legendScale = [0, 1, 2, 3, 4];

  return (
    <div>
      <Heatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={classForValue}
        transformDayElement={transformDayElement}
        showMonthLabels={false}
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
