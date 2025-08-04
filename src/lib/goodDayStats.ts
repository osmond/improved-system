import type { SessionPoint } from "@/hooks/useRunningSessions"

export interface GoodDayStats {
  lastDate: string | null
  currentStreak: number
  bestStreak: number
  personalBest: number
}

const KEY = "goodDayStats"

function getStorage(): Storage {
  if (typeof localStorage !== "undefined") return localStorage
  // simple in-memory fallback for non-browser environments
  const store: Record<string, string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = v
    },
    removeItem: (k: string) => {
      delete store[k]
    },
    clear: () => {
      for (const k in store) delete store[k]
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    length: 0,
  } as Storage
}

function load(): GoodDayStats {
  try {
    const raw = getStorage().getItem(KEY)
    if (raw) return JSON.parse(raw) as GoodDayStats
  } catch {}
  return { lastDate: null, currentStreak: 0, bestStreak: 0, personalBest: 0 }
}

function save(stats: GoodDayStats): void {
  try {
    getStorage().setItem(KEY, JSON.stringify(stats))
  } catch {}
}

export function resetGoodDayStats(): void {
  save({ lastDate: null, currentStreak: 0, bestStreak: 0, personalBest: 0 })
}

export function getGoodDayStats(): GoodDayStats {
  return load()
}

export function updateGoodDayStats(
  sessions: Array<Pick<SessionPoint, "start" | "good" | "paceDelta">>,
): GoodDayStats {
  let stats = load()
  const sorted = sessions
    .filter((s) => s.good)
    .sort((a, b) => a.start.localeCompare(b.start))
  for (const s of sorted) {
    const day = s.start.slice(0, 10)
    if (stats.lastDate && day <= stats.lastDate) {
      if (s.paceDelta > stats.personalBest) stats.personalBest = s.paceDelta
      continue
    }
    if (stats.lastDate) {
      const prev = new Date(stats.lastDate)
      prev.setDate(prev.getDate() + 1)
      const expected = prev.toISOString().slice(0, 10)
      stats.currentStreak = day === expected ? stats.currentStreak + 1 : 1
    } else {
      stats.currentStreak = 1
    }
    stats.lastDate = day
    if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak
    if (s.paceDelta > stats.personalBest) stats.personalBest = s.paceDelta
  }
  save(stats)
  return stats
}
