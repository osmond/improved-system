import { useMemo } from "react";

export type MetricPoint = Record<string, number>;

export interface CorrelationStats {
  /** Pearson correlation coefficient */
  value: number;
  /** Sample size used to compute the correlation */
  n: number;
  /** Two-tailed p-value for the correlation */
  p: number;
  /** Optional rolling correlation values for sparkline rendering */
  sparkline?: number[];
}

export type CorrelationMatrix<T extends MetricPoint> = {
  [K in keyof T]: { [K2 in keyof T]: CorrelationStats };
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

// --- Statistical helper functions ---

/** Natural logarithm of the gamma function */
function gammaln(x: number): number {
  const cof = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -0.000005395239384953,
  ];
  let ser = 1.000000000190015;
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  for (let j = 0; j < cof.length; j++) {
    ser += cof[j] / ++y;
  }
  return Math.log(2.5066282746310005 * ser / x) - tmp;
}

function betacf(a: number, b: number, x: number): number {
  const MAXITER = 100;
  const EPS = 3e-7;
  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let m = 1, m2 = 2; m <= MAXITER; m++, m2 += 2) {
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

function betainc(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) throw new Error("x out of range in betainc");
  if (x === 0 || x === 1) return x;
  const bt = Math.exp(
    gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x),
  );
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betacf(a, b, x)) / a;
  } else {
    return 1 - (bt * betacf(b, a, 1 - x)) / b;
  }
}

function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  const bt = betainc(x, a, b);
  return t > 0 ? 1 - 0.5 * bt : 0.5 * bt;
}

function pValueFromCorrelation(r: number, n: number): number {
  if (n < 3) return 1;
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const p = 2 * (1 - tCDF(Math.abs(t), n - 2));
  return p;
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
    matrix[k1] = {} as Record<keyof T, CorrelationStats>;
    for (const k2 of keys) {
      const s2 = series[k2]!;
      const n = Math.min(s1.length, s2.length);
      const value = pearson(s1, s2);
      const p = pValueFromCorrelation(value, n);
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

