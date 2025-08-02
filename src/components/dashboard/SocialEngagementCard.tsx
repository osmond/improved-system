import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useSocialEngagement from "@/hooks/useSocialEngagement";

export default function SocialEngagementCard() {
  const data = useSocialEngagement();
  if (!data) return <Skeleton className="h-32" />;
  const { index, consecutiveHomeDays } = data;
  const message =
    consecutiveHomeDays >= 5
      ? "You've been mostly at home for 5 days—maybe schedule a quick meetup or change of scenery."
      : null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums">{index.toFixed(2)}</div>
        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}
