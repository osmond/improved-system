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
      <h1 className="text-xl font-bold mb-4">Related Books Network</h1>
      {data ? (
        <div>
          <button onClick={toggleView} data-testid="toggle-view">
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

