import { useState, useEffect, useMemo } from "react";
import {
  getGarminData,
  getDailySteps,
  GarminData,
  GarminDay,
  Activity,
  getSeasonalBaselines,
  SeasonalBaseline,
} from "@/lib/api";

export function useGarminData(): GarminData | null {
  const [data, setData] = useState<GarminData | null>(null);
  useEffect(() => {
    getGarminData().then(setData);
  }, []);
  return data;
}

export function useGarminDays(): GarminDay[] | null {
  const [days, setDays] = useState<GarminDay[] | null>(null);

  useEffect(() => {
    getDailySteps().then(setDays);
  }, []);

  return useMemo(() => {
    if (!days) return days;
    return [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [days]);
}

export const useDailySteps = useGarminDays;

export function useGarminDaysLazy(open: boolean): GarminDay[] | null {
  const [days, setDays] = useState<GarminDay[] | null>(null);

  useEffect(() => {
    if (open && !days) {
      getDailySteps().then(setDays);
    }
  }, [open]);

  return useMemo(() => {
    if (!days) return days;
    return [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [days]);
}

export function useMostRecentActivity(): Activity | null {
  const data = useGarminData();

  return useMemo(() => {
    if (!data || !data.activities?.length) return null;
    return [...data.activities].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];
  }, [data]);
}

export function useSeasonalBaseline(): SeasonalBaseline[] | null {
  const [baseline, setBaseline] = useState<SeasonalBaseline[] | null>(null)

  useEffect(() => {
    getSeasonalBaselines().then(setBaseline)
  }, [])

  return baseline
}

export interface MonthlyStepsProjection {
  monthTotal: number;
  projectedTotal: number;
  goalTotal: number;
  daysInMonth: number;
  onTrack: boolean;
  pctOfGoal: number;
}

export function computeMonthlyStepProjection(
  days: GarminDay[],
  goalPerDay = 10000,
): MonthlyStepsProjection {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDays = days.filter((d) => {
    const dt = new Date(d.date);
    return dt.getMonth() === month && dt.getFullYear() === year;
  });
  const total = monthDays.reduce((sum, d) => sum + d.steps, 0);
  const recorded = monthDays.length;
  const avg = recorded ? total / recorded : 0;
  const projected = avg * daysInMonth;
  const goalTotal = goalPerDay * daysInMonth;
  const pctOfGoal = goalTotal === 0 ? 0 : (projected / goalTotal) * 100;
  return {
    monthTotal: total,
    projectedTotal: projected,
    goalTotal,
    daysInMonth,
    onTrack: projected >= goalTotal,
    pctOfGoal,
  };
}

export function useMonthlyStepsProjection(
  goalPerDay = 10000,
): MonthlyStepsProjection | null {
  const days = useGarminDays();
  return useMemo(() => {
    if (!days) return null;
    return computeMonthlyStepProjection(days, goalPerDay);
  }, [days, goalPerDay]);
}
