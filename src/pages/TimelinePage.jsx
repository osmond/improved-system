import React from 'react';
import useReadingSessions from '@/hooks/useReadingSessions';
import ReadingTimeline from '@/components/timeline/ReadingTimeline.jsx';
import TimelineSkeleton from '@/components/timeline/TimelineSkeleton.jsx';

export default function TimelinePage() {
  const { data, error, isLoading } = useReadingSessions();

  if (error) return <div>Failed to load sessions</div>;
  if (isLoading) return <TimelineSkeleton className="h-64 w-full" />;
  return <ReadingTimeline sessions={data || []} />;
}
