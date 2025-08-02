import React from "react";
import RouteSimilarity from "@/components/dashboard/RouteSimilarity";

export default function RouteSimilarityPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Route similarity</h2>
      <p className="text-sm text-muted-foreground">Compare two routes to see how alike they are.</p>
      <RouteSimilarity />
    </div>
  );
}
