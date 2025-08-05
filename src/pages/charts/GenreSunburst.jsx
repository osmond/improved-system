import React, { useEffect, useState } from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import GenreIcicle from '@/components/genre/GenreIcicle.jsx';
import { Skeleton } from '@/ui/skeleton';

export default function GenreSunburstPage() {
  const [view, setView] = useState('sunburst');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    import('@/data/kindle/genre-hierarchy.json').then((module) => {
      if (isMounted) {
        setData(module.default);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
      {isLoading ? (
        <Skeleton
          className="h-[400px] w-full"
          data-testid="genre-hierarchy-skeleton"
        />
      ) : view === 'sunburst' ? (
        <GenreSunburst data={data} />
      ) : (
        <GenreIcicle data={data} />
      )}
    </div>
  );
}
