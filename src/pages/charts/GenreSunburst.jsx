import React, { useState } from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import GenreIcicle from '@/components/genre/GenreIcicle.jsx';
import genreHierarchy from '@/data/kindle/genre-hierarchy.json';

export default function GenreSunburstPage() {
  const [view, setView] = useState('sunburst');

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Genre Hierarchy</h1>
      <div className="mb-4 space-x-2">
        <button
          type="button"
          onClick={() => setView('sunburst')}
          className="px-2 py-1 border rounded"
        >
          Sunburst
        </button>
        <button
          type="button"
          onClick={() => setView('icicle')}
          className="px-2 py-1 border rounded"
        >
          Icicle
        </button>
      </div>
      {view === 'sunburst' ? (
        <GenreSunburst data={genreHierarchy} />
      ) : (
        <GenreIcicle data={genreHierarchy} />
      )}
    </div>
  );
}
