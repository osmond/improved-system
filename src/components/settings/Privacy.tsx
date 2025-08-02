import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  const [backgroundLocation, setBackgroundLocation] = useState(false);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const stored = localStorage.getItem("bg:location");
    setBackgroundLocation(stored === "true");
  }, []);

  function toggleBackgroundLocation() {
    const next = !backgroundLocation;
    setBackgroundLocation(next);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("bg:location", String(next));
    }
  }

  function clearHistory() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("loc:points");
      localStorage.removeItem("loc:clusters");
    }
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
      <Button variant="outline" onClick={clearHistory}>
        Clear history
      </Button>
    </div>
  );
}
