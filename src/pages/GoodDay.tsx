import React from "react";
import GoodDayMap from "@/components/statistics/GoodDayMap";
import { useRunningSessions } from "@/hooks/useRunningSessions";

export default function GoodDayPage() {
  const sessions = useRunningSessions();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Good day sessions</h2>
      <p className="text-sm text-muted-foreground">Sessions exceeding expectations.</p>
      <GoodDayMap data={sessions} />
    </div>
  );
}
