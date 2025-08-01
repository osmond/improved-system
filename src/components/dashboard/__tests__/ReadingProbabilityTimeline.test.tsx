import { render, screen } from "@testing-library/react"
import ReadingProbabilityTimeline from "../ReadingProbabilityTimeline"
import { vi, describe, it, expect } from "vitest"
import "@testing-library/jest-dom"

vi.mock("@/hooks/useReadingProbability", () => ({
  __esModule: true,
  default: () => [
    { time: "2025-07-30T00:00:00Z", probability: 0.5, intensity: 0.3 },
  ],
}))

describe("ReadingProbabilityTimeline", () => {
  it("renders chart title", () => {
    render(<ReadingProbabilityTimeline />)
    expect(screen.getByText(/Reading Probability/)).toBeInTheDocument()
  })
})
