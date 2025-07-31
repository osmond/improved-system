import React, { useMemo, useState } from "react";
import { useStateVisits } from "@/hooks/useStateVisits";
import type { StateVisit } from "@/lib/types";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const US_STATES = [
  "WA","OR","CA","NV","ID","UT","AZ","MT","WY","CO","NM","ND","SD","NE","KS","OK",
  "TX","MN","IA","MO","AR","LA","WI","IL","KY","TN","MS","AL","GA","FL","SC","NC","VA",
  "WV","OH","IN","MI","PA","NY","NJ","DE","MD","DC","MA","CT","RI","VT","NH","ME","HI"
];

interface StateSquareProps {
  abbr: string;
  visited: boolean;
  selected: boolean;
  onClick: () => void;
}

function StateSquare({ abbr, visited, selected, onClick }: StateSquareProps) {
  return (
    <div
      onClick={onClick}
      aria-label={abbr + (visited ? " visited" : " not visited")}
      className={cn(
        "w-10 h-10 flex items-center justify-center text-xs font-semibold border cursor-pointer select-none",
        visited ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        selected && "ring-2 ring-ring"
      )}
    >
      {abbr}
    </div>
  );
}

export default function GeoActivityExplorer() {
  const data = useStateVisits();
  const [expandedState, setExpandedState] = useState<string | null>(null);

  const summaryMap = useMemo(() => {
    const m: Record<string, StateVisit> = {};
    (data || []).forEach((s) => {
      m[s.stateCode] = s;
    });
    return m;
  }, [data]);

  if (!data) {
    return <Skeleton className="h-60 w-full" />;
  }

  const toggleState = (abbr: string) => {
    setExpandedState((prev) => (prev === abbr ? null : abbr));
  };

  const leftStates = data.slice(0, Math.ceil(data.length / 2));
  const rightStates = data.slice(Math.ceil(data.length / 2));

  return (
    <ChartContainer config={{}} title="State Visits" className="space-y-6">
      <div className="flex gap-12">
        <div className="grid grid-cols-5 gap-1">
          {US_STATES.map((abbr) => (
            <StateSquare
              key={abbr}
              abbr={abbr}
              visited={!!summaryMap[abbr] && summaryMap[abbr].visited}
              selected={expandedState === abbr}
              onClick={() => toggleState(abbr)}
            />
          ))}
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-6">
            <StateTable states={leftStates} expanded={expandedState} onToggle={toggleState} />
            <StateTable states={rightStates} expanded={expandedState} onToggle={toggleState} />
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}

interface TableProps {
  states: StateVisit[];
  expanded: string | null;
  onToggle: (abbr: string) => void;
}

function StateTable({ states, expanded, onToggle }: TableProps) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2">State</th>
          <th className="py-2 text-right">Days</th>
          <th className="py-2 text-right">Miles</th>
        </tr>
      </thead>
      <tbody>
        {states.map((s) => (
          <React.Fragment key={s.stateCode}>
            <tr
              className={cn(
                "cursor-pointer hover:bg-muted",
                expanded === s.stateCode && "bg-muted"
              )}
              onClick={() => onToggle(s.stateCode)}
            >
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">{s.stateCode}</div>
                  <div className="text-muted-foreground text-xs">›</div>
                </div>
              </td>
              <td className="py-2 text-right">{s.totalDays}</td>
              <td className="py-2 text-right">{s.totalMiles}</td>
            </tr>
            {expanded === s.stateCode && (
              <React.Fragment>
                {s.cities.map((c) => (
                  <tr key={c.name} className="text-muted-foreground">
                    <td className="pl-8 py-1">{c.name}</td>
                    <td className="py-1 text-right">{c.days}</td>
                    <td className="py-1 text-right">{c.miles}</td>
                  </tr>
                ))}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
