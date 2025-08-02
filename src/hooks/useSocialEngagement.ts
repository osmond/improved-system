import { useEffect, useMemo, useState } from "react";
import { getLocationVisits, type LocationVisit } from "@/lib/api";
import {
  getSocialBaseline,
  setSocialBaseline,
  type SocialBaseline,
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

function filterRecentVisits(visits: LocationVisit[], days: number): LocationVisit[] {
  const dates = Array.from(new Set(visits.map((v) => v.date))).sort();
  const recent = new Set(dates.slice(-days));
  return visits.filter((v) => recent.has(v.date));
}

export interface SocialMetrics {
  locationEntropy: number;
  outOfHomeFrequency: number;
}

export function computeSocialEngagementIndex(
  visits: LocationVisit[],
  windowDays = 7,
): {
  index: number;
  locationEntropy: number;
  outOfHomeFrequency: number;
  consecutiveHomeDays: number;
} {
  const recent = filterRecentVisits(visits, windowDays);
  const locationEntropy = computeLocationEntropy(recent);
  const outOfHomeFrequency = computeOutOfHomeFrequency(recent);
  const consecutiveHomeDays = computeConsecutiveHomeDays(visits);
  const index = (locationEntropy + outOfHomeFrequency) / 2;
  return { index, locationEntropy, outOfHomeFrequency, consecutiveHomeDays };
}

export function computeDeviationFlags(
  metrics: SocialMetrics,
  baseline: SocialBaseline,
): string[] {
  const flags: string[] = [];
  const entropyChange =
    baseline.entropy === 0
      ? 0
      : (metrics.locationEntropy - baseline.entropy) / baseline.entropy;
  if (Math.abs(entropyChange) >= 0.3) {
    flags.push(
      `entropy ${entropyChange > 0 ? "up" : "down"} ${Math.round(
        Math.abs(entropyChange) * 100,
      )}%`,
    );
  }
  const outChange =
    baseline.outOfHome === 0
      ? 0
      : (metrics.outOfHomeFrequency - baseline.outOfHome) / baseline.outOfHome;
  if (Math.abs(outChange) >= 0.3) {
    flags.push(
      `out-of-home ${outChange > 0 ? "up" : "down"} ${Math.round(
        Math.abs(outChange) * 100,
      )}%`,
    );
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
    const metrics = computeSocialEngagementIndex(visits);
    const baseline = getSocialBaseline(userId);
    if (!baseline) {
      setSocialBaseline(
        { entropy: metrics.locationEntropy, outOfHome: metrics.outOfHomeFrequency },
        userId,
      );
      return { ...metrics, deviationFlags: [] };
    }
    const flags = computeDeviationFlags(
      { locationEntropy: metrics.locationEntropy, outOfHomeFrequency: metrics.outOfHomeFrequency },
      baseline,
    );
    return { ...metrics, deviationFlags: flags };
  }, [visits, userId]);
}

export {
  computeLocationEntropy,
  computeOutOfHomeFrequency,
  computeConsecutiveHomeDays,
};
