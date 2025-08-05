import React from 'react';
import ReadingSpeedViolin from '@/components/stats/ReadingSpeedViolin.jsx';

export default function ReadingSpeedViolinPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reading Speed Distribution</h1>
      <ReadingSpeedViolin />
    </div>
  );
}
