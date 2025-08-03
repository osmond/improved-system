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

interface Metrics extends MetricPoint {
  steps: number;
  sleep: number;
  heartRate: number;
  calories: number;
}

export default function StatisticsPage() {
  const [points, setPoints] = useState<Metrics[]>([]);
  const [upperOnly, setUpperOnly] = useState(true);

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
  const labels = ["Steps", "Sleep", "Heart Rate", "Calories"];
  const keys: (keyof Metrics)[] = ["steps", "sleep", "heartRate", "calories"];
  const matrix = keys.map((k1) => keys.map((k2) => matrixObj?.[k1]?.[k2] ?? 0));

  if (!points.length) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Metric Correlations</h1>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Metric Correlations</h1>
      <p className="text-xs text-muted-foreground">
        Correlation between daily steps, sleep, heart rate, and calories. Red
        squares indicate positive correlation while blue show negative. Color
        intensity reflects the strength, and clicking a square reveals a
        time-series drill-down.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setUpperOnly((p) => !p)}
      >
        {upperOnly ? "Show Full Matrix" : "Show Upper Triangle"}
      </Button>
      <CorrelationRippleMatrix
        matrix={matrix}
        labels={labels}
        upperOnly={upperOnly}
      />
    </div>
  );
}

