import { useState, useEffect } from 'react'
import { getRunningSessions, RunningSession } from '@/lib/api'
import TSNE from 'tsne-js'

export interface SessionPoint {
  x: number
  y: number
  cluster: number
  good: boolean
  temperature: number
  startHour: number
  pace: number
  heartRate: number
  duration: number
  lat: number
  lon: number
  humidity: number
  wind: number
  condition: string
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

export function useRunningSessions(): SessionPoint[] | null {
  const [points, setPoints] = useState<SessionPoint[] | null>(null)

  useEffect(() => {
    function expectedPace(s: RunningSession): number {
      const hour = new Date(s.start).getHours()
      const tempAdj = (s.weather.temperature - 55) * 0.02
      const humidAdj = (s.weather.humidity - 50) * 0.01
      const timeAdj = Math.abs(hour - 8) * 0.03
      const hrAdj = (s.heartRate - 140) * 0.015
      return 6.5 + tempAdj + humidAdj + timeAdj + hrAdj
    }

    getRunningSessions().then((sessions: RunningSession[]) => {
      const model = new TSNE({ dim: 2, perplexity: 5 })
      const input = sessions.map((s) => [
        s.weather.temperature,
        s.weather.humidity,
        new Date(s.start).getHours(),
        s.heartRate,
        s.pace,
      ])
      model.init({ data: input, type: 'dense' })
      for (let i = 0; i < 250; i++) {
        model.step()
      }
      const output = model.getOutputScaled()
      const labels = kMeans(output, 3)
      const data = output.map(
        ([x, y]: [number, number], idx: number) => ({
          x,
          y,
          cluster: labels[idx],
          good: sessions[idx].pace < expectedPace(sessions[idx]) - 0.2,
          temperature: sessions[idx].weather.temperature,
          startHour: new Date(sessions[idx].start).getHours(),
          pace: sessions[idx].pace,
          heartRate: sessions[idx].heartRate,
          duration: sessions[idx].duration,
          lat: sessions[idx].lat,
          lon: sessions[idx].lon,
          humidity: sessions[idx].weather.humidity,
          wind: sessions[idx].weather.wind,
          condition: sessions[idx].weather.condition,
        }),
      )
      setPoints(data)
    })
  }, [])

  return points
}
