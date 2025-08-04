import { useMemo } from "react";

export type MetricPoint = Record<string, number>;

export type CorrelationMatrix<T extends MetricPoint> = {
  [K in keyof T]: { [K2 in keyof T]: number };
};

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = x.reduce((sum, v) => sum + v, 0) / n;
  const meanY = y.reduce((sum, v) => sum + v, 0) / n;
  let num = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  return denomX && denomY ? num / Math.sqrt(denomX * denomY) : 0;
}

export function computeCorrelationMatrix<T extends MetricPoint>(
  points: T[],
): CorrelationMatrix<T> {
  if (!points.length) return {} as CorrelationMatrix<T>;
  const keys = Object.keys(points[0]) as (keyof T)[];
  const series: Partial<Record<keyof T, number[]>> = {};
  for (const key of keys) {
    series[key] = points.map((p) => p[key]);
  }

  for (const key of keys) {
    if (!series[key]) {
      throw new Error(`Series for key ${String(key)} is missing`);
    }
  }

  const matrix = {} as CorrelationMatrix<T>;
  for (const k1 of keys) {
    const s1 = series[k1]!;
    matrix[k1] = {} as Record<keyof T, number>;
    for (const k2 of keys) {
      const s2 = series[k2]!;
      matrix[k1][k2] = pearson(s1, s2);
    }
  }
  return matrix;
}

export function useCorrelationMatrix<T extends MetricPoint>(
  points: T[],
): CorrelationMatrix<T> {
  return useMemo(() => computeCorrelationMatrix(points), [points]);
}

export interface ClusterNode {
  left?: ClusterNode;
  right?: ClusterNode;
  indices: number[];
  distance: number;
}

export interface ClusterResult {
  order: number[];
  tree: ClusterNode;
}

/**
 * Perform a simple agglomerative hierarchical clustering on a symmetric
 * distance matrix. The matrix should represent similarities (e.g. correlation)
 * where higher values mean closer points. The algorithm uses average linkage
 * and returns both a dendrogram tree and the seriation order of leaves.
 */
export function hierarchicalCluster(matrix: number[][]): ClusterResult {
  const n = matrix.length;
  const clusters: ClusterNode[] = Array.from({ length: n }, (_, i) => ({
    indices: [i],
    distance: 0,
  }));

  const dist = (a: ClusterNode, b: ClusterNode) => {
    let sum = 0;
    let count = 0;
    for (const i of a.indices) {
      for (const j of b.indices) {
        sum += 1 - matrix[i][j];
        count++;
      }
    }
    return sum / count;
  };

  while (clusters.length > 1) {
    let bestI = 0;
    let bestJ = 1;
    let bestD = dist(clusters[0], clusters[1]);
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const d = dist(clusters[i], clusters[j]);
        if (d < bestD) {
          bestD = d;
          bestI = i;
          bestJ = j;
        }
      }
    }
    const a = clusters[bestI];
    const b = clusters[bestJ];
    const merged: ClusterNode = {
      left: a,
      right: b,
      indices: [...a.indices, ...b.indices],
      distance: bestD,
    };
    // remove j first to not mess up indices
    clusters.splice(bestJ, 1);
    clusters.splice(bestI, 1);
    clusters.push(merged);
  }

  const traverse = (node: ClusterNode): number[] =>
    node.left && node.right
      ? [...traverse(node.left), ...traverse(node.right)]
      : node.indices;

  const tree = clusters[0];
  return { order: traverse(tree), tree };
}

export default useCorrelationMatrix;

