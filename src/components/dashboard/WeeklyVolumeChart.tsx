"use client";
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Brush,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import useWeeklyVolume from "@/hooks/useWeeklyVolume";
import { useChartSelection } from "./ChartSelectionContext";
import { useEffect, useState, type MouseEvent } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeeklyVolumeChart() {
  const data = useWeeklyVolume();
  const { range, setRange } = useChartSelection();
  const [tooltip, setTooltip] = useState<
    { start: string; end: string; x: number; y: number } | null
  >(null);

  useEffect(() => {
    if (data && range.start === null && range.end === null && data.length) {
      setRange({ start: data[0].week, end: data[data.length - 1].week });
    }
  }, [data]);

  if (!data) return <Skeleton className="h-64" />;

  const config = {
    miles: { label: "Miles", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const handleBrushChange = (e: any) => {
    if (
      e &&
      e.startIndex != null &&
      e.endIndex != null &&
      data[e.startIndex] &&
      data[e.endIndex]
    ) {
      const start = data[e.startIndex].week;
      const end = data[e.endIndex].week;
      setRange({ start, end });
      setTooltip((prev) => ({ ...prev, start, end, x: prev?.x ?? 0, y: prev?.y ?? 0 }));
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tooltip) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ ...tooltip, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <ChartCard title="Weekly Volume" description="Historical weekly mileage totals">
      <div
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded bg-popover px-2 py-1 text-[10px] text-popover-foreground shadow"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {new Date(tooltip.start).toLocaleDateString()} –
            {" "}
            {new Date(tooltip.end).toLocaleDateString()}
          </div>
        )}
        <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <ChartTooltip />
            <Bar
              dataKey="miles"
              fill="var(--chart-1)"
              radius={2}
              animationDuration={300}
            />
            <Brush
              dataKey="week"
              height={30}
              travellerWidth={15}
              fill="hsl(var(--card))"
              stroke="hsl(var(--border))"
              className="drop-shadow-sm"
              traveller={<BrushHandle />}
              onChange={handleBrushChange}
              onDragEnd={() => setTooltip(null)}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </ChartCard>
  );
}

function BrushHandle(props: any) {
  const { x, y, width, height, stroke } = props;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = width;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={stroke} rx={2} />
      <circle cx={cx} cy={cy} r={r} fill={stroke} />
    </g>
  );
}
