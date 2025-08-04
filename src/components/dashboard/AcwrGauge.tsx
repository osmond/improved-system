import React from "react";
import useAcwr from "@/hooks/useAcwr";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/tooltip";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

export interface AcwrGaugeProps {
  /** Array of daily training load values ordered from oldest to newest */
  loads: number[];
  /** Size of the gauge in pixels */
  size?: number;
  /** Stroke width for gauge arcs */
  strokeWidth?: number;
  /** Safe range for the ratio [min, max] */
  safeRange?: [number, number];
}

/**
 * Semicircular gauge displaying the Acute:Chronic Workload Ratio.
 */
export function AcwrGauge({
  loads,
  size = 160,
  strokeWidth = 12,
  safeRange = [0.8, 1.3],
}: AcwrGaugeProps) {
  const ratio = useAcwr(loads);
  const normalized = Math.min(Math.max(ratio, 0), 2) / 2; // 0-2 mapped to 0-1
  const prefersReducedMotion = usePrefersReducedMotion();

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
            aria-label={`ACWR ${ratio.toFixed(2)}`}
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
                className="motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-in-out hover:opacity-80"
                style={{
                  transition: prefersReducedMotion
                    ? "none"
                    : "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </svg>
            <span className="mt-2 text-lg font-bold tabular-nums">
              {ratio.toFixed(2)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          ACWR compares last 7 days of load vs last 28; 0.8–1.3 is ideal
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AcwrGauge;
