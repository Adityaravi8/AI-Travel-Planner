export interface Trip {
  _id?: string;
  destination: string;
  startDate: string;
  days: number;
  budgetPerPerson: number;
  ownerId?: string;
}

export interface Preference {
  interests: string[];
  activityLevel: string;
  diet: string;
  hardNo: string[];
}

export interface Weather {
  conditions: string;
  highTemp: number;
  lowTemp: number;
  rainChance?: number;
}

export interface Day {
  day: number;
  date?: string;
  weather?: Weather;
  morning: string;
  afternoon: string;
  evening: string;
  estimatedCost: number;
}
