import React from "react";
import { mockDailySteps } from "@/lib/api";
import StepsTrendWithGoal from "@/components/dashboard/StepsTrendWithGoal";

export default function StepsTrendWithGoalPage() {
  return (
    <div className="p-4">
      <StepsTrendWithGoal data={mockDailySteps} />
    </div>
  );
}
