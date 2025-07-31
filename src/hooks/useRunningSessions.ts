import { useState, useEffect } from 'react'
import TSNE from 'tsne-js'
import { getRunningSessions, RunningSession } from '@/lib/api'

export interface SessionPoint {
  x: number
  y: number
  cluster: number
}

function euclidean(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0))
}

function kMeans(data: number[][], k: number, iterations = 10): number[] {
  const centroids = data.slice(0, k).map((d) => d.slice())
  let assignments = new Array(data.length).fill(0)

  for (let iter = 0; iter < iterations; iter++) {
    // assign
    assignments = data.map((point) => {
      let best = 0
      let bestDist = Infinity
      centroids.forEach((c, idx) => {
        const dist = euclidean(point, c)
        if (dist < bestDist) {
          bestDist = dist
          best = idx
        }
      })
      return best
    })

    // recompute
    const sums = Array.from({ length: k }, () =>
      new Array(data[0].length).fill(0)
    )
    const counts = new Array(k).fill(0)
    data.forEach((point, i) => {
      const a = assignments[i]
      counts[a]++
      point.forEach((v, idx) => {
        sums[a][idx] += v
      })
    })
    centroids.forEach((c, idx) => {
      if (counts[idx]) {
        c.forEach((_, d) => {
          c[d] = sums[idx][d] / counts[idx]
        })
      }
    })
  }
  return assignments
}

export function useRunningSessions(): SessionPoint[] | null {
  const [points, setPoints] = useState<SessionPoint[] | null>(null)

  useEffect(() => {
    getRunningSessions().then((sessions: RunningSession[]) => {
      const features = sessions.map((s) => [s.pace, s.duration, s.heartRate])
      const tsne = new TSNE({ dim: 2, perplexity: 30, earlyExaggeration: 4 })
      tsne.init({ data: features, type: 'dense' })
      tsne.run()
      const output = tsne.getOutputScaled()
      const clusters = kMeans(output, 3)
      setPoints(
        output.map(([x, y], idx) => ({ x, y, cluster: clusters[idx] }))
      )
    })
  }, [])

  return points
}

