import React from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import genreHierarchy from '@/data/kindle/genre-hierarchy.json';

export default function GenreSunburstPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Genre Hierarchy Sunburst</h1>
      <GenreSunburst data={genreHierarchy} />
    </div>
  );
}
