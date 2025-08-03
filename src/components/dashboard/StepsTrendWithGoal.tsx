import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import type { GarminDay } from "@/lib/api";
import React, { useMemo } from "react";
import { useSeasonalBaseline } from "@/hooks/useGarminData";
import { useRunningStats } from "@/hooks/useRunningStats";
import { Info } from "lucide-react";
import type { TooltipProps } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

export interface StepsTrendWithGoalProps {
  data: GarminDay[];
  /** Goal for ReferenceLine */
  goal?: number;
  /** Window size for moving average */
  window?: number;
}

export function StepsTrendWithGoal({
  data,
  goal = 10000,
  window = 7,
}: StepsTrendWithGoalProps) {
  const uid = React.useId().replace(/:/g, '')
  const fillStepsId = `fillSteps-${uid}`
  const dataWithAvg = useMemo(() => {
    return data.map((d, idx) => {
      const start = Math.max(0, idx - window + 1)
      const slice = data.slice(start, idx + 1)
      const avg = slice.reduce((sum, val) => sum + val.steps, 0) / slice.length
      const prev = idx === 0 ? d.steps : data[idx - 1].steps
      return { ...d, avg, prev }
    })
  }, [data, window])

  const baselines = useSeasonalBaseline();
  const stats = useRunningStats();
  const prefersReducedMotion = usePrefersReducedMotion();
  const weatherNote = useMemo(() => {
    if (!stats) return null;
    const rainy = stats.weatherConditions.find((w) => w.label === 'Rain')?.count || 0;
    const snowy = stats.weatherConditions.find((w) => w.label === 'Snow')?.count || 0;
    if (rainy + snowy > 0) {
      return 'Recent rain or snow may have reduced activity';
    }
    return null;
  }, [stats]);

  const baselineAreas = useMemo(() => {
    if (!baselines) return [];
    const months = Array.from(new Set(data.map((d) => d.date.slice(0, 7))));
    return months
      .map((m) => {
        const monthNum = new Date(`${m}-01`).getMonth() + 1;
        const b = baselines.find((bl) => bl.month === monthNum);
        if (!b) return null;
        const start = new Date(`${m}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        return {
          x1: start.toISOString().slice(0, 10),
          x2: end.toISOString().slice(0, 10),
          min: b.min,
          max: b.max,
        };
      })
      .filter(Boolean) as { x1: string; x2: string; min: number; max: number }[];
  }, [baselines, data]);

  const weatherAreas = useMemo(() => {
    if (!stats) return [];
    return stats.dailyWeather
      .filter((d) => d.condition === 'Rain' || d.condition === 'Snow' || d.temperature >= 85)
      .map((d) => ({ date: d.date, temp: d.temperature, condition: d.condition }))
  }, [stats])

  const chartConfig = {
    steps: { label: "Pace", color: "hsl(var(--chart-1))" },
    avg: { label: `${window}d Avg`, color: "hsl(var(--chart-2))" },
    goal: { label: "Goal", color: "hsl(var(--chart-3))" },
    baseline: { label: "Baseline", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  function StepsTooltip(props: TooltipProps<number, string>) {
    const { active, payload } = props
    if (!(active && payload && payload.length)) return null
    const day = payload[0].payload as GarminDay & { prev: number }
    const value = payload[0].value as number
    const delta = value - day.prev
    const gap = goal - value

    return (
      <ChartTooltipContent
        {...(props as any)}
        nameKey="steps"
        formatter={() => (
          <div className="grid gap-0.5">
            <span>{value.toLocaleString()}</span>
            <span className="text-muted-foreground">
              {delta > 0 ? `+${delta.toLocaleString()}` : `${delta.toLocaleString()}`} vs prev
            </span>
            <span className="text-muted-foreground">
              {gap >= 0
                ? `${gap.toLocaleString()} to goal`
                : `+${(-gap).toLocaleString()} over goal`}
            </span>
          </div>
        )}
        labelFormatter={(d) =>
          new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        }
      />
    )
  }

  if (!baselines || !stats) {
    return <Skeleton className="h-60 md:col-span-2" />
  }

  return (
    <ChartCard
      title="Pace Variability"
      description="How your pace changes over time (e.g., affected by weather or effort)"
      className="md:col-span-2"
    >
      <ChartContainer config={chartConfig} className="h-60 md:h-80 lg:h-96">
        <AreaChart data={dataWithAvg} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id={fillStepsId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis />
          {baselineAreas.map((area) => (
            <ReferenceArea
              key={area.x1}
              x1={area.x1}
              x2={area.x2}
              y1={area.min}
              y2={area.max}
              strokeOpacity={0}
              fill="var(--color-baseline)"
              fillOpacity={0.15}
            />
          ))}
          {weatherAreas.map((w) => (
            <ReferenceArea
              key={w.date}
              x1={w.date}
              x2={w.date}
              strokeOpacity={0}
              fill="var(--color-destructive)"
              fillOpacity={0.1}
            />
          ))}
          <ReferenceLine y={goal} stroke={chartConfig.goal.color} strokeDasharray="4 4" />
          <ChartTooltip content={<StepsTooltip />} />
          <Area
            dataKey="steps"
            type="monotone"
            stroke={chartConfig.steps.color}
            fill={`url(#${fillStepsId})`}
            animationDuration={300}
            animationEasing="ease-in-out"
            isAnimationActive={!prefersReducedMotion}
            className={!prefersReducedMotion ? "transition-all hover:opacity-80" : undefined}
            style={
              prefersReducedMotion
                ? undefined
                : { transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }
            }
          />
        <Line
          dataKey="avg"
          type="monotone"
          stroke={chartConfig.avg.color}
          dot={false}
          animationDuration={300}
          animationEasing="ease-in-out"
          isAnimationActive={!prefersReducedMotion}
          className={!prefersReducedMotion ? "transition-all hover:opacity-80" : undefined}
          style={
            prefersReducedMotion
              ? undefined
              : { transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }
          }
        />
      </AreaChart>
      </ChartContainer>
      {weatherNote && (
        <p className="mt-2 flex items-center text-xs text-muted-foreground" title={weatherNote}>
          <Info className="w-3 h-3 mr-1" />
          {weatherNote}
        </p>
      )}
    </ChartCard>
  );
}

export default StepsTrendWithGoal;
