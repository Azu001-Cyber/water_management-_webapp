export type UsageType = 'drinking' | 'cooking' | 'washing' | 'bathing' | 'others';

export interface WaterEntry {
  id: string;
  date: string;
  amount: number;
  usageType: UsageType;
  customType?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DailyUsage {
  date: string;
  total: number;
  byCategory: Record<UsageType, number>;
  entries: WaterEntry[];
}

export interface WaterSettings {
  dailyLimit: number;
}

export const USAGE_TYPES: { value: UsageType; label: string }[] = [
  { value: 'drinking', label: 'Drinking' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'washing', label: 'Washing' },
  { value: 'bathing', label: 'Bathing' },
  { value: 'others', label: 'Others' },
];

export const DEFAULT_DAILY_LIMIT = 150;