import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarminData } from "@/hooks/useGarminData";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import { GeoActivityExplorer } from "@/components/map";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Dashboard() {
  const data = useGarminData();
  const [activeTab, setActiveTab] = useState("map");

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
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
      </TabsList>
      <TabsContent value="map">
        <GeoActivityExplorer />
      </TabsContent>
      <TabsContent value="examples">
        <Examples />
      </TabsContent>
    </Tabs>
  );
}
