import React from "react";
import SessionSimilarityMap from "@/components/statistics/SessionSimilarityMap";
import { useRunningSessions } from "@/hooks/useRunningSessions";

export default function SessionSimilarityPage() {
  const sessions = useRunningSessions();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Session similarity</h2>
      <p className="text-sm text-muted-foreground">Similarity of recent runs.</p>
      <SessionSimilarityMap data={sessions} />
    </div>
  );
}
