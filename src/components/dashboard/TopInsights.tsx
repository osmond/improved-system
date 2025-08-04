import React from "react";
import { Card } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { Badge } from "@/ui/badge";
import { Flame, HeartPulse, Moon, Pizza, BookOpen } from "lucide-react";
import useInsights from "@/hooks/useInsights";

export default function TopInsights() {
  const insights = useInsights();

  if (!insights) return <Skeleton className="h-8" />;

  const items: React.ReactNode[] = [];

  if (insights.activeStreak > 0) {
    items.push(
      <Badge key="streak" className="flex items-center gap-1">
        <Flame className="w-3 h-3" />
        {insights.activeStreak}-day streak
      </Badge>
    );
  }
  if (insights.highHeartRate) {
    items.push(
      <Badge key="heart" className="flex items-center gap-1">
        <HeartPulse className="w-3 h-3 text-red-600" />
        High heart rate
      </Badge>
    );
  }
  if (insights.lowSleep) {
    items.push(
      <Badge key="sleep" className="flex items-center gap-1">
        <Moon className="w-3 h-3 text-yellow-500" />
        Low sleep
      </Badge>
    );
  }
  if (insights.calorieSurplus) {
    items.push(
      <Badge key="calories" className="flex items-center gap-1">
        <Pizza className="w-3 h-3 text-amber-600" />
        Calorie surplus
      </Badge>
    );
  }
  if (insights.quietDay) {
    items.push(
      <Badge key="quiet" className="flex items-center gap-1">
        <BookOpen className="w-3 h-3" />
        Quiet day
      </Badge>
    );
  }

  if (items.length === 0) return null;

  return <Card className="p-2 flex gap-2 flex-wrap text-xs">{items}</Card>;
}
