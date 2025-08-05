import React from 'react';
import useReadingSessions from '@/hooks/useReadingSessions';
import ReadingTimeline from '@/components/timeline/ReadingTimeline.jsx';
import TimelineSkeleton from '@/components/timeline/TimelineSkeleton.jsx';

export default function ReadingTimelinePage() {
  const { data, error, isLoading } = useReadingSessions();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reading Timeline</h1>
      {error ? (
        <div>Failed to load sessions</div>
      ) : isLoading ? (
        <TimelineSkeleton className="h-64 w-full" />
      ) : (
        <ReadingTimeline sessions={data || []} />
      )}
    </div>
  );
}
