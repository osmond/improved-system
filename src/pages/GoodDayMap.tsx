import React from "react";
import { GoodDayMap } from "@/components/statistics";
import { useRunningSessions } from "@/hooks/useRunningSessions";

export default function GoodDayMapPage() {
  const sessions = useRunningSessions();
  return <GoodDayMap data={sessions} />;
}

