import React from 'react';
import useReadingSessions from '@/hooks/useReadingSessions';
import ReadingTimeline from '@/components/timeline/ReadingTimeline.jsx';
import { Skeleton } from '@/ui/skeleton';

export default function TimelinePage() {
  const { data, error, isLoading } = useReadingSessions();

  if (error) return <div>Failed to load sessions</div>;
  if (isLoading) return <Skeleton className="h-64 w-full" />;
  return <ReadingTimeline sessions={data || []} />;
}
