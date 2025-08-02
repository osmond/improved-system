import React from "react";
import { GoodDayMap } from "@/components/statistics";
import { useRunningSessions } from "@/hooks/useRunningSessions";

export default function GoodDayPage() {
  const sessions = useRunningSessions();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Good Day Sessions</h1>
      <p className="text-sm text-muted-foreground">
        Sessions that exceeded expectations are highlighted below.
      </p>
      <GoodDayMap data={sessions} />
    </div>
  );
}
