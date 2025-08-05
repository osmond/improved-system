import React, { useMemo } from "react";
import useFocusHistory from "@/hooks/useFocusHistory";
import type { FocusEvent } from "@/hooks/useFocusHistory";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { FocusTimeline } from "@/components/trends";

export default function FocusHistoryPage() {
  const { history, dismissEvent } = useFocusHistory();
  const mockHistory = useMemo<FocusEvent[]>(() => {
    const now = Date.now();
    return [
      {
        timestamp: now - 45 * 60 * 1000,
        type: "detection",
        message: "Checked phone",
      },
      {
        timestamp: now - 30 * 60 * 1000,
        type: "intervention",
        message: "Back to deep work",
      },
    ];
  }, []);
  const showMock = history.length === 0;
  const events = showMock ? mockHistory : history;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Focus History</h1>
      <FocusTimeline events={events} />
      {showMock ? (
        <p className="text-sm text-muted-foreground">
          No history yet—showing sample data.
        </p>
      ) : (
        <div className="space-y-2">
          {history.map((e, idx) => (
            <Card key={idx} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                  <div className="font-medium capitalize">{e.type}</div>
                  <div>{e.message}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissEvent(idx)}
                >
                  Dismiss
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

