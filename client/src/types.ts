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

export interface Day {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  estimatedCost: number;
}
