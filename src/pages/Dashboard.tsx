import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarminData } from "@/hooks/useGarminData";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import Statistics from "@/pages/Statistics";
import {
  FragilityGauge,
  RouteNoveltyMap,
  RouteSimilarity,
} from "@/components/dashboard";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SessionSimilarityMap } from "@/components/statistics";

export default function Dashboard() {
  const data = useGarminData();
  const [activeTab, setActiveTab] = useState<
    | "map"
    | "route"
    | "novelty"
    | "examples"
    | "statistics"
    | "fragility"
    | "sessions"
  >("map");

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    );
  }

  minutesSince(data.lastSync); // retain side-effect-free call for now

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="map">Map playground</TabsTrigger>
        <TabsTrigger value="route">Route similarity</TabsTrigger>
        <TabsTrigger value="novelty">Route Novelty</TabsTrigger>
        <TabsTrigger value="examples">Analytics fun</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="fragility">Fragility</TabsTrigger>
        <TabsTrigger value="sessions">Session Similarity</TabsTrigger>
      </TabsList>
      <TabsContent value="map">
        <div className="p-6 text-muted-foreground">
          Map playground details coming soon.
        </div>
      </TabsContent>
      <TabsContent value="route">
        <RouteSimilarity />
      </TabsContent>
      <TabsContent value="novelty">
        <RouteNoveltyMap />
      </TabsContent>
      <TabsContent value="examples">
        <Examples />
      </TabsContent>
      <TabsContent value="statistics">
        <Statistics />
      </TabsContent>
      <TabsContent value="fragility">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">Fragility index</h3>
          <p className="text-sm text-muted-foreground">
            The fragility index blends training consistency with load spikes to
            estimate injury risk. Lower scores signal resilience, while higher
            scores call for caution.
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-4">
            <li>
              <span className="text-green-600">0–0.33</span>: stable
            </li>
            <li>
              <span className="text-yellow-600">0.34–0.66</span>: monitor
            </li>
            <li>
              <span className="text-red-600">0.67–1.00</span>: high risk
            </li>
          </ul>
          <FragilityGauge />
        </div>
      </TabsContent>
      <TabsContent value="sessions">
        <SessionSimilarityMap />
      </TabsContent>
    </Tabs>
  );
}
