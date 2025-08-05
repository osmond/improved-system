import React from 'react';
import ReadingMap from '@/components/map/ReadingMap.jsx';

export default function ReadingMapPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reading Locations Map</h1>
      <ReadingMap />
    </div>
  );
}
