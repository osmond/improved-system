export type Activity = {
  id: number;
  type: string;
  distance: number;
  duration: number;
  date: string;
};

export type GarminData = {
  steps: number;
  sleep: number;
  heartRate: number;
  calories: number;
  activities: Activity[];
};

export type GarminDay = {
  date: string;
  steps: number;
};

export const mockDailySteps: GarminDay[] = [
  { date: "2025-07-24", steps: 7500 },
  { date: "2025-07-25", steps: 8200 },
  { date: "2025-07-26", steps: 6100 },
  { date: "2025-07-27", steps: 9450 },
  { date: "2025-07-28", steps: 10020 },
  { date: "2025-07-29", steps: 8456 },
  { date: "2025-07-30", steps: 10342 },
];

export const mockGarminData: GarminData = {
  steps: 10342,
  sleep: 7.4,
  heartRate: 62,
  calories: 2200,
  activities: [
    { id: 1, type: "Run", distance: 5.2, duration: 42, date: "2025-07-30" },
    { id: 2, type: "Walk", distance: 2.1, duration: 25, date: "2025-07-29" },
  ],
};

export async function getGarminData(): Promise<GarminData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockGarminData), 500);
  });
}

export async function getDailySteps(): Promise<GarminDay[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDailySteps), 300);
  });
}

// ----- State visit data -----
import type { StateVisit } from "./types";

export const mockStateVisits: StateVisit[] = [
  {
    stateCode: "CA",
    visited: true,
    totalDays: 10,
    totalMiles: 1200,
    cities: [
      { name: "Los Angeles", days: 4, miles: 300 },
      { name: "San Francisco", days: 3, miles: 400 },
      { name: "San Diego", days: 3, miles: 500 },
    ],
  },
  {
    stateCode: "TX",
    visited: true,
    totalDays: 5,
    totalMiles: 600,
    cities: [
      { name: "Austin", days: 2, miles: 200 },
      { name: "Houston", days: 3, miles: 400 },
    ],
  },
  {
    stateCode: "NY",
    visited: false,
    totalDays: 0,
    totalMiles: 0,
    cities: [],
  },
];

export async function getStateVisits(): Promise<StateVisit[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStateVisits), 300);
  });
}
