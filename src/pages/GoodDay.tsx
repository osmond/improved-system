import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  GoodDayMap,
  GoodDayInsights,
  GoodDayBadges,
  GoodDayForecastCalendar,
} from "@/components/statistics"
import SessionDetailDrawer from "@/components/statistics/SessionDetailDrawer"
import { useRunningSessions, type SessionPoint } from "@/hooks/useRunningSessions"
import { SimpleSelect } from "@/ui/select"
import Slider from "@/ui/slider"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/ui/popover"
import useOnboardingTips from "@/hooks/useOnboardingTips"
import { X } from "lucide-react"
import { getWeatherForecast } from "@/lib/weatherApi"

interface FilterPreset {
  name: string
  filters: {
    condition: string
    hourRange: [number, number]
    route?: string
    gear?: string
    day?: string
    hasRoute?: boolean
    hasGear?: boolean
    hasTags?: boolean
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
  const { sessions, trend, error } = useRunningSessions()
  const [condition, setCondition] = useState("all")
  const [hourRange, setHourRange] = useState<[number, number]>([0, 23])
  const [route, setRoute] = useState("all")
  const [gear, setGear] = useState("all")
  const [day, setDay] = useState("all")
  const [hasRoute, setHasRoute] = useState(false)
  const [hasGear, setHasGear] = useState(false)
  const [hasTags, setHasTags] = useState(false)
  const [active, setActive] = useState<SessionPoint | null>(null)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [highlightDate, setHighlightDate] = useState<string | null>(null)
  const [presets, setPresets] = useState<FilterPreset[]>([])
  const [forecastMessage, setForecastMessage] = useState<string | null>(null)
  const [forecast, setForecast] = useState<{ date: string; probability: number }[]>([])
  const [selectedPresets, setSelectedPresets] = useState<number[]>([])
  const lastPresetIdx = useRef<number | null>(null)
  const { index: tip, next: nextTip } = useOnboardingTips('good-day', 3)

  if (error) {
    return (
      <div className="p-4">
        Unable to load running sessions. Please try again later.
      </div>
    )
  }

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
      if (condition !== "all" && s.condition !== condition) return false
      if (s.startHour < hourRange[0] || s.startHour > hourRange[1]) return false
      if (hasRoute && !getTag("route:", s)) return false
      if (route !== "all" && getTag("route:", s) !== route) return false
      if (hasGear && !getTag("gear:", s)) return false
      if (gear !== "all" && getTag("gear:", s) !== gear) return false
      if (
        hasTags &&
        s.tags.filter((t) => !t.startsWith("route:") && !t.startsWith("gear:"))
          .length === 0
      )
        return false
      if (day !== "all" && DAY_NAMES[new Date(s.start).getDay()] !== day) return false
      return true
    })
  }, [sessions, route, gear, day, hasRoute, hasGear, hasTags, condition, hourRange])

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
        setHasRoute(parsed.hasRoute ?? false)
        setHasGear(parsed.hasGear ?? false)
        setHasTags(parsed.hasTags ?? false)
      }
      const presetRaw = localStorage.getItem(PRESETS_KEY)
      if (presetRaw) setPresets(JSON.parse(presetRaw))
    } catch {}
  }, [])

  useEffect(() => {
    const data = {
      condition,
      hourRange,
      route,
      gear,
      day,
      hasRoute,
      hasGear,
      hasTags,
    }
    localStorage.setItem(FILTERS_KEY, JSON.stringify(data))
  }, [condition, hourRange, route, gear, day, hasRoute, hasGear, hasTags])

  useEffect(() => {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
  }, [presets])

  const applyPreset = (p: FilterPreset["filters"]) => {
    if (p.condition) setCondition(p.condition)
    if (p.hourRange) setHourRange(p.hourRange)
    if (p.route) setRoute(p.route)
    if (p.gear) setGear(p.gear)
    if (p.day) setDay(p.day)
    if (p.hasRoute !== undefined) setHasRoute(p.hasRoute)
    if (p.hasGear !== undefined) setHasGear(p.hasGear)
    if (p.hasTags !== undefined) setHasTags(p.hasTags)
  }

  const saveView = () => {
    const name = prompt("View name?")
    if (!name) return
    const next: FilterPreset = {
      name,
      filters: {
        condition,
        hourRange,
        route,
        gear,
        day,
        hasRoute,
        hasGear,
        hasTags,
      },
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

  useEffect(() => {
    if (selectedPresets.length === 0) return
    let merged: FilterPreset["filters"] = {}
    selectedPresets.forEach((idx) => {
      const p = allPresets[idx]
      if (p) merged = { ...merged, ...p.filters }
    })
    applyPreset(merged)
  }, [selectedPresets, allPresets])

  const resetFilters = () => {
    setCondition("all")
    setHourRange([0, 23])
    setRoute("all")
    setGear("all")
    setDay("all")
    setHasRoute(false)
    setHasGear(false)
    setHasTags(false)
    setSelectedPresets([])
  }

  const activeFilters = [
    ...(condition !== "all"
      ? [{ label: `Condition: ${condition}`, onClear: () => setCondition("all") }]
      : []),
    ...(route !== "all"
      ? [{ label: `Route: ${route}`, onClear: () => setRoute("all") }]
      : []),
    ...(gear !== "all"
      ? [{ label: `Gear: ${gear}`, onClear: () => setGear("all") }]
      : []),
    ...(hasRoute
      ? [{ label: "Has route", onClear: () => setHasRoute(false) }]
      : []),
    ...(hasGear
      ? [{ label: "Has gear", onClear: () => setHasGear(false) }]
      : []),
    ...(hasTags
      ? [{ label: "Has tags", onClear: () => setHasTags(false) }]
      : []),
    ...(day !== "all"
      ? [{ label: `Day: ${day}`, onClear: () => setDay("all") }]
      : []),
    ...(hourRange[0] !== 0 || hourRange[1] !== 23
      ? [{ label: `Hours: ${hourRange[0]}-${hourRange[1]}`, onClear: () => setHourRange([0, 23]) }]
      : []),
  ]

  const handlePresetClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      setSelectedPresets((prev) => {
        let next = [...prev]
        if (e.shiftKey && lastPresetIdx.current !== null) {
          const [start, end] =
            idx > lastPresetIdx.current
              ? [lastPresetIdx.current, idx]
              : [idx, lastPresetIdx.current]
          for (let i = start; i <= end; i++) {
            if (!next.includes(i)) next.push(i)
          }
        } else {
          if (next.includes(idx)) next = next.filter((i) => i !== idx)
          else next.push(idx)
        }
        lastPresetIdx.current = idx
        return next
      })
    } else {
      lastPresetIdx.current = idx
      setSelectedPresets([idx])
    }
  }

  useEffect(() => {
    async function checkForecast() {
      if (!sessions || sessions.length === 0) return
      const good = sessions.filter((s) => s.good && !s.isFalsePositive)
      if (good.length < 3) return
      const top = [...good].sort((a, b) => b.paceDelta - a.paceDelta).slice(0, 5)
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
      const avgTemp = avg(top.map((s) => s.temperature))
      const avgHum = avg(top.map((s) => s.humidity))
      const avgWind = avg(top.map((s) => s.wind))
      const counts: Record<string, number> = {}
      for (const s of top) counts[s.condition] = (counts[s.condition] || 0) + 1
      const common = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
      const loc = top.find((s) => !isNaN(s.lat) && !isNaN(s.lon))
      if (!loc || !common) return
      try {
        const forecastData = await getWeatherForecast(loc.lat, loc.lon, 5)
        const withProb = forecastData.map((d) => {
          const t = Math.max(0, 1 - Math.abs(d.temperature - avgTemp) / 10)
          const h = Math.max(0, 1 - Math.abs(d.humidity - avgHum) / 20)
          const w = Math.max(0, 1 - Math.abs(d.wind - avgWind) / 5)
          const c = d.condition === common ? 1 : 0
          return { date: d.date, probability: (t + h + w + c) / 4 }
        })
        setForecast(withProb)
        const best = [...withProb].sort((a, b) => b.probability - a.probability)[0]
        if (best && best.probability > 0.6) {
          setForecastMessage(
            `High chance of a good session on ${new Date(best.date).toLocaleDateString()}.`,
          )
        }
      } catch {}
    }
    checkForecast()
  }, [sessions])


  return (
    <div className="p-4 space-y-4">
      <div className="-m-4 mb-4 sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Good Day Sessions</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
            <Popover open={tip === 0}>
              <PopoverTrigger asChild>
                <Button size="sm" onClick={saveView}>
                  Save view
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="max-w-xs text-sm">Save the current filter selection for quick access later.</p>
                <Button size="sm" className="mt-2" onClick={nextTip}>
                  Next
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {sessions && <GoodDayBadges sessions={sessions} />}
        {activeFilters.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {activeFilters.map((f) => (
              <Badge
                key={f.label}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {f.label}
                <button onClick={f.onClear} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Sessions that exceeded expectations are highlighted below.
      </p>
      {forecastMessage && (
        <div className="p-2 bg-green-100 text-green-800 rounded">
          {forecastMessage}
        </div>
      )}
      {forecast.length > 0 && (
        <GoodDayForecastCalendar data={forecast} />
      )}
      <Popover open={tip === 1}>
        <PopoverTrigger asChild>
          <div className="flex gap-2 flex-wrap">
            {allPresets.map((p, i) => (
              <Button
                key={p.name}
                size="sm"
                variant={selectedPresets.includes(i) ? "default" : "outline"}
                className="rounded-full"
                onClick={(e) => handlePresetClick(e, i)}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <p className="max-w-xs text-sm">Apply a preset to quickly filter sessions.</p>
          <Button size="sm" className="mt-2" onClick={nextTip}>
            Next
          </Button>
        </PopoverContent>
      </Popover>
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
          <Button
            size="sm"
            variant={hasRoute ? "default" : "outline"}
            onClick={() => setHasRoute((v) => !v)}
          >
            Has route
          </Button>
          <Button
            size="sm"
            variant={hasGear ? "default" : "outline"}
            onClick={() => setHasGear((v) => !v)}
          >
            Has gear
          </Button>
          <Button
            size="sm"
            variant={hasTags ? "default" : "outline"}
            onClick={() => setHasTags((v) => !v)}
          >
            Has tags
          </Button>
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
      <Popover open={tip === 2}>
        <PopoverTrigger asChild>
          <div>
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
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <p className="max-w-xs text-sm">Explore your sessions on the map. Click a point to view details.</p>
          <Button size="sm" className="mt-2" onClick={nextTip}>
            Done
          </Button>
        </PopoverContent>
      </Popover>
      <SessionDetailDrawer session={active} onClose={() => setActive(null)} />
    </div>
  )
}
