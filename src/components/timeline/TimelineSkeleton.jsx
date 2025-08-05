import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TimelineSkeleton({ className = 'h-40 w-full', ...props }) {
  return <Skeleton className={className} data-testid="timeline-skeleton" {...props} />;
}
