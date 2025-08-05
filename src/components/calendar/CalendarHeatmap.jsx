import React, { useMemo } from 'react';
import Heatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useDailyReading from '@/hooks/useDailyReading';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/ui/tooltip';
import { Skeleton } from '@/ui/skeleton';
import {
  getISOWeek,
  getISOWeekYear,
  getMonth,
  getYear,
  getISODay,
} from 'date-fns';

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

function YearlyHeatmap({ data, maxMinutes }) {
  const dates = data.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...dates));
  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - 1);
  const endDate = new Date(Math.max(...dates));

  const startWithEmptyDays = new Date(startDate);
  startWithEmptyDays.setDate(
    startWithEmptyDays.getDate() - ((getISODay(startDate) + 6) % 7)
  );

  const dataByMonth = useMemo(
    () =>
      data.reduce((acc, d) => {
        const dt = new Date(d.date);
        const key = `${getYear(dt)}-${getMonth(dt)}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(d);
        return acc;
      }, {}),
    [data, maxMinutes]
  );

  const monthTotals = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(dataByMonth).map(([key, arr]) => [
          key,
          arr.reduce((sum, item) => sum + item.minutes, 0),
        ])
      ),
    [data, maxMinutes]
  );

  const values = data.map((d) => ({ date: d.date, count: d.minutes }));

  const minutesByDate = useMemo(
    () =>
      data.reduce((acc, d) => {
        acc[d.date] = d.minutes;
        return acc;
      }, {}),
    [data, maxMinutes]
  );


  const weekSeries = useMemo(() => {
    const result = {};
    data.forEach((d) => {
      const dt = new Date(d.date);
      const weekKey = `${getISOWeekYear(dt)}-${getISOWeek(dt)}`;
      if (!result[weekKey]) result[weekKey] = Array(7).fill(0);
      const dayIdx = (dt.getDay() + 6) % 7; // Monday=0
      result[weekKey][dayIdx] = d.minutes;
    });
    return result;
  }, [data, maxMinutes]);


    const classForValue = (value) => {
      if (!value || !value.count || maxMinutes === 0) return 'reading-scale-0';
      const level = Math.ceil((value.count / maxMinutes) * 5);
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
    const dayRect = React.cloneElement(element, {
      'data-date': dateKey,
      tabIndex: 0,
      'aria-label': `${formatted}: ${minutes} minutes`,
    });
    const cell = (
      <Tooltip>
        <TooltipTrigger
          asChild
          onFocus={(e) =>
            e.target.dispatchEvent(
              new MouseEvent('mouseover', { bubbles: true })
            )
          }
          onBlur={(e) =>
            e.target.dispatchEvent(
              new MouseEvent('mouseout', { bubbles: true })
            )
          }
        >
          {dayRect}
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <span>{formatted}</span>
            <span>{minutes} min</span>
            <Sparkline series={series} />
          </div>
        </TooltipContent>
      </Tooltip>
    );
    if (date.getDate() === 1) {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const size = Number(element.props.height) || 10;
      const topY = element.props.y - (getISODay(date) - 1) * size;
      const bottomY = topY + size * 7 + 12;
      const lineX = element.props.x - 1;
      const boundaryClass = `month-boundary${
        date.getMonth() % 3 === 0 ? ' quarter-boundary' : ''
      }`;
      return (
        <g key={dateKey}>
          <line
            x1={lineX}
            y1={topY}
            x2={lineX}
            y2={bottomY - 12}
            className={boundaryClass}
          />
          <text x={element.props.x} y={topY - 2} className="text-xs">
            {monthNames[date.getMonth()]}
          </text>
          {cell}
          <text x={element.props.x} y={bottomY} className="text-xs">
            {monthTotals[key]}
          </text>
        </g>
      );
    }
    return <g key={dateKey}>{cell}</g>;
  };

  const legendScale = [1, 2, 3, 4, 5];
  const step = Math.ceil(maxMinutes / 5) || 1;

  return (
    <TooltipProvider>
      <div>
        <Heatmap
          startDate={startWithEmptyDays}
          endDate={endDate}
          values={values}
          classForValue={classForValue}
          transformDayElement={transformDayElement}
          showMonthLabels={false}
        />
        <div
          className="flex flex-wrap items-center gap-2 mt-2 text-xs"
          data-testid="reading-legend"
        >
          <div className="flex items-center gap-1" data-no-data>
            <div className="w-3 h-3 border" />
            <span>No data</span>
          </div>
          {legendScale.map((level) => {
            const min = step * (level - 1);
            const max = step * level;
            return (
              <div
                key={level}
                className="flex items-center gap-1"
                data-legend-level
              >
                <div className={`w-3 h-3 reading-scale-${level}`} />
                <span>
                  {min}-{max} min
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function CalendarHeatmap({ data: propData, multiYear }) {
  const { data: hookData, isLoading } = useDailyReading();
  const data = propData || hookData;
  if (isLoading) {
    return <Skeleton className="h-64" data-testid="calendar-heatmap-skeleton" />;
  }
  if (!data || data.length === 0) return null;

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 0);

  const dataByYear = data.reduce((acc, d) => {
    const year = new Date(d.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(d);
    return acc;
  }, {});

  const years = Object.keys(dataByYear).sort();
  const isMultiYear = multiYear ?? years.length > 1;

  if (!isMultiYear) {
    const year = years[0];
    return <YearlyHeatmap data={dataByYear[year]} maxMinutes={maxMinutes} />;
  }

  return (
    <div>
      {years.map((year) => (
        <div key={year} className="mb-8">
          <div className="mb-2 font-semibold">{year}</div>
          <YearlyHeatmap data={dataByYear[year]} maxMinutes={maxMinutes} />
        </div>
      ))}
    </div>
  );
}

