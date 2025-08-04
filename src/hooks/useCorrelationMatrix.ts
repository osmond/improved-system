import { useMemo } from "react";
import { jStat } from "jstat";

export type MetricPoint = Record<string, number>;

export interface CorrelationCell {
  /** Pearson correlation coefficient */
  value: number;
  /** number of paired samples */
  n: number;
  /** two-tailed p-value */
  p: number;
}

export type CorrelationMatrix<T extends MetricPoint> = {
  [K in keyof T]: { [K2 in keyof T]: CorrelationCell };
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
    matrix[k1] = {} as Record<keyof T, CorrelationCell>;
    for (const k2 of keys) {
      const s2 = series[k2]!;
      const n = Math.min(s1.length, s2.length);
      const value = pearson(s1, s2);
      let p = 1;
      if (n > 2 && Math.abs(value) < 1) {
        const t = (value * Math.sqrt(n - 2)) / Math.sqrt(1 - value * value);
        p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));
      } else if (Math.abs(value) === 1) {
        p = 0;
      }
      matrix[k1][k2] = { value, n, p };
    }
  }
  return matrix;
}

export function useCorrelationMatrix<T extends MetricPoint>(
  points: T[],
): CorrelationMatrix<T> {
  return useMemo(() => computeCorrelationMatrix(points), [points]);
}

export default useCorrelationMatrix;

