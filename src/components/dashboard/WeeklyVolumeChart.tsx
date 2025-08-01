"use client";
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Brush,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import useWeeklyVolume from "@/hooks/useWeeklyVolume";
import { useChartSelection } from "./ChartSelectionContext";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeeklyVolumeChart() {
  const data = useWeeklyVolume();
  const { range, setRange } = useChartSelection();

  useEffect(() => {
    if (data && range.start === null && range.end === null && data.length) {
      setRange({ start: data[0].week, end: data[data.length - 1].week });
    }
  }, [data]);

  if (!data) return <Skeleton className="h-64" />;

  const config = {
    miles: { label: "Miles", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title="Weekly Volume">
      <ChartContainer config={config} className="h-64">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <ChartTooltip />
          <Bar dataKey="miles" fill="var(--color-miles)" radius={2} animationDuration={300} />
          <Brush
            dataKey="week"
            height={20}
            travellerWidth={10}
            onChange={(e) => {
              if (e && data[e.startIndex] && data[e.endIndex]) {
                setRange({ start: data[e.startIndex].week, end: data[e.endIndex].week });
              }
            }}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
