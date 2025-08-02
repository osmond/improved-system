// src/lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function minutesSince(date: string | number | Date): number {
  const d = new Date(date)
  return Math.floor((Date.now() - d.getTime()) / 60000)
}

export function generateTrendMessage(): string {
  const direction = Math.random() < 0.5 ? 'up' : 'down'
  const percentage = (Math.random() * (8 - 3) + 3).toFixed(1)
  return `Trending ${direction} by ${percentage}% this month`
}

import type { RouteRun, MetricDay } from './api'

export function computeNoveltyTrend(
  runs: RouteRun[],
  windowDays = 7,
  threshold = 0.3,
): { trend: MetricDay[]; prolongedLow: boolean } {
  const sorted = [...runs].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp),
  )
  const trend: MetricDay[] = []
  for (const run of sorted) {
    const current = new Date(run.timestamp)
    const windowStart = new Date(current)
    windowStart.setDate(current.getDate() - (windowDays - 1))
    const windowRuns = sorted.filter((r) => {
      const d = new Date(r.timestamp)
      return d >= windowStart && d <= current
    })
    const avg =
      windowRuns.reduce((sum, r) => sum + r.novelty, 0) / windowRuns.length
    trend.push({ date: run.timestamp.slice(0, 10), value: +avg.toFixed(3) })
  }
  const prolongedLow =
    trend.length >= windowDays &&
    trend.slice(-windowDays).every((t) => t.value < threshold)
  return { trend, prolongedLow }
}

