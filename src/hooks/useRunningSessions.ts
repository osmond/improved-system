import { useState, useEffect } from 'react'
import { getRunningSessions, RunningSession } from '@/lib/api'
import { getSessionMeta } from '@/lib/sessionMeta'
import TSNE from 'tsne-js'

export interface SessionPoint {
  x: number
  y: number
  /** Unique session identifier */
  id: number
  cluster: number
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
}

export interface GoodDayTrendPoint {
  date: string
  avg: number
  lower: number
  upper: number
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

export function useRunningSessions(): {
  sessions: SessionPoint[] | null
  trend: GoodDayTrendPoint[] | null
} {
  const [points, setPoints] = useState<SessionPoint[] | null>(null)
  const [trend, setTrend] = useState<GoodDayTrendPoint[] | null>(null)

  useEffect(() => {
    function expectedPace(s: RunningSession): number {
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
      return 6.5 + tempAdj + humidAdj + windAdj + conditionAdj + timeAdj + hrAdj
    }

    getRunningSessions().then((sessions: RunningSession[]) => {
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
      const data = output.map(([x, y]: [number, number], idx: number) => {
        const expected = expectedPace(sessions[idx])
        const paceDelta = expected - sessions[idx].pace
        const confidence = baselineConfidence(sessions[idx])
        const meta = getSessionMeta(sessions[idx].id)
        return {
          x,
          y,
          id: sessions[idx].id,
          cluster: labels[idx],
          good: paceDelta > 0,
          pace: sessions[idx].pace,
          paceDelta,
          heartRate: sessions[idx].heartRate,
          confidence,
          temperature: sessions[idx].weather.temperature,
          humidity: sessions[idx].weather.humidity,
          wind: sessions[idx].weather.wind,
          startHour: new Date(sessions[idx].start ?? sessions[idx].date).getHours(),
          duration: sessions[idx].duration,
          lat: sessions[idx].lat,
          lon: sessions[idx].lon,
          condition: sessions[idx].weather.condition,
          start: sessions[idx].start ?? sessions[idx].date,
          tags: meta.tags,
          isFalsePositive: meta.isFalsePositive,
        }
      })
      setPoints(data)
      setTrend(computeTrend(data))
    })
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
        return updated
      })
    }
    window.addEventListener('sessionMetaUpdated', onMetaUpdate)
    return () => window.removeEventListener('sessionMetaUpdated', onMetaUpdate)
  }, [])

  return { sessions: points, trend }
}
