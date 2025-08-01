import React from "react";

export interface ProgressRingProps {
  /** Progress percentage from 0-100 */
  value: number;
  /** Outer dimension of the ring */
  size?: number;
  /** Stroke width of the ring */
  strokeWidth?: number;
  /** Accessible label describing the metric */
  label: string;
  /** Threshold at which the goal is reached (0-100) */
  goal?: number;
  /** Visual state influencing stroke color */
  variant?: "success" | "warning" | "danger";
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  label,
  goal = 100,
  variant,
}: ProgressRingProps) {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedValue = Math.max(value, 0);
  const clampedGoal = Math.min(Math.max(goal, 0), 100);

  const progress = Math.min(clampedValue, clampedGoal);
  const buffer = clampedValue > clampedGoal ? clampedValue - clampedGoal : 0;

  const progressOffset = circumference - (progress / 100) * circumference;
  const bufferDasharray = `${(buffer / 100) * circumference} ${circumference}`;
  const bufferOffset = circumference - (clampedGoal / 100) * circumference;

  let color = "hsl(var(--primary))";
  const autoVariant = variant
    ? variant
    : clampedValue >= clampedGoal
    ? "success"
    : clampedValue >= clampedGoal * 0.9
    ? "warning"
    : "danger";
  switch (autoVariant) {
    case "success":
      color = "hsl(var(--chart-3))";
      break;
    case "warning":
      color = "hsl(var(--chart-8))";
      break;
    case "danger":
      color = "hsl(var(--destructive))";
      break;
  }

  const tickAngle = (clampedGoal / 100) * 2 * Math.PI - Math.PI / 2;
  const tickX1 = size / 2 + radius * Math.cos(tickAngle);
  const tickY1 = size / 2 + radius * Math.sin(tickAngle);
  const tickX2 = size / 2 + (radius + strokeWidth / 2) * Math.cos(tickAngle);
  const tickY2 = size / 2 + (radius + strokeWidth / 2) * Math.sin(tickAngle);

  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className="rotate-[-90deg]"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
        strokeLinecap="round"
      />
      {buffer > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={bufferDasharray}
          strokeDashoffset={bufferOffset}
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
      )}
      {clampedGoal < 100 && (
        <line
          x1={tickX1}
          y1={tickY1}
          x2={tickX2}
          y2={tickY2}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
        />
      )}
    </svg>
  );
}
