import { useMemo } from "react";

/**
 * Compute the Acute:Chronic Workload Ratio (ACWR).
 * @param loads Array of daily training load values (oldest -> newest).
 * @returns The ratio of the 7‑day average load to the 28‑day average load.
 */
export function useAcwr(loads: number[]): number {
  return useMemo(() => {
    if (!loads || !loads.length) return 0;
    const last7 = loads.slice(-7);
    const last28 = loads.slice(-28);
    const recent7 = last7.reduce((sum, v) => sum + v, 0) / last7.length;
    const recent28 = last28.reduce((sum, v) => sum + v, 0) / last28.length;
    if (recent28 === 0) return 0;
    return recent7 / recent28;
  }, [loads]);
}

export default useAcwr;
