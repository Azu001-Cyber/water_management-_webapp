import { User, WaterEntry, WaterSettings, DEFAULT_DAILY_LIMIT } from '../types';
import { format } from 'date-fns';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Storage keys
const STORAGE_KEYS = {
  USER: 'water_app_user',
  ENTRIES: 'water_app_entries',
  SETTINGS: 'water_app_settings',
};

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@example.com': {
    password: 'password123',
    user: { id: '1', email: 'demo@example.com', name: 'Demo User' },
  },
};

// Helper to get stored data
const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to set stored data
const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============ AUTH API ============

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    await delay(500);
    
    // Check mock users first
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password) {
      setStoredData(STORAGE_KEYS.USER, mockUser.user);
      return mockUser.user;
    }
    
    // Check registered users
    const registeredUsers = getStoredData<Record<string, { password: string; user: User }>>(
      'registered_users',
      {}
    );
    const registeredUser = registeredUsers[email];
    if (registeredUser && registeredUser.password === password) {
      setStoredData(STORAGE_KEYS.USER, registeredUser.user);
      return registeredUser.user;
    }
    
    throw new Error('Invalid email or password');
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    await delay(500);
    
    // Check if user exists
    if (MOCK_USERS[email]) {
      throw new Error('Email already registered');
    }
    
    const registeredUsers = getStoredData<Record<string, { password: string; user: User }>>(
      'registered_users',
      {}
    );
    if (registeredUsers[email]) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser: User = {
      id: generateId(),
      email,
      name,
    };
    
    registeredUsers[email] = { password, user: newUser };
    setStoredData('registered_users', registeredUsers);
    setStoredData(STORAGE_KEYS.USER, newUser);
    
    return newUser;
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    return getStoredData<User | null>(STORAGE_KEYS.USER, null);
  },
};

// ============ WATER ENTRIES API ============

export const waterApi = {
  async getEntries(userId: string): Promise<WaterEntry[]> {
    await delay(300);
    const allEntries = getStoredData<WaterEntry[]>(STORAGE_KEYS.ENTRIES, []);
    return allEntries
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getEntriesByDate(userId: string, date: string): Promise<WaterEntry[]> {
    await delay(200);
    const allEntries = getStoredData<WaterEntry[]>(STORAGE_KEYS.ENTRIES, []);
    return allEntries.filter(
      entry => entry.userId === userId && entry.date === date
    );
  },

  async getEntry(id: string): Promise<WaterEntry | null> {
    await delay(200);
    const allEntries = getStoredData<WaterEntry[]>(STORAGE_KEYS.ENTRIES, []);
    return allEntries.find(entry => entry.id === id) || null;
  },

  async createEntry(
    data: Omit<WaterEntry, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WaterEntry> {
    await delay(300);
    const allEntries = getStoredData<WaterEntry[]>(STORAGE_KEYS.ENTRIES, []);
    
    const newEntry: WaterEntry = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    allEntries.push(newEntry);
    setStoredData(STORAGE_KEYS.ENTRIES, allEntries);
    
    return newEntry;
  },

  async updateEntry(
    id: string,
    data: Partial<Omit<WaterEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<WaterEntry> {
    await delay(300);
    const allEntries = getStoredData<WaterEntry[]>(STORAGE_KEYS.ENTRIES, []);
    const index = allEntries.findIndex(entry => entry.id === id);
    
    if (index === -1) {
      throw new Error('Entry not found');
    }
    
    allEntries[index] = {
      ...allEntries[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    setStoredData(STORAGE_KEYS.ENTRIES, allEntries);
    return allEntries[index];
  },

  async deleteEntry(id: string): Promise<void> {
    await delay(300);
    const allEntries = getStoredData<WaterEntry[]>(STORAGE_KEYS.ENTRIES, []);
    const filtered = allEntries.filter(entry => entry.id !== id);
    setStoredData(STORAGE_KEYS.ENTRIES, filtered);
  },

  async getTodayUsage(userId: string): Promise<number> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const entries = await this.getEntriesByDate(userId, today);
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  },
};

// ============ SETTINGS API ============

export const settingsApi = {
  async getSettings(userId: string): Promise<WaterSettings> {
    await delay(100);
    const allSettings = getStoredData<Record<string, WaterSettings>>(
      STORAGE_KEYS.SETTINGS,
      {}
    );
    return allSettings[userId] || { dailyLimit: DEFAULT_DAILY_LIMIT };
  },

  async updateSettings(
    userId: string,
    settings: Partial<WaterSettings>
  ): Promise<WaterSettings> {
    await delay(200);
    const allSettings = getStoredData<Record<string, WaterSettings>>(
      STORAGE_KEYS.SETTINGS,
      {}
    );
    
    allSettings[userId] = {
      ...(allSettings[userId] || { dailyLimit: DEFAULT_DAILY_LIMIT }),
      ...settings,
    };
    
    setStoredData(STORAGE_KEYS.SETTINGS, allSettings);
    return allSettings[userId];
  },
};
