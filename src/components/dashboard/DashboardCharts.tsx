import React from "react";
import StepsTrendWithGoal from "./StepsTrendWithGoal";
import { DailyStepsChart } from "./DailyStepsChart";
import { ActivitiesChart } from "./ActivitiesChart";
import WeeklyVolumeChart from "./WeeklyVolumeChart";
import { useGarminDays } from "@/hooks/useGarminData";
import { Skeleton } from "@/ui/skeleton";

export default function DashboardCharts() {
  const days = useGarminDays();

  if (!days) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-60 md:col-span-2" />
        <Skeleton className="h-60" />
        <Skeleton className="h-60" />
        <Skeleton className="h-60" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StepsTrendWithGoal data={days} />
      <DailyStepsChart data={days} />
      <ActivitiesChart />
      <WeeklyVolumeChart />
    </div>
  );
}
