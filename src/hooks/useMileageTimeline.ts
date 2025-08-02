import { useState, useEffect } from "react";
import { getMileageTimeline, MileageTimelinePoint } from "@/lib/api";

export interface CumulativeMileagePoint {
  week: string;
  cumulativeMiles: number;
  path: string;
}

export default function useMileageTimeline(): CumulativeMileagePoint[] | null {
  const [data, setData] = useState<CumulativeMileagePoint[] | null>(null);
  useEffect(() => {
    getMileageTimeline().then((points: MileageTimelinePoint[]) => {
      let total = 0;
      const cumulative = points.map((p) => {
        total += p.miles;
        return { week: p.week, cumulativeMiles: total, path: p.path };
      });
      setData(cumulative);
    });
  }, []);
  return data;
}
