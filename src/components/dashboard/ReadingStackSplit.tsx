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
import type { ChartConfig } from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import useReadingMediumTotals from "@/hooks/useReadingMediumTotals";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Smartphone,
  Monitor,
  Tablet,
  BookOpen,
  BookOpenText,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

const labels: Record<string, string> = {
  phone: "Phone",
  computer: "Computer",
  tablet: "Tablet",
  kindle: "Kindle",
  real_book: "Real Book",
  other: "Other",
};

const icons: Record<string, LucideIcon> = {
  phone: Smartphone,
  computer: Monitor,
  tablet: Tablet,
  kindle: BookOpen,
  real_book: BookOpenText,
  other: HelpCircle,
};

export default function ReadingStackSplit() {
  const data = useReadingMediumTotals();

  if (!data) return <Skeleton className="h-64" />;

  const config: ChartConfig = {
    minutes: { label: "Minutes" },
  };
  data.forEach((d, i) => {
    (config as any)[d.medium] = {
      label: labels[d.medium],
      icon: icons[d.medium],
      color: `hsl(var(--chart-${i + 1}))`,
    };
  });

  return (
    <ChartCard title="Reading Stack Split" description="Time by device">
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
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
      </ChartContainer>
    </ChartCard>
  );
}
