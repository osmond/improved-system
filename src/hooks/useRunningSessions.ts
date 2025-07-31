import { useState, useEffect } from 'react'
import { getRunningSessions, RunningSession } from '@/lib/api'
import TSNE from 'tsne-js'

export interface SessionPoint {
  x: number
  y: number
  cluster: number
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

    for (let j = 0; j < k; j++) {
      const pts = data.filter((_, idx) => labels[idx] === j)
      if (pts.length) {
        centroids[j] = [
          pts.reduce((sum, p) => sum + p[0], 0) / pts.length,
          pts.reduce((sum, p) => sum + p[1], 0) / pts.length,
        ]
      }
    }
  }

  return labels
}

export function useRunningSessions(): SessionPoint[] | null {
  const [points, setPoints] = useState<SessionPoint[] | null>(null)

  useEffect(() => {
    getRunningSessions().then((sessions: RunningSession[]) => {
      const model = new TSNE({ dim: 2, perplexity: 5 })
      const input = sessions.map((s) => [s.pace, s.duration, s.heartRate])
      model.init({ data: input, type: 'dense' })
      for (let i = 0; i < 250; i++) {
        model.step()
      }
      const output = model.getOutputScaled()
      const labels = kMeans(output, 3)
      const data = output.map(([x, y], idx) => ({ x, y, cluster: labels[idx] }))
      setPoints(data)
    })
  }, [])

  return points
}
