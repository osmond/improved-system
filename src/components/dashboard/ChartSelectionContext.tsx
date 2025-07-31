import React from "react";

export interface ChartRange {
  start: string | null;
  end: string | null;
}

interface ChartSelectionContextValue {
  range: ChartRange;
  setRange: (range: ChartRange) => void;
}

const ChartSelectionContext = React.createContext<ChartSelectionContextValue | undefined>(
  undefined,
);

export function ChartSelectionProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = React.useState<ChartRange>({ start: null, end: null });
  return (
    <ChartSelectionContext.Provider value={{ range, setRange }}>
      {children}
    </ChartSelectionContext.Provider>
  );
}

export function useChartSelection() {
  const ctx = React.useContext(ChartSelectionContext);
  if (!ctx) {
    throw new Error("useChartSelection must be used within ChartSelectionProvider");
  }
  return ctx;
}
