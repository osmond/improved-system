import { createContext, useContext, useState, ReactNode } from "react";

export interface ChartActions {
  onSaveView?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  info?: string;
}

interface ChartActionsState {
  actions: ChartActions;
  setActions: (a: ChartActions) => void;
}

const ChartActionsContext = createContext<ChartActionsState | undefined>(undefined);

export function ChartActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ChartActions>({});
  return (
    <ChartActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </ChartActionsContext.Provider>
  );
}

export function useChartActions(): ChartActionsState {
  const ctx = useContext(ChartActionsContext);
  if (!ctx) {
    return { actions: {}, setActions: () => {} };
  }
  return ctx;
}
