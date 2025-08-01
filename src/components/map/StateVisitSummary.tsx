import React, { useMemo } from "react";
import { useStateVisits } from "@/hooks/useStateVisits";
import useInsights from "@/hooks/useInsights";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function StateVisitSummary() {
  const states = useStateVisits();
  const insights = useInsights();

  const summary = useMemo(() => {
    if (!states) return null;
    const visited = states.filter((s) => s.visited);
    const totalStates = visited.length;
    const totalMiles = visited.reduce((acc, s) => acc + s.totalMiles, 0);
    const favorite = visited.reduce(
      (prev, curr) => (curr.totalMiles > prev.totalMiles ? curr : prev),
      visited[0] || { stateCode: "", totalMiles: 0 }
    );
    return { totalStates, totalMiles, favorite: favorite.stateCode };
  }, [states]);

  if (!summary) return <Skeleton className="h-4 w-full" />;

  return (
    <div className="flex gap-2 flex-wrap text-xs mb-2">
      <Badge>{summary.totalStates} states</Badge>
      <Badge>{summary.totalMiles}mi</Badge>
      {summary.favorite && <Badge>Fav: {summary.favorite}</Badge>}
      {insights && <Badge>{insights.activeStreak}d streak</Badge>}
    </div>
  );
}
