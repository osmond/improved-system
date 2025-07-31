import React from "react";
import {
  AnnualMileageChart,
  WorkoutTimeChart,
  AverageDailyMileageChart,
  RunDistancesChart,
  TreadmillOutdoorChart,
  PaceDistributionChart,
  HeartRateZonesChart,
  PaceVsHeartChart,
  TemperatureChart,
  WeatherConditionsChart,
  StatesMap,
  StateTable,
} from "@/components/dashboard";
import { useRunningStats } from "@/hooks/useRunningStats";
import { useGarminData } from "@/hooks/useGarminData";
import { useStateVisits } from "@/hooks/useStateVisits";

export default function StatsExamples() {
  // Fetch all stats data
  const running = useRunningStats();
  const garmin = useGarminData();
  const visits = useStateVisits();
  const [selected, setSelected] = React.useState<string | null>(null);

  if (!running || !garmin || !visits) {
    return <p>Loading…</p>;
  }

  const maxHourPct = Math.max(...running.byHour.map((d) => d.pct));
  const maxWeekdayPct = Math.max(...running.byWeekday.map((d) => d.pct));

  return (
    <div className="grid gap-6">
      <PaceDistributionChart data={running.paceDistribution} />
      <HeartRateZonesChart data={running.heartRateZones} />
      <PaceVsHeartChart data={running.paceVsHeart} />
      <TemperatureChart data={running.temperature} />
      <WeatherConditionsChart data={running.weatherConditions} />
      <AnnualMileageChart data={running.annualMileage} />
      <WorkoutTimeChart data={running.byHour} maxPct={maxHourPct} />
      <AverageDailyMileageChart data={running.byWeekday} maxPct={maxWeekdayPct} />
      <RunDistancesChart data={running.distanceBuckets} />
      <TreadmillOutdoorChart data={running.treadmillOutdoor} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:col-span-2">
        <StatesMap data={visits} onSelectState={setSelected} />
        <StateTable data={visits} selectedState={selected} onSelectState={setSelected} />
      </div>
    </div>
  );
}
