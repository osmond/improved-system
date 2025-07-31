import { ChartContainer } from "@/components/ui/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
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
    <ChartContainer
      config={chartConfig}
      className="h-60 md:col-span-2"
      title="Activities"
      subtitle="Distance vs Duration"
    >
      <LineChart data={activities} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString()}
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <ChartTooltip>
          <ChartTooltipContent
            labelFormatter={(d) =>
              new Date(d).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
          />
        </ChartTooltip>
        <ChartLegend content={<ChartLegendContent />} />
        <Line yAxisId="left" type="monotone" dataKey="distance" stroke={chartConfig.distance.color} />
        <Line yAxisId="right" type="monotone" dataKey="duration" stroke={chartConfig.duration.color} />
      </LineChart>
    </ChartContainer>
  );
}
