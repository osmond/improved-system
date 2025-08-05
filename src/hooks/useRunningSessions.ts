import { useState, useEffect } from 'react'
import { getRunningSessions, RunningSession } from '@/lib/api'
import { getAllSessionMeta, getSessionMeta } from '@/lib/sessionStore'
import TSNE from 'tsne-js'
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
}

function computeClusterMetrics(
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
    result[c] = { goodRuns, variance, boundaryBreaches }
  }
  return result
}

function kMeans(data: number[][], k: number, iterations = 10): number[] {
  let centroids = data.slice(0, k).map((p) => [...p])
  const labels = new Array(data.length).fill(0)

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
      sums[label][0] += data[i][0]
      sums[label][1] += data[i][1]
      counts[label]++
    }

    for (let j = 0; j < k; j++) {
      if (counts[j]) {
        centroids[j] = [sums[j][0] / counts[j], sums[j][1] / counts[j]]
      }
    }
  }

  return labels
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

export function useRunningSessions(): {
  sessions: SessionPoint[] | null
  trend: GoodDayTrendPoint[] | null
  clusterStats: Record<number, ClusterMetrics> | null
  error: Error | null
} {
  const [points, setPoints] = useState<SessionPoint[] | null>(null)
  const [trend, setTrend] = useState<GoodDayTrendPoint[] | null>(null)
  const [clusterStats, setClusterStats] = useState<
    Record<number, ClusterMetrics> | null
  >(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const sessions = await getRunningSessions()
        const model = new TSNE({ dim: 2, perplexity: 5 })
        const input = sessions.map((s) => [
          s.weather.temperature,
          s.weather.humidity,
          new Date(s.start ?? s.date).getHours(),
          s.heartRate,
          s.pace,
        ])
        model.init({ data: input, type: 'dense' })
        model.run()
        const output = model.getOutputScaled()
        const labels = kMeans(output, 3)
        const metaMap = getAllSessionMeta()
        const preliminary = output.map(([x, y]: [number, number], idx: number) => {
          const session = sessions[idx]
          const { expected, factors } = computeExpected(session)
          const paceDelta = expected - session.pace
          const confidence = baselineConfidence(session)
          const meta = metaMap[session.id] || { tags: [], isFalsePositive: false }
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
            factors,
          }
        })

        const descriptorMap: Record<number, string> = {}
        const uniqueClusters = Array.from(new Set(labels))
        for (const c of uniqueClusters) {
          const clusterSessions = preliminary.filter((p) => p.cluster === c)
          const avgTemp =
            clusterSessions.reduce((sum, s) => sum + s.temperature, 0) /
            clusterSessions.length
          const avgHour =
            clusterSessions.reduce((sum, s) => sum + s.startHour, 0) /
            clusterSessions.length
          const avgDelta =
            clusterSessions.reduce((sum, s) => sum + s.paceDelta, 0) /
            clusterSessions.length
          const existing = getClusterLabel(c)
          const label = existing ?? makeClusterLabel(avgTemp, avgHour, avgDelta)
          descriptorMap[c] = label
          if (!existing) setClusterLabel(c, label)
        }

        const data = preliminary.map((p) => ({
          ...p,
          descriptor: descriptorMap[p.cluster],
        }))

        setPoints(data)
        setTrend(computeTrend(data))
        setClusterStats(computeClusterMetrics(data))
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load sessions'))
      }
    }
    load()
  }, [])

  useEffect(() => {
    function onMetaUpdate() {
      setPoints((prev) => {
        if (!prev) return prev
        const updated = prev.map((p) => {
          const meta = getSessionMeta(p.id)
          return { ...p, tags: meta.tags, isFalsePositive: meta.isFalsePositive }
        })
        setTrend(computeTrend(updated))
        setClusterStats(computeClusterMetrics(updated))
        return updated
      })
    }
    window.addEventListener('sessionMetaUpdated', onMetaUpdate)
    return () => window.removeEventListener('sessionMetaUpdated', onMetaUpdate)
  }, [])

  return { sessions: points, trend, clusterStats, error }
}
