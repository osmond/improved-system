'use client'

import WeeklyComparisonChart from '@/components/trends/WeeklyComparisonChart'

export const description = 'Compare this week with the same week last year'

export default function GhostSelfRivalChart() {
  return <WeeklyComparisonChart metric="steps" />
}
