import React from 'react';
import Heatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useDailyReading from '@/hooks/useDailyReading';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/ui/tooltip';
import { getISOWeek, getISOWeekYear } from 'date-fns';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Sparkline = ({ series }) => {
  const width = 40;
  const height = 10;
  const max = Math.max(...series, 1);
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-testid="sparkline"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
};

function YearlyHeatmap({ data }) {
  const dates = data.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...dates));
  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - 1);
  const endDate = new Date(Math.max(...dates));

  const startWithEmptyDays = new Date(startDate);
  startWithEmptyDays.setDate(startWithEmptyDays.getDate() - startDate.getDay());

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

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 0);
  const values = data.map((d) => ({ date: d.date, count: d.minutes }));

  const minutesByDate = data.reduce((acc, d) => {
    acc[d.date] = d.minutes;
    return acc;
  }, {});

  const weekSeries = {};
  data.forEach((d) => {
    const dt = new Date(d.date);
    const weekKey = `${getISOWeekYear(dt)}-${getISOWeek(dt)}`;
    if (!weekSeries[weekKey]) weekSeries[weekKey] = Array(7).fill(0);
    const dayIdx = (dt.getDay() + 6) % 7; // Monday=0
    weekSeries[weekKey][dayIdx] = d.minutes;
  });

  const classForValue = (value) => {
    if (!value || !value.count || maxMinutes === 0) return 'reading-scale-0';
    const level = Math.ceil((value.count / maxMinutes) * 4);
    return `reading-scale-${level}`;
  };

  const transformDayElement = (element, value, index) => {
    const date = new Date(startWithEmptyDays);
    date.setDate(startWithEmptyDays.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    const weekKey = `${getISOWeekYear(date)}-${getISOWeek(date)}`;
    const series = weekSeries[weekKey] || Array(7).fill(0);
    const minutes = minutesByDate[dateKey] || 0;
    const formatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const dayRect = React.cloneElement(element, { 'data-date': dateKey });
    const cell = (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{dayRect}</TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col">
              <span>{formatted}</span>
              <span>{minutes} min</span>
              <Sparkline series={series} />
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    if (date.getDate() === 1) {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      return (
        <g key={dateKey}>
          <text x={element.props.x} y={element.props.y - 2} className="text-xs">
            {monthNames[date.getMonth()]}
          </text>
          {cell}
          <text x={element.props.x} y={element.props.y + 12} className="text-xs">
            {monthTotals[key]}
          </text>
        </g>
      );
    }
    return <g key={dateKey}>{cell}</g>;
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

export default function CalendarHeatmap({ data: propData }) {
  const { data: hookData } = useDailyReading();
  const data = propData || hookData;
  if (!data || data.length === 0) return null;

  const dataByYear = data.reduce((acc, d) => {
    const year = new Date(d.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(d);
    return acc;
  }, {});

  const years = Object.keys(dataByYear).sort();

  return (
    <div>
      {years.map((year) => (
        <div key={year} className="mb-8">
          <div className="mb-2 font-semibold">{year}</div>
          <YearlyHeatmap data={dataByYear[year]} />
        </div>
      ))}
    </div>
  );
}

