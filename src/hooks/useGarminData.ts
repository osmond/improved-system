import { useState, useEffect } from "react";
import { getGarminData, GarminData } from "@/lib/api";

export function useGarminData(): GarminData | null {
  const [data, setData] = useState<GarminData | null>(null);
  useEffect(() => {
    getGarminData().then(setData);
  }, []);
  return data;
}
