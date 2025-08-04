import React, { useEffect, useMemo, useState } from "react"
import { GoodDayMap, GoodDayInsights, GoodDayBadges } from "@/components/statistics"
import SessionDetailDrawer from "@/components/statistics/SessionDetailDrawer"
import { useRunningSessions, type SessionPoint } from "@/hooks/useRunningSessions"
import { SimpleSelect } from "@/ui/select"
import Slider from "@/ui/slider"
import { Button } from "@/ui/button"

interface FilterPreset {
  name: string
  filters: {
    condition: string
    hourRange: [number, number]
    route?: string
    gear?: string
    day?: string
  }
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const FILTERS_KEY = "goodDayFilters"
const PRESETS_KEY = "goodDayPresets"

export default function GoodDayPage() {
  const { sessions, trend } = useRunningSessions()
  const [condition, setCondition] = useState("all")
  const [hourRange, setHourRange] = useState<[number, number]>([0, 23])
  const [route, setRoute] = useState("all")
  const [gear, setGear] = useState("all")
  const [day, setDay] = useState("all")
  const [active, setActive] = useState<SessionPoint | null>(null)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [highlightDate, setHighlightDate] = useState<string | null>(null)
  const [presets, setPresets] = useState<FilterPreset[]>([])

  const conditions = useMemo(
    () => (sessions ? Array.from(new Set(sessions.map((s) => s.condition))) : []),
    [sessions],
  )

  const getTag = (prefix: string, s: SessionPoint) => {
    const t = s.tags.find((t) => t.startsWith(prefix))
    return t ? t.slice(prefix.length) : null
  }

  const routes = useMemo(
    () =>
      sessions
        ? Array.from(
            new Set(
              sessions
                .map((s) => getTag("route:", s))
                .filter((v): v is string => Boolean(v)),
            ),
          )
        : [],
    [sessions],
  )

  const gears = useMemo(
    () =>
      sessions
        ? Array.from(
            new Set(
              sessions
                .map((s) => getTag("gear:", s))
                .filter((v): v is string => Boolean(v)),
            ),
          )
        : [],
    [sessions],
  )

  const filteredSessions = useMemo(() => {
    if (!sessions) return null
    return sessions.filter((s) => {
      if (route !== "all" && getTag("route:", s) !== route) return false
      if (gear !== "all" && getTag("gear:", s) !== gear) return false
      if (day !== "all" && DAY_NAMES[new Date(s.start).getDay()] !== day) return false
      return true
    })
  }, [sessions, route, gear, day])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FILTERS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setCondition(parsed.condition ?? "all")
        setHourRange(parsed.hourRange ?? [0, 23])
        setRoute(parsed.route ?? "all")
        setGear(parsed.gear ?? "all")
        setDay(parsed.day ?? "all")
      }
      const presetRaw = localStorage.getItem(PRESETS_KEY)
      if (presetRaw) setPresets(JSON.parse(presetRaw))
    } catch {}
  }, [])

  useEffect(() => {
    const data = { condition, hourRange, route, gear, day }
    localStorage.setItem(FILTERS_KEY, JSON.stringify(data))
  }, [condition, hourRange, route, gear, day])

  useEffect(() => {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
  }, [presets])

  const applyPreset = (p: FilterPreset["filters"]) => {
    if (p.condition) setCondition(p.condition)
    if (p.hourRange) setHourRange(p.hourRange)
    if (p.route) setRoute(p.route)
    if (p.gear) setGear(p.gear)
    if (p.day) setDay(p.day)
  }

  const savePreset = () => {
    const name = prompt("Preset name?")
    if (!name) return
    const next: FilterPreset = {
      name,
      filters: { condition, hourRange, route, gear, day },
    }
    setPresets((prev) => [...prev, next])
  }

  const defaultPresets: FilterPreset[] = [
    { name: "Cloudy Evenings", filters: { condition: "Cloudy", hourRange: [17, 23] } },
    { name: "Cool Mornings", filters: { condition: "Clear", hourRange: [5, 9] } },
  ]

  const suggestedPresets: FilterPreset[] = useMemo(() => {
    if (!sessions) return []
    const clusterDefs = [
      { label: "Night", range: [0, 5] as [number, number] },
      { label: "Morning", range: [5, 12] as [number, number] },
      { label: "Afternoon", range: [12, 17] as [number, number] },
      { label: "Evening", range: [17, 24] as [number, number] },
    ]
    const counts: Record<string, { condition: string; range: [number, number]; label: string; count: number }> = {}
    const good = filteredSessions?.filter((s) => s.good) ?? []
    for (const s of good) {
      const cluster = clusterDefs.find(
        (c) => s.startHour >= c.range[0] && s.startHour < c.range[1],
      )
      if (!cluster) continue
      const key = `${s.condition}-${cluster.label}`
      if (!counts[key]) counts[key] = { condition: s.condition, range: cluster.range, label: cluster.label, count: 0 }
      counts[key].count++
    }
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((c) => ({
        name: `${c.condition} ${c.label}s`,
        filters: { condition: c.condition, hourRange: c.range },
      }))
  }, [filteredSessions, sessions])

  const allPresets = [...defaultPresets, ...suggestedPresets, ...presets]


  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Good Day Sessions</h1>
      <p className="text-sm text-muted-foreground">
        Sessions that exceeded expectations are highlighted below.
      </p>
      {sessions && <GoodDayBadges sessions={sessions} />}
      <div className="flex gap-2 flex-wrap">
        {allPresets.map((p) => (
          <Button
            key={p.name}
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => applyPreset(p.filters)}
          >
            {p.name}
          </Button>
        ))}
        <Button size="sm" className="rounded-full" onClick={savePreset}>
          Save preset
        </Button>
      </div>
      <GoodDayInsights
        sessions={filteredSessions}
        trend={trend}
        onSelect={setActive}
        onRangeChange={setDateRange}
        highlightDate={highlightDate}
      />
      {filteredSessions && (
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
          <SimpleSelect
            label="Route"
            value={route}
            onValueChange={setRoute}
            options={[
              { value: "all", label: "All" },
              ...routes.map((r) => ({ value: r, label: r })),
            ]}
          />
          <SimpleSelect
            label="Gear"
            value={gear}
            onValueChange={setGear}
            options={[
              { value: "all", label: "All" },
              ...gears.map((g) => ({ value: g, label: g })),
            ]}
          />
          <SimpleSelect
            label="Day"
            value={day}
            onValueChange={setDay}
            options={[
              { value: "all", label: "All" },
              ...DAY_NAMES.map((d) => ({ value: d, label: d })),
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
        data={filteredSessions}
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
