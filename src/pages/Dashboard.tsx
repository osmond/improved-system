import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarminData } from "@/hooks/useGarminData";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import MileageGlobePage from "@/pages/MileageGlobe";
import {
  FragilityGauge,
  RouteNoveltyMap,
  RouteSimilarity,
} from "@/components/dashboard";
import {
  SessionSimilarityMap,
  GoodDayMap,
  HabitConsistencyHeatmap,
} from "@/components/statistics";
import { useRunningSessions } from "@/hooks/useRunningSessions";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";


export default function Dashboard() {
  const data = useGarminData();
  const sessions = useRunningSessions();
  const [accordionValue, setAccordionValue] = React.useState("routes");
  const [routeTab, setRouteTab] = React.useState("similarity");
  const [sessionTab, setSessionTab] = React.useState("fragility");
  const [miscTab, setMiscTab] = React.useState("examples");

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
    <Accordion value={accordionValue} onValueChange={setAccordionValue}>
      <AccordionItem value="routes">
        <AccordionTrigger>Route Analytics</AccordionTrigger>
        <AccordionContent value="routes">
          <Tabs value={routeTab} onValueChange={setRouteTab}>
            <TabsList>
              <TabsTrigger value="similarity">Similarity</TabsTrigger>
              <TabsTrigger value="novelty">Novelty</TabsTrigger>
              <TabsTrigger value="mileage">Mileage Globe</TabsTrigger>
            </TabsList>
            <TabsContent value="similarity">
              <RouteSimilarity />
            </TabsContent>
            <TabsContent value="novelty">
              <RouteNoveltyMap />
            </TabsContent>
            <TabsContent value="mileage">
              <MileageGlobePage />
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sessions">
      <AccordionTrigger>Session Analysis</AccordionTrigger>
      <AccordionContent value="sessions">
        <Tabs value={sessionTab} onValueChange={setSessionTab}>
          <TabsList>
            <TabsTrigger value="fragility">Fragility</TabsTrigger>
            <TabsTrigger value="session-similarity">Session Similarity</TabsTrigger>
            <TabsTrigger value="good-day">Good Day</TabsTrigger>
            <TabsTrigger value="habit-consistency">Habit Consistency</TabsTrigger>
          </TabsList>
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
          <TabsContent value="session-similarity">
            <SessionSimilarityMap data={sessions} />
          </TabsContent>
          <TabsContent value="good-day">
            <GoodDayMap data={sessions} />
          </TabsContent>
          <TabsContent value="habit-consistency">
            <HabitConsistencyHeatmap />
          </TabsContent>
        </Tabs>
      </AccordionContent>
      </AccordionItem>

      <AccordionItem value="other">
        <AccordionTrigger>Other</AccordionTrigger>
        <AccordionContent value="other">
          <Tabs value={miscTab} onValueChange={setMiscTab}>
            <TabsList>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>
            <TabsContent value="examples">
              <Examples />
            </TabsContent>
            <TabsContent value="map">
              <div className="p-6 text-muted-foreground">
                Map playground details coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
