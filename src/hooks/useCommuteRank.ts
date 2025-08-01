import { useEffect, useState } from 'react'
import { getRouteSessions, type RouteSession } from '@/lib/api'

export interface CommuteRankItem {
  route: string
  score: number
}

function variance(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((s, v) => s + v, 0) / values.length
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
}

export function computeCommuteScore(sessions: RouteSession[]): number {
  if (sessions.length === 0) return 0
  const paces: number[] = []
  const heartRates: number[] = []
  sessions.forEach((s) => {
    const avgHr =
      s.paceDistribution.reduce((sum, b) => sum + b.upper, 0) /
      s.paceDistribution.length
    heartRates.push(avgHr)
    s.paceDistribution.forEach((b) => {
      const [m, sec] = b.bin.split(':').map(Number)
      const pace = m + (sec || 0) / 60
      for (let i = 0; i < b.upper; i++) {
        paces.push(pace)
      }
    })
  })
  const paceVar = variance(paces)
  const hrVar = variance(heartRates)
  const dates = sessions
    .map((s) => new Date(s.date).getTime())
    .sort((a, b) => a - b)
  const gaps = dates.slice(1).map((d, i) => d - dates[i])
  const timeVar = variance(gaps)
  const score =
    ((1 / (1 + paceVar)) + (1 / (1 + hrVar)) + (1 / (1 + timeVar / 86400000))) /
    3
  return +(score * 100).toFixed(2)
}

export default function useCommuteRank(routes: string[]): CommuteRankItem[] | null {
  const [data, setData] = useState<CommuteRankItem[] | null>(null)

  useEffect(() => {
    let active = true
    Promise.all(routes.map((r) => getRouteSessions(r))).then((results) => {
      if (!active) return
      const scores = results.map((sessions, idx) => ({
        route: routes[idx],
        score: computeCommuteScore(sessions),
      }))
      scores.sort((a, b) => b.score - a.score)
      setData(scores)
    })
    return () => {
      active = false
    }
  }, [routes.join('|')])

  return data
}
