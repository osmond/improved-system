import { useState, useEffect } from "react";
import { WeeklyVolumePoint, getWeeklyVolumeHistory } from "@/lib/api";

export default function useWeeklyVolumeHistory(
  years: number = 20,
): WeeklyVolumePoint[] | null {
  const [data, setData] = useState<WeeklyVolumePoint[] | null>(null);
  useEffect(() => {
    getWeeklyVolumeHistory(years).then(setData);
  }, [years]);
  return data;
}
