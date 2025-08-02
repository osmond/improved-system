import { useCallback, useMemo, useState } from "react";
import {
  getRouteRunHistory,
  recordRouteRun,
  type RouteRun,
  type LatLon,
} from "@/lib/api";
import { computeNoveltyTrend } from "@/lib/utils";

export default function useRouteNovelty() {
  const [runs, setRuns] = useState<RouteRun[]>(() => getRouteRunHistory());

  const { trend, prolongedLow } = useMemo(
    () => computeNoveltyTrend(runs),
    [runs],
  );

  const recordRun = useCallback((points: LatLon[]) => {
    const run = recordRouteRun(points);
    setRuns((prev) => [...prev, run]);
    return run;
  }, []);

  return [runs, trend, prolongedLow, recordRun] as const;
}
