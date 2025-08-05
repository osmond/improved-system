import React, { useEffect, useState } from 'react';
import BookNetwork from '@/components/network/BookNetwork.jsx';
import { Skeleton } from '@/ui/skeleton';

export default function BookNetworkPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    import('@/data/kindle/book-graph.json').then((mod) => {
      setData(mod.default);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Related Books Network</h1>
      {data ? (
        <BookNetwork />
      ) : (
        <Skeleton className="h-96 w-full" data-testid="book-network-skeleton" />
      )}
    </div>
  );
}
