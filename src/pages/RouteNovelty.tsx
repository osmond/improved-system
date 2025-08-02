import React from "react";
import { RouteNoveltyMap } from "@/components/dashboard";

export default function RouteNoveltyPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Route Novelty</h1>
      <p className="text-sm text-muted-foreground">
        Highlight unique segments across your runs to discover new ground.
      </p>
      <RouteNoveltyMap />
    </div>
  );
}
