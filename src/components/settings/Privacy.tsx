import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  clearLocationData,
  exportLocationData,
  getRetentionDays,
  purgeOldLocationData,
  setRetentionDays,
} from "@/lib/locationStore";
import {
  clearFocusHistory,
  exportFocusHistory,
  purgeOldFocusHistory,
} from "@/hooks/useFocusHistory";

export default function Privacy() {
  const [backgroundLocation, setBackgroundLocation] = useState(false);
  const [retention, setRetention] = useState(30);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const stored = localStorage.getItem("bg:location");
    setBackgroundLocation(stored === "true");
    setRetention(getRetentionDays());
  }, []);

  function toggleBackgroundLocation() {
    const next = !backgroundLocation;
    setBackgroundLocation(next);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("bg:location", String(next));
    }
  }

  async function exportData() {
    const data = {
      location: await exportLocationData(),
      focus: exportFocusHistory(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function clearHistory() {
    await clearLocationData();
    clearFocusHistory();
  }

  function updateRetention(e: React.ChangeEvent<HTMLInputElement>) {
    const days = parseInt(e.target.value, 10) || 0;
    setRetention(days);
    setRetentionDays(days);
    purgeOldLocationData(days);
    purgeOldFocusHistory(days);
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={backgroundLocation}
          onChange={toggleBackgroundLocation}
        />
        <span>Enable background location</span>
      </label>
      <div className="flex items-center gap-2">
        <label htmlFor="retention">Retention (days)</label>
        <input
          id="retention"
          type="number"
          value={retention}
          onChange={updateRetention}
          className="w-20 rounded border px-2 py-1"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={exportData}>
          Export data
        </Button>
        <Button variant="outline" onClick={clearHistory}>
          Delete data
        </Button>
      </div>
    </div>
  );
}
