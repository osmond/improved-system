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
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import type { GarminDay } from "@/lib/api";
import { useMemo } from "react";

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
  const dataWithAvg = useMemo(() => {
    return data.map((d, idx) => {
      const start = Math.max(0, idx - window + 1);
      const slice = data.slice(start, idx + 1);
      const avg = slice.reduce((sum, val) => sum + val.steps, 0) / slice.length;
      return { ...d, avg };
    });
  }, [data, window]);

  const chartConfig = {
    steps: { label: "Pace", color: "hsl(var(--chart-1))" },
    avg: { label: `${window}d Avg`, color: "hsl(var(--chart-2))" },
    goal: { label: "Goal", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  return (
    <ChartCard title="Pace Trend (min/mile)" className="md:col-span-2">
      <ChartContainer config={chartConfig} className="h-60">
        <AreaChart data={dataWithAvg} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="fillSteps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis />
          <ReferenceLine y={goal} stroke={chartConfig.goal.color} strokeDasharray="4 4" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                nameKey="steps"
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
            }
          />
          <Area
            dataKey="steps"
            type="monotone"
            stroke={chartConfig.steps.color}
            fill="url(#fillSteps)"
          />
          <Line dataKey="avg" type="monotone" stroke={chartConfig.avg.color} dot={false} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}

export default StepsTrendWithGoal;
