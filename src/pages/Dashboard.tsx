import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarminData } from "@/hooks/useGarminData";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";

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
        <TabsTrigger value="map">Map playground</TabsTrigger>
        <TabsTrigger value="examples">Analytics fun</TabsTrigger>
      </TabsList>
      <TabsContent value="map">
        <div className="p-6 text-muted-foreground space-y-4">
          <p>Habit Consistency Heatmap</p>
          <p>
            X-axis: day of week, Y-axis: hour-of-day; cell intensity = frequency
            of activity.
          </p>
          <p>
            Overlay changes over rolling windows to show when a user’s routine
            drifts
          </p>

          <p>“Good Day” Contextual Cluster Explorer</p>
          <p>
            Cluster sessions based on weather, time of day, and physiological
            state; highlight clusters where pace/performance exceeded
            expectation. Could be a small multiple of scatter plots annotated
            with context.
          </p>

          <p>
            Entropy of session start times (habit strength) — low entropy =
            strong routine.
          </p>

          <p>
            Route similarity index (e.g., Jaccard on GPS track clusters) to
            quantify novelty.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="examples">
        <Examples />
      </TabsContent>
    </Tabs>
  );
}
