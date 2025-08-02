import { useEffect, useMemo, useState } from "react";
import {
  getActivityVisits,
  type ActivityVisit,
} from "@/lib/activityContext";
import {
  getSocialBaseline,
  setSocialBaseline,
  type SocialBaseline,
} from "@/lib/locationStore";

function computeLocationEntropy(visits: ActivityVisit[]): number {
  const active = visits.filter((v) => v.activity !== "sedentary");
  const counts: Record<string, number> = {};
  active.forEach((v) => {
    counts[v.placeId] = (counts[v.placeId] || 0) + 1;
  });
  const total = active.length;
  if (total === 0) return 0;
  let entropy = 0;
  Object.values(counts).forEach((c) => {
    const p = c / total;
    entropy -= p * Math.log(p);
  });
  const maxEntropy = Math.log(Object.keys(counts).length);
  return maxEntropy === 0 ? 0 : entropy / maxEntropy;
}

function computeOutOfHomeFrequency(visits: ActivityVisit[]): number {
  const active = visits.filter((v) => v.activity !== "sedentary");
  const byDate: Record<string, ActivityVisit[]> = {};
  active.forEach((v) => {
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

function computeConsecutiveHomeDays(visits: ActivityVisit[]): number {
  const active = visits.filter((v) => v.activity !== "sedentary");
  const byDate: Record<string, ActivityVisit[]> = {};
  active.forEach((v) => {
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

export function computeSocialEngagementIndex(visits: ActivityVisit[]): {
  index: number;
  locationEntropy: number;
  outOfHomeFrequency: number;
  consecutiveHomeDays: number;
} {
  const active = visits.filter((v) => v.activity !== "sedentary");
  const byDate: Record<string, ActivityVisit[]> = {};
  active.forEach((v) => {
    if (!byDate[v.date]) byDate[v.date] = [];
    byDate[v.date].push(v);
  });
  const dailyEntropies = Object.values(byDate).map((day) =>
    computeLocationEntropy(day),
  );
  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
  const locationEntropy = avg(dailyEntropies);
  const outOfHomeFrequency = computeOutOfHomeFrequency(visits);
  const consecutiveHomeDays = computeConsecutiveHomeDays(visits);
  const index = (locationEntropy + outOfHomeFrequency) / 2;
  return { index, locationEntropy, outOfHomeFrequency, consecutiveHomeDays };
}

export default function useSocialEngagement() {
  const [visits, setVisits] = useState<ActivityVisit[] | null>(null);

  useEffect(() => {
    getActivityVisits().then(setVisits);
  }, []);

  return useMemo(() => {
    if (!visits) return null;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const recent = visits.filter((v) => new Date(v.date) >= cutoff);
    let baseline: SocialBaseline | null = getSocialBaseline();

    if (!baseline) {
      const baselineVisits = visits.filter((v) => new Date(v.date) < cutoff);
      const computed = computeSocialEngagementIndex(baselineVisits);
      baseline = {
        locationEntropy: computed.locationEntropy,
        outOfHomeFrequency: computed.outOfHomeFrequency,
      };
      setSocialBaseline(baseline);
    }

    const current = computeSocialEngagementIndex(recent);

    const deviationFlags: string[] = [];
    if (baseline) {
      if (baseline.locationEntropy > 0) {
        const change =
          (current.locationEntropy - baseline.locationEntropy) /
          baseline.locationEntropy;
        if (change <= -0.3)
          deviationFlags.push(
            `entropy down ${Math.round(Math.abs(change) * 100)}%`,
          );
      }
      if (baseline.outOfHomeFrequency > 0) {
        const change =
          (current.outOfHomeFrequency - baseline.outOfHomeFrequency) /
          baseline.outOfHomeFrequency;
        if (change <= -0.3)
          deviationFlags.push(
            `out-of-home down ${Math.round(Math.abs(change) * 100)}%`,
          );
      }
    }

    return { ...current, baseline, deviationFlags };
  }, [visits]);
}

export { computeLocationEntropy, computeOutOfHomeFrequency, computeConsecutiveHomeDays };
