import React, { useMemo, useState } from "react";
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart";
import ChartCard from "@/components/dashboard/ChartCard";
import { useRunningStats } from "@/hooks/useRunningStats";
import { SimpleSelect } from "@/components/ui/select";

interface PerfPoint {
  pace: number;
  power: number;
  temperature: number;
  humidity: number;
  wind: number;
  elevation: number;
}

function mapPoint(
  pace: number,
  temperature: number,
  humidity: number,
  wind: number,
  elevation: number,
): PerfPoint {
  const power = 250 - pace * 20 + Math.random() * 10;
  return {
    pace: +pace.toFixed(2),
    power: Math.round(power),
    temperature,
    humidity,
    wind,
    elevation,
  };
}

function regression(
  data: PerfPoint[],
  xKey: keyof PerfPoint,
  yKey: keyof PerfPoint,
): { [k in keyof PerfPoint]?: number }[] {
  const xs = data.map((d) => d[xKey] as number);
  const ys = data.map((d) => d[yKey] as number);
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return [
    { [xKey]: minX, [yKey]: intercept + slope * minX },
    { [xKey]: maxX, [yKey]: intercept + slope * maxX },
  ];
}

export default function PerfVsEnvironmentMatrix() {
  const stats = useRunningStats();
  const [variable, setVariable] = useState(
    "temperature" as "temperature" | "humidity" | "wind" | "elevation",
  );
  const DATA = useMemo(() => {
    if (!stats) return [];
    return stats.paceEnvironment.map((p) =>
      mapPoint(p.pace, p.temperature, p.humidity, p.wind, p.elevation),
    );
  }, [stats]);

  const config = {
    points: { color: "hsl(var(--chart-4))" },
    pace: { label: "Pace" },
    trend: { label: "Trend", color: "hsl(var(--chart-3))" },
  } as const;

  const axisLabels = {
    temperature: "Temp (F)",
    humidity: "Humidity (%)",
    wind: "Wind (mph)",
    elevation: "Elevation (ft)",
  };

  const trend = useMemo(
    () => regression(DATA, variable, "pace"),
    [DATA, variable],
  );

  return (
    <ChartCard
      title="Perf vs Environment"
      description="How pace varies with weather conditions"
      className="space-y-4"
    >
      <SimpleSelect
        value={variable}
        onValueChange={(v) => setVariable(v as typeof variable)}
        options={[
          { value: "temperature", label: "Temperature" },
          { value: "humidity", label: "Humidity" },
          { value: "wind", label: "Wind" },
          { value: "elevation", label: "Elevation" },
        ]}
      />
      <ChartContainer config={config} className="h-60">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={variable} name={axisLabels[variable]} />
          <YAxis dataKey="pace" name="Pace (min/mi)" />
          <ChartTooltip />
          <Scatter data={DATA} fill="var(--color-points)" />
          <Line data={trend} stroke={config.trend.color} dot={false} />
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  );
}
