import React, { lazy, Suspense } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const StepsChart = lazy(() =>
  import("./StepsChart").then((m) => ({ default: m.StepsChart }))
);

export type Metric = "steps" | "sleep" | "heartRate" | "calories";

export interface RingDetailDialogProps {
  metric: Metric | null;
  onClose: () => void;
  /** Screen reader summary for the metric */
  summary?: string;
}

export function RingDetailDialog({ metric, onClose, summary }: RingDetailDialogProps) {
  const open = metric !== null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-4">
        {summary && (
          <p className="sr-only" aria-live="polite">
            {summary}
          </p>
        )}
        <Tabs value="steps" onValueChange={() => {}}>
          <TabsList>
            <TabsTrigger value="steps">Steps</TabsTrigger>
          </TabsList>
          <Suspense fallback={<Skeleton className="h-60 w-full" />}>
            <StepsChart active={open} />
          </Suspense>
        </Tabs>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RingDetailDialog;
