import React from 'react';
import useReadingSessions from '@/hooks/useReadingSessions';
import ReadingTimeline from '@/components/timeline/ReadingTimeline.jsx';
import { Skeleton } from '@/ui/skeleton';

export default function ReadingTimelinePage() {
  const { data, error, isLoading } = useReadingSessions();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reading Timeline</h1>
      {error ? (
        <div>Failed to load sessions</div>
      ) : isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ReadingTimeline sessions={data || []} />
      )}
    </div>
  );
}
