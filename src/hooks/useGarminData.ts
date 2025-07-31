import { useState, useEffect, useMemo } from "react";
import {
  getGarminData,
  getDailySteps,
  GarminData,
  GarminDay,
  Activity,
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

export function useMostRecentActivity(): Activity | null {
  const data = useGarminData();

  return useMemo(() => {
    if (!data || !data.activities?.length) return null;
    return [...data.activities].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];
  }, [data]);
}
