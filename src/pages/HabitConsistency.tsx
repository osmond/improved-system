import React from "react";
import { HabitConsistencyHeatmap } from "@/components/trends";

export default function HabitConsistencyPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Habit Consistency</h1>
      <p className="text-sm text-muted-foreground">
        Session counts by weekday and hour illustrate your training habits.
      </p>
      <HabitConsistencyHeatmap />
    </div>
  );
}
