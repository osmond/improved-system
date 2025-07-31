import React from "react";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { useGarminData } from "@/hooks/useGarminData";

export default function Dashboard() {
  const data = useGarminData();

  if (!data) {
    return <p>Loading…</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Steps</h2>
          <ProgressRing value={(data.steps / 10000) * 100} />
          <span className="mt-2 text-lg font-bold">{data.steps}</span>
        </Card>

        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Sleep (hrs)</h2>
          <ProgressRing value={(data.sleep / 8) * 100} />
          <span className="mt-2 text-lg font-bold">{data.sleep}</span>
        </Card>

        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Heart Rate</h2>
          <ProgressRing value={(data.heartRate / 200) * 100} />
          <span className="mt-2 text-lg font-bold">{data.heartRate}</span>
        </Card>

        <Card className="flex flex-col items-center">
          <h2 className="text-sm mb-2">Calories</h2>
          <ProgressRing value={(data.calories / 3000) * 100} />
          <span className="mt-2 text-lg font-bold">{data.calories}</span>
        </Card>
      </div>
    </div>
  );
}
