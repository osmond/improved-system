import React from "react";
import { ProgressRing, type ProgressRingProps } from "./ProgressRing";

export interface ProgressRingWithDeltaProps extends ProgressRingProps {
  /** Current value used when computing delta */
  current: number;
  /** Previous value to compare against */
  previous: number;
  /** Decimal places for delta percentage */
  decimalPlaces?: number;
  /** Optional tertiary text shown below the delta */
  tertiary?: string;
}

export function ProgressRingWithDelta({
  current,
  previous,
  decimalPlaces = 1,
  tertiary,
  ...ringProps
}: ProgressRingWithDeltaProps) {
  const delta = previous === 0 ? 0 : (current - previous) / previous;
  const formatted = `${delta > 0 ? "+" : ""}${(delta * 100).toFixed(decimalPlaces)}%`;

  return (
    <div className="flex flex-col items-center">
      <ProgressRing {...ringProps} />
      <span className="text-xs mt-1" aria-label="Change from previous">
        {formatted}
      </span>
      {tertiary && (
        <span className="text-xs text-muted-foreground" aria-label="Additional context">
          {tertiary}
        </span>
      )}
    </div>
  );
}

export default ProgressRingWithDelta;
