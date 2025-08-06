import React, { useEffect, useState } from 'react';
import BookNetwork from '@/components/network/BookNetwork.jsx';
import BookChordDiagram from '@/components/network/BookChordDiagram.jsx';
import { Skeleton } from '@/ui/skeleton';

export default function BookNetworkPage() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('network');

  useEffect(() => {
    import('@/data/kindle/book-graph.json').then((mod) => {
      setData(mod.default);
    });
  }, []);

  const toggleView = () => {
    setView((v) => (v === 'network' ? 'chord' : 'network'));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Related Books Network</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Click a book to expand its neighbors, drag nodes to reposition and use
        the switch below to view a chord diagram.
      </p>
      {data ? (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <span className="h-3 w-3 rounded-full bg-chart-1"></span>
                <span className="h-3 w-3 rounded-full bg-chart-2"></span>
                <span className="h-3 w-3 rounded-full bg-chart-3"></span>
              </div>
              <span>Communities</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-0.5 w-6 bg-[var(--chart-network-link)]"></span>
              <span>Weak link</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-6 bg-[var(--chart-network-link)]"></span>
              <span>Strong link</span>
            </div>
          </div>
          <button onClick={toggleView} data-testid="toggle-view" className="mb-4">
            {view === 'network' ? 'Show Chord Diagram' : 'Show Network'}
          </button>
          {view === 'network' ? (
            <BookNetwork data={data} />
          ) : (
            <BookChordDiagram data={data} />
          )}
        </div>
      ) : (
        <Skeleton className="h-96 w-full" data-testid="book-network-skeleton" />
      )}
    </div>
  );
}

