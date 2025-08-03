import React from "react";
import GeoActivityExplorer from "@/components/map/GeoActivityExplorer";

export default function MapPlaygroundPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">State Visits Map</h1>
      <p className="text-sm text-muted-foreground">
        View the states you've visited on an interactive map.
      </p>
      <GeoActivityExplorer />
    </div>
  );
}
