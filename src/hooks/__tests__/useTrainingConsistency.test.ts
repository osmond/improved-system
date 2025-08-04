import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import useTrainingConsistency from "../useTrainingConsistency"
import * as api from "@/lib/api"
import type { RunningSession } from "@/lib/api"

describe("useTrainingConsistency", () => {
  it("filters sessions by timeframe", async () => {
    const baseSession = {
      pace: 6,
      duration: 30,
      heartRate: 130,
      lat: 0,
      lon: 0,
      weather: { temperature: 50, humidity: 40, wind: 0, condition: "Clear" },
    }
    const now = Date.now()
    const recent = new Date(now - 2 * 7 * 24 * 60 * 60 * 1000)
    const older = new Date(now - 10 * 7 * 24 * 60 * 60 * 1000)
    const sessions: RunningSession[] = [
      { id: 1, date: recent.toISOString().slice(0, 10), start: recent.toISOString(), ...baseSession },
      { id: 2, date: older.toISOString().slice(0, 10), start: older.toISOString(), ...baseSession },
    ]

    const spy = vi.spyOn(api, "getRunningSessions").mockResolvedValue(sessions)

    const { result } = renderHook(() => useTrainingConsistency("4w"))
    await waitFor(() => expect(result.current.data).not.toBeNull())
    expect(result.current.data?.sessions).toHaveLength(1)
    expect(result.current.data?.sessions[0].id).toBe(1)

    spy.mockRestore()
  })

  it("includes older sessions for longer timeframe", async () => {
    const baseSession = {
      pace: 6,
      duration: 30,
      heartRate: 130,
      lat: 0,
      lon: 0,
      weather: { temperature: 50, humidity: 40, wind: 0, condition: "Clear" },
    }
    const now = Date.now()
    const recent = new Date(now - 2 * 7 * 24 * 60 * 60 * 1000)
    const older = new Date(now - 10 * 7 * 24 * 60 * 60 * 1000)
    const sessions: RunningSession[] = [
      { id: 1, date: recent.toISOString().slice(0, 10), start: recent.toISOString(), ...baseSession },
      { id: 2, date: older.toISOString().slice(0, 10), start: older.toISOString(), ...baseSession },
    ]

    const spy = vi.spyOn(api, "getRunningSessions").mockResolvedValue(sessions)

    const { result } = renderHook(() => useTrainingConsistency("12w"))
    await waitFor(() => expect(result.current.data).not.toBeNull())
    expect(result.current.data?.sessions).toHaveLength(2)

    spy.mockRestore()
  })
})

