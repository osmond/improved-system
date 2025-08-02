import React from "react";
import RouteNoveltyMap from "@/components/dashboard/RouteNoveltyMap";

export default function RouteNoveltyPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Route novelty</h2>
      <p className="text-sm text-muted-foreground">Explore how unique your recent routes are.</p>
      <RouteNoveltyMap />
    </div>
  );
}
