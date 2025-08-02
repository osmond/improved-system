import React from "react";
import { RouteSimilarity } from "@/components/dashboard";

export default function RouteSimilarityPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Route Similarity</h1>
      <p className="text-sm text-muted-foreground">
        Compare two routes to evaluate their overlap using a Jaccard index.
      </p>
      <RouteSimilarity />
    </div>
  );
}
