import { useState, useEffect, useRef } from 'react'
import { getRunningSessions, RunningSession } from '@/lib/api'
import { getAllSessionMeta, getSessionMeta } from '@/lib/sessionStore'
import TSNE from 'tsne-js'
import { UMAP } from 'umap-js'
import { getClusterLabel, setClusterLabel } from '@/lib/clusterLabelStore'

export interface SessionFactor {
  /** Human friendly description of what helped or hurt */
  label: string
  /** Impact on pace in min/mi (positive = faster, negative = slower) */
  impact: number
}

export interface SessionPoint {
  x: number
  y: number
  /** Unique session identifier */
  id: number
  cluster: number
  /** Distance from this run to its cluster centroid */
  distance: number
  descriptor: string
  good: boolean
  pace: number
  paceDelta: number
  heartRate: number
  /** Baseline robustness from data completeness and weather accuracy (0-1) */
  confidence: number
  temperature: number
  humidity: number
  wind: number
  startHour: number
  duration: number
  lat: number
  lon: number
  condition: string
  /** ISO timestamp when the session started */
  start: string
  tags: string[]
  isFalsePositive: boolean
  feltHarder: boolean
  factors: SessionFactor[]
}

export interface GoodDayTrendPoint {
  date: string
  avg: number
  lower: number
  upper: number
}

export interface ClusterMetrics {
  goodRuns: number
  variance: number
  boundaryBreaches: number
  flaggedRuns: number
}

export interface AxisHint {
  label: string
  x: number
  y: number
}

export function computeClusterMetrics(
  points: SessionPoint[],
): Record<number, ClusterMetrics> {
  const clusters = Array.from(new Set(points.map((p) => p.cluster)))
  const result: Record<number, ClusterMetrics> = {}
  for (const c of clusters) {
    const pts = points.filter((p) => p.cluster === c)
    const goodRuns = pts.filter((p) => p.good).length
    const mean = pts.reduce((s, p) => s + p.paceDelta, 0) / pts.length
    const variance =
      pts.reduce((s, p) => s + (p.paceDelta - mean) ** 2, 0) / pts.length
    const std = Math.sqrt(variance)
    const boundaryBreaches = pts.filter(
      (p) => Math.abs(p.paceDelta - mean) > 2 * std,
    ).length
    const flaggedRuns = pts.filter((p) => p.feltHarder).length
    result[c] = { goodRuns, variance, boundaryBreaches, flaggedRuns }
  }
  return result
}

function kMeans(
  data: number[][],
  k: number,
  iterations = 10,
  weights: number[] = [],
): number[] {
  let centroids = data.slice(0, k).map((p) => [...p])
  const labels = new Array(data.length).fill(0)
  const w = weights.length ? weights : new Array(data.length).fill(1)

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < data.length; i++) {
      let best = 0
      let bestDist = Infinity
      for (let j = 0; j < k; j++) {
        const dist = Math.hypot(
          data[i][0] - centroids[j][0],
          data[i][1] - centroids[j][1],
        )
        if (dist < bestDist) {
          bestDist = dist
          best = j
        }
      }
      labels[i] = best
    }

    const sums = Array.from({ length: k }, () => [0, 0])
    const counts = new Array(k).fill(0)

    for (let i = 0; i < data.length; i++) {
      const label = labels[i]
      const weight = w[i]
      sums[label][0] += data[i][0] * weight
      sums[label][1] += data[i][1] * weight
      counts[label] += weight
    }

    for (let j = 0; j < k; j++) {
      if (counts[j]) {
        centroids[j] = [sums[j][0] / counts[j], sums[j][1] / counts[j]]
      }
    }
  }

  return labels
}

function computePCA(data: number[][]): AxisHint[] {
  const n = data.length
  const m = data[0].length
  const means = Array(m).fill(0)
  for (const row of data) for (let j = 0; j < m; j++) means[j] += row[j]
  for (let j = 0; j < m; j++) means[j] /= n
  const centered = data.map((row) => row.map((v, j) => v - means[j]))
  const cov = Array.from({ length: m }, () => Array(m).fill(0))
  for (const row of centered) {
    for (let i = 0; i < m; i++) {
      for (let j = i; j < m; j++) {
        cov[i][j] += row[i] * row[j]
      }
    }
  }
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) {
      cov[i][j] /= n - 1
      cov[j][i] = cov[i][j]
    }
  }
  function powerIteration(mat: number[][]): { vec: number[]; val: number } {
    let vec = Array(m)
      .fill(0)
      .map(() => Math.random())
    for (let iter = 0; iter < 50; iter++) {
      const next = mat.map((row) => row.reduce((s, v, j) => s + v * vec[j], 0))
      const norm = Math.hypot(...next)
      vec = next.map((v) => v / norm)
    }
    const val = vec.reduce(
      (s, v, i) => s + v * mat[i].reduce((r, w, j) => r + w * vec[j], 0),
      0,
    )
    return { vec, val }
  }
  const comps: number[][] = []
  let mat = cov.map((row) => row.slice())
  for (let k = 0; k < 2; k++) {
    const { vec, val } = powerIteration(mat)
    comps.push(vec)
    for (let i = 0; i < m; i++)
      for (let j = 0; j < m; j++) mat[i][j] -= val * vec[i] * vec[j]
  }
  const features = ['Temperature', 'Humidity', 'Hour', 'HeartRate', 'Pace']
  const hints = features.map((label, i) => ({
    label,
    x: comps[0][i],
    y: comps[1][i],
  }))
  const max = Math.max(
    ...hints.map((h) => Math.max(Math.abs(h.x), Math.abs(h.y))),
    1,
  )
  return hints.map((h) => ({ label: h.label, x: h.x / max, y: h.y / max }))
}

function computeTrend(
  points: SessionPoint[],
  windowSize = 7,
): GoodDayTrendPoint[] {
  const byDate: Record<string, { good: number; total: number }> = {}
  for (const p of points) {
    if (p.isFalsePositive) continue
    const key = p.start.slice(0, 10)
    if (!byDate[key]) byDate[key] = { good: 0, total: 0 }
    byDate[key].total++
    if (p.good) byDate[key].good++
  }
  const dates = Object.keys(byDate).sort()
  const daily = dates.map((d) => ({ date: d, ...byDate[d] }))
  const result: GoodDayTrendPoint[] = []
  for (let i = 0; i < daily.length; i++) {
    const win = daily.slice(Math.max(0, i - windowSize + 1), i + 1)
    const good = win.reduce((s, d) => s + d.good, 0)
    const total = win.reduce((s, d) => s + d.total, 0)
    const p = total ? good / total : 0
    const z = 1.96
    const margin = total ? z * Math.sqrt((p * (1 - p)) / total) : 0
    result.push({
      date: daily[i].date,
      avg: p,
      lower: Math.max(0, p - margin),
      upper: Math.min(1, p + margin),
    })
  }
  return result
}

function isPresent(v: unknown) {
  return v !== null && v !== undefined && !(typeof v === 'number' && isNaN(v))
}

function baselineConfidence(s: RunningSession): number {
  const baseFields = [s.pace, s.duration, s.heartRate, s.start ?? s.date, s.lat, s.lon]
  const completeness = baseFields.filter(isPresent).length / baseFields.length
  const weatherFields = [s.weather.temperature, s.weather.humidity, s.weather.wind]
  const weatherAccuracy = weatherFields.filter(isPresent).length / weatherFields.length
  return +(0.5 * completeness + 0.5 * weatherAccuracy).toFixed(2)
}

export function computeExpected(s: RunningSession): { expected: number; factors: SessionFactor[] } {
  const hour = new Date(s.start ?? s.date).getHours()
  const temp = s.weather.temperature || 55
  const humidity = s.weather.humidity || 50
  const wind = s.weather.wind || 0
  const tempAdj = (temp - 55) * 0.02
  const humidAdj = (humidity - 50) * 0.01
  const windAdj = wind * 0.01
  const conditionAdjMap: Record<string, number> = {
    Clear: -0.05,
    Cloudy: 0.02,
    Fog: 0.05,
    Drizzle: 0.07,
    Rain: 0.1,
    Snow: 0.15,
    Storm: 0.2,
  }
  const conditionAdj = conditionAdjMap[s.weather.condition] ?? 0
  const timeAdj = Math.abs(hour - 8) * 0.03
  const hrAdj = (s.heartRate - 140) * 0.015

  const factors: SessionFactor[] = []
  if (tempAdj !== 0)
    factors.push({ label: tempAdj < 0 ? 'Cool temps' : 'Heat', impact: -tempAdj })
  if (humidAdj !== 0)
    factors.push({ label: humidAdj < 0 ? 'Dry air' : 'Humidity', impact: -humidAdj })
  if (windAdj !== 0)
    factors.push({ label: windAdj < 0 ? 'Tailwind' : 'Headwind', impact: -windAdj })
  if (conditionAdj !== 0)
    factors.push({ label: conditionAdj < 0 ? 'Clear skies' : s.weather.condition, impact: -conditionAdj })
  if (timeAdj !== 0)
    factors.push({ label: 'Timing', impact: -timeAdj })
  if (hrAdj !== 0)
    factors.push({ label: hrAdj < 0 ? 'Stable HR' : 'High HR', impact: -hrAdj })

  return {
    expected: 6.5 + tempAdj + humidAdj + windAdj + conditionAdj + timeAdj + hrAdj,
    factors,
  }
}

function tempLabel(t: number): string {
  if (t < 45) return 'Cold'
  if (t < 60) return 'Cool'
  if (t < 75) return 'Warm'
  return 'Hot'
}

function hourLabel(h: number): string {
  if (h < 6) return 'Early'
  if (h < 12) return 'Morning'
  if (h < 18) return 'Afternoon'
  return 'Evening'
}

function deltaLabel(d: number): string {
  if (d > 0.3) return 'High Δ'
  if (d < -0.3) return 'Low Δ'
  return 'Mid Δ'
}

function makeClusterLabel(t: number, h: number, d: number): string {
  return `${tempLabel(t)} ${hourLabel(h)} ${deltaLabel(d)}`
}

export function useRunningSessions(
  method: 'tsne' | 'umap' = 'tsne',
): {
  sessions: SessionPoint[] | null
  trend: GoodDayTrendPoint[] | null
  clusterStats: Record<number, ClusterMetrics> | null
  axisHints: AxisHint[] | null
  error: Error | null
} {
  const [points, setPoints] = useState<SessionPoint[] | null>(null)
  const [trend, setTrend] = useState<GoodDayTrendPoint[] | null>(null)
  const [clusterStats, setClusterStats] = useState<
    Record<number, ClusterMetrics> | null
  >(null)
  const [axisHints, setAxisHints] = useState<AxisHint[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const lastCount = useRef(0)

  useEffect(() => {
    lastCount.current = 0
    async function load() {
      try {
        const sessions = await getRunningSessions()
        if (sessions.length === lastCount.current && points) return
        lastCount.current = sessions.length
        const input = sessions.map((s) => [
          s.weather.temperature,
          s.weather.humidity,
          new Date(s.start ?? s.date).getHours(),
          s.heartRate,
          s.pace,
        ])
        let output: number[][]
        if (method === 'umap') {
          const umap = new UMAP({ nComponents: 2 })
          const raw = umap.fit(input)
          const xs = raw.map((p) => p[0])
          const ys = raw.map((p) => p[1])
          const xMin = Math.min(...xs)
          const xMax = Math.max(...xs)
          const yMin = Math.min(...ys)
          const yMax = Math.max(...ys)
          output = raw.map(([x, y]) => [
            ((x - xMin) / (xMax - xMin)) * 2 - 1,
            ((y - yMin) / (yMax - yMin)) * 2 - 1,
          ])
        } else {
          const model = new TSNE({ dim: 2, perplexity: 5 })
          model.init({ data: input, type: 'dense' })
          model.run()
          output = model.getOutputScaled()
        }
        const metaMap = getAllSessionMeta()
        const weights = sessions.map((s) =>
          metaMap[s.id]?.feltHarder ? 1.5 : 1,
        )
        const labels = kMeans(output, 3, 10, weights)
        const preliminary = output.map(([x, y]: [number, number], idx: number) => {
          const session = sessions[idx]
          const { expected, factors } = computeExpected(session)
          const paceDelta = expected - session.pace
          const confidence = baselineConfidence(session)
          const meta = metaMap[session.id] || {
            tags: [],
            isFalsePositive: false,
            feltHarder: false,
          }
          return {
            x,
            y,
            id: session.id,
            cluster: labels[idx],
            good: paceDelta > 0,
            pace: session.pace,
            paceDelta,
            heartRate: session.heartRate,
            confidence,
            temperature: session.weather.temperature,
            humidity: session.weather.humidity,
            wind: session.weather.wind,
            startHour: new Date(session.start ?? session.date).getHours(),
            duration: session.duration,
            lat: session.lat,
            lon: session.lon,
            condition: session.weather.condition,
            start: session.start ?? session.date,
            tags: meta.tags,
            isFalsePositive: meta.isFalsePositive,
            feltHarder: meta.feltHarder,
            factors,
          }
        })

        const descriptorMap: Record<number, string> = {}
        const centroids: Record<number, { x: number; y: number }> = {}
        const uniqueClusters = Array.from(new Set(labels))
        for (const c of uniqueClusters) {
          const clusterSessions = preliminary.filter((p) => p.cluster === c)
          const weightSum = clusterSessions.reduce(
            (sum, s) => sum + (s.feltHarder ? 1.5 : 1),
            0,
          )
          const avgTemp =
            clusterSessions.reduce(
              (sum, s) => sum + s.temperature * (s.feltHarder ? 1.5 : 1),
              0,
            ) / weightSum
          const avgHour =
            clusterSessions.reduce(
              (sum, s) => sum + s.startHour * (s.feltHarder ? 1.5 : 1),
              0,
            ) / weightSum
          const avgDelta =
            clusterSessions.reduce(
              (sum, s) => sum + s.paceDelta * (s.feltHarder ? 1.5 : 1),
              0,
            ) / weightSum
          const avgX =
            clusterSessions.reduce(
              (sum, s) => sum + s.x * (s.feltHarder ? 1.5 : 1),
              0,
            ) / weightSum
          const avgY =
            clusterSessions.reduce(
              (sum, s) => sum + s.y * (s.feltHarder ? 1.5 : 1),
              0,
            ) / weightSum
          centroids[c] = { x: avgX, y: avgY }
          const existing = getClusterLabel(c)
          const label = existing ?? makeClusterLabel(avgTemp, avgHour, avgDelta)
          descriptorMap[c] = label
          if (!existing) setClusterLabel(c, label)
        }

        const data = preliminary.map((p) => ({
          ...p,
          descriptor: descriptorMap[p.cluster],
          distance: Math.hypot(
            p.x - centroids[p.cluster].x,
            p.y - centroids[p.cluster].y,
          ),
        }))

        setPoints(data)
        setTrend(computeTrend(data))
        setClusterStats(computeClusterMetrics(data))
        setAxisHints(computePCA(input))
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load sessions'))
      }
    }
    load()
    function onUpdate() {
      lastCount.current = 0
      load()
    }
    window.addEventListener('runningSessionsUpdated', onUpdate)
    return () => window.removeEventListener('runningSessionsUpdated', onUpdate)
  }, [method])

  useEffect(() => {
    function onMetaUpdate() {
      setPoints((prev) => {
        if (!prev) return prev
        const updated = prev.map((p) => {
          const meta = getSessionMeta(p.id)
          return {
            ...p,
            tags: meta.tags,
            isFalsePositive: meta.isFalsePositive,
            feltHarder: meta.feltHarder,
          }
        })
        setTrend(computeTrend(updated))
        setClusterStats(computeClusterMetrics(updated))
        return updated
      })
    }
    window.addEventListener('sessionMetaUpdated', onMetaUpdate)
    return () => window.removeEventListener('sessionMetaUpdated', onMetaUpdate)
  }, [])

  return { sessions: points, trend, clusterStats, axisHints, error }
}
