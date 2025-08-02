import { useState, useEffect } from "react";
import { getMileageTimeline, MileageTimelinePoint } from "@/lib/api";

export interface CumulativeMileagePoint {
  date: string;
  miles: number;
  cumulativeMiles: number;
  coordinates: [number, number][];
}

export default function useMileageTimeline(
  years?: number,
  range?: { startWeek?: number; endWeek?: number },
): CumulativeMileagePoint[] | null {
  const [raw, setRaw] = useState<MileageTimelinePoint[] | null>(null);
  const [data, setData] = useState<CumulativeMileagePoint[] | null>(null);

  useEffect(() => {
    getMileageTimeline(years).then(setRaw);
  }, [years]);

  useEffect(() => {
    if (!raw) return;
    const startOfWeek = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const sorted = [...raw].sort((a, b) => a.date.localeCompare(b.date));
    const origin = startOfWeek(new Date(sorted[0].date));
    const start = range?.startWeek ?? 0;
    const end = range?.endWeek ?? Number.MAX_SAFE_INTEGER;
    let total = 0;
    const filtered: CumulativeMileagePoint[] = [];
    for (const p of sorted) {
      const weekIndex = Math.floor(
        (startOfWeek(new Date(p.date)).getTime() - origin.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      );
      if (weekIndex < start || weekIndex > end) continue;
      total += p.miles;
      filtered.push({
        date: p.date,
        miles: p.miles,
        cumulativeMiles: total,
        coordinates: p.coordinates,
      });
    }
    setData(filtered);
  }, [raw, range?.startWeek, range?.endWeek]);

  return data;
}
