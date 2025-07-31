export interface CityVisit {
  name: string;
  days: number;
  miles: number;
}

export interface ActivityLogEntry {
  date: string;
  type: "run" | "bike";
  miles: number;
}

export interface StateVisit {
  stateCode: string;
  visited: boolean;
  totalDays: number;
  totalMiles: number;
  cities: CityVisit[];
  log: ActivityLogEntry[];
}
