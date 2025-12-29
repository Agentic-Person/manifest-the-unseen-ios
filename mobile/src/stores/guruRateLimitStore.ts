/**
 * Guru Rate Limit Store
 *
 * Tracks daily Guru analysis usage for free/trial users.
 * Free tier users get 3 Guru requests per day.
 * Awakening+ users have unlimited access.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'guru_daily_usage';
const DAILY_LIMIT = 3;

interface DailyUsage {
  date: string; // YYYY-MM-DD format
  count: number;
}

interface GuruRateLimitState {
  usage: DailyUsage | null;
  isLoading: boolean;

  // Actions
  loadUsage: () => Promise<void>;
  canMakeRequest: () => boolean;
  incrementUsage: () => Promise<void>;
  getRemainingRequests: () => number;
  getResetTime: () => string;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Guru Rate Limit Store
 */
export const useGuruRateLimitStore = create<GuruRateLimitState>((set, get) => ({
  usage: null,
  isLoading: true,

  /**
   * Load usage from AsyncStorage
   */
  loadUsage: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const usage: DailyUsage = JSON.parse(stored);
        const today = getTodayDate();

        // Reset if it's a new day
        if (usage.date !== today) {
          const newUsage: DailyUsage = { date: today, count: 0 };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
          set({ usage: newUsage, isLoading: false });
        } else {
          set({ usage, isLoading: false });
        }
      } else {
        // First time - initialize
        const newUsage: DailyUsage = { date: getTodayDate(), count: 0 };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
        set({ usage: newUsage, isLoading: false });
      }
    } catch (error) {
      console.error('[GuruRateLimit] Failed to load usage:', error);
      // Default to allowing requests on error
      set({ usage: { date: getTodayDate(), count: 0 }, isLoading: false });
    }
  },

  /**
   * Check if user can make a Guru request
   * Returns true if under daily limit
   */
  canMakeRequest: (): boolean => {
    const { usage } = get();
    if (!usage) return true; // Allow if not loaded yet

    const today = getTodayDate();
    if (usage.date !== today) return true; // New day, reset

    return usage.count < DAILY_LIMIT;
  },

  /**
   * Increment the daily usage counter
   * Call this after a successful Guru request
   */
  incrementUsage: async () => {
    const { usage } = get();
    const today = getTodayDate();

    let newUsage: DailyUsage;

    if (!usage || usage.date !== today) {
      // New day or first request
      newUsage = { date: today, count: 1 };
    } else {
      // Same day, increment
      newUsage = { date: today, count: usage.count + 1 };
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
      set({ usage: newUsage });
    } catch (error) {
      console.error('[GuruRateLimit] Failed to save usage:', error);
    }
  },

  /**
   * Get remaining requests for today
   */
  getRemainingRequests: (): number => {
    const { usage } = get();
    if (!usage) return DAILY_LIMIT;

    const today = getTodayDate();
    if (usage.date !== today) return DAILY_LIMIT;

    return Math.max(0, DAILY_LIMIT - usage.count);
  },

  /**
   * Get time until rate limit resets (midnight local time)
   */
  getResetTime: (): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diffMs = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },
}));

/**
 * Hook to get rate limit status
 */
export const useGuruRateLimit = () => {
  const canMakeRequest = useGuruRateLimitStore((state) => state.canMakeRequest);
  const incrementUsage = useGuruRateLimitStore((state) => state.incrementUsage);
  const getRemainingRequests = useGuruRateLimitStore((state) => state.getRemainingRequests);
  const getResetTime = useGuruRateLimitStore((state) => state.getResetTime);
  const loadUsage = useGuruRateLimitStore((state) => state.loadUsage);
  const isLoading = useGuruRateLimitStore((state) => state.isLoading);

  return {
    canMakeRequest,
    incrementUsage,
    getRemainingRequests,
    getResetTime,
    loadUsage,
    isLoading,
    dailyLimit: DAILY_LIMIT,
  };
};

/**
 * Export daily limit constant for UI display
 */
export const GURU_DAILY_LIMIT = DAILY_LIMIT;
