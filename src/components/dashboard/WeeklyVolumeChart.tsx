"use client";
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Brush,
  Tooltip as ChartTooltip,
} from "@/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/ui/chart";
import useWeeklyVolume from "@/hooks/useWeeklyVolume";
import { useChartSelection } from "./ChartSelectionContext";
import { useEffect, useState } from "react";
import { Skeleton } from "@/ui/skeleton";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

function BrushHandle({ x, y, width, height, stroke }: any) {
  const line1 = x + width / 2 - 3;
  const line2 = x + width / 2 + 3;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={stroke} rx={2} />
      <line
        x1={line1}
        y1={y + 4}
        x2={line1}
        y2={y + height - 4}
        stroke="#fff"
        strokeWidth={2}
      />
      <line
        x1={line2}
        y1={y + 4}
        x2={line2}
        y2={y + height - 4}
        stroke="#fff"
        strokeWidth={2}
      />
    </g>
  );
}

export default function WeeklyVolumeChart() {
  const data = useWeeklyVolume();
  const { range, setRange } = useChartSelection();
  const [brushTooltip, setBrushTooltip] = useState<
    { x: number; y: number; start: string; end: string } | null
  >(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (data && range.start === null && range.end === null && data.length) {
      setRange({ start: data[0].week, end: data[data.length - 1].week });
    }
  }, [data, range.start, range.end, setRange]);

  if (!data) return <Skeleton className="h-64" />;

  const config = {
    miles: { label: "Miles", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartCard title="Weekly Volume" description="Historical weekly mileage totals">
      <div className="relative">
        {brushTooltip && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded bg-muted px-2 py-1 text-[10px] shadow"
            style={{ left: brushTooltip.x, top: brushTooltip.y }}
          >
            {new Date(brushTooltip.start).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" – "}
            {new Date(brushTooltip.end).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
        <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              interval="preserveStartEnd"
              tickFormatter={(d) => {
                const date = new Date(d)
                return (
                  date.toLocaleString('en-US', { month: 'short' }) +
                  " '" +
                  date.toLocaleString('en-US', { year: '2-digit' })
                )
              }}
            />
            <ChartTooltip />
            <Bar
              dataKey="miles"
              fill="var(--chart-1)"
              radius={2}
              animationDuration={prefersReducedMotion ? 0 : 300}
              animationEasing="ease-in-out"
              isAnimationActive={!prefersReducedMotion}
              className="motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-in-out hover:opacity-80"
            />
            <Brush
              dataKey="week"
              height={30}
              travellerWidth={15}
              fill="hsl(var(--muted))"
              fillOpacity={0.3}
              traveller={<BrushHandle />}
              onChange={(e) => {
                if (
                  e &&
                  e.startIndex != null &&
                  e.endIndex != null &&
                  data[e.startIndex] &&
                  data[e.endIndex]
                ) {
                  setRange({
                    start: data[e.startIndex].week,
                    end: data[e.endIndex].week,
                  })
                }
              }}
              onMouseMove={(e) => {
                if (!range.start || !range.end) return
                const svg = (e.currentTarget as SVGElement).ownerSVGElement
                if (!svg) return
                const rect = svg.getBoundingClientRect()
                setBrushTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  start: range.start,
                  end: range.end,
                })
              }}
              onMouseLeave={() => setBrushTooltip(null)}
              onMouseUp={() => setBrushTooltip(null)}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </ChartCard>
  );
}
