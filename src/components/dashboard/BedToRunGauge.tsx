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
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

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
  const [displayRatio, setDisplayRatio] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

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

  useEffect(() => {
    if (ratio === null) return;
    if (prefersReducedMotion) {
      setDisplayRatio(ratio);
      return;
    }
    setDisplayRatio(0);
    let start: number | null = null;
    const duration = 500;
    let frame: number;
    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayRatio(progress * ratio);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [ratio, prefersReducedMotion]);

  if (ratio === null) return <Skeleton className="h-32" />;

  const max = safeRange[1];
  const normalized = Math.min(Math.max(displayRatio, 0), max) / max; // map 0-max -> 0-1
  const radius = size / 2 - strokeWidth / 2;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - normalized * circumference;

  let color = "hsl(var(--chart-3))";
  if (ratio !== null && ratio < safeRange[0]) {
    color = "hsl(var(--chart-8))";
  } else if (ratio !== null && ratio > safeRange[1]) {
    color = "hsl(var(--destructive))";
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex flex-col items-center ${
              prefersReducedMotion ? '' : 'transition-transform hover:scale-105'
            }`}
            role="img"
            aria-label={`Bed-to-run ratio ${displayRatio.toFixed(2)}`}
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
                style={
                  prefersReducedMotion
                    ? undefined
                    : {
                        transition:
                          'stroke-dashoffset 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                      }
                }
              />
            </svg>
            <span className="mt-2 text-lg font-bold tabular-nums">
              {displayRatio.toFixed(2)}
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
