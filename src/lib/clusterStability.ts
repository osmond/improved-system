import { SessionPoint } from "@/hooks/useRunningSessions";

/**
 * Compute a stability score for each cluster based on rolling variance of its centroid.
 * Lower variance -> higher stability. Score is 1 / (1 + variance).
 */
export function computeClusterStability(
  points: SessionPoint[],
  window = 5,
): Record<number, number> {
  const byCluster: Record<number, SessionPoint[]> = {};
  for (const p of points) {
    if (!byCluster[p.cluster]) byCluster[p.cluster] = [];
    byCluster[p.cluster].push(p);
  }

  const result: Record<number, number> = {};
  for (const key in byCluster) {
    const pts = byCluster[key].slice().sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
    const centroids: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
      const startIdx = Math.max(0, i - window + 1);
      const subset = pts.slice(startIdx, i + 1);
      const cx = subset.reduce((s, p) => s + p.x, 0) / subset.length;
      const cy = subset.reduce((s, p) => s + p.y, 0) / subset.length;
      centroids.push([cx, cy]);
    }
    const meanCx = centroids.reduce((s, c) => s + c[0], 0) / centroids.length;
    const meanCy = centroids.reduce((s, c) => s + c[1], 0) / centroids.length;
    const variance =
      centroids.reduce(
        (s, [cx, cy]) => s + (cx - meanCx) ** 2 + (cy - meanCy) ** 2,
        0,
      ) / centroids.length;
    result[Number(key)] = 1 / (1 + variance);
  }
  return result;
}

export default computeClusterStability;
