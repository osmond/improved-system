import React from "react";
import { HabitConsistencyHeatmap } from "@/components/trends";
import useTrainingConsistency from "@/hooks/useTrainingConsistency";
import { Skeleton } from "@/ui/skeleton";
import { SimpleSelect } from "@/ui/select";
import {
  ChartContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ChartTooltip,
} from "@/ui/chart";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HabitConsistencyPage() {
  const [timeframe, setTimeframe] = React.useState("30d");
  const { data, error } = useTrainingConsistency(timeframe);

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Habit Consistency</h1>
        <p className="text-sm text-muted-foreground">
          Session counts by weekday and hour illustrate your training habits.
        </p>
        <div className="text-sm text-destructive">Failed to load training data</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Habit Consistency</h1>
        <p className="text-sm text-muted-foreground">
          Session counts by weekday and hour illustrate your training habits.
        </p>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const entropyMax = Math.log2(168);
  const consistencySeries = data.weeklyEntropy.map((e, i) => ({
    week: i + 1,
    score: 1 - e / entropyMax,
  }));

  const weekendSessions = data.sessions.filter((s) => {
    const d = new Date(s.start ?? s.date);
    const day = d.getDay();
    return day === 0 || day === 6;
  }).length;
  let prompt: string | null = null;
  if (weekendSessions === 0) {
    prompt = "Consider adding weekend sessions.";
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Habit Consistency</h1>
      <p className="text-sm text-muted-foreground">
        Session counts by weekday and hour illustrate your training habits.
      </p>
      <SimpleSelect
        value={timeframe}
        onValueChange={(v) => setTimeframe(v)}
        options={[
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
          { value: "90d", label: "Last 90 days" },
          { value: "all", label: "All time" },
        ]}
        label="Timeframe"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>Consistency Score: {data.consistencyScore.toFixed(2)}</div>
        <div>Most Consistent Day: {dayLabels[data.mostConsistentDay]}</div>
        <div>
          Preferred Training Hour: {" "}
          {data.preferredTrainingHour.toString().padStart(2, "0")}:00
        </div>
      </div>
      {prompt && (
        <p className="text-sm text-muted-foreground">{prompt}</p>
      )}
      <HabitConsistencyHeatmap heatmap={data.heatmap} timeframe={timeframe} />
      <ChartContainer config={{}} className="h-32">
        <LineChart
          data={consistencySeries}
          margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 1]} hide />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--chart-1))"
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
