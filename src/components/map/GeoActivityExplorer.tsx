import React, { useMemo, useState } from "react";
import { useStateVisits } from "@/hooks/useStateVisits";
import type { StateVisit } from "@/lib/types";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SimpleSelect } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const US_STATES = [
  "WA","OR","CA","NV","ID","UT","AZ","MT","WY","CO","NM","ND","SD","NE","KS","OK",
  "TX","MN","IA","MO","AR","LA","WI","IL","KY","TN","MS","AL","GA","FL","SC","NC","VA",
  "WV","OH","IN","MI","PA","NY","NJ","DE","MD","DC","MA","CT","RI","VT","NH","ME","HI","AK"
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
  const [activity, setActivity] = useState("all");
  const [range, setRange] = useState("year");

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

  const states = data;

  return (
    <ChartContainer config={{}} title="State Visits" className="space-y-6">
      <div className="flex gap-4 mb-4">
        <SimpleSelect
          label="Activity"
          value={activity}
          onValueChange={setActivity}
          options={[
            { value: "all", label: "All" },
            { value: "run", label: "Run" },
            { value: "bike", label: "Bike" },
          ]}
        />
        <SimpleSelect
          label="Range"
          value={range}
          onValueChange={setRange}
          options={[
            { value: "year", label: "This Year" },
            { value: "month", label: "This Month" },
            { value: "all", label: "All Time" },
          ]}
        />
      </div>
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
          <Accordion value={expandedState || undefined} onValueChange={setExpandedState}>
            {states.map((s) => (
              <AccordionItem key={s.stateCode} value={s.stateCode}>
                <AccordionTrigger className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-medium">{s.stateCode}</span>
                    <Badge>{s.cities.length}</Badge>
                  </span>
                  <span className="flex gap-2">
                    <Badge>{s.totalDays}d</Badge>
                    <Badge>{s.totalMiles}mi</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="text-sm space-y-1">
                    {s.cities.map((c) => (
                      <li key={c.name} className="flex justify-between px-2">
                        <span>{c.name}</span>
                        <span className="flex gap-2">
                          <Badge>{c.days}d</Badge>
                          <Badge>{c.miles}mi</Badge>
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </ChartContainer>
  );
}

