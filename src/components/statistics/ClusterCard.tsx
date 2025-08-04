"use client"

import { useState } from "react"
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
} from "@/ui/chart"
import { Card } from "@/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet"
import type { SessionPoint } from "@/hooks/useRunningSessions"

interface ClusterCardProps {
  data: SessionPoint[]
  color: string
}

export default function ClusterCard({ data, color }: ClusterCardProps) {
  const [open, setOpen] = useState(false)

  if (!data.length) return null

  const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length
  const avgStart = data.reduce((sum, d) => sum + d.startHour, 0) / data.length
  const descriptor = data[0]?.descriptor ?? ""

  const sparkData = data
    .map((d, i) => ({ index: i, delta: d.paceDelta }))
    .sort((a, b) => a.index - b.index)

  const config = {
    delta: { label: "Δ Pace", color },
  }

  return (
    <>
      <button
        className="w-full text-left"
        onClick={() => setOpen(true)}
      >
        <Card className="p-2 space-y-1">
          <ChartContainer className="h-16 w-full" config={config}>
            <LineChart data={sparkData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <XAxis dataKey="index" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Line
                type="monotone"
                dataKey="delta"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
          <p className="text-xs text-center">{descriptor}</p>
          <p className="text-xs text-muted-foreground text-center">
            Avg temp {avgTemp.toFixed(1)}°F · Start {avgStart.toFixed(0)}h
          </p>
        </Card>
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle>{descriptor}</SheetTitle>
          </SheetHeader>
          <ChartContainer className="h-64 mt-4" config={{}}>
            <ScatterChart>
              <XAxis type="number" dataKey="x" />
              <YAxis type="number" dataKey="y" />
              <Scatter data={data} fill={color} />
            </ScatterChart>
          </ChartContainer>
        </SheetContent>
      </Sheet>
    </>
  )
}

