import React, { Suspense } from 'react';
import { Skeleton } from '@/ui/skeleton';
const WordTree = React.lazy(() => import('@/components/highlights/WordTree.jsx'));

export default function WordTreePage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Highlight Word Tree</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <WordTree />
      </Suspense>
    </div>
  );
}
