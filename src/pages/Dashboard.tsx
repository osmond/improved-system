import React from "react";
import {
  StepsTrendWithGoal,
  ActivitiesChart,
  WeeklyVolumeChart,
  TimeInBedChart,
  ReadingProbabilityTimeline,
  ReadingStackSplit,
  TopInsights,
  BooksVsCalories,
  RunSoundtrackCard,
  ChartSelectionProvider,
} from "@/components/dashboard";
import {
  PaceVsHR,
  RunBikeVolumeComparison,
  TrainingLoadRatio,
  ActivityByTime,
  TreadmillVsOutdoor,
  AnnualMileage,
} from "@/components/statistics";
import { GeoActivityExplorer } from "@/components/map";
import { useGarminDays } from "@/hooks/useGarminData";
import useDashboardFilters, { ActivityType, DateRange } from "@/hooks/useDashboardFilters";
import { SimpleSelect } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const days = useGarminDays();
  const filters = useDashboardFilters();

  if (!days) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    );
  }

  return (
    <ChartSelectionProvider>
      <div className="space-y-8">
        <div className="sticky top-0 z-10 flex flex-wrap gap-4 bg-background/80 p-2 backdrop-blur">
          <SimpleSelect
            label="Activity"
            value={filters.activity}
            onValueChange={(v) => filters.setActivity(v as ActivityType)}
            options={[
              { value: "all", label: "All" },
              { value: "run", label: "Run" },
              { value: "bike", label: "Bike" },
              { value: "walk", label: "Walk" },
            ]}
          />
          <SimpleSelect
            label="Range"
            value={filters.range}
            onValueChange={(v) => filters.setRange(v as DateRange)}
            options={[
              { value: "7d", label: "7 Days" },
              { value: "30d", label: "30 Days" },
              { value: "90d", label: "90 Days" },
            ]}
          />
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Overview</h2>
          <TopInsights />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StepsTrendWithGoal data={days} />
            <ActivitiesChart />
            <WeeklyVolumeChart />
            <TimeInBedChart />
            <ReadingProbabilityTimeline />
            <ReadingStackSplit />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Performance</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RunBikeVolumeComparison />
            <TrainingLoadRatio />
            <PaceVsHR />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Habits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActivityByTime />
            <TreadmillVsOutdoor />
            <AnnualMileage />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Balance</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BooksVsCalories />
            <RunSoundtrackCard />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">History</h2>
          <div className="grid gap-4">
            <GeoActivityExplorer />
          </div>
        </section>
      </div>
    </ChartSelectionProvider>
  );
}

