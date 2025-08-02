import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useSocialEngagement from "@/hooks/useSocialEngagement";
import useEngagementNudges from "@/hooks/useEngagementNudges";
import {
  ChartContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

export default function SocialEngagementCard() {
  const data = useSocialEngagement();
  if (!data) return <Skeleton className="h-64" />;
  const { index, locationEntropy, outOfHomeFrequency, baseline } = data;
  const nudges = useEngagementNudges();
  const chartData = [
    {
      metric: "Overall",
      current: index,
      baseline: baseline.index,
    },
    {
      metric: "Entropy",
      current: locationEntropy,
      baseline: baseline.locationEntropy,
    },
    {
      metric: "Out of Home",
      current: outOfHomeFrequency,
      baseline: baseline.outOfHomeFrequency,
    },
  ];
  const chartConfig = {
    current: { label: "Current", color: "hsl(var(--chart-1))" },
    baseline: { label: "Baseline", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Engagement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold tabular-nums">{index.toFixed(2)}</div>
        <ChartContainer config={chartConfig} className="h-48">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <Radar
              name="Current"
              dataKey="current"
              stroke="var(--color-current)"
              fill="var(--color-current)"
              fillOpacity={0.6}
            />
            <Radar
              name="Baseline"
              dataKey="baseline"
              stroke="var(--color-baseline)"
              fill="var(--color-baseline)"
              fillOpacity={0.3}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
        {nudges.map((msg) => (
          <p key={msg} className="text-sm text-muted-foreground">
            {msg}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
