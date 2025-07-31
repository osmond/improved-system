import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useGarminData } from "@/hooks/useGarminData";

const chartConfig = {
  distance: {
    label: "Distance (km)",
    color: "var(--chart-1)",
  },
  duration: {
    label: "Duration (min)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ActivitiesChart() {
  const data = useGarminData();
  if (!data) return null;
  const activities = data.activities;

  return (
    <ChartContainer config={chartConfig} className="h-60">
      <LineChart data={activities} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line yAxisId="left" type="monotone" dataKey="distance" stroke={chartConfig.distance.color} />
        <Line yAxisId="right" type="monotone" dataKey="duration" stroke={chartConfig.duration.color} />
      </LineChart>
    </ChartContainer>
  );
}
