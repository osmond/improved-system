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
import * as React from "react";

interface ClusterCardProps {
  data: any[];
  color: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: () => void;
}

function getAnnotation(avgTemp: number, avgStart: number) {
  const timeLabel =
    avgStart < 6
      ? "Early runs"
      : avgStart < 12
      ? "Morning runs"
      : avgStart < 18
      ? "Afternoon runs"
      : "Evening runs";
  const tempLabel =
    avgTemp < 45
      ? "cold temp"
      : avgTemp < 65
      ? "moderate temp"
      : "warm temp";
  return `${timeLabel}, ${tempLabel}`;
}

export default function ClusterCard({
  data,
  color,
  open,
  onOpenChange,
  onSelect,
}: ClusterCardProps) {
  const paceData = React.useMemo(
    () => data.map((d, i) => ({ index: i, paceDelta: d.paceDelta })),
    [data],
  );
  const avgTemp =
    data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
  const avgStart =
    data.reduce((sum, d) => sum + d.startHour, 0) / data.length;
  const annotation = getAnnotation(avgTemp, avgStart);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer" onClick={onSelect}>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">{annotation}</CardTitle>
            <CardDescription className="text-xs">
              Avg temp {avgTemp.toFixed(1)}°F · Start {avgStart.toFixed(0)}h
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
                <Line type="monotone" dataKey="paceDelta" stroke="var(--color-pace)" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <h3 className="mb-2 text-lg font-semibold">{annotation}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Avg temp {avgTemp.toFixed(1)}°F · Start {avgStart.toFixed(0)}h
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

