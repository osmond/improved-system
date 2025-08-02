import React, { useState } from "react";
import MileageGlobe from "@/components/examples/MileageGlobe";
import Slider from "@/components/ui/slider";

export default function MileageGlobePage() {
  const [years, setYears] = useState(1);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mileage Globe</h2>
      <p className="text-sm text-muted-foreground">
        Explore your activities on an interactive 3D globe. Drag to rotate, and use your
        mouse wheel or touchpad to zoom. Click on a path to inspect mileage.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-medium">Years of data: {years}</label>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[years]}
          onValueChange={(val) => setYears(val[0])}
          className="w-48"
        />
      </div>
      <MileageGlobe years={years} />
    </div>
  );
}
