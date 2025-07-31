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
import type { ChartConfig } from "@/components/ui/chart";

import type { GarminDay } from "@/lib/api";
import { useDailySteps } from "@/hooks/useGarminData";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  steps: {
    label: "Steps",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StepsChart() {
  const data = useDailySteps();
  if (!data) return <Skeleton className="h-60 w-full" />;

  if (!data.length) {
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
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
        <YAxis />
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="steps"
              labelFormatter={(d) =>
                new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
          }
        />
        <Bar dataKey="steps" fill={chartConfig.steps.color} />
      </BarChart>
    </ChartContainer>
  );
}
