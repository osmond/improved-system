import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi, describe, it, expect } from "vitest"
import BooksVsCalories from "../BooksVsCalories"

vi.mock("@/hooks/useReadingProgress", () => ({
  __esModule: true,
  default: () => ({ pagesRead: 40, readingGoal: 100, unreadPages: 60 }),
}))

vi.mock("@/hooks/useGarminData", () => ({
  __esModule: true,
  useGarminData: () => ({
    steps: 0,
    sleep: 0,
    heartRate: 0,
    calories: 200,
    activities: [],
    lastSync: "",
  }),
}))

vi.mock("@/hooks/useUserGoals", () => ({
  __esModule: true,
  default: () => ({
    dailyStepGoal: 0,
    setDailyStepGoal: vi.fn(),
    sleepGoal: 0,
    setSleepGoal: vi.fn(),
    heartRateGoal: 0,
    setHeartRateGoal: vi.fn(),
    calorieGoal: 500,
    setCalorieGoal: vi.fn(),
    readingGoal: 100,
    setReadingGoal: vi.fn(),
  }),
}))

describe("BooksVsCalories", () => {
  it("renders bars and tooltip", () => {
    vi.useFakeTimers()
    render(<BooksVsCalories />)
    const pagesBar = screen.getByTestId("pages-bar")
    const calorieBar = screen.getByTestId("calorie-bar")
    expect(pagesBar.style.width).toBe("60%")
    expect(calorieBar.style.width).toBe("60%")

    const card = screen.getByRole("img", { name: /Books vs Calories/i })
    fireEvent.focus(card)
    vi.advanceTimersByTime(1)
    expect(
      screen.getAllByText("Pages left: 60 / Calories to burn: 300.").length
    ).toBeGreaterThan(0)
    vi.useRealTimers()
  })
})
