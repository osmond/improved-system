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

const chartConfig = {
  steps: {
    label: "Steps",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StepsChart() {
  const data = useDailySteps();
  if (!data) return null;

  // assume data is an array like [{ date: "2025-07-01", steps: 8000 }, …]
  return (
    <ChartContainer
      config={chartConfig}
      className="h-60"
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
