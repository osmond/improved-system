import React from "react";
import {
  StepsChart,
  PaceDistributionChart,
  HeartRateZonesChart,
} from "@/components/dashboard";
import { useGarminData } from "@/hooks/useGarminData";
import { useRunningStats } from "@/hooks/useRunningStats";


export default function Examples() {
  const garmin = useGarminData();
  const running = useRunningStats();

  if (!garmin || !running) {
    return <p>Loading…</p>;
  }

  return (
    <div className="grid gap-6">
      <StepsChart />
      <PaceDistributionChart data={running.paceDistribution} />
      <HeartRateZonesChart data={running.heartRateZones} />
    </div>
  );
}
