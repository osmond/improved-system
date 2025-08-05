import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { getStateVisits } from "@/lib/api";
import { useStateVisits } from "../useStateVisits";

vi.mock("@/lib/api", () => ({
  __esModule: true,
  getStateVisits: vi.fn(),
}));

describe("useStateVisits", () => {
  it("returns null data and an error when the API fails", async () => {
    const err = new Error("API error");
    (getStateVisits as any).mockRejectedValue(err);
    const { result } = renderHook(() => useStateVisits());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(err);
  });
});
