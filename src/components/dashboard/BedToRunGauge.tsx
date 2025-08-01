import React, { useEffect, useState } from "react";
import {
  getSleepSessions,
  getRunBikeVolume,
  SleepSession,
  RunBikeVolumePoint,
} from "@/lib/api";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export interface BedToRunGaugeProps {
  /** Diameter of the gauge in pixels */
  size?: number;
  /** Stroke width for gauge arcs */
  strokeWidth?: number;
  /** Safe range for the ratio [min, max] */
  safeRange?: [number, number];
}

/**
 * Semicircular gauge displaying hours of running/cycling per hour in bed.
 */
export default function BedToRunGauge({
  size = 160,
  strokeWidth = 12,
  safeRange = [0.1, 0.25],
}: BedToRunGaugeProps) {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getSleepSessions(), getRunBikeVolume()]).then(
      ([sleep, volume]: [SleepSession[], RunBikeVolumePoint[]]) => {
        const sleepHours = sleep
          .slice(0, 7)
          .reduce((sum, s) => sum + s.timeInBed, 0);
        const lastWeek = volume[volume.length - 1];
        const runHours = (lastWeek.runTime + lastWeek.bikeTime) / 60;
        const r = sleepHours === 0 ? 0 : runHours / sleepHours;
        setRatio(r);
      },
    );
  }, []);

  if (ratio === null) return <Skeleton className="h-32" />;

  const max = safeRange[1];
  const normalized = Math.min(Math.max(ratio, 0), max) / max; // map 0-max -> 0-1
  const radius = size / 2 - strokeWidth / 2;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - normalized * circumference;

  let color = "hsl(var(--chart-3))";
  if (ratio < safeRange[0]) {
    color = "hsl(var(--chart-8))";
  } else if (ratio > safeRange[1]) {
    color = "hsl(var(--destructive))";
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex flex-col items-center"
            role="img"
            aria-label={`Bed-to-run ratio ${ratio.toFixed(2)}`}
          >
            <svg
              width={size}
              height={size / 2}
              viewBox={`0 0 ${size} ${size / 2}`}
            >
              <path
                d={`M ${strokeWidth / 2},${size / 2 - strokeWidth / 2} A ${radius} ${radius} 0 0 1 ${
                  size - strokeWidth / 2
                } ${size / 2 - strokeWidth / 2}`}
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <path
                d={`M ${strokeWidth / 2},${size / 2 - strokeWidth / 2} A ${radius} ${radius} 0 0 1 ${
                  size - strokeWidth / 2
                } ${size / 2 - strokeWidth / 2}`}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <span className="mt-2 text-lg font-bold tabular-nums">
              {ratio.toFixed(2)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Hours run or biked per hour in bed; {safeRange[0]}–{safeRange[1]} is
          ideal
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
