import React, { useEffect, useState } from "react"
import { Badge } from "@/ui/badge"
import type { SessionPoint } from "@/hooks/useRunningSessions"
import {
  updateGoodDayStats,
  type GoodDayStats,
} from "@/lib/goodDayStats"

interface GoodDayBadgesProps {
  sessions: SessionPoint[] | null
}

export default function GoodDayBadges({ sessions }: GoodDayBadgesProps) {
  const [stats, setStats] = useState<GoodDayStats | null>(null)

  useEffect(() => {
    if (!sessions) return
    const updated = updateGoodDayStats(sessions)
    setStats(updated)
  }, [sessions])

  if (!stats) return null

  return (
    <div className="flex gap-2 flex-wrap">
      <Badge className="flex items-center gap-1">
        {stats.currentStreak}d streak
      </Badge>
      {stats.bestStreak > 0 && (
        <Badge className="flex items-center gap-1" variant="secondary">
          Best {stats.bestStreak}d
        </Badge>
      )}
      {stats.personalBest > 0 && (
        <Badge className="flex items-center gap-1" variant="outline">
          PB Δ{stats.personalBest.toFixed(2)}
        </Badge>
      )}
    </div>
  )
}
