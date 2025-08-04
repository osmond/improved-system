import React, { useEffect, useState } from "react";
import CorrelationRippleMatrix from "@/components/visualizations/CorrelationRippleMatrix";
import { Button } from "@/ui/button";
import { SimpleSelect } from "@/ui/select";
import {
  getDailySteps,
  getDailySleep,
  getDailyHeartRate,
  getDailyCalories,
  type GarminDay,
  type MetricDay,
} from "@/lib/api";
import { Skeleton } from "@/ui/skeleton";
import useCorrelationMatrix, { type MetricPoint } from "@/hooks/useCorrelationMatrix";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/ui/card";

interface Metrics extends MetricPoint {
  steps: number;
  sleep: number;
  heartRate: number;
  calories: number;
}

interface MetricConfig {
  key: keyof Metrics;
  label: string;
}

interface MetricGroup {
  label: string;
  metrics: MetricConfig[];
}

const METRIC_GROUPS: MetricGroup[] = [
  {
    label: "Activity",
    metrics: [
      { key: "steps", label: "Steps" },
      { key: "calories", label: "Calories" },
    ],
  },
  {
    label: "Recovery",
    metrics: [
      { key: "sleep", label: "Sleep" },
      { key: "heartRate", label: "Heart Rate" },
    ],
  },
];

export default function StatisticsPage() {
  const [points, setPoints] = useState<Metrics[]>([]);
  const [displayMode, setDisplayMode] = useState<"upper" | "lower" | "full">("upper");
  const [showValues, setShowValues] = useState(false);

  useEffect(() => {
    async function load() {
      const [steps, sleep, heart, calories] = await Promise.all([
        getDailySteps(),
        getDailySleep(),
        getDailyHeartRate(),
        getDailyCalories(),
      ]);
      const byDate: Record<string, Partial<Metrics>> = {};
      steps.forEach((d: GarminDay) => {
        byDate[d.date] = { ...byDate[d.date], steps: d.steps };
      });
      sleep.forEach((d: MetricDay) => {
        byDate[d.date] = { ...byDate[d.date], sleep: d.value };
      });
      heart.forEach((d: MetricDay) => {
        byDate[d.date] = { ...byDate[d.date], heartRate: d.value };
      });
      calories.forEach((d: MetricDay) => {
        byDate[d.date] = { ...byDate[d.date], calories: d.value };
      });
      const merged = Object.values(byDate).filter(
        (p): p is Metrics =>
          p.steps !== undefined &&
          p.sleep !== undefined &&
          p.heartRate !== undefined &&
          p.calories !== undefined,
      );
      setPoints(merged);
    }
    load();
  }, []);

  const matrixObj = useCorrelationMatrix(points);

  const labels = METRIC_GROUPS.flatMap((g) => g.metrics.map((m) => m.label));
  const keys: (keyof Metrics)[] = METRIC_GROUPS.flatMap((g) =>
    g.metrics.map((m) => m.key),
  );
  const matrix = keys.map((k1) =>
    keys.map(
      (k2) => matrixObj?.[k1]?.[k2] ?? { value: 0, n: 0, p: 1 },
    ),
  );
  const groups = METRIC_GROUPS.map((g) => ({ label: g.label, size: g.metrics.length }));

  const correlations = [] as {
    labels: [string, string];
    value: number;
  }[];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const value = matrixObj?.[keys[i]]?.[keys[j]]?.value ?? 0;
      correlations.push({ labels: [labels[i], labels[j]], value });
    }
  }

  let topPositive = correlations[0];
  let topNegative = correlations[0];
  let mostChanging = correlations[0];
  for (const corr of correlations) {
    if (corr.value > topPositive.value) topPositive = corr;
    if (corr.value < topNegative.value) topNegative = corr;
    if (Math.abs(corr.value) > Math.abs(mostChanging.value)) mostChanging = corr;
  }

  if (!points.length) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Metric Correlations</h1>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">Metric Correlations</h1>
        <CardDescription>
          Correlation between daily steps, sleep, heart rate, and calories. Red
          squares indicate positive correlation while blue show negative. Color
          intensity reflects the strength, and clicking a square reveals a
          time-series drill-down.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <SimpleSelect
            value={displayMode}
            onValueChange={(v) =>
              setDisplayMode(v as "upper" | "lower" | "full")
            }
            options={[
              { value: "upper", label: "Upper Triangle" },
              { value: "lower", label: "Lower Triangle" },
              { value: "full", label: "Full Matrix" },
            ]}
            label="Display"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues((p) => !p)}
          >
            {showValues ? "Hide Values" : "Show Values"}
          </Button>
        </div>
        <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <li>
            <span className="font-medium">Top Positive:</span> {topPositive.labels[0]} &
            {" "}
            {topPositive.labels[1]} ({topPositive.value.toFixed(2)})
          </li>
          <li>
            <span className="font-medium">Top Negative:</span> {topNegative.labels[0]} &
            {" "}
            {topNegative.labels[1]} ({topNegative.value.toFixed(2)})
          </li>
          <li>
            <span className="font-medium">Most Changing:</span> {mostChanging.labels[0]} &
            {" "}
            {mostChanging.labels[1]} ({mostChanging.value.toFixed(2)})
          </li>
        </ul>
        <CorrelationRippleMatrix
          matrix={matrix}
          labels={labels}
          groups={groups}
          displayMode={displayMode}
          showValues={showValues}
          maxCellSize={80}
        />
      </CardContent>
    </Card>
  );
}

