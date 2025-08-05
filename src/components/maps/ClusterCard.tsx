import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
} from "@/ui/chart";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/ui/dialog";
import { Badge } from "@/ui/badge";
import * as React from "react";

interface ClusterCardProps {
  data: any[]
  color: string
  stability: number
  label: string
  centroid?: { temperature: number; startHour: number; paceDelta: number }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: () => void
  goodDay?: boolean
}

export default function ClusterCard({
  data,
  color,
  stability,
  label,
  centroid,
  goodDay,
  open,
  onOpenChange,
  onSelect,
}: ClusterCardProps) {
  const paceData = React.useMemo(
    () => data.map((d, i) => ({ index: i, paceDelta: d.paceDelta })),
    [data],
  );
  const temp = centroid?.temperature ?? 0;
  const start = centroid?.startHour ?? 0;
  const delta = centroid?.paceDelta ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Card
          role="button"
          tabIndex={0}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              ;(e.currentTarget as HTMLElement).click()
            }
          }}
        >
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {label}
              {goodDay && (
                <Badge variant="secondary">Good day cluster</Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {temp.toFixed(1)}°F · {start.toFixed(0)}h · Δ {delta.toFixed(2)} ·
              Stability {(stability * 100).toFixed(0)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ChartContainer
              className="h-16 w-full"
              config={{ pace: { color } }}
            >
              <LineChart data={paceData}>
                <XAxis dataKey="index" hide />
                <YAxis dataKey="paceDelta" hide domain={["dataMin", "dataMax"]} />
                <Line
                  type="monotone"
                  dataKey="paceDelta"
                  stroke="var(--color-pace)"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <h3 className="mb-2 text-lg font-semibold">{label}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {temp.toFixed(1)}°F · {start.toFixed(0)}h · Δ {delta.toFixed(2)} ·
          Stability {(stability * 100).toFixed(0)}%
        </p>
        <ChartContainer className="h-48 w-full" config={{}}>
          <ScatterChart>
            <XAxis type="number" dataKey="x" />
            <YAxis type="number" dataKey="y" />
            <Scatter data={data} fill={color} />
          </ScatterChart>
        </ChartContainer>
      </DialogContent>
    </Dialog>
  );
}

