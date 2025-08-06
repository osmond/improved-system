import React, { useEffect, useMemo, useState } from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import GenreIcicle from '@/components/genre/GenreIcicle.jsx';
import hierarchy from '@/data/kindle/genre-hierarchy.json';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/lib/utils';
import { filterUnclassified } from '@/services/genreHierarchy';

export default function GenreSunburstPage() {
  const [view, setView] = useState('sunburst');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnclassified, setShowUnclassified] = useState(false);

  useEffect(() => {
    setData(hierarchy);
    setIsLoading(false);
  }, []);

  const displayData = useMemo(() => {
    if (!data) return null;
    return showUnclassified ? filterUnclassified(data) : data;
  }, [data, showUnclassified]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Genre Hierarchy</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Each slice represents time spent reading in that genre, with deeper levels
        revealing sub-genres.
      </p>
      <div className="mb-4 space-x-2">
        <button
          type="button"
          onClick={() => setView('sunburst')}
          aria-pressed={view === 'sunburst'}
          disabled={isLoading}
          className={cn(
            'px-2 py-1 border rounded',
            view === 'sunburst' && 'bg-primary text-white',
          )}
        >
          Sunburst
        </button>
        <button
          type="button"
          onClick={() => setView('icicle')}
          aria-pressed={view === 'icicle'}
          disabled={isLoading}
          className={cn(
            'px-2 py-1 border rounded',
            view === 'icicle' && 'bg-primary text-white',
          )}
        >
          Icicle
        </button>
        <button
          type="button"
          onClick={() => setShowUnclassified((v) => !v)}
          aria-pressed={showUnclassified}
          disabled={isLoading}
          className={cn(
            'px-2 py-1 border rounded',
            showUnclassified && 'bg-accent text-accent-foreground',
          )}
        >
          {showUnclassified ? 'Show All' : 'Unclassified Only'}
        </button>
      </div>
      {isLoading ? (
        <Skeleton
          className="h-[400px] w-full"
          data-testid="genre-hierarchy-skeleton"
        />
      ) : view === 'sunburst' ? (
        <GenreSunburst data={displayData} />
      ) : (
        <GenreIcicle data={displayData} />
      )}
    </div>
  );
}
