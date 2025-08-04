import { describe, it, expect } from "vitest";
import { computeClusterStability } from "../clusterStability";

describe("computeClusterStability", () => {
  it("gives higher score to clusters with stable centroids", () => {
    const stable: any[] = [
      { cluster: 0, x: 0, y: 0, start: "2024-01-01" },
      { cluster: 0, x: 0.1, y: -0.1, start: "2024-01-02" },
      { cluster: 0, x: -0.1, y: 0.1, start: "2024-01-03" },
      { cluster: 0, x: 0.05, y: -0.05, start: "2024-01-04" },
      { cluster: 0, x: -0.05, y: 0.05, start: "2024-01-05" },
    ];
    const unstable: any[] = [
      { cluster: 1, x: 0, y: 0, start: "2024-01-01" },
      { cluster: 1, x: 5, y: 5, start: "2024-01-02" },
      { cluster: 1, x: -5, y: -5, start: "2024-01-03" },
      { cluster: 1, x: 5, y: -5, start: "2024-01-04" },
      { cluster: 1, x: -5, y: 5, start: "2024-01-05" },
    ];
    const res = computeClusterStability([...stable, ...unstable], 3);
    expect(res[0]).toBeGreaterThan(res[1]);
  });
});
