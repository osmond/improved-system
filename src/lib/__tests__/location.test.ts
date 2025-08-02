import { getCurrentLocation } from "@/lib/api";

vi.mock("@capacitor/geolocation", () => ({
  Geolocation: {
    requestPermissions: vi.fn().mockResolvedValue({ location: "granted" }),
    getCurrentPosition: vi
      .fn()
      .mockResolvedValue({ coords: { latitude: 44, longitude: -93 } }),
  },
}));

describe("getCurrentLocation", () => {
  it("returns coordinates from the geolocation plugin", async () => {
    await expect(getCurrentLocation()).resolves.toEqual({
      latitude: 44,
      longitude: -93,
    });
  });
});
