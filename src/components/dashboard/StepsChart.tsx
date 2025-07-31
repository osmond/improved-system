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
import { useDailySteps } from "@/hooks/useGarminData";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function StepsTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props;
  let summary: string | null = null;
  if (
    active &&
    payload &&
    payload.length &&
    payload[0].payload &&
    payload[0].value !== undefined
  ) {
    const day = payload[0].payload as GarminDay;
    summary = `${payload[0].value.toLocaleString()} steps on ${new Date(
      day.date,
    ).toLocaleDateString()}`;
  }

  return (
    <div aria-live="polite">
      <ChartTooltipContent
        active={active}
        payload={payload}
        nameKey="steps"
        labelFormatter={(d) =>
          new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        }
      />
      {summary && <p className="sr-only">{summary}</p>}
    </div>
  );
}

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
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString()}
        />
        <YAxis />
        <ChartTooltip content={<StepsTooltip />} />
        <Bar dataKey="steps" fill={chartConfig.steps.color}>
          {data.map((day) => (
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
