import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ProgressRingWithDelta,
  MiniSparkline,
  RingDetailDialog,
} from "@/components/dashboard";
import {
  useGarminData,
  useMostRecentActivity,
  useMonthlyStepsProjection,
} from "@/hooks/useGarminData";

export default function Dashboard() {
  type Metric = "steps" | "sleep" | "heartRate" | "calories";
  const data = useGarminData();
  const recentActivity = useMostRecentActivity();
  const [expanded, setExpanded] = useState<Metric | null>(null);

  if (!data) {
    return <p>Loading…</p>;
  }

  const handleKey = (
    e: React.KeyboardEvent<HTMLDivElement>,
    metric: Metric,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setExpanded(metric);
    }
  };

  const previousSteps = data.steps * 0.9;
  const previousSleep = data.sleep * 0.9;
  const previousHeartRate = data.heartRate * 0.9;
  const previousCalories = data.calories * 0.9;
  const sparkData: { date: string; value: number }[] = [];
  const monthly = useMonthlyStepsProjection();

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("steps")}
          onKeyDown={(e) => handleKey(e, "steps")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2 flex items-center gap-2">
            Steps
            {recentActivity && (
              <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium">
                {recentActivity.type}
              </span>
            )}
          </h2>
          <ProgressRingWithDelta
            label="Steps progress"
            value={(data.steps / 10000) * 100}
            current={data.steps}
            previous={previousSteps}
          />
          {monthly && (
            <div className="w-full mt-1" aria-label={`Projected ${Math.round(monthly.projectedTotal).toLocaleString()} steps`}>
              <div className="h-1 w-full bg-muted rounded">
                <div
                  className={`h-full rounded ${monthly.onTrack ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, monthly.pctOfGoal).toFixed(0)}%` }}
                />
              </div>
              <p
                className={`text-[10px] mt-1 ${monthly.onTrack ? 'text-green-600' : 'text-red-600'}`}
              >
                {monthly.onTrack ? 'On track' : 'Off track'}
              </p>
            </div>
          )}
          <span className="mt-2 text-lg font-bold">{data.steps}</span>
          <MiniSparkline data={sparkData} />
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("sleep")}
          onKeyDown={(e) => handleKey(e, "sleep")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Sleep (hrs)</h2>
          <ProgressRingWithDelta
            label="Sleep progress"
            value={(data.sleep / 8) * 100}
            current={data.sleep}
            previous={previousSleep}
          />
          <span className="mt-2 text-lg font-bold">{data.sleep}</span>
          <MiniSparkline data={sparkData} />
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("heartRate")}
          onKeyDown={(e) => handleKey(e, "heartRate")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Heart Rate</h2>
          <ProgressRingWithDelta
            label="Heart rate progress"
            value={(data.heartRate / 200) * 100}
            current={data.heartRate}
            previous={previousHeartRate}
          />
          <span className="mt-2 text-lg font-bold">{data.heartRate}</span>
          <MiniSparkline data={sparkData} />
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("calories")}
          onKeyDown={(e) => handleKey(e, "calories")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Calories</h2>
          <ProgressRingWithDelta
            label="Calories progress"
            value={(data.calories / 3000) * 100}
            current={data.calories}
            previous={previousCalories}
          />
          <span className="mt-2 text-lg font-bold">{data.calories}</span>
          <MiniSparkline data={sparkData} />
        </Card>
      </div>

      <RingDetailDialog metric={expanded} onClose={() => setExpanded(null)} />
    </div>
  );
}
