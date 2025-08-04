import React from "react";
import { SessionSimilarityMap } from "@/components/statistics";
import { useRunningSessions } from "@/hooks/useRunningSessions";

export default function SessionSimilarityPage() {
  const { sessions, error } = useRunningSessions();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Session Similarity</h1>
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
