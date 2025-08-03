"use client";
import {
  ChartContainer,
  PieChart,
  Pie,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ResponsiveContainer,
} from "@/components/ui/chart";
import { Cell, Label, type TooltipProps } from "recharts";
import { useState } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import useReadingMediumTotals from "@/hooks/useReadingMediumTotals";
import { Skeleton } from "@/components/ui/skeleton";
import { type ReadingMedium } from "@/lib/api";
import {
  Smartphone,
  Monitor,
  Tablet,
  BookOpen,
  BookOpenText,
  Book,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

const labels: Record<ReadingMedium, string> = {
  phone: "Phone",
  computer: "Computer",
  tablet: "Tablet",
  kindle: "Kindle",
  real_book: "Real Book",
  other: "Other",
};

const icons: Record<ReadingMedium, LucideIcon> = {
  phone: Smartphone,
  computer: Monitor,
  tablet: Tablet,
  kindle: BookOpen,
  real_book: BookOpenText,
  other: HelpCircle,
};

export function ReadingTooltip(
  props: TooltipProps<number, string> & { total: number }
) {
  const { active, payload, total } = props;
  if (!(active && payload && payload.length)) return null;
  const item = payload[0];
  const minutes = item.value as number;
  const medium = labels[item.payload.medium as ReadingMedium];
  const percent = Math.round((minutes / total) * 100);
  return (
    <ChartTooltipContent
      active={active}
      payload={payload}
      nameKey="medium"
      formatter={() => (
        <div className="grid gap-0.5">
          <span>{medium}</span>
          <span className="text-muted-foreground">
            {minutes} min ({percent}%)
          </span>
        </div>
      )}
    />
  );
}

export default function ReadingStackSplit() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = useReadingMediumTotals();

  if (!data) return <Skeleton className="h-64" />;

  const filtered = data.filter((d) => d.minutes > 0);

  const total = filtered.reduce((sum, d) => sum + d.minutes, 0);

  const config: ChartConfig = {
    minutes: { label: "Minutes" },
  };
  filtered.forEach((d, i) => {
    (config as any)[d.medium] = {
      label: labels[d.medium],
      icon: icons[d.medium],
      color: `hsl(var(--chart-${i + 1}))`,
    };
  });

  return (
    <ChartCard title="Reading Stack Split" description="Time by device">
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {filtered.map((_, idx) => (
                <linearGradient
                  key={idx}
                  id={`reading-split-gradient-${idx}`}
                >
                  <stop
                    offset="0%"
                    stopColor={`hsl(var(--chart-${idx + 1}))`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={`hsl(var(--chart-${idx + 1}))`}
                    stopOpacity={0.5}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip content={<ReadingTooltip total={total} />} />
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
              height={24}
            />
            <Pie
              data={filtered}
              dataKey="minutes"
              nameKey="medium"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={4}
              cornerRadius={8}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              isAnimationActive
              animationDuration={500}
            >
              {filtered.map((entry, idx) => (
                <Cell
                  key={entry.medium}
                  fill={`url(#reading-split-gradient-${idx})`}
                  opacity={activeIndex === idx ? 1 : 0.6}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  return (
                    <g
                      transform={`translate(${cx}, ${cy})`}
                      className="fill-foreground"
                    >
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xl font-bold"
                      >
                        {total}
                      </text>
                      <Book
                        x={12}
                        y={-12}
                        className="h-5 w-5 text-foreground"
                      />
                    </g>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  );
}
