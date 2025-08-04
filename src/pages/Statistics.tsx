import React, { useEffect, useState } from "react";
import CorrelationRippleMatrix from "@/components/visualizations/CorrelationRippleMatrix";
import CorrelationList from "@/components/statistics/CorrelationList";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [showValues, setShowValues] = useState(false);
  const isMobile = useIsMobile();

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

  const pairs = keys.flatMap((k1, i) =>
    keys.slice(i + 1).map((k2, j) => ({
      label1: labels[i],
      label2: labels[i + 1 + j],
      value: matrixObj?.[k1]?.[k2] ?? 0,
      series: points.map((p) => ({ a: p[k1], b: p[k2] })),
    }))
  );
  const topPairs = [...pairs]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5);

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Metric Correlations</h1>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  aria-label="How to read this"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Each value represents the correlation coefficient between two
                metrics. Red indicates positive correlation, blue negative. Tap
                a cell for a detailed time-series view.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Correlation between daily steps, sleep, heart rate, and calories. Red
          squares indicate positive correlation while blue show negative. Color
          intensity reflects the strength, and clicking a square reveals a
          time-series drill-down.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMobile ? (
          <CorrelationList pairs={topPairs} />
        ) : (
          <>
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
              upperOnly={upperOnly}
              showValues={showValues}
              maxCellSize={80}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

