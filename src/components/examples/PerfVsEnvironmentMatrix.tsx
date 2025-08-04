"use client";

import React, { useState, useMemo } from "react";
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";
import ChartCard from "@/components/dashboard/ChartCard";
import { SimpleSelect } from "@/ui/select";

interface PerfPoint {
  pace: number;
  power: number;
  temperature: number;
  humidity: number;
  wind: number;
  elevation: number;
}

function generateData(count = 50): PerfPoint[] {
  return Array.from({ length: count }, () => {
    const pace = 6 + Math.random() * 2; // 6-8 min/mi
    const power = 250 - pace * 20 + Math.random() * 10;
    return {
      pace: +pace.toFixed(2),
      power: Math.round(power),
      temperature: Math.round(40 + pace * 5 + Math.random() * 10),
      humidity: Math.round(40 + Math.random() * 50),
      wind: +(Math.random() * 20).toFixed(1),
      elevation: Math.round(Math.random() * 300),
    };
  });
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

const DATA = generateData();

const config = {
  points: { color: "hsl(var(--chart-4))" },
  pace: { label: "Pace" },
  trend: { label: "Trend", color: "hsl(var(--chart-2))" },
} as const;

export default function PerfVsEnvironmentMatrixExample() {
  const [variable, setVariable] = useState(
    "temperature" as "temperature" | "humidity" | "wind" | "elevation",
  );

  const axisLabels = {
    temperature: "Temp (F)",
    humidity: "Humidity (%)",
    wind: "Wind (mph)",
    elevation: "Elevation (ft)",
  };

  const trend = useMemo(() => regression(DATA, variable, "pace"), [variable]);

  return (
    <ChartCard
      title="Performance vs Environment"
      description="How pace varies with conditions like temperature, wind, or elevation"
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
      <ChartContainer config={config} className="h-60 md:h-80 lg:h-96">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={variable} name={axisLabels[variable]} />
          <YAxis dataKey="pace" name="Pace (min/mi)" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Scatter data={DATA} fill="var(--color-points)" />
          <Line data={trend} stroke="var(--color-trend)" dot={false} />
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  );
}
