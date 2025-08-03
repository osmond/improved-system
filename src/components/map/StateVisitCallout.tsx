import React, { useMemo } from "react";
import { Bike, Footprints } from "lucide-react";
import { feature } from "topojson-client";
import { useStateVisits } from "@/hooks/useStateVisits";
import { Skeleton } from "@/components/ui/skeleton";
import statesTopo from "@/lib/us-states.json";
import { fipsToAbbr } from "@/lib/stateCodes";
import { formatDate, formatMiles } from "@/lib/format";

const stateNames: Record<string, string> = (() => {
  const fc = feature(
    statesTopo as any,
    (statesTopo as any).objects.states
  ) as any;
  const map: Record<string, string> = {};
  fc.features.forEach((f: any) => {
    const abbr = fipsToAbbr[f.id as string];
    if (abbr) map[abbr] = f.properties.name as string;
  });
  return map;
})();

interface StateVisitCalloutProps {
  onSelectState?: (code: string) => void;
}

export default function StateVisitCallout({
  onSelectState,
}: StateVisitCalloutProps) {
  const visits = useStateVisits();

  const latest = useMemo(() => {
    if (!visits) return null;
    let entry:
      | {
          date: string;
          type: string;
          miles: number;
          stateCode: string;
          stateName: string;
          formattedDate: string;
          formattedMiles: string;
        }
      | null = null;
    visits.forEach((state) => {
      state.log.forEach((l) => {
        if (!entry || new Date(l.date) > new Date(entry.date)) {
          const stateName = stateNames[state.stateCode] || state.stateCode;
          entry = {
            ...l,
            stateCode: state.stateCode,
            stateName,
            formattedDate: formatDate(l.date),
            formattedMiles: formatMiles(l.miles),
          };
        }
      });
    });
    return entry;
  }, [visits]);

  if (!visits) return <Skeleton className="h-4 w-full" />;
  if (!latest) return null;

  const { type, stateCode, stateName, formattedDate, formattedMiles } = latest;
  const Icon = type === "run" ? Footprints : Bike;

  return (
    <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span>
        {formattedDate} - {formattedMiles} in {stateName}
      </span>
      {onSelectState && (
        <button
          className="underline"
          onClick={() => onSelectState(stateCode)}
        >
          View
        </button>
      )}
    </div>
  );
}
