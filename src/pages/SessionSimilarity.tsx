import React, { useEffect, useState } from "react";
import { SessionSimilarityMap } from "@/components/maps";
import { useRunningSessions } from "@/hooks/useRunningSessions";
import { useSessionInsights } from "@/hooks/useSessionInsights";
import {
  getSavedViews,
  saveView,
  type SavedView,
} from "@/lib/savedViewStore";

export default function SessionSimilarityPage() {
  const [method, setMethod] = useState<"tsne" | "umap">("tsne");
  const { sessions, clusterStats, axisHints, error } = useRunningSessions(method);
  const insights = useSessionInsights(clusterStats);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [compareId, setCompareId] = useState<string>("");

  useEffect(() => {
    setSavedViews(getSavedViews());
  }, []);

  const handleSave = () => {
    if (!sessions) return;
    const view: SavedView = {
      id: Date.now().toString(),
      created: new Date().toISOString(),
      method,
      sessions,
      axisHints,
    };
    saveView(view);
    setSavedViews(getSavedViews());
  };

  const compare = savedViews.find((v) => v.id === compareId) || null;

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
      <div className="flex flex-wrap items-center gap-2 text-sm">
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
        <button
          onClick={handleSave}
          className="ml-2 rounded border px-2 py-1"
          disabled={!sessions}
        >
          Save View
        </button>
        {savedViews.length > 0 && (
          <>
            <label htmlFor="compare">Compare:</label>
            <select
              id="compare"
              value={compareId}
              onChange={(e) => setCompareId(e.target.value)}
              className="border rounded p-1"
            >
              <option value="">None</option>
              {savedViews.map((v) => (
                <option key={v.id} value={v.id}>
                  {new Date(v.created).toLocaleString()}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      {error ? (
        <div className="text-sm text-red-500">
          Unable to load running sessions.
        </div>
      ) : compare ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SessionSimilarityMap
            data={compare.sessions}
            axisHints={compare.axisHints}
          />
          <SessionSimilarityMap data={sessions} axisHints={axisHints} />
        </div>
      ) : (
        <SessionSimilarityMap data={sessions} axisHints={axisHints} />
      )}
    </div>
  );
}
