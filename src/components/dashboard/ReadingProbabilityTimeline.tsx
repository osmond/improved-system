"use client";
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
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import useReadingProbability from "@/hooks/useReadingProbability";
import { Skeleton } from "@/components/ui/skeleton";
import type { TooltipProps } from "recharts";

export default function ReadingProbabilityTimeline() {
  const data = useReadingProbability();

  if (!data) return <Skeleton className="h-64" />;

  const config = {
    probability: { label: "Probability", color: "hsl(var(--chart-1))" },
    intensity: { label: "Intensity", color: "hsl(var(--chart-2))" },
    highlight: { color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  const highAreas = data.reduce<{ x1: string; x2: string }[]>((acc, cur, i) => {
    if (cur.probability > 0.8) {
      const next = data[i + 1];
      acc.push({ x1: cur.time, x2: next ? next.time : cur.time });
    }
    return acc;
  }, []);

  function ReadingTooltip(props: TooltipProps<number, string>) {
    const { active, payload, label } = props;
    if (!(active && payload && payload.length)) return null;
    const start = new Date(label as string);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    const range = `${start.toLocaleTimeString([], { hour: "numeric" })}–${end.toLocaleTimeString([], { hour: "numeric" })}`;
    const prob = (payload.find((p) => p.dataKey === "probability")?.value as number) || 0;
    return (
      <ChartTooltipContent
        {...(props as any)}
        nameKey="probability"
        formatter={() => `${Math.round(prob * 100)}%`}
        labelFormatter={() => range}
      />
    );
  }

  return (
    <ChartCard title="Reading Probability" description="Likelihood of reading throughout the day">
      <ChartContainer config={config} className="h-64">
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={(t) => String(new Date(t).getHours())} />
          <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
          {highAreas.map((a, idx) => (
            <ReferenceArea
              key={idx}
              x1={a.x1}
              x2={a.x2}
              y1={0}
              y2={1}
              strokeOpacity={0}
              fill="var(--color-highlight)"
              fillOpacity={0.1}
            />
          ))}
          <ChartTooltip content={<ReadingTooltip />} />
          <Area type="monotone" dataKey="intensity" stroke={config.intensity.color} fill={config.intensity.color} fillOpacity={0.2} />
          <Line type="monotone" dataKey="probability" stroke={config.probability.color} dot={false} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
