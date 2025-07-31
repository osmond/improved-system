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
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  label,
}: ProgressRingProps) {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

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
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
