import { render, screen, renderHook, waitFor } from "@testing-library/react"
import ReadingProbabilityTimeline from "../ReadingProbabilityTimeline"
import useReadingProbability from "@/hooks/useReadingProbability"
import { getKindleSessions } from "@/lib/api"
import { vi, describe, it, expect } from "vitest"
import React from "react"
import "@testing-library/jest-dom"

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts")
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.cloneElement(children, { width: 800, height: 400 })}
      </div>
    ),
  }
})

vi.mock("@/lib/api", () => ({
  __esModule: true,
  getKindleSessions: vi.fn(),
}))

describe("ReadingProbabilityTimeline", () => {
  it("renders chart title", async () => {
    ;(getKindleSessions as any).mockResolvedValue([])
    render(<ReadingProbabilityTimeline />)
    expect(await screen.findByText(/Reading Probability/)).toBeInTheDocument()
  })
})

describe("useReadingProbability", () => {
  it("computes hourly percentages", async () => {
      const sessions = [
        {
          start: "2025-07-30T00:15:00Z",
          end: "2025-07-30T00:35:00Z",
          asin: "A",
          title: "Book A",
          duration: 20,
          highlights: 10,
        },
        {
          start: "2025-07-30T01:45:00Z",
          end: "2025-07-30T02:25:00Z",
          asin: "B",
          title: "Book B",
          duration: 40,
          highlights: 28,
        },
      ]
      ;(getKindleSessions as any).mockResolvedValue(sessions)
    const { result } = renderHook(() => useReadingProbability())
    await waitFor(() => result.current !== null)
    const data = result.current!
      const h0 = data.find((d) => new Date(d.time).getHours() === 0)
      const h1 = data.find((d) => new Date(d.time).getHours() === 1)
      expect(h0?.probability).toBeCloseTo(0.5)
      expect(h1?.probability).toBeCloseTo(0.5)
      expect(h0?.intensity).toBeCloseTo(0.5)
      expect(h1?.intensity).toBeCloseTo(0.7)
      expect(h0?.avgDuration).toBeCloseTo(20)
      expect(h1?.avgDuration).toBeCloseTo(40)
      expect(h0?.label).toBe("Skim")
      expect(h1?.label).toBe("Deep Dive")
  })
})
