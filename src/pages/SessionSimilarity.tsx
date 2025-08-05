import React, { useState } from "react";
import { SessionSimilarityMap } from "@/components/maps";
import { useRunningSessions } from "@/hooks/useRunningSessions";
import { useSessionInsights } from "@/hooks/useSessionInsights";

export default function SessionSimilarityPage() {
  const [method, setMethod] = useState<"tsne" | "umap">("tsne");
  const { sessions, clusterStats, axisHints, error } = useRunningSessions(method);
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
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="embed">Embedding:</label>
        <select
          id="embed"
          value={method}
          onChange={(e) => setMethod(e.target.value as "tsne" | "umap")}
          className="border rounded p-1"
        >
          <option value="tsne">t-SNE</option>
          <option value="umap">UMAP</option>
        </select>
      </div>
      {error ? (
        <div className="text-sm text-red-500">
          Unable to load running sessions.
        </div>
      ) : (
        <SessionSimilarityMap data={sessions} axisHints={axisHints} />
      )}
    </div>
  );
}
