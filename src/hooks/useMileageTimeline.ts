import { useState, useEffect } from "react";
import { getMileageTimeline, MileageTimelinePoint } from "@/lib/api";

export interface CumulativeMileagePoint {
  date: string;
  cumulativeMiles: number;
  coordinates: [number, number][];
}

export default function useMileageTimeline(
  years?: number,
): CumulativeMileagePoint[] | null {
  const [data, setData] = useState<CumulativeMileagePoint[] | null>(null);
  useEffect(() => {
    getMileageTimeline(years).then((points: MileageTimelinePoint[]) => {
      let total = 0;
      const cumulative = points.map((p) => {
        total += p.miles;
        return { date: p.date, cumulativeMiles: total, coordinates: p.coordinates };
      });
      setData(cumulative);
    });
  }, [years]);
  return data;
}
