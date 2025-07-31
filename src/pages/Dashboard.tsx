import React from "react";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { ActivitiesChart } from "@/components/dashboard/ActivitiesChart";
import { StepsChart } from "@/components/dashboard/StepsChart";
import MapChart from "@/components/dashboard/MapChart";
import StateTable from "@/components/dashboard/StateTable";
import {
  PaceDistributionChart,
  HeartRateZonesChart,
  PaceVsHeartChart,
  TemperatureChart,
  AnnualMileageChart,
  WorkoutTimeChart,
  RunDistancesChart,
  TreadmillOutdoorChart,
} from "@/components/dashboard";
import { useRunningStats } from "@/hooks/useRunningStats";
import { useGarminData } from "@/hooks/useGarminData";
import { useStateVisits } from "@/hooks/useStateVisits";

export default function Dashboard() {
  const data = useGarminData();
  const visits = useStateVisits();
  const running = useRunningStats();
  const [selected, setSelected] = React.useState<string | null>(null);

  if (!data || !visits || !running) {
    return <p>Loading…</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Steps</h2>
          <ProgressRing value={(data.steps / 10000) * 100} />
          <span className="mt-2 text-lg font-bold">{data.steps}</span>
        </Card>

        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Sleep (hrs)</h2>
          <ProgressRing value={(data.sleep / 8) * 100} />
          <span className="mt-2 text-lg font-bold">{data.sleep}</span>
        </Card>

        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Heart Rate</h2>
          <ProgressRing value={(data.heartRate / 200) * 100} />
          <span className="mt-2 text-lg font-bold">{data.heartRate}</span>
        </Card>

        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Calories</h2>
          <ProgressRing value={(data.calories / 3000) * 100} />
          <span className="mt-2 text-lg font-bold">{data.calories}</span>
        </Card>
      </div>

      <Card className="md:col-span-2 p-4">
        <StepsChart />
      </Card>

      <Card className="md:col-span-2 p-4">
        <ActivitiesChart />
      </Card>

      <Card className="md:col-span-2 p-4">
        <PaceDistributionChart data={running.paceDistribution} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <HeartRateZonesChart data={running.heartRateZones} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <PaceVsHeartChart data={running.paceVsHeart} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <TemperatureChart data={running.temperature} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <AnnualMileageChart data={running.annualMileage} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <WorkoutTimeChart data={running.byHour} maxPct={100} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <RunDistancesChart data={running.distanceBuckets} />
      </Card>

      <Card className="md:col-span-2 p-4">
        <TreadmillOutdoorChart data={running.treadmillOutdoor} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:col-span-2">
        <MapChart data={visits} onSelectState={setSelected} />
        <StateTable data={visits} selectedState={selected} onSelectState={setSelected} />
      </div>
    </div>
  );
}
