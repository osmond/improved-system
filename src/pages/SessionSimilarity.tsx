import React from "react";
import { SessionSimilarityMap } from "@/components/maps";
import { useRunningSessions } from "@/hooks/useRunningSessions";
import { useSessionInsights } from "@/hooks/useSessionInsights";

export default function SessionSimilarityPage() {
  const { sessions, clusterStats, error } = useRunningSessions();
  const insights = useSessionInsights(clusterStats);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Session Similarity</h1>
      {insights.length > 0 && (
        <div className="space-y-1 text-sm text-muted-foreground">
          {insights.map((i, idx) => (
            <p key={idx}>{i}</p>
          ))}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Visualize how recent runs cluster based on their characteristics.
      </p>
      {error ? (
        <div className="text-sm text-red-500">
          Unable to load running sessions.
        </div>
      ) : (
        <SessionSimilarityMap data={sessions} />
      )}
    </div>
  );
}
