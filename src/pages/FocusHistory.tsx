import React from "react";
import useFocusHistory from "@/hooks/useFocusHistory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FocusTimeline } from "@/components/visualizations";

export default function FocusHistoryPage() {
  const { history, dismissEvent } = useFocusHistory();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Focus History</h1>
      {history.length > 0 && <FocusTimeline events={history} />}
      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">No history yet.</p>
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

