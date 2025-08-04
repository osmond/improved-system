import React from "react";
import { Button } from "@/ui/button";
import { SimpleSelect } from "@/ui/select";
import { Slider } from "@/ui/slider";

interface FilterBarProps {
  displayMode: "upper" | "lower" | "full";
  onDisplayModeChange: (mode: "upper" | "lower" | "full") => void;
  showValues: boolean;
  onToggleValues: () => void;
  signFilter: "all" | "positive" | "negative";
  onSignFilterChange: (val: "all" | "positive" | "negative") => void;
  threshold: number;
  onThresholdChange: (val: number) => void;
  topN: number;
  maxPairs: number;
  onTopNChange: (val: number) => void;
}

export default function FilterBar({
  displayMode,
  onDisplayModeChange,
  showValues,
  onToggleValues,
  signFilter,
  onSignFilterChange,
  threshold,
  onThresholdChange,
  topN,
  maxPairs,
  onTopNChange,
}: FilterBarProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SimpleSelect
        value={displayMode}
        onValueChange={(v) =>
          onDisplayModeChange(v as "upper" | "lower" | "full")
        }
        options={[
          { value: "upper", label: "Upper Triangle" },
          { value: "lower", label: "Lower Triangle" },
          { value: "full", label: "Full Matrix" },
        ]}
        label="Display"
        className="w-full"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleValues}
        className="w-full sm:w-auto"
      >
        {showValues ? "Hide Values" : "Show Values"}
      </Button>
      <SimpleSelect
        value={signFilter}
        onValueChange={(v) => onSignFilterChange(v as "all" | "positive" | "negative")}
        options={[
          { value: "all", label: "All" },
          { value: "positive", label: "Positive Only" },
          { value: "negative", label: "Negative Only" },
        ]}
        label="Sign"
        className="w-full"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Min |r|</span>
        <Slider
          value={[threshold]}
          max={1}
          step={0.01}
          className="w-full max-w-[8rem]"
          onValueChange={(v) => onThresholdChange(v[0] ?? 0)}
        />
        <span className="w-10 text-right text-sm">
          {threshold.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Top N</span>
        <Slider
          value={[topN]}
          min={0}
          max={maxPairs}
          step={1}
          className="w-full max-w-[8rem]"
          onValueChange={(v) => onTopNChange(v[0] ?? 0)}
        />
        <span className="w-10 text-right text-sm">{topN}</span>
      </div>
    </div>
  );
}

