import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { StepsChart } from "@/components/dashboard";
import { useGarminData } from "@/hooks/useGarminData";

export default function Dashboard() {
  type Metric = "steps" | "sleep" | "heartRate" | "calories";
  const data = useGarminData();
  const [expanded, setExpanded] = useState<Metric | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (expanded) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [expanded]);

  if (!data) {
    return <p>Loading…</p>;
  }

  const handleKey = (
    e: React.KeyboardEvent<HTMLDivElement>,
    metric: Metric,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setExpanded(metric);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("steps")}
          onKeyDown={(e) => handleKey(e, "steps")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Steps</h2>
          <ProgressRing label="Steps progress" value={(data.steps / 10000) * 100} />
          <span className="mt-2 text-lg font-bold">{data.steps}</span>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("sleep")}
          onKeyDown={(e) => handleKey(e, "sleep")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Sleep (hrs)</h2>
          <ProgressRing label="Sleep progress" value={(data.sleep / 8) * 100} />
          <span className="mt-2 text-lg font-bold">{data.sleep}</span>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("heartRate")}
          onKeyDown={(e) => handleKey(e, "heartRate")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Heart Rate</h2>
          <ProgressRing label="Heart rate progress" value={(data.heartRate / 200) * 100} />
          <span className="mt-2 text-lg font-bold">{data.heartRate}</span>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => setExpanded("calories")}
          onKeyDown={(e) => handleKey(e, "calories")}
          className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring"
        >
          <h2 className="text-sm mb-2">Calories</h2>
          <ProgressRing label="Calories progress" value={(data.calories / 3000) * 100} />
          <span className="mt-2 text-lg font-bold">{data.calories}</span>
        </Card>
      </div>

      <dialog
        ref={dialogRef}
        className="rounded-lg p-0 max-w-lg w-full border bg-background"
        onClose={() => setExpanded(null)}
      >
        <div className="p-4">
          <Tabs value="steps" onValueChange={() => {}}>
            <TabsList>
              <TabsTrigger value="steps">Steps</TabsTrigger>
            </TabsList>
            <StepsChart />
          </Tabs>
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
              onClick={() => setExpanded(null)}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
