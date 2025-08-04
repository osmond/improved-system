import { updateGoodDayStats, resetGoodDayStats } from "@/lib/goodDayStats"

describe("goodDayStats", () => {
  beforeEach(() => resetGoodDayStats())

  it("tracks streaks and personal best", () => {
    const sessions = [
      { start: "2024-01-01T10:00:00Z", good: true, paceDelta: 0.5 },
      { start: "2024-01-02T10:00:00Z", good: true, paceDelta: 0.8 },
      { start: "2024-01-04T10:00:00Z", good: true, paceDelta: 0.4 },
    ] as any
    const stats = updateGoodDayStats(sessions)
    expect(stats.currentStreak).toBe(1)
    expect(stats.bestStreak).toBe(2)
    expect(stats.personalBest).toBeCloseTo(0.8)
  })
})
