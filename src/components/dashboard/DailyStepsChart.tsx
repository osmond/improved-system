import * as React from "react";
import { ChartContainer } from "@/components/ui/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { GarminDay } from "@/lib/api";
import { Cell } from "recharts";

export interface DailyStepsChartProps {
  data?: GarminDay[]; // make optional to support loading/empty
  isLoading?: boolean;
}

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-primary))",
  },
} satisfies ChartConfig;

function formatDateShort(d: string) {
  const dt = new Date(d);
  // e.g., "7/29"
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

export function DailyStepsChart({
  data = [],
  isLoading = false,
}: DailyStepsChartProps) {
  const last7 = React.useMemo(() => data.slice(-7), [data]);

  // Empty / loading placeholder
  if (isLoading) {
    return (
      <ChartContainer
        config={chartConfig}
        className="h-60 md:col-span-2"
        title="Daily Steps"
        subtitle="Last 7 days"
      >
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Loading step data...
        </div>
      </ChartContainer>
    );
  }

  if (!last7.length) {
    return (
      <ChartContainer
        config={chartConfig}
        className="h-60 md:col-span-2"
        title="Daily Steps"
        subtitle="Last 7 days"
      >
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          No step data available.
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="h-60 md:col-span-2"
      title="Daily Steps"
      subtitle="Last 7 days"
      aria-label="Daily steps over the last 7 days"
    >
      <BarChart
        data={last7}
        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
      >
        <CartesianGrid
          stroke="var(--grid-line)"
          strokeDasharray="4 4"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateShort}
          tick={{
            fill: "var(--tick-text)",
            fontSize: 10,
            dy: 4,
          }}
          axisLine={{ stroke: "var(--axis-line)" }}
          tickLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          tick={{ fill: "var(--tick-text)", fontSize: 10 }}
          axisLine={{ stroke: "var(--axis-line)" }}
          tickLine={false}
          width={50}
        />
        <ReferenceLine
          y={10000}
          stroke="var(--axis-line)"
          strokeDasharray="3 3"
          label={{
            value: "10k goal",
            position: "top",
            fill: "var(--muted-foreground)",
            fontSize: 10,
          }}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          content={
            <ChartTooltipContent
              nameKey="steps"
              labelFormatter={(d) =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              valueFormatter={(val: number) =>
                `${val.toLocaleString()} steps`
              }
              style={{
                background: "var(--tooltip-bg)",
                border: "1px solid var(--tooltip-border)",
                color: "hsl(var(--foreground))",
              }}
            />
          }
        />
        <Bar
          dataKey="steps"
          name="Steps"
          fill="hsl(var(--chart-primary))"
          radius={[4, 4, 0, 0]}
          barSize={22}
          aria-label="Bar chart of daily steps"
          isAnimationActive
        >
          {last7.map((day) => (
            <Cell
              key={day.date}
              aria-label={`${day.steps.toLocaleString()} steps on ${new Date(
                day.date
              ).toLocaleDateString()}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
