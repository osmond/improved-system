import React from 'react';
import Heatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useDailyReading from '@/hooks/useDailyReading';

export default function CalendarHeatmap() {
  const { data } = useDailyReading();
  if (!data || data.length === 0) return null;
  const dates = data.map((d) => new Date(d.date));
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));
  const values = data.map((d) => ({ date: d.date, count: d.minutes }));
  return <Heatmap startDate={startDate} endDate={endDate} values={values} />;
}
