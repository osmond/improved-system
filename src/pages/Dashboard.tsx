import React, { useEffect, useState, useMemo } from "react";
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


  const [stepGoal, setStepGoalState] = useState(10000)
  const [sleepGoal, setSleepGoalState] = useState(8)
  const [heartGoal, setHeartGoalState] = useState(200)
  const [calorieGoal, setCalorieGoalState] = useState(3000)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const sg = localStorage.getItem('stepGoal')
    if (sg) {
      const n = parseInt(sg, 10)
      if (!Number.isNaN(n)) setStepGoalState(n)
    }
    const sl = localStorage.getItem('sleepGoal')
    if (sl) {
      const n = parseInt(sl, 10)
      if (!Number.isNaN(n)) setSleepGoalState(n)
    }
    const hg = localStorage.getItem('heartGoal')
    if (hg) {
      const n = parseInt(hg, 10)
      if (!Number.isNaN(n)) setHeartGoalState(n)
    }
    const cg = localStorage.getItem('calorieGoal')
    if (cg) {
      const n = parseInt(cg, 10)
      if (!Number.isNaN(n)) setCalorieGoalState(n)
    }
  }, [])

  const setStepGoal = (n: number) => {
    setStepGoalState(n)
    localStorage.setItem('stepGoal', String(n))
  }
  const setSleepGoal = (n: number) => {
    setSleepGoalState(n)
    localStorage.setItem('sleepGoal', String(n))
  }
  const setHeartGoal = (n: number) => {
    setHeartGoalState(n)
    localStorage.setItem('heartGoal', String(n))
  }
  const setCalorieGoal = (n: number) => {
    setCalorieGoalState(n)
    localStorage.setItem('calorieGoal', String(n))
  }


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
  const stepContext = stepInsights
    ? `${stepInsights.vsYesterday >= 0 ? '+' : ''}${(stepInsights.vsYesterday * 100).toFixed(0)}% vs yesterday • ${stepInsights.vs7DayAvg >= 0 ? '+' : ''}${(stepInsights.vs7DayAvg * 100).toFixed(0)}% vs 7d avg`
    : undefined;

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
