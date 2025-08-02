import { getGarminData, getLocationVisits, type LocationVisit } from './api';

export type ActivityLabel = 'run' | 'walk' | 'sedentary';

export interface PhoneActivityState {
  date: string;
  type: ActivityLabel;
}

// Mock phone activity-recognition states
const mockPhoneStates: PhoneActivityState[] = [
  {
    date: new Date().toISOString().slice(0, 10),
    type: 'walk',
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    type: 'sedentary',
  },
];

export async function getPhoneActivityStates(): Promise<PhoneActivityState[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPhoneStates), 200);
  });
}

export interface ActivityVisit extends LocationVisit {
  activity: ActivityLabel;
}

// Fetch Garmin sessions, phone activity states, and enrich visits
export async function getActivityVisits(): Promise<ActivityVisit[]> {
  const [visits, garmin, phone] = await Promise.all([
    getLocationVisits(),
    getGarminData(),
    getPhoneActivityStates(),
  ]);

  const sessionByDate: Record<string, ActivityLabel> = {};
  garmin.activities.forEach((a) => {
    const t = a.type.toLowerCase();
    if (t === 'run' || t === 'walk') {
      sessionByDate[a.date] = t as ActivityLabel;
    }
  });

  const phoneByDate: Record<string, ActivityLabel> = {};
  phone.forEach((p) => {
    phoneByDate[p.date] = p.type;
  });

  return visits.map((v) => {
    const activity = sessionByDate[v.date] || phoneByDate[v.date] || 'sedentary';
    return { ...v, activity };
  });
}

export default getActivityVisits;
