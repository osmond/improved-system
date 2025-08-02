import React from "react";
import { SessionSimilarityMap } from "@/components/statistics";
import { useRunningSessions } from "@/hooks/useRunningSessions";

export default function SessionSimilarityMapPage() {
  const sessions = useRunningSessions();
  return <SessionSimilarityMap data={sessions} />;
}

