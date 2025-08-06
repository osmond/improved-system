import React, { useMemo } from 'react'
import Sentiment from 'sentiment'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export interface Highlight {
  id: string
  text: string
  date: string
  book?: string
}

const analyzer = new Sentiment()

export default function MoodTrajectory({ highlights, groupBy = 'month' }: { highlights: Highlight[]; groupBy?: 'book' | 'month' }) {
  const data = useMemo(() => {
    const groups: Record<string, { total: number; count: number }> = {}
    for (const h of highlights) {
      const key = groupBy === 'book' ? h.book ?? 'Unknown' : format(new Date(h.date), 'yyyy-MM')
      const score = analyzer.analyze(h.text).score
      if (!groups[key]) groups[key] = { total: 0, count: 0 }
      groups[key].total += score
      groups[key].count += 1
    }
    return Object.entries(groups)
      .map(([k, v]) => ({ key: k, score: v.total / v.count }))
      .sort((a, b) => a.key.localeCompare(b.key))
  }, [highlights, groupBy])

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="key" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-2))" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
