import { useState, useEffect } from "react";
import { getGarminData, getDailySteps, GarminData, GarminDay } from "@/lib/api";

export function useGarminData(): GarminData | null {
  const [data, setData] = useState<GarminData | null>(null);
  useEffect(() => {
    getGarminData().then(setData);
  }, []);
  return data;
}

export function useDailySteps(): GarminDay[] | null {
  const [data, setData] = useState<GarminDay[] | null>(null);
  useEffect(() => {
    getDailySteps().then(setData);
  }, []);
  return data;
}
