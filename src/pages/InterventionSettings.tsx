import React from "react";
import useInterventionPreferences from "@/hooks/useInterventionPreferences";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import Slider from "@/ui/slider";

export default function InterventionSettingsPage() {
  const { prefs, setPrefs } = useInterventionPreferences();

  return (
    <div className="p-4 space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">Intervention Settings</h1>
      <Card className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Reminders</p>
            <p className="text-sm text-muted-foreground">
              {prefs.remindersEnabled ? "On" : "Off"}
            </p>
          </div>
          <Button
            variant={prefs.remindersEnabled ? "default" : "outline"}
            onClick={() =>
              setPrefs({ remindersEnabled: !prefs.remindersEnabled })
            }
          >
            {prefs.remindersEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
        <div>
          <p className="font-medium mb-2">Delay Threshold (minutes)</p>
          <Slider
            min={30}
            max={60}
            step={5}
            value={[prefs.delayMinutes]}
            onValueChange={(val) => setPrefs({ delayMinutes: val[0] })}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Notify after {prefs.delayMinutes} minutes of fragmentation.
          </p>
        </div>
      </Card>
    </div>
  );
}

