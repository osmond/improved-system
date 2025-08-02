import React, { useState, useEffect } from "react";
import MileageGlobe from "@/components/examples/MileageGlobe";
import Slider from "@/components/ui/slider";
import useWeeklyVolumeHistory from "@/hooks/useWeeklyVolumeHistory";

export default function MileageGlobePage() {
  const weekly = useWeeklyVolumeHistory();
  const [range, setRange] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (weekly) {
      setRange([Math.max(0, weekly.length - 52), weekly.length - 1]);
    }
  }, [weekly]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mileage Globe</h2>
      <p className="text-sm text-muted-foreground">
        Explore your activities on an interactive 3D globe. Drag to rotate, and use your
        mouse wheel or touchpad to zoom. Total mileage for the selected period is shown
        below the globe.
      </p>
      {weekly && range && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Week range: {new Date(weekly[range[0]].week).toLocaleDateString()} -
            {" "}
            {new Date(weekly[range[1]].week).toLocaleDateString()}
          </label>
          <Slider
            numberOfThumbs={2}
            min={0}
            max={weekly.length - 1}
            step={1}
            value={range}
            onValueChange={(val) => setRange(val as [number, number])}
            className="w-48"
          />
        </div>
      )}
      <div className="mx-auto max-w-md">
        <MileageGlobe weekRange={range ?? undefined} />
      </div>
    </div>
  );
}
