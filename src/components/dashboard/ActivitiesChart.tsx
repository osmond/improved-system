import {
  ChartContainer,
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
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import { useGarminData } from "@/hooks/useGarminData";
import useDashboardFilters from "@/hooks/useDashboardFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { chartColors } from "@/lib/chartColors";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const chartConfig = {
  distance: {
    label: "Distance (km)",
    color: chartColors["1"],
  },
  duration: {
    label: "Duration (min)",
    color: chartColors["2"],
  },
} satisfies ChartConfig;

export function ActivitiesChart() {
  const data = useGarminData();
  const { activity, range } = useDashboardFilters();
  const prefersReducedMotion = usePrefersReducedMotion();
  if (!data) return <Skeleton className="h-60 md:col-span-2" />;
  let activities = data.activities;

  if (activity !== 'all') {
    activities = activities.filter(
      (a) => a.type.toLowerCase() === activity,
    );
  }

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  activities = activities.filter(
    (a) => new Date(a.date) >= start,
  );

  return (
    <ChartCard
      title="Activities"
      description="Distance vs Duration"
      className="md:col-span-2"
      lastSync={data.lastSync}
    >
      <ChartContainer config={chartConfig} className="h-60 md:h-80 lg:h-96">
        <LineChart data={activities} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="distance"
          stroke={chartConfig.distance.color}
          animationDuration={300}
          animationEasing="ease-in-out"
          isAnimationActive={!prefersReducedMotion}
          className={!prefersReducedMotion ? "transition-all hover:opacity-80" : undefined}
          style={
            prefersReducedMotion
              ? undefined
              : { transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }
          }
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="duration"
          stroke={chartConfig.duration.color}
          animationDuration={300}
          animationEasing="ease-in-out"
          isAnimationActive={!prefersReducedMotion}
          className={!prefersReducedMotion ? "transition-all hover:opacity-80" : undefined}
          style={
            prefersReducedMotion
              ? undefined
              : { transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }
          }
        />
      </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
