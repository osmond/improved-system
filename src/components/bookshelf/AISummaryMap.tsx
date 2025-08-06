import React, { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { UMAP } from 'umap-js'

export interface Book {
  id: string
  title: string
  highlights: string[]
}

function summarize(highlights: string[]): string {
  const text = highlights.join(' ')
  const match = text.match(/[^.!?]*[.!?]/)
  if (match) return match[0].trim()
  const words = text.split(/\s+/)
  return words.slice(0, 20).join(' ') + (words.length > 20 ? '…' : '')
}

function buildVocab(texts: string[], limit = 50): string[] {
  const counts: Record<string, number> = {}
  for (const t of texts) {
    const words = t.toLowerCase().split(/\W+/)
    for (const w of words) {
      if (!w) continue
      counts[w] = (counts[w] || 0) + 1
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w)
}

function embed(text: string, vocab: string[]): number[] {
  const words = text.toLowerCase().split(/\W+/)
  return vocab.map((term) => words.filter((w) => w === term).length)
}

export default function AISummaryMap({ books }: { books: Book[] }) {
  const points = useMemo(() => {
    if (!books.length) return []
    const summaries = books.map((b) => summarize(b.highlights))
    const vocab = buildVocab(summaries)
    const embeddings = summaries.map((s) => embed(s, vocab))
    const umap = new UMAP({ nComponents: 2, nNeighbors: Math.min(5, books.length - 1), minDist: 0.1 })
    const coords = umap.fit(embeddings)
    return books.map((b, i) => ({
      x: coords[i][0],
      y: coords[i][1],
      title: b.title,
      summary: summaries[i],
    }))
  }, [books])

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <XAxis dataKey="x" type="number" name="Dim 1" />
          <YAxis dataKey="y" type="number" name="Dim 2" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (!payload || !payload.length) return null
              const { title, summary } = payload[0].payload as any
              return (
                <div className="p-2 text-sm bg-background border rounded shadow">
                  <strong>{title}</strong>
                  <p className="mt-1 max-w-xs">{summary}</p>
                </div>
              )
            }}
          />
          <Scatter data={points} fill="hsl(var(--chart-1))" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
