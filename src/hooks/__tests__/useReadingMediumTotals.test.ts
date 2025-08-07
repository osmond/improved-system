import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import useReadingMediumTotals from "../useReadingMediumTotals"
import * as api from "@/lib/api"
import type { ReadingMediumTotal } from "@/lib/api"

describe("useReadingMediumTotals", () => {
  it("fetches data and updates loading state", async () => {
    const mockData: ReadingMediumTotal[] = [
      { medium: "phone", minutes: 30 },
    ]
    const fetcher = vi.fn().mockResolvedValue(mockData)
    const { result } = renderHook(() => useReadingMediumTotals({ fetcher }))

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalled()
  })

  it("handles fetch errors", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("fail"))
    const { result } = renderHook(() => useReadingMediumTotals({ fetcher }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeNull()
  })

  it("falls back to mock data when fetch fails", async () => {
    const mockData: ReadingMediumTotal[] = [
      { medium: "tablet", minutes: 45 },
    ]
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fail")))
    const spy = vi
      .spyOn(api, "getReadingMediumTotals")
      .mockResolvedValue(mockData)
    const { result } = renderHook(() => useReadingMediumTotals())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(spy).toHaveBeenCalled()
    vi.unstubAllGlobals()
    spy.mockRestore()
  })
})
