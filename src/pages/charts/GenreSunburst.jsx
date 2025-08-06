import React, { useEffect, useState } from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import GenreIcicle from '@/components/genre/GenreIcicle.jsx';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/lib/utils';

export default function GenreSunburstPage() {
  const [view, setView] = useState('sunburst');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/kindle/genre-hierarchy')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load genre hierarchy');
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
      </div>
      {isLoading ? (
        <Skeleton
          className="h-[400px] w-full"
          data-testid="genre-hierarchy-skeleton"
        />
      ) : error ? (
        <div role="alert">{error}</div>
      ) : view === 'sunburst' ? (
        <GenreSunburst data={data} />
      ) : (
        <GenreIcicle data={data} />
      )}
    </div>
  );
}
