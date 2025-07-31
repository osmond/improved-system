import { useState, useEffect } from "react";
import { WeeklyVolumePoint, getWeeklyVolume } from "@/lib/api";

export default function useWeeklyVolume(): WeeklyVolumePoint[] | null {
  const [data, setData] = useState<WeeklyVolumePoint[] | null>(null);
  useEffect(() => {
    getWeeklyVolume().then(setData);
  }, []);
  return data;
}
