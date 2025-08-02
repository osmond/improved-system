import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarminData } from "@/hooks/useGarminData";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import Statistics from "@/pages/Statistics";
import RouteSimilarity from "@/components/dashboard/RouteSimilarity";
import { FragilityGauge } from "@/components/dashboard";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Dashboard() {
  const data = useGarminData();
  const [activeTab, setActiveTab] = useState("fragility");

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
        <TabsTrigger value="examples">Analytics fun</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="fragility">Fragility</TabsTrigger>
      </TabsList>
      <TabsContent value="map">
        <div className="p-6 text-muted-foreground">
          Map playground details coming soon.
        </div>
      </TabsContent>
      <TabsContent value="route">
        <RouteSimilarity />
      </TabsContent>
      <TabsContent value="examples">
        <Examples />
      </TabsContent>
      <TabsContent value="statistics">
        <Statistics />
      </TabsContent>
      <TabsContent value="fragility">
        <FragilityGauge />
      </TabsContent>
    </Tabs>
  );
}
