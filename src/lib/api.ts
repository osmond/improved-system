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

export function generateMockRunningStats(): RunningStats {
  const paceDistribution: PaceDistributionBin[] = []
  for (let i = 0; i < 10; i++) {
    const minutes = 5 + i * 0.5
    const m = Math.floor(minutes)
    const s = Math.round((minutes - m) * 60)
    const bin = `${m}:${s.toString().padStart(2, '0')}`
    const value = Math.round(Math.random() * 8 + 2)
    paceDistribution.push({ bin, upper: value, lower: -value })
  }

  const heartRateZones: HeartRateZoneData[] = [
    { zone: 'Z1', count: 20 },
    { zone: 'Z2', count: 40 },
    { zone: 'Z3', count: 30 },
    { zone: 'Z4', count: 15 },
    { zone: 'Z5', count: 5 },
  ]

  const paceVsHeart: PaceHeartPoint[] = Array.from({ length: 30 }, () => {
    const pace = +(5 + Math.random() * 4).toFixed(2)
    const heartRate = Math.round(130 + (10 - pace) * 10 + Math.random() * 5)
    return { pace, heartRate }
  })

  const temperature: TempBucket[] = [
    { label: '40-50', count: 3 },
    { label: '50-60', count: 8 },
    { label: '60-70', count: 12 },
    { label: '70-80', count: 6 },
    { label: '80-90', count: 2 },
  ]

  const weatherConditions: WeatherCondition[] = [
    { label: 'Sunny', count: 15 },
    { label: 'Cloudy', count: 8 },
    { label: 'Rain', count: 4 },
    { label: 'Snow', count: 1 },
  ]

  const currentYear = new Date().getFullYear()
  const annualMileage: AnnualMileage[] = []
  for (let year = currentYear - 5; year <= currentYear; year++) {
    annualMileage.push({ year, totalMiles: 800 + Math.round(Math.random() * 700) })
  }

  const byHour: HourActivity[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    pct: Math.round(Math.random() * 10),
  }))

  const byWeekday: WeekdayMileage[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (day) => ({ day, pct: Math.round(Math.random() * 20) })
  )

  const distanceBuckets: DistanceBucket[] = [
    { label: '0-3', count: 4 },
    { label: '3-6', count: 10 },
    { label: '6-9', count: 8 },
    { label: '9-12', count: 5 },
    { label: '12+', count: 2 },
  ]

  const treadmillOutdoor: TreadmillOutdoor = { outdoor: 80, treadmill: 20 }

  return {
    paceDistribution,
    heartRateZones,
    paceVsHeart,
    temperature,
    weatherConditions,
    annualMileage,
    byHour,
    byWeekday,
    distanceBuckets,
    treadmillOutdoor,
  }
}

export const mockRunningStats: RunningStats = generateMockRunningStats()

export async function getRunningStats(): Promise<RunningStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunningStats()), 300)
  })
}

export interface RunningSession {
  id: number
  pace: number
  duration: number
  heartRate: number
  date: string
}

export function generateMockRunningSessions(): RunningSession[] {
  return Array.from({ length: 50 }, (_, i) => {
    const pace = +(5 + Math.random() * 4).toFixed(2)
    const duration = Math.round(20 + Math.random() * 40)
    const heartRate = Math.round(120 + Math.random() * 40)
    const date = new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 180
    )
      .toISOString()
      .slice(0, 10)
    return { id: i + 1, pace, duration, heartRate, date }
  })
}

export const mockRunningSessions: RunningSession[] = generateMockRunningSessions()

export async function getRunningSessions(): Promise<RunningSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunningSessions()), 300)
  })
}

