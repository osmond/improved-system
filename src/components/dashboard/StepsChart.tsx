// src/components/dashboard/StepsChart.tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "@/components/ui/chart";
import { Cell, type TooltipProps } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

import type { GarminDay } from "@/lib/api";
import { useGarminDaysLazy } from "@/hooks/useGarminData";
import useDashboardFilters from "@/hooks/useDashboardFilters";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function StepsTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props

  if (!(active && payload && payload.length)) return null

  const day = payload[0].payload as GarminDay & { prev: number }
  const value = payload[0].value as number
  const delta = value - day.prev
  const goal = 10000
  const gap = goal - value

  const summary = `${value.toLocaleString()} steps on ${new Date(
    day.date,
  ).toLocaleDateString()}`

  return (
    <div aria-live="polite">
      <ChartTooltipContent
        active={active}
        payload={payload}
        nameKey="steps"
        formatter={() => (
          <div className="grid gap-0.5">
            <span>{value.toLocaleString()}</span>
            <span className="text-muted-foreground">
              {delta > 0 ? `+${delta.toLocaleString()}` : `${delta.toLocaleString()}`}
              {" vs prev"}
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
      {summary && (
        <p className="sr-only">
          {summary}. {delta >= 0 ? "+" : ""}
          {delta.toLocaleString()} from previous.{' '}
          {gap >= 0
            ? `${gap.toLocaleString()} short of goal`
            : `${(-gap).toLocaleString()} over goal`}
        </p>
      )}
    </div>
  )
}

export interface StepsChartProps {
  /** Fetch data when true */
  active?: boolean;
}

export function StepsChart({ active = true }: StepsChartProps = {}) {
  const data = useGarminDaysLazy(active);
  const { range } = useDashboardFilters();
  if (!data) return <Skeleton className="h-60 w-full" />;

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  const filtered = data.filter((d) => new Date(d.date) >= start);
  const enriched = filtered.map((d, i) => ({
    ...d,
    prev: i === 0 ? d.steps : filtered[i - 1].steps,
  }))

  if (!filtered.length) {
    return (

      <ChartContainer
        config={chartConfig}
        className="h-60 md:col-span-2"
        title="Daily Steps"
      >

        <div className="flex h-full items-center justify-center text-muted-foreground">
          No data
        </div>
      </ChartContainer>
    );
  }

  // assume data is an array like [{ date: "2025-07-01", steps: 8000 }, …]
  return (

    <ChartContainer
      config={chartConfig}
      className="h-60 md:col-span-2"
      title="Daily Steps"
    >
      <BarChart data={enriched} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString()}
        />
        <YAxis />
        <ChartTooltip content={<StepsTooltip />} />
        <Bar dataKey="steps" fill={chartConfig.steps.color} animationDuration={300}>
          {enriched.map((day) => (
            <Cell
              key={day.date}
              aria-label={`${day.steps.toLocaleString()} steps on ${new Date(day.date).toLocaleDateString()}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
