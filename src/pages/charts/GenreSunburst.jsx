import React from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import genreHierarchy from '@/data/kindle/genre-hierarchy.json';

export default function GenreSunburstPage() {
  return (
    <div className="p-4">
      <GenreSunburst data={genreHierarchy} />
    </div>
  );
}
