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
          maxCellSize={80}
        />
      </CardContent>
    </Card>
  );
}

