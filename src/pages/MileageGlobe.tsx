import React from "react";
import MileageGlobe from "@/components/examples/MileageGlobe";

export default function MileageGlobePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mileage Globe</h2>
      <p className="text-sm text-muted-foreground">
        Explore your activities on an interactive 3D globe. Drag to rotate, and use your
        mouse wheel or touchpad to zoom. Click on a path to inspect mileage.
      </p>
      <MileageGlobe />
    </div>
  );
}
