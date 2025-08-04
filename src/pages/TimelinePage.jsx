import React from 'react';
import useReadingSessions from '@/hooks/useReadingSessions';
import ReadingTimeline from '@/components/timeline/ReadingTimeline.jsx';

export default function TimelinePage() {
  const { data, error, isLoading } = useReadingSessions();
  if (error) return <div>Failed to load sessions</div>;
  if (isLoading) return <div>Loading...</div>;
  return <ReadingTimeline sessions={data || []} />;
}
