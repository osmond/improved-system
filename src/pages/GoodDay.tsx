import React, { useMemo, useState } from "react";
import { GoodDayMap, GoodDaySparkline } from "@/components/statistics";
import SessionDetailDrawer from "@/components/statistics/SessionDetailDrawer";
import { useRunningSessions, type SessionPoint } from "@/hooks/useRunningSessions";
import { SimpleSelect } from "@/components/ui/select";
import Slider from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export default function GoodDayPage() {
  const sessions = useRunningSessions();
  const [condition, setCondition] = useState("all");
  const [hourRange, setHourRange] = useState<[number, number]>([0, 23]);
  const [active, setActive] = useState<SessionPoint | null>(null);

  const conditions = useMemo(
    () => (sessions ? Array.from(new Set(sessions.map((s) => s.condition))) : []),
    [sessions],
  );

  const stats = useMemo(() => {
    if (!sessions) return null;
    const goodSessions = sessions.filter((s) => s.good);
    if (!goodSessions.length)
      return { count: 0, mean: 0, max: 0, percent: 0, top: [], trend: [] };
    const deltas = goodSessions.map((s) => s.paceDelta);
    const count = goodSessions.length;
    const mean = deltas.reduce((sum, d) => sum + d, 0) / count;
    const best = goodSessions.reduce((a, b) => (b.paceDelta > a.paceDelta ? b : a));
    const baselineAvg =
      goodSessions.reduce((sum, s) => sum + s.pace + s.paceDelta, 0) / count;
    const percent = baselineAvg ? (mean / baselineAvg) * 100 : 0;
    const top = [...goodSessions]
      .sort((a, b) => b.paceDelta - a.paceDelta)
      .slice(0, 3);
    const now = new Date();
    const trend = Array.from({ length: 30 }, (_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (29 - i));
      const key = day.toISOString().slice(0, 10);
      const c = goodSessions.filter(
        (s) => s.start && s.start.slice(0, 10) === key,
      ).length;
      return { date: key, count: c };
    });
    return { count, mean, max: best.paceDelta, percent, top, trend };
  }, [sessions]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Good Day Sessions</h1>
      <p className="text-sm text-muted-foreground">
        Sessions that exceeded expectations are highlighted below.
      </p>
      {stats && (
        <Card className="p-4 text-sm space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-1">
              <div>Good sessions: {stats.count}</div>
              <div>
                Avg Δ Pace: {stats.mean.toFixed(2)} min/mi (
                {stats.percent.toFixed(0)}% faster than expected)
              </div>
              <div>Best run: {stats.max.toFixed(2)} min/mi faster</div>
            </div>
            <div className="sm:w-40 w-full">
              <GoodDaySparkline data={stats.trend} />
            </div>
          </div>
          {stats.top.length > 0 && (
            <div>
              <h2 className="font-medium mt-2">Top improvements</h2>
              <ol className="list-decimal pl-4 space-y-1">
                {stats.top.map((s) => (
                  <li key={s.start}>
                    <button
                      className="hover:underline"
                      onClick={() => setActive(s)}
                    >
                      {new Date(s.start).toLocaleDateString()}: {s.paceDelta.toFixed(2)}
                      {" "}min/mi faster
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      )}
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
        onSelect={setActive}
      />
      <SessionDetailDrawer session={active} onClose={() => setActive(null)} />
    </div>
  );
}
