/**
 * TanStack Query Configuration
 *
 * Configures QueryClient with optimized settings for the app.
 * Provides default options for queries and mutations.
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { captureException, addBreadcrumb } from './crashReportingService';

/**
 * Error Handler
 * Global error handler for queries and mutations
 */
const handleError = (error: unknown) => {
  // Log error for debugging in development
  if (__DEV__) {
    console.error('Query/Mutation Error:', error);
  }

  // Send to Sentry for production error tracking
  captureException(error, {
    source: 'TanStack Query',
    type: error instanceof Error ? error.name : 'UnknownError',
  });
};

/**
 * Add breadcrumb for query/mutation tracking
 */
const addQueryBreadcrumb = (type: 'query' | 'mutation', key: unknown, status: string) => {
  addBreadcrumb({
    category: 'tanstack-query',
    message: `${type} ${status}`,
    level: status === 'error' ? 'error' : 'info',
    data: {
      queryKey: JSON.stringify(key),
    },
  });
};

/**
 * Query Cache
 * Configure global query cache
 */
const queryCache = new QueryCache({
  onError: (error, query) => {
    addQueryBreadcrumb('query', query.queryKey, 'error');
    handleError(error);
  },
  onSuccess: (_data, query) => {
    addQueryBreadcrumb('query', query.queryKey, 'success');
  },
});

/**
 * Mutation Cache
 * Configure global mutation cache
 */
const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    addQueryBreadcrumb('mutation', mutation.options.mutationKey, 'error');
    handleError(error);
  },
  onSuccess: (_data, _variables, _context, mutation) => {
    addQueryBreadcrumb('mutation', mutation.options.mutationKey, 'success');
  },
});

/**
 * Query Client
 *
 * Configured with:
 * - Aggressive caching (5 minutes stale time)
 * - Automatic refetch on window focus
 * - Retry failed queries
 * - Global error handling
 *
 * @example
 * ```tsx
 * import { QueryClientProvider } from '@tanstack/react-query';
 * import { queryClient } from '@/services/queryClient';
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <YourApp />
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)

      // Retry failed queries
      retry: (failureCount, error) => {
        // Don't retry on 404s or 401s
        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          (error.status === 404 || error.status === 401)
        ) {
          return false;
        }

        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: true,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,

      // Exponential backoff
      retryDelay: 1000,
    },
  },
});

/**
 * Query Keys
 * Centralized query key factory for consistent caching
 *
 * @example
 * ```tsx
 * import { queryKeys } from '@/services/queryClient';
 *
 * const { data } = useQuery({
 *   queryKey: queryKeys.users.detail(userId),
 *   queryFn: () => getUserProfile(userId),
 * });
 * ```
 */
export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    profile: (id: string) => ['users', id, 'profile'] as const,
  },

  // Workbook queries
  workbook: {
    all: ['workbook'] as const,
    phases: ['workbook', 'phases'] as const,
    phase: (id: number) => ['workbook', 'phases', id] as const,
    progress: (userId: string) => ['workbook', 'progress', userId] as const,
    exercise: (phaseId: number, exerciseId: string) =>
      ['workbook', 'phases', phaseId, 'exercises', exerciseId] as const,
  },

  // Meditation queries
  meditations: {
    all: ['meditations'] as const,
    list: (type?: string, narrator?: string) =>
      ['meditations', 'list', { type, narrator }] as const,
    detail: (id: string) => ['meditations', 'detail', id] as const,
    sessions: (userId: string) => ['meditations', 'sessions', userId] as const,
    stats: (userId: string) => ['meditations', 'stats', userId] as const,
  },

  // AI Chat queries
  aiChat: {
    all: ['ai-chat'] as const,
    conversations: (userId: string) => ['ai-chat', 'conversations', userId] as const,
    conversation: (id: string) => ['ai-chat', 'conversations', id] as const,
  },

  // Vision Board queries
  visionBoards: {
    all: ['vision-boards'] as const,
    list: (userId: string) => ['vision-boards', userId] as const,
    detail: (id: string) => ['vision-boards', id] as const,
  },

  // Subscription queries
  subscription: {
    status: (userId: string) => ['subscription', 'status', userId] as const,
    offerings: ['subscription', 'offerings'] as const,
  },
};

/**
 * Cache Invalidation Helpers
 * Utility functions to invalidate specific query caches
 */

/**
 * Invalidate User Queries
 */
export const invalidateUserQueries = (userId?: string) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
  } else {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  }
};

/**
 * Invalidate Workbook Queries
 */
export const invalidateWorkbookQueries = (userId?: string) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.workbook.progress(userId) });
  } else {
    queryClient.invalidateQueries({ queryKey: queryKeys.workbook.all });
  }
};

/**
 * Invalidate Meditation Queries
 */
export const invalidateMeditationQueries = (userId?: string) => {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.meditations.sessions(userId) });
  } else {
    queryClient.invalidateQueries({ queryKey: queryKeys.meditations.all });
  }
};

/**
 * Invalidate Guru-Related Queries
 * Use when workbook data is updated to trigger Guru re-assessment
 * This ensures the Guru AI fetches fresh workbook data for analysis
 */
export const invalidateGuruQueries = (userId: string) => {
  // Invalidate workbook progress (source data for Guru)
  queryClient.invalidateQueries({ queryKey: ['workbook-progress', userId] });
  // Invalidate all guru conversations so fresh data is fetched
  queryClient.invalidateQueries({ queryKey: ['guru-conversation', userId] });
};

/**
 * Clear All Caches
 * Use when user signs out
 */
export const clearAllCaches = () => {
  queryClient.clear();
};
