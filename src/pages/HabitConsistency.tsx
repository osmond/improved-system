import React, { useState } from "react";
import { HabitConsistencyHeatmap } from "@/components/trends";
import { SimpleSelect } from "@/ui/select";

export default function HabitConsistencyPage() {
  const [timeframe, setTimeframe] = useState("12w");
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Habit Consistency</h1>
      <p className="text-sm text-muted-foreground">
        Session counts by weekday and hour illustrate your training habits.
      </p>
      <SimpleSelect
        label="Timeframe"
        value={timeframe}
        onValueChange={setTimeframe}
        options={[
          { value: "4w", label: "4 weeks" },
          { value: "12w", label: "12 weeks" },
          { value: "all", label: "All time" },
        ]}
      />
      <HabitConsistencyHeatmap timeframe={timeframe} />
    </div>
  );
}
