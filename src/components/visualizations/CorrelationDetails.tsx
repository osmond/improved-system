"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Button } from "@/ui/button";
import { ChartContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "@/ui/chart";
import { Pin, PinOff } from "lucide-react";

interface TimeseriesPoint {
  time: number;
  value: number;
}

export interface CorrelationDrilldown {
  seriesX: TimeseriesPoint[];
  seriesY: TimeseriesPoint[];
  rolling: TimeseriesPoint[];
  breakdown: { weekday: number; weekend: number };
}

interface CorrelationDetailsProps {
  open: boolean;
  xLabel: string;
  yLabel: string;
  data?: CorrelationDrilldown;
  pinned: boolean;
  onPinnedChange: (pinned: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export default function CorrelationDetails({
  open,
  xLabel,
  yLabel,
  data,
  pinned,
  onPinnedChange,
  onOpenChange,
}: CorrelationDetailsProps) {
  const timeSeries = (data
    ? data.seriesX.map((p, i) => ({
        time: p.time,
        x: p.value,
        y: data.seriesY[i]?.value ?? null,
      }))
    : []) as { time: number; x: number; y: number | null }[];
  const breakdownData = data
    ? [
        { label: "Weekday", value: data.breakdown.weekday },
        { label: "Weekend", value: data.breakdown.weekend },
      ]
    : [];

  return (
    <Sheet open={open} onOpenChange={(o) => (!pinned ? onOpenChange(o) : null)}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
        data-testid="correlation-details"
      >
        <SheetHeader>
          <SheetTitle>
            {xLabel} vs {yLabel}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            variant={pinned ? "default" : "outline"}
            onClick={() => onPinnedChange(!pinned)}
            aria-label={pinned ? "Unpin details" : "Pin details"}
          >
            {pinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
            {pinned ? "Unpin" : "Pin"}
          </Button>
        </div>
        {data ? (
          <div className="mt-4 space-y-6">
            <ChartContainer
              config={{ x: { label: xLabel }, y: { label: yLabel } }}
              className="h-40"
            >
              <LineChart data={timeSeries} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" type="number" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="x" stroke="hsl(var(--chart-1))" dot={false} />
                <Line type="monotone" dataKey="y" stroke="hsl(var(--chart-2))" dot={false} />
              </LineChart>
            </ChartContainer>
            <ChartContainer
              config={{ r: { label: "Rolling r" } }}
              className="h-40"
            >
              <LineChart data={data.rolling} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" type="number" hide />
                <YAxis domain={[-1, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" dot={false} />
              </LineChart>
            </ChartContainer>
            <ChartContainer
              config={{ value: { label: "Correlation" } }}
              className="h-40"
              disableResponsive
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[ -1, 1 ]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground">No data</div>
        )}
      </SheetContent>
    </Sheet>
  );
}

