"use client";

import React, { useState, useEffect } from "react";
import MileageGlobe from "@/components/examples/MileageGlobe";
import Slider from "@/ui/slider";
import { Button } from "@/ui/button";
import { SimpleSelect } from "@/ui/select";
import { Card, CardContent } from "@/ui/card";
import useWeeklyVolumeHistory from "@/hooks/useWeeklyVolumeHistory";

export default function MileageGlobePage() {
  const weekly = useWeeklyVolumeHistory();
  const [startWeek, setStartWeek] = useState<number | null>(null);
  const [playIndex, setPlayIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [autoRotate, setAutoRotate] = useState(true);

  // initialise range and playback index to the last year of data
  useEffect(() => {
    if (weekly) {
      const start = Math.max(0, weekly.length - 52);
      setStartWeek(start);
      setPlayIndex(start);
    }
  }, [weekly]);

  // advance playback when playing
  useEffect(() => {
    if (!playing || playIndex === null || startWeek === null || !weekly) return;
    const end = weekly.length - 1;
    const interval = setInterval(() => {
      setPlayIndex((idx) => {
        if (idx === null) return idx;
        if (idx >= end) {
          setPlaying(false);
          return idx;
        }
        return idx + 1;
      });
    }, 800 / parseFloat(speed));
    return () => clearInterval(interval);
  }, [playing, speed, startWeek, playIndex, weekly]);

  const handleScrub = (val: number[]) => {
    setPlayIndex(val[0]);
    setPlaying(false);
  };

  const caption =
    weekly && playIndex !== null
      ? `${new Date(weekly[playIndex].week).toLocaleDateString()}: ${weekly[playIndex].miles} miles`
      : "";

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Mileage Globe</h2>
      <p className="text-sm text-muted-foreground">
        Explore your activities on an interactive 3D globe. Drag to rotate, and use your
        mouse wheel or touchpad to zoom. Total mileage for the selected period is shown
        below the globe.
      </p>
      {weekly && startWeek !== null && playIndex !== null && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{caption}</label>
          <Slider
            min={startWeek}
            max={weekly.length - 1}
            step={1}
            value={[playIndex]}
            onValueChange={handleScrub}
            className="w-64"
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause playback" : "Play playback"}
            >
              {playing ? "Pause" : "Play"}
            </Button>
            <SimpleSelect
              value={speed}
              onValueChange={(v) => setSpeed(v)}
              options={[
                { value: "0.5", label: "0.5x" },
                { value: "1", label: "1x" },
                { value: "2", label: "2x" },
              ]}
              label="Speed"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoRotate((a) => !a)}
              aria-label={autoRotate ? "Pause rotation" : "Play rotation"}
            >
              {autoRotate ? "Rotating" : "Static"}
            </Button>
          </div>
        </div>
      )}
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-2">
          <MileageGlobe
            weekRange={
              startWeek !== null && playIndex !== null ? [startWeek, playIndex] : undefined
            }
            autoRotate={autoRotate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
