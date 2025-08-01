import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ProgressRingWithDelta,
  MiniSparkline,
  RingDetailDialog,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import {
  useGarminData,
  useMostRecentActivity,
  useGarminDays,
} from "@/hooks/useGarminData";
import useStepInsights from "@/hooks/useStepInsights";
import useInsights from "@/hooks/useInsights";
import { Flame, HeartPulse, Moon, Pizza } from "lucide-react";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import { GeoActivityExplorer } from "@/components/map";


export default function Dashboard() {
  type Metric = "steps" | "sleep" | "heartRate" | "calories";
  const data = useGarminData();
  const days = useGarminDays();
  const stepInsights = useStepInsights(days);
  const recentActivity = useMostRecentActivity();
  const insights = useInsights();
  const [expanded, setExpanded] = useState<Metric | null>(null);
  const [dismissed, setDismissed] = useState<{ pace: boolean; day: boolean }>({
    pace: false,
    day: false,
  });

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    )
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

  const previousSteps = days && days.length > 1 ? days[days.length - 2].steps : data.steps * 0.9;
  const previousSleep = data.sleep * 0.9;
  const previousHeartRate = data.heartRate * 0.9;
  const previousCalories = data.calories * 0.9;
  const sparkData: { date: string; value: number }[] = [];
  const lastSyncedMinutes = minutesSince(data.lastSync);

  const monthly = stepInsights?.monthly;
  const stepContext = stepInsights
    ? `${stepInsights.vsYesterday >= 0 ? '+' : ''}${(stepInsights.vsYesterday * 100).toFixed(0)}% vs yesterday • ${stepInsights.vs7DayAvg >= 0 ? '+' : ''}${(stepInsights.vs7DayAvg * 100).toFixed(0)}% vs 7d avg`
    : undefined;

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
            <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Steps progress"
            value={(data.steps / 10000) * 100}
            current={data.steps}
            previous={previousSteps}
            tertiary={stepContext}
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
          {insights && insights.activeStreak >= 3 && (
            <Flame
              className="h-4 w-4 text-orange-600 mt-1"
              aria-label={`${insights.activeStreak}-day streak`}
            />
          )}
          {insights && insights.bestPaceThisMonth && !dismissed.pace && (
            <div className="mt-1 text-[10px] flex items-center gap-1">
              <Badge>
                Best pace {insights.bestPaceThisMonth.toFixed(2)}
              </Badge>
              <button
                className="text-muted-foreground"
                onClick={() => setDismissed({ ...dismissed, pace: true })}
                aria-label="Dismiss best pace message"
              >
                ×
              </button>
              <button
                className="underline text-muted-foreground"
                onClick={() => setExpanded("steps")}
              >
                Learn more
              </button>
            </div>
          )}
          {insights && insights.mostConsistentDay && !dismissed.day && (
            <div className="mt-1 text-[10px] flex items-center gap-1">
              <Badge>
                Consistent on {insights.mostConsistentDay}
              </Badge>
              <button
                className="text-muted-foreground"
                onClick={() => setDismissed({ ...dismissed, day: true })}
                aria-label="Dismiss consistent day message"
              >
                ×
              </button>
              <button
                className="underline text-muted-foreground"
                onClick={() => setExpanded("steps")}
              >
                Learn more
              </button>
            </div>
          )}
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("sleep")}
          onKeyDown={(e) => handleKey(e, "sleep")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Sleep (hrs)</h2>
            <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Sleep progress"
            value={(data.sleep / 8) * 100}
            current={data.sleep}
            previous={previousSleep}
          />
          <span className="mt-2 text-lg font-bold">{data.sleep}</span>
          <MiniSparkline data={sparkData} />
          {insights && insights.lowSleep && (
            <Moon
              className="h-4 w-4 text-yellow-500 mt-1"
              aria-label="Low sleep"
            />
          )}
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("heartRate")}
          onKeyDown={(e) => handleKey(e, "heartRate")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Heart Rate</h2>
            <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Heart rate progress"
            value={(data.heartRate / 200) * 100}
            current={data.heartRate}
            previous={previousHeartRate}
          />
          <span className="mt-2 text-lg font-bold">{data.heartRate}</span>
          <MiniSparkline data={sparkData} />
          {insights && insights.highHeartRate && (
            <HeartPulse
              className="h-4 w-4 text-red-600 mt-1"
              aria-label="High heart rate"
            />
          )}
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("calories")}
          onKeyDown={(e) => handleKey(e, "calories")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Calories</h2>
            <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Calories progress"
            value={(data.calories / 3000) * 100}
            current={data.calories}
            previous={previousCalories}
          />
          <span className="mt-2 text-lg font-bold">{data.calories}</span>
          <MiniSparkline data={sparkData} />
          {insights && insights.calorieSurplus && (
            <Pizza
              className="h-4 w-4 text-amber-600 mt-1"
              aria-label="Calorie surplus"
            />
          )}
        </Card>
      </div>

      <RingDetailDialog metric={expanded} onClose={() => setExpanded(null)} />
      <Examples />
      <GeoActivityExplorer />
    </div>
  );
}
