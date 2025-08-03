import { renderHook, waitFor } from "@testing-library/react";
import useLowEndDevice from "../useLowEndDevice";

describe("useLowEndDevice", () => {
  const originalCores = navigator.hardwareConcurrency;
  const originalMemory = (navigator as any).deviceMemory;

  afterEach(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: originalCores,
    });
    (navigator as any).deviceMemory = originalMemory;
  });

  it("detects low-end hardware", async () => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: 2,
    });
    (navigator as any).deviceMemory = 1;

    const { result } = renderHook(() => useLowEndDevice());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("does not flag modern hardware", async () => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: 8,
    });
    (navigator as any).deviceMemory = 8;

    const { result } = renderHook(() => useLowEndDevice());
    await waitFor(() => expect(result.current).toBe(false));
  });
});
