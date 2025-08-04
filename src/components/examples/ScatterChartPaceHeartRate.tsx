"use client";

import { TrendingUp } from "lucide-react";
import { generateTrendMessage } from "@/lib/utils";
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/ui/card";

// Generate demo data without per-point colouring
const scatterData = Array.from({ length: 200 }, () => {
  const pace = 6 + Math.random() * 2;
  const hr = 120 + Math.random() * 40;
  return {
    pace,
    hr,
  };
});

// Provide a single series colour matching the other demo charts
const chartConfig = {
  points: { color: "hsl(var(--chart-4))" },
  pace: { label: "Pace" },
  hr: { label: "Heart Rate" },
} as const;

export default function ScatterChartPaceHeartRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pace vs Heart Rate</CardTitle>
        <CardDescription>
          Correlation of effort and speed from recent runs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 md:h-80 lg:h-96">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pace" name="Pace (min/mi)" />
            <YAxis dataKey="hr" name="Heart Rate (bpm)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Scatter data={scatterData} fill="var(--color-points)" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm">
        {generateTrendMessage()} <TrendingUp className="h-4 w-4" />
      </CardFooter>
    </Card>
  );
}
