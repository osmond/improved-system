import { useEffect, useMemo, useState } from "react";
import { getHourlySteps, type HourlySteps } from "@/lib/api";

export interface FingerprintPoint {
  hour: number;
  steps: number;
}

export function computeMovementFingerprint(
  data: HourlySteps[],
): FingerprintPoint[] {
  const bins = Array.from({ length: 24 }, () => ({ total: 0, count: 0 }));
  for (const h of data) {
    const d = new Date(h.timestamp);
    const hour = d.getHours();
    bins[hour].total += h.steps;
    bins[hour].count += 1;
  }
  return bins.map((b, i) => ({
    hour: i,
    steps: b.count ? b.total / b.count : 0,
  }));
}

export default function useMovementFingerprint(): FingerprintPoint[] | null {
  const [data, setData] = useState<HourlySteps[] | null>(null);

  useEffect(() => {
    getHourlySteps().then(setData);
  }, []);

  return useMemo(() => {
    if (!data) return null;
    return computeMovementFingerprint(data);
  }, [data]);
}
