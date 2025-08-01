import React from "react";
import { ProgressRing, type ProgressRingProps } from "./ProgressRing";

export interface ProgressRingWithDeltaProps extends ProgressRingProps {
  /** Current value used when computing delta */
  current: number;
  /** Previous value to compare against */
  previous: number;
  /** Decimal places for delta percentage */
  decimalPlaces?: number;
  /** Additional deltas rendered below the primary delta */
  deltas?: { value: number; label: string }[];
}

export function ProgressRingWithDelta({
  current,
  previous,
  decimalPlaces = 1,
  deltas,
  ...ringProps
}: ProgressRingWithDeltaProps) {
  const formatted = React.useMemo(() => {
    const delta = previous === 0 ? 0 : (current - previous) / previous;
    return `${delta > 0 ? "+" : ""}${(delta * 100).toFixed(decimalPlaces)}%`;
  }, [current, previous, decimalPlaces]);

  return (
    <div className="flex flex-col items-center">
      <ProgressRing {...ringProps} />
      <span
        className="text-xs mt-1"
        aria-label="Change from previous"
        aria-live="polite"
        key={formatted}
      >
        {formatted}
      </span>
      {deltas && deltas.length > 0 && (
        <span className="text-xs text-muted-foreground" aria-label="Additional context">
          {deltas
            .map((d) => `${d.value >= 0 ? "+" : ""}${(d.value * 100).toFixed(decimalPlaces)}% ${d.label}`)
            .join(" \u2022 ")}
        </span>
      )}
    </div>
  );
}

export default ProgressRingWithDelta;
