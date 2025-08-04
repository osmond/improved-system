import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RunComparisonPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: SessionPoint | null
  clusterPoints: SessionPoint[]
  allSessions: SessionPoint[]
}

function generateSeries(base: number) {
  return Array.from({ length: 10 }, (_, i) => ({
    t: i,
    v: +(base + Math.sin(i / 2) * 0.1).toFixed(2),
  }))
}

export default function RunComparisonPanel({
  open,
  onOpenChange,
  session,
  clusterPoints,
  allSessions,
}: RunComparisonPanelProps) {
  if (!session) return null

  const clusterAvg = React.useMemo(() => {
    const pace = clusterPoints.reduce((s, d) => s + d.pace, 0) / clusterPoints.length
    const hr = clusterPoints.reduce((s, d) => s + d.heartRate, 0) / clusterPoints.length
    return { pace, heartRate: hr }
  }, [clusterPoints])

  const typicalAvg = React.useMemo(() => {
    const pace = allSessions.reduce((s, d) => s + d.pace, 0) / allSessions.length
    const hr = allSessions.reduce((s, d) => s + d.heartRate, 0) / allSessions.length
    return { pace, heartRate: hr }
  }, [allSessions])

  const paceSeries = React.useMemo(() => {
    const run = generateSeries(session.pace)
    const cluster = generateSeries(clusterAvg.pace)
    const typical = generateSeries(typicalAvg.pace)
    return run.map((_, i) => ({
      t: i,
      run: run[i].v,
      cluster: cluster[i].v,
      typical: typical[i].v,
    }))
  }, [session.pace, clusterAvg.pace, typicalAvg.pace])

  const hrSeries = React.useMemo(() => {
    const run = generateSeries(session.heartRate)
    const cluster = generateSeries(clusterAvg.heartRate)
    const typical = generateSeries(typicalAvg.heartRate)
    return run.map((_, i) => ({
      t: i,
      run: run[i].v,
      cluster: cluster[i].v,
      typical: typical[i].v,
    }))
  }, [session.heartRate, clusterAvg.heartRate, typicalAvg.heartRate])

  const chartConfig = {
    run: { label: "Run", color: "hsl(var(--chart-1))" },
    cluster: { label: "Cluster", color: "hsl(var(--chart-2))" },
    typical: { label: "Typical", color: "hsl(var(--chart-3))" },
  } as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="absolute right-2 top-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        <h3 className="mb-2 text-lg font-semibold">Run Comparison</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {new Date(session.start).toLocaleString()}
        </p>
        <div className="grid gap-4">
          <div>
            <h4 className="mb-1 text-sm font-medium">Pace (min/mi)</h4>
            <ChartContainer className="h-24" config={chartConfig}>
              <LineChart data={paceSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line type="monotone" dataKey="run" stroke="var(--color-run)" dot={false} />
                <Line type="monotone" dataKey="cluster" stroke="var(--color-cluster)" dot={false} />
                <Line type="monotone" dataKey="typical" stroke="var(--color-typical)" dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-medium">Heart Rate (bpm)</h4>
            <ChartContainer className="h-24" config={chartConfig}>
              <LineChart data={hrSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line type="monotone" dataKey="run" stroke="var(--color-run)" dot={false} />
                <Line type="monotone" dataKey="cluster" stroke="var(--color-cluster)" dot={false} />
                <Line type="monotone" dataKey="typical" stroke="var(--color-typical)" dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
