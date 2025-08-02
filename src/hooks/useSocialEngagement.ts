import { useEffect, useMemo, useState } from "react";
import { getLocationVisits, type LocationVisit } from "@/lib/api";

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
} {
  const locationEntropy = computeLocationEntropy(visits);
  const outOfHomeFrequency = computeOutOfHomeFrequency(visits);
  const consecutiveHomeDays = computeConsecutiveHomeDays(visits);
  const index = (locationEntropy + outOfHomeFrequency) / 2;
  return { index, locationEntropy, outOfHomeFrequency, consecutiveHomeDays };
}

export default function useSocialEngagement() {
  const [visits, setVisits] = useState<LocationVisit[] | null>(null);

  useEffect(() => {
    getLocationVisits().then(setVisits);
  }, []);

  return useMemo(() => {
    if (!visits) return null;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const recent = visits.filter((v) => new Date(v.date) >= cutoff);
    const baselineVisits = visits.filter((v) => new Date(v.date) < cutoff);

    const current = computeSocialEngagementIndex(recent);
    const baseline = computeSocialEngagementIndex(baselineVisits);

    return { ...current, baseline };
  }, [visits]);
}

export { computeLocationEntropy, computeOutOfHomeFrequency, computeConsecutiveHomeDays };
