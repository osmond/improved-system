import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { StateVisit } from "@/lib/types";
import ChartCard from "./ChartCard";

interface StateTableProps {
  data: StateVisit[];
  selectedState: string | null;
  onSelectState: (stateCode: string) => void;
}

export default function StateTable({ data, selectedState, onSelectState }: StateTableProps) {
  return (
    <ChartCard title="Visited States" description="Details" className="p-2 space-y-2">
      <Accordion value={selectedState || undefined} onValueChange={onSelectState}>
        {data
          .filter((d) => d.visited)
          .map((d) => (
            <AccordionItem value={d.stateCode} key={d.stateCode}>
              <AccordionTrigger className="flex justify-between">
                <span>{d.stateCode}</span>
                <span>
                  {d.totalDays}d • {d.totalMiles}mi
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {d.cities.map((c) => (
                    <li key={c.name} className="flex justify-between pl-4">
                      <span>{c.name}</span>
                      <span>
                        {c.days}d • {c.miles}mi
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </ChartCard>
  );
}
