"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Pin, PinOff } from "lucide-react";

interface Point {
  x: number;
  y: number;
  date?: string; // optional ISO date string
}

interface CorrelationDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xLabel: string;
  yLabel: string;
  data: Point[];
  pinned: boolean;
  onPinChange: (pinned: boolean) => void;
}

function correlation(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n === 0) return 0;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX) * Math.sqrt(denomY);
  return denom === 0 ? 0 : num / denom;
}

function rollingCorrelation(data: Point[], windowSize = 7) {
  const result: { index: number; corr: number }[] = [];
  for (let i = 0; i <= data.length - windowSize; i++) {
    const slice = data.slice(i, i + windowSize);
    const xs = slice.map((d) => d.x);
    const ys = slice.map((d) => d.y);
    result.push({ index: i + windowSize - 1, corr: correlation(xs, ys) });
  }
  return result;
}

function weekdayWeekendBreakdown(data: Point[]) {
  const weekday: Point[] = [];
  const weekend: Point[] = [];
  data.forEach((d) => {
    if (!d.date) return;
    const day = new Date(d.date).getDay();
    if (day === 0 || day === 6) weekend.push(d);
    else weekday.push(d);
  });
  const weekdayCorr = correlation(
    weekday.map((d) => d.x),
    weekday.map((d) => d.y)
  );
  const weekendCorr = correlation(
    weekend.map((d) => d.x),
    weekend.map((d) => d.y)
  );
  return [
    { type: "Weekday", corr: weekdayCorr },
    { type: "Weekend", corr: weekendCorr },
  ];
}

export default function CorrelationDetails({
  open,
  onOpenChange,
  xLabel,
  yLabel,
  data,
  pinned,
  onPinChange,
}: CorrelationDetailsProps) {
  const lineData = useMemo(
    () => data.map((d, i) => ({ index: i, x: d.x, y: d.y, date: d.date })),
    [data]
  );
  const rollingData = useMemo(() => rollingCorrelation(data), [data]);
  const breakdown = useMemo(() => weekdayWeekendBreakdown(data), [data]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>
            {xLabel} vs {yLabel}
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label={pinned ? "Unpin" : "Pin"}
            data-testid="pin-button"
            onClick={() => onPinChange(!pinned)}
          >
            {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="h-32">
            <h4 className="mb-2 text-sm font-medium">Aligned Time Series</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="x" stroke="#8884d8" dot={false} name={xLabel} />
                <Line type="monotone" dataKey="y" stroke="#82ca9d" dot={false} name={yLabel} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-32">
            <h4 className="mb-2 text-sm font-medium">Rolling Correlation</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rollingData}>
                <XAxis dataKey="index" />
                <YAxis domain={[-1, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="corr" stroke="#ff7300" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-32">
            <h4 className="mb-2 text-sm font-medium">Weekday vs Weekend</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis domain={[-1, 1]} />
                <Tooltip />
                <Bar dataKey="corr" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

