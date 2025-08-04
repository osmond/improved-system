import React, { useMemo, useState } from "react"
import { GoodDayMap, GoodDayInsights } from "@/components/statistics"
import SessionDetailDrawer from "@/components/statistics/SessionDetailDrawer"
import { useRunningSessions, type SessionPoint } from "@/hooks/useRunningSessions"
import { SimpleSelect } from "@/ui/select"
import Slider from "@/ui/slider"

export default function GoodDayPage() {
  const sessions = useRunningSessions()
  const [condition, setCondition] = useState("all")
  const [hourRange, setHourRange] = useState<[number, number]>([0, 23])
  const [active, setActive] = useState<SessionPoint | null>(null)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [highlightDate, setHighlightDate] = useState<string | null>(null)

  const conditions = useMemo(
    () => (sessions ? Array.from(new Set(sessions.map((s) => s.condition))) : []),
    [sessions],
  )


  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Good Day Sessions</h1>
      <p className="text-sm text-muted-foreground">
        Sessions that exceeded expectations are highlighted below.
      </p>
      <GoodDayInsights
        sessions={sessions}
        onSelect={setActive}
        onRangeChange={setDateRange}
        highlightDate={highlightDate}
      />
      {sessions && (
        <div className="flex gap-4 flex-wrap items-center">
          <SimpleSelect
            label="Condition"
            value={condition}
            onValueChange={setCondition}
            options={[
              { value: "all", label: "All" },
              ...conditions.map((c) => ({ value: c, label: c })),
            ]}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm">Start Hour: {hourRange[0]}</label>
            <Slider
              min={0}
              max={23}
              step={1}
              value={[hourRange[0]]}
              onValueChange={(val) =>
                setHourRange([val[0], Math.max(val[0], hourRange[1])])
              }
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">End Hour: {hourRange[1]}</label>
            <Slider
              min={0}
              max={23}
              step={1}
              value={[hourRange[1]]}
              onValueChange={(val) =>
                setHourRange([Math.min(val[0], hourRange[0]), val[0]])
              }
              className="w-40"
            />
          </div>
        </div>
      )}
      <GoodDayMap
        data={sessions}
        condition={condition === "all" ? null : condition}
        hourRange={hourRange}
        onSelect={(s) => {
          setActive(s)
          setHighlightDate(s.start.slice(0, 10))
        }}
        dateRange={dateRange}
      />
      <SessionDetailDrawer session={active} onClose={() => setActive(null)} />
    </div>
  )
}
