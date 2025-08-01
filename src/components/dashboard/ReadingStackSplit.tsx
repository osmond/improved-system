"use client";
import {
  ChartContainer,
  PieChart,
  Pie,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Cell } from "recharts";

// We'll display a total minutes label inside the donut chart
import type { ChartConfig } from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import useReadingMediumTotals from "@/hooks/useReadingMediumTotals";
import { Skeleton } from "@/components/ui/skeleton";

const labels: Record<string, string> = {
  phone: "Phone",
  computer: "Computer",
  tablet: "Tablet",
  kindle: "Kindle",
  real_book: "Real Book",
  other: "Other",
};

export default function ReadingStackSplit() {
  const data = useReadingMediumTotals();

  if (!data) return <Skeleton className="h-64" />;

  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);

  const config: ChartConfig = {
    minutes: { label: "Minutes" },
  };
  data.forEach((d, i) => {
    (config as any)[d.medium] = {
      label: labels[d.medium],
      color: `hsl(var(--chart-${i + 1}))`,
    };
  });

  return (
    <ChartCard title="Reading Stack Split" description="Time by device">
      <ChartContainer config={config} className="h-64">
        <div className="relative h-full w-full">
          <PieChart width={200} height={160}>
            <ChartTooltip />
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
              height={24}
            />
            <Pie
              data={data}
              dataKey="minutes"
              nameKey="medium"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              cornerRadius={8}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
            >
              {data.map((entry, idx) => (
                <Cell key={entry.medium} fill={`hsl(var(--chart-${idx + 1}))`} />
              ))}
            </Pie>
          </PieChart>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-sm font-semibold">
              {totalMinutes.toLocaleString()} <span className="text-muted-foreground">min</span>
            </div>
          </div>
        </div>
      </ChartContainer>
    </ChartCard>
  );
}
