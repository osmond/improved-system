import {
  ChartContainer,
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
  data: GarminDay[];
}

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-primary))",
  },
} satisfies ChartConfig;

export function DailyStepsChart({ data }: DailyStepsChartProps) {
  const last7 = data.slice(-7)
  return (
    <ChartContainer
      config={chartConfig}
      className="h-60 md:col-span-2"
      title="Daily Steps"
      subtitle="Last 7 days"
    >
      <BarChart data={last7} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--axis-line))" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString()}
          stroke="hsl(var(--axis-line))"
        />
        <YAxis stroke="hsl(var(--axis-line))" />
        <ReferenceLine
          y={10000}
          strokeDasharray="3 3"
          stroke="hsl(var(--axis-line))"
        />
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
        <Bar dataKey="steps" fill={chartConfig.steps.color} radius={[4, 4, 0, 0]}>
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
  )
}
