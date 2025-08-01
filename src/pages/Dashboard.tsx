import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ProgressRingWithDelta,
  MiniSparkline,
  RingDetailDialog,
} from "@/components/dashboard";
import { TopInsights } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import {
  useGarminData,
  useMostRecentActivity,
  useGarminDays,
} from "@/hooks/useGarminData";
import useStepInsights from "@/hooks/useStepInsights";
import useInsights from "@/hooks/useInsights";

import useSleepInsights from "@/hooks/useSleepInsights";
import useHeartRateInsights from "@/hooks/useHeartRateInsights";
import useCalorieInsights from "@/hooks/useCalorieInsights";
import useUserGoals from "@/hooks/useUserGoals";

import { Flame, HeartPulse, Moon, Pizza, Pencil } from "lucide-react";
import { minutesSince } from "@/lib/utils";
import Examples from "@/pages/Examples";
import { GeoActivityExplorer } from "@/components/map";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SimpleSelect } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useDashboardFilters, {
  type ActivityType,
  type DateRange,
} from "@/hooks/useDashboardFilters";


export default function Dashboard() {
  type Metric = "steps" | "sleep" | "heartRate" | "calories";
  const data = useGarminData();


  const {
    dailyStepGoal: stepGoal,
    setDailyStepGoal: setStepGoal,
    sleepGoal,
    setSleepGoal,
    heartRateGoal: heartGoal,
    setHeartRateGoal: setHeartGoal,
    calorieGoal,
    setCalorieGoal,
  } = useUserGoals()
  const [activeTab, setActiveTab] = useState("dashboard")


  const days = useGarminDays();
  const { activity, setActivity, range, setRange } = useDashboardFilters();

  const filteredDays = useMemo(() => {
    if (!days) return null;
    const count = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const start = new Date();
    start.setDate(start.getDate() - count);
    return days.filter((d) => new Date(d.date) >= start);
  }, [days, range]);

  const stepInsights = useStepInsights(filteredDays, stepGoal);
  const sleepInsights = useSleepInsights();
  const heartRateInsights = useHeartRateInsights();
  const calorieInsights = useCalorieInsights();


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

  const previousSteps =
    filteredDays && filteredDays.length > 1
      ? filteredDays[filteredDays.length - 2].steps
      : data.steps * 0.9;
  const previousSleep = data.sleep * 0.9;
  const previousHeartRate = data.heartRate * 0.9;
  const previousCalories = data.calories * 0.9;
  const sparkData = (filteredDays ?? [])
    .slice(-14)
    .map((d) => ({ date: d.date, value: d.steps }));
  const lastSyncedMinutes = minutesSince(data.lastSync);

  const monthly = stepInsights?.monthly;
  const stepDeltas =
    stepInsights && [
      { value: stepInsights.vsYesterday, label: 'vs yesterday' },
      { value: stepInsights.vs7DayAvg, label: 'vs 7d avg' },
    ];
  const sleepDeltas =
    sleepInsights && [
      { value: sleepInsights.vsYesterday, label: 'vs yesterday' },
      { value: sleepInsights.vs7DayAvg, label: 'vs 7d avg' },
    ];
  const heartDeltas =
    heartRateInsights && [
      { value: heartRateInsights.vsYesterday, label: 'vs yesterday' },
      { value: heartRateInsights.vs7DayAvg, label: 'vs 7d avg' },
    ];
  const calorieDeltas =
    calorieInsights && [
      { value: calorieInsights.vsYesterday, label: 'vs yesterday' },
      { value: calorieInsights.vs7DayAvg, label: 'vs 7d avg' },
    ];

  // screen reader summaries for the rings
  const stepsDelta = previousSteps === 0 ? 0 : (data.steps - previousSteps) / previousSteps;
  const stepsSummaryParts = [
    `${data.steps.toLocaleString()} steps`,
    `${stepsDelta >= 0 ? '+' : ''}${(stepsDelta * 100).toFixed(1)}% vs yesterday`,
    data.steps >= stepGoal ? 'goal met' : 'goal not met',
  ];
  if (insights && insights.activeStreak >= 3) {
    stepsSummaryParts.push(`${insights.activeStreak}-day streak`);
  }
  if (insights && insights.bestPaceThisMonth && !dismissed.pace) {
    stepsSummaryParts.push(`Best pace ${insights.bestPaceThisMonth.toFixed(2)}`);
  }
  if (insights && insights.mostConsistentDay && !dismissed.day) {
    stepsSummaryParts.push(`Consistent on ${insights.mostConsistentDay}`);
  }
  const stepsSummary = stepsSummaryParts.join('. ');

  const sleepDelta = (data.sleep - previousSleep) / previousSleep;
  const sleepSummaryParts = [
    `${data.sleep.toLocaleString()} hours sleep`,
    `${sleepDelta >= 0 ? '+' : ''}${(sleepDelta * 100).toFixed(1)}% vs yesterday`,
    data.sleep >= sleepGoal ? 'goal met' : 'goal not met',
  ];
  if (insights && insights.lowSleep) {
    sleepSummaryParts.push('Low sleep');
  }
  const sleepSummary = sleepSummaryParts.join('. ');

  const heartDelta = (data.heartRate - previousHeartRate) / previousHeartRate;
  const heartSummaryParts = [
    `${data.heartRate.toLocaleString()} bpm`,
    `${heartDelta >= 0 ? '+' : ''}${(heartDelta * 100).toFixed(1)}% vs yesterday`,
    data.heartRate <= heartGoal ? 'within goal' : 'over goal',
  ];
  if (insights && insights.highHeartRate) {
    heartSummaryParts.push('High heart rate');
  }
  const heartSummary = heartSummaryParts.join('. ');

  const calorieDelta = (data.calories - previousCalories) / previousCalories;
  const calorieSummaryParts = [
    `${data.calories.toLocaleString()} calories`,
    `${calorieDelta >= 0 ? '+' : ''}${(calorieDelta * 100).toFixed(1)}% vs yesterday`,
    data.calories <= calorieGoal ? 'within goal' : 'over goal',
  ];
  if (insights && insights.calorieSurplus) {
    calorieSummaryParts.push('Calorie surplus');
  }
  const calorieSummary = calorieSummaryParts.join('. ');

  const summaries: Record<Metric, string> = {
    steps: stepsSummary,
    sleep: sleepSummary,
    heartRate: heartSummary,
    calories: calorieSummary,
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <div className="grid gap-4">
          <TopInsights />
      <div className="flex gap-4">
        <SimpleSelect
          label="Activity"
          value={activity}
          onValueChange={(v) => setActivity(v as ActivityType)}
          options={[
            { value: 'all', label: 'All' },
            { value: 'run', label: 'Run' },
            { value: 'bike', label: 'Bike' },
            { value: 'walk', label: 'Walk' },
          ]}
        />
        <SimpleSelect
          label="Range"
          value={range}
          onValueChange={(v) => setRange(v as DateRange)}
          options={[
            { value: '90d', label: 'Last 90 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '7d', label: 'Last 7 days' },
          ]}
        />
      </div>
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
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Edit steps goal" className="ml-1">
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    const val = parseInt(fd.get('goal') as string, 10)
                    if (!Number.isNaN(val)) setStepGoal(val)
                  }}
                  className="grid gap-2"
                >
                  <label className="text-xs" htmlFor="goal">Daily goal</label>
                  <input
                    id="goal"
                    name="goal"
                    type="number"
                    defaultValue={stepGoal}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button type="submit" className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
                    Save
                  </button>
                </form>
              </PopoverContent>
            </Popover>
          </h2>
            <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Steps progress"
            value={(data.steps / stepGoal) * 100}
            current={data.steps}
            previous={previousSteps}
            goal={100}
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
          <p className="sr-only" aria-live="polite">{stepsSummary}</p>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("sleep")}
          onKeyDown={(e) => handleKey(e, "sleep")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2 flex items-center gap-2">
            Sleep (hrs)
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Edit sleep goal" className="ml-1">
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    const val = parseInt(fd.get('goal') as string, 10)
                    if (!Number.isNaN(val)) setSleepGoal(val)
                  }}
                  className="grid gap-2"
                >
                  <label className="text-xs" htmlFor="sleepGoal">Daily goal</label>
                  <input
                    id="sleepGoal"
                    name="goal"
                    type="number"
                    defaultValue={sleepGoal}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button type="submit" className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
                    Save
                  </button>
                </form>
              </PopoverContent>
            </Popover>
          </h2>
          <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Sleep progress"
            value={(data.sleep / sleepGoal) * 100}
            current={data.sleep}
            previous={previousSleep}

            goal={100}

          />
          <span className="mt-2 text-lg font-bold">{data.sleep}</span>
          <MiniSparkline data={sparkData} />
          {insights && insights.lowSleep && (
            <Moon
              className="h-4 w-4 text-yellow-500 mt-1"
              aria-label="Low sleep"
            />
          )}
          <p className="sr-only" aria-live="polite">{sleepSummary}</p>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("heartRate")}
          onKeyDown={(e) => handleKey(e, "heartRate")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2 flex items-center gap-2">
            Heart Rate
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Edit heart rate goal" className="ml-1">
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    const val = parseInt(fd.get('goal') as string, 10)
                    if (!Number.isNaN(val)) setHeartGoal(val)
                  }}
                  className="grid gap-2"
                >
                  <label className="text-xs" htmlFor="hrGoal">Max HR</label>
                  <input
                    id="hrGoal"
                    name="goal"
                    type="number"
                    defaultValue={heartGoal}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button type="submit" className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
                    Save
                  </button>
                </form>
              </PopoverContent>
            </Popover>
          </h2>
          <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Heart rate progress"
            value={(data.heartRate / heartGoal) * 100}
            current={data.heartRate}
            previous={previousHeartRate}

            goal={100}

          />
          <span className="mt-2 text-lg font-bold">{data.heartRate}</span>
          <MiniSparkline data={sparkData} />
          {insights && insights.highHeartRate && (
            <HeartPulse
              className="h-4 w-4 text-red-600 mt-1"
              aria-label="High heart rate"
            />
          )}
          <p className="sr-only" aria-live="polite">{heartSummary}</p>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("calories")}
          onKeyDown={(e) => handleKey(e, "calories")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2 flex items-center gap-2">
            Calories
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Edit calories goal" className="ml-1">
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const fd = new FormData(e.currentTarget)
                    const val = parseInt(fd.get('goal') as string, 10)
                    if (!Number.isNaN(val)) setCalorieGoal(val)
                  }}
                  className="grid gap-2"
                >
                  <label className="text-xs" htmlFor="calGoal">Daily goal</label>
                  <input
                    id="calGoal"
                    name="goal"
                    type="number"
                    defaultValue={calorieGoal}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button type="submit" className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
                    Save
                  </button>
                </form>
              </PopoverContent>
            </Popover>
          </h2>
          <p className="text-[10px] text-muted-foreground">Last synced {lastSyncedMinutes} min ago</p>
          <ProgressRingWithDelta
            label="Calories progress"
            value={(data.calories / calorieGoal) * 100}
            current={data.calories}
            previous={previousCalories}

            goal={100}

          />
          <span className="mt-2 text-lg font-bold">{data.calories}</span>
          <MiniSparkline data={sparkData} />
          {insights && insights.calorieSurplus && (
            <Pizza
              className="h-4 w-4 text-amber-600 mt-1"
              aria-label="Calorie surplus"
            />
          )}
          <p className="sr-only" aria-live="polite">{calorieSummary}</p>
        </Card>
      </div>

          <RingDetailDialog
            metric={expanded}
            onClose={() => setExpanded(null)}
            summary={expanded ? summaries[expanded] : undefined}
          />
        </div>
      </TabsContent>

      <TabsContent value="map">
        <GeoActivityExplorer />
      </TabsContent>

      <TabsContent value="examples">
        <Examples />
      </TabsContent>
    </Tabs>
  );
}
