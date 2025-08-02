import React from "react";
import HabitConsistencyHeatmap from "@/components/statistics/HabitConsistencyHeatmap";

export default function HabitConsistencyPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Habit consistency</h2>
      <p className="text-sm text-muted-foreground">Session count by weekday and hour.</p>
      <HabitConsistencyHeatmap />
    </div>
  );
}
