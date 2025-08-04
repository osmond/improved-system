import React, { useEffect, useState } from "react";
import CorrelationRippleMatrix from "@/components/visualizations/CorrelationRippleMatrix";
import { Button } from "@/components/ui/button";
import {
  getDailySteps,
  getDailySleep,
  getDailyHeartRate,
  getDailyCalories,
  type GarminDay,
  type MetricDay,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import useCorrelationMatrix, { type MetricPoint } from "@/hooks/useCorrelationMatrix";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

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
  const [upperOnly, setUpperOnly] = useState(true);
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
  const matrix = keys.map((k1) => keys.map((k2) => matrixObj?.[k1]?.[k2] ?? 0));
  const groups = METRIC_GROUPS.map((g) => ({ label: g.label, size: g.metrics.length }));

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUpperOnly((p) => !p)}
          >
            {upperOnly ? "Show Full Matrix" : "Show Upper Triangle"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues((p) => !p)}
          >
            {showValues ? "Hide Values" : "Show Values"}
          </Button>
        </div>
        <CorrelationRippleMatrix
          matrix={matrix}
          labels={labels}
          groups={groups}
          upperOnly={upperOnly}
          showValues={showValues}
          maxCellSize={80}
        />
      </CardContent>
    </Card>
  );
}

