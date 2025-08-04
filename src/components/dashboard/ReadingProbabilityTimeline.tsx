"use client";
import React from "react";
import {
  ChartContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/ui/chart";
import useReadingProbability from "@/hooks/useReadingProbability";
import { Skeleton } from "@/ui/skeleton";
import type { TooltipProps } from "recharts";

export default function ReadingProbabilityTimeline() {
  const raw = useReadingProbability();

  const config = {
    probability: { label: "Probability", color: "hsl(var(--chart-1))" },
    confidence: { label: "Confidence", color: "hsl(var(--chart-2))" },
    deepDive: { color: "hsl(var(--chart-4))" },
    skim: { color: "hsl(var(--chart-5))" },
    panic: { color: "hsl(var(--chart-6))" },
  } satisfies ChartConfig;

  const data = React.useMemo(() => {
    if (!raw) return null;
    return raw.map((p) => {
      const spread = (1 - p.intensity) * 0.1;
      const lower = Math.max(0, p.probability - spread);
      const upper = Math.min(1, p.probability + spread);
      return { ...p, lower, river: upper - lower };
    });
  }, [raw]);

  const stateAreas = React.useMemo(() => {
    if (!raw) return [];
    const areas: { x1: string; x2: string; state: string }[] = [];
    let start: number | null = null;
    let curLabel = "";
    const key = (l: string) =>
      l === "Deep Dive" ? "deepDive" : l === "Skim" ? "skim" : l === "Page Turn Panic" ? "panic" : "";
    raw.forEach((d, i) => {
      const label = key(d.label);
      if (label !== curLabel) {
        if (start !== null && curLabel) {
          areas.push({ x1: raw[start].time, x2: d.time, state: curLabel });
        }
        start = i;
        curLabel = label;
      }
      if (i === raw.length - 1 && start !== null && curLabel) {
        areas.push({ x1: raw[start].time, x2: d.time, state: curLabel });
      }
    });
    return areas;
  }, [raw]);

  if (!data) return <Skeleton className="h-64" />;

  function ReadingTooltip(props: TooltipProps<number, string>) {
    const { active, payload, label } = props;
    if (!(active && payload && payload.length)) return null;
    const start = new Date(label as string);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    const range = `${start.toLocaleTimeString([], { hour: "numeric" })}–${end.toLocaleTimeString([], { hour: "numeric" })}`;
    return (
      <ChartTooltipContent
        {...(props as any)}
        nameKey="probability"
        formatter={(value) => `${Math.round((value as number) * 100)}%`}
        labelFormatter={() => range}
      />
    );
  }

  return (
    <ChartCard title="Reading Probability" description="Likelihood of reading throughout the day">
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={(t) => String(new Date(t).getHours())} />
          <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
          {stateAreas.map((a, idx) => (
            <ReferenceArea
              key={idx}
              x1={a.x1}
              x2={a.x2}
              y1={0}
              y2={1}
              strokeOpacity={0}
              fill={`var(--color-${a.state})`}
              fillOpacity={0.08}
            />
          ))}
          <ChartTooltip content={<ReadingTooltip />} />
          <Area
            type="monotone"
            dataKey="lower"
            stackId="confidence"
            stroke="none"
            fillOpacity={0}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="river"
            stackId="confidence"
            stroke="none"
            fill={config.confidence.color}
            fillOpacity={0.15}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="probability"
            stroke={config.probability.color}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
