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

// ----- Running stats -----

export interface PaceDistributionBin {
  bin: string
  upper: number
  lower: number
}

export interface HeartRateZoneData {
  zone: string
  count: number
}

export interface PaceHeartPoint {
  pace: number
  heartRate: number
}

export interface TempBucket {
  label: string
  count: number
}

export interface WeatherCondition {
  label: string
  count: number
}

export interface AnnualMileage {
  year: number
  totalMiles: number
}

export interface HourActivity {
  hour: number
  pct: number
}

export interface WeekdayMileage {
  day: string
  pct: number
}

export interface DistanceBucket {
  label: string
  count: number
}

export interface TreadmillOutdoor {
  outdoor: number
  treadmill: number
}

export interface RunningStats {
  paceDistribution: PaceDistributionBin[]
  heartRateZones: HeartRateZoneData[]
  paceVsHeart: PaceHeartPoint[]
  temperature: TempBucket[]
  weatherConditions: WeatherCondition[]
  annualMileage: AnnualMileage[]
  byHour: HourActivity[]
  byWeekday: WeekdayMileage[]
  distanceBuckets: DistanceBucket[]
  treadmillOutdoor: TreadmillOutdoor
}

export const mockRunningStats: RunningStats = {
  paceDistribution: [
    { bin: '5:00', upper: 10, lower: 0 },
    { bin: '6:00', upper: 8, lower: 0 },
    { bin: '7:00', upper: 6, lower: 0 },
  ],
  heartRateZones: [
    { zone: 'Z1', count: 5 },
    { zone: 'Z2', count: 10 },
    { zone: 'Z3', count: 7 },
  ],
  paceVsHeart: [
    { pace: 5.2, heartRate: 150 },
    { pace: 6.1, heartRate: 145 },
  ],
  temperature: [
    { label: '50-60', count: 4 },
    { label: '60-70', count: 9 },
  ],
  weatherConditions: [
    { label: 'Sunny', count: 6 },
    { label: 'Cloudy', count: 3 },
  ],
  annualMileage: [
    { year: 2023, totalMiles: 1200 },
    { year: 2024, totalMiles: 900 },
  ],
  byHour: [
    { hour: 6, pct: 30 },
    { hour: 18, pct: 70 },
  ],
  byWeekday: [
    { day: 'Mon', pct: 15 },
    { day: 'Tue', pct: 20 },
  ],
  distanceBuckets: [
    { label: '0-3', count: 4 },
    { label: '3-6', count: 8 },
  ],
  treadmillOutdoor: {
    outdoor: 75,
    treadmill: 25,
  },
}

export async function getRunningStats(): Promise<RunningStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRunningStats), 300)
  })
}
