import { useEffect, useMemo, useState } from "react";
import { getLocationVisits, type LocationVisit } from "@/lib/api";
import {
  getLocationBaseline,
  updateLocationBaseline,
  type LocationBaseline,
} from "@/lib/locationStore";

function computeLocationEntropy(visits: LocationVisit[]): number {
  const counts: Record<string, number> = {};
  visits.forEach((v) => {
    counts[v.placeId] = (counts[v.placeId] || 0) + 1;
  });
  const total = visits.length;
  if (total === 0) return 0;
  let entropy = 0;
  Object.values(counts).forEach((c) => {
    const p = c / total;
    entropy -= p * Math.log(p);
  });
  const maxEntropy = Math.log(Object.keys(counts).length);
  return maxEntropy === 0 ? 0 : entropy / maxEntropy;
}

function computeOutOfHomeFrequency(visits: LocationVisit[]): number {
  const byDate: Record<string, LocationVisit[]> = {};
  visits.forEach((v) => {
    if (!byDate[v.date]) byDate[v.date] = [];
    byDate[v.date].push(v);
  });
  const days = Object.values(byDate);
  if (days.length === 0) return 0;
  let outDays = 0;
  days.forEach((day) => {
    if (day.some((v) => v.category === "other")) outDays++;
  });
  return outDays / days.length;
}

function computeConsecutiveHomeDays(visits: LocationVisit[]): number {
  const byDate: Record<string, LocationVisit[]> = {};
  visits.forEach((v) => {
    if (!byDate[v.date]) byDate[v.date] = [];
    byDate[v.date].push(v);
  });
  const dates = Object.keys(byDate).sort().reverse();
  let count = 0;
  for (const d of dates) {
    const day = byDate[d];
    const hasOther = day.some((v) => v.category === "other");
    if (hasOther) break;
    count++;
  }
  return count;
}

export function computeSocialEngagementIndex(visits: LocationVisit[]): {
  index: number;
  locationEntropy: number;
  outOfHomeFrequency: number;
  consecutiveHomeDays: number;
  locationEntropy7d: number;
  outOfHomeFrequency7d: number;
} {
  const locationEntropy = computeLocationEntropy(visits);
  const outOfHomeFrequency = computeOutOfHomeFrequency(visits);
  const consecutiveHomeDays = computeConsecutiveHomeDays(visits);
  const { locationEntropy7d, outOfHomeFrequency7d } = computeSevenDayRollingAverages(
    visits,
  );
  const index = (locationEntropy7d + outOfHomeFrequency7d) / 2;
  return {
    index,
    locationEntropy,
    outOfHomeFrequency,
    consecutiveHomeDays,
    locationEntropy7d,
    outOfHomeFrequency7d,
  };
}

function computeSevenDayRollingAverages(visits: LocationVisit[]) {
  const byDate: Record<string, LocationVisit[]> = {};
  visits.forEach((v) => {
    if (!byDate[v.date]) byDate[v.date] = [];
    byDate[v.date].push(v);
  });
  const dates = Object.keys(byDate).sort();
  const entropy: number[] = [];
  const outOfHome: number[] = [];
  for (const d of dates) {
    const dayVisits = byDate[d];
    entropy.push(computeLocationEntropy(dayVisits));
    outOfHome.push(dayVisits.some((v) => v.category === "other") ? 1 : 0);
  }
  const last7Entropy = entropy.slice(-7);
  const last7Out = outOfHome.slice(-7);
  return {
    locationEntropy7d: last7Entropy.length
      ? last7Entropy.reduce((a, b) => a + b, 0) / last7Entropy.length
      : 0,
    outOfHomeFrequency7d: last7Out.length
      ? last7Out.reduce((a, b) => a + b, 0) / last7Out.length
      : 0,
  };
}

export function computeDeviationFlags(
  current: { locationEntropy7d: number; outOfHomeFrequency7d: number },
  baseline: LocationBaseline,
) {
  const flags: string[] = [];
  if (baseline.locationEntropy) {
    const change =
      (current.locationEntropy7d - baseline.locationEntropy) /
      baseline.locationEntropy;
    if (Math.abs(change) >= 0.3) {
      const pct = Math.round(Math.abs(change) * 100);
      flags.push(`entropy ${change < 0 ? "down" : "up"} ${pct}%`);
    }
  }
  if (baseline.outOfHomeFrequency) {
    const change =
      (current.outOfHomeFrequency7d - baseline.outOfHomeFrequency) /
      baseline.outOfHomeFrequency;
    if (Math.abs(change) >= 0.3) {
      const pct = Math.round(Math.abs(change) * 100);
      flags.push(`out-of-home ${change < 0 ? "down" : "up"} ${pct}%`);
    }
  }
  return flags;
}

export default function useSocialEngagement(userId = "default") {
  const [visits, setVisits] = useState<LocationVisit[] | null>(null);

  useEffect(() => {
    getLocationVisits().then(setVisits);
  }, []);

  return useMemo(() => {
    if (!visits) return null;
    const result = computeSocialEngagementIndex(visits);
    const baseline = getLocationBaseline(userId);
    const flags = baseline ? computeDeviationFlags(result, baseline) : [];
    updateLocationBaseline(userId, {
      locationEntropy: result.locationEntropy7d,
      outOfHomeFrequency: result.outOfHomeFrequency7d,
    });
    return { ...result, baseline, flags };
  }, [visits, userId]);
}

export {
  computeLocationEntropy,
  computeOutOfHomeFrequency,
  computeConsecutiveHomeDays,
};
