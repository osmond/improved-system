import React, { useMemo } from "react";
import { useStateVisits } from "@/hooks/useStateVisits";
import { Skeleton } from "@/components/ui/skeleton";

export default function StateVisitCallout() {
  const visits = useStateVisits();

  const latest = useMemo(() => {
    if (!visits) return null;
    let entry: { date: string; type: string; miles: number; stateCode: string } | null = null;
    visits.forEach((state) => {
      state.log.forEach((l) => {
        if (!entry || new Date(l.date) > new Date(entry.date)) {
          entry = { ...l, stateCode: state.stateCode };
        }
      });
    });
    return entry;
  }, [visits]);

  if (!visits) return <Skeleton className="h-4 w-full" />;
  if (!latest) return null;

  const message = `Latest ${latest.type}: ${latest.miles}mi in ${latest.stateCode}`;

  return (
    <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 text-xs text-muted-foreground">
      {message}
    </div>
  );
}
