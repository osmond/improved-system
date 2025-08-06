import React, { useEffect, useState, useMemo } from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';
import GenreIcicle from '@/components/genre/GenreIcicle.jsx';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/lib/utils';
import constants from '@/config/constants';

const { UNCLASSIFIED_GENRE } = constants;

export default function GenreSunburstPage() {
  const [view, setView] = useState('sunburst');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnclassified, setShowUnclassified] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const module = await import('@/data/kindle/genre-hierarchy.json');
        const hierarchy = module.default || module;
        if (isMounted) {
          setData(hierarchy);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to load genre data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!showUnclassified) return data;
    const unc = data.children?.find((c) => c.name === UNCLASSIFIED_GENRE);
    return unc ? { ...data, children: [unc] } : { ...data, children: [] };
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
          onClick={() => setShowUnclassified((p) => !p)}
          aria-pressed={showUnclassified}
          disabled={isLoading}
          className={cn(
            'px-2 py-1 border rounded',
            showUnclassified && 'bg-primary text-white',
          )}
        >
          {showUnclassified ? 'Show All' : `Show ${UNCLASSIFIED_GENRE}`}
        </button>
      </div>
      {error ? (
        <div className="text-destructive" role="alert">
          {error}
        </div>
      ) : isLoading ? (
        <Skeleton
          className="h-[400px] w-full"
          data-testid="genre-hierarchy-skeleton"
        />
      ) : view === 'sunburst' ? (
        <GenreSunburst data={filteredData} />
      ) : (
        <GenreIcicle data={filteredData} />
      )}
    </div>
  );
}
