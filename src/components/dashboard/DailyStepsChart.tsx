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
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import type { GarminDay } from "@/lib/api";
import { Cell } from "recharts";

export interface DailyStepsChartProps {
  data: GarminDay[];
}

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function DailyStepsChart({ data }: DailyStepsChartProps) {
  return (
    <ChartCard title="Daily Steps" className="md:col-span-2">
      <ChartContainer config={chartConfig} className="h-60">
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString()}
        />
        <YAxis />
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
        <Bar dataKey="steps" fill={chartConfig.steps.color}>
          {data.map((day) => (
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
    </ChartCard>
  );
}
