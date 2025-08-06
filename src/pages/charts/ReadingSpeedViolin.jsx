import React from 'react';
import ReadingSpeedViolin from '@/components/stats/ReadingSpeedViolin.jsx';

export default function ReadingSpeedViolinPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Reading Speed Distribution</h1>
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
        <ReadingSpeedViolin />
      </div>
    </div>
  );
}
