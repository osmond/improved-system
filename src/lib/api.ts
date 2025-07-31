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
