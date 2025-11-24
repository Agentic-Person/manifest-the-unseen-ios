# Manifest the Unseen - Mobile App

React Native mobile application for iOS (with future Android support).

## Project Structure

```
mobile/
├── src/
│   ├── navigation/          # React Navigation setup
│   │   ├── RootNavigator.tsx       # Root navigation with auth flow
│   │   └── MainTabNavigator.tsx    # Bottom tab navigation
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.tsx          # Dashboard/home
│   │   ├── WorkbookScreen.tsx      # Workbook phases
│   │   ├── MeditateScreen.tsx      # Meditation player
│   │   ├── JournalScreen.tsx       # Voice journaling
│   │   └── ProfileScreen.tsx       # User profile & settings
│   ├── stores/              # Zustand state management
│   │   ├── authStore.ts            # Authentication state
│   │   ├── settingsStore.ts        # App settings
│   │   └── appStore.ts             # Global app state
│   ├── services/            # External services
│   │   ├── supabase.ts             # Supabase client & helpers
│   │   └── queryClient.ts          # TanStack Query config
│   ├── hooks/               # Custom React hooks
│   │   └── useUser.ts              # User query hooks
│   └── types/               # TypeScript types
│       ├── navigation.ts           # Navigation types
│       ├── store.ts                # Store types
│       └── database.ts             # Supabase types
├── App.tsx                  # Root component
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md               # This file
```

## Tech Stack

### Core
- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library (v6+)

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query** (React Query) - Server state management
- **AsyncStorage** - Local persistence

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Apple Sign-In, email)
  - Real-time subscriptions
  - Storage for media files

## Installation

### Prerequisites
- Node.js 18+
- Xcode 14+ (for iOS)
- CocoaPods (for iOS dependencies)

### Setup

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Install iOS dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Configure environment variables**

   Create a `.env` file in the mobile directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the app**
   ```bash
   # iOS
   npm run ios

   # Android (future)
   npm run android
   ```

## Architecture

### Navigation Structure

The app uses a nested navigation structure:

```
RootNavigator (Stack)
├── Auth Flow (when not authenticated)
│   ├── Welcome
│   ├── Sign In
│   └── Sign Up
└── Main App (when authenticated)
    └── MainTabNavigator (Bottom Tabs)
        ├── Home
        ├── Workbook
        ├── Meditate
        ├── Journal
        └── Profile
```

### State Management

#### Zustand Stores

1. **Auth Store** (`src/stores/authStore.ts`)
   - User authentication state
   - User profile data
   - Session management
   - Sign in/out actions

2. **Settings Store** (`src/stores/settingsStore.ts`)
   - Theme preferences
   - Notification settings
   - Meditation preferences (narrator, reminders)
   - Journal preferences
   - Accessibility settings

3. **App Store** (`src/stores/appStore.ts`)
   - Global app state
   - Network status
   - Onboarding status
   - UI state (drawer, tabs)

#### TanStack Query

Used for server state management with Supabase:
- Automatic caching (5 min stale time)
- Background refetching
- Optimistic updates
- Error handling
- Retry logic

**Query Keys** (centralized in `queryClient.ts`):
```typescript
queryKeys.users.profile(userId)
queryKeys.workbook.progress(userId)
queryKeys.journal.entries(userId)
queryKeys.meditations.list
// ... etc
```

### Supabase Integration

The `supabase.ts` service file provides:

**Auth Helpers**:
- `signInWithEmail(email, password)`
- `signUpWithEmail(email, password)`
- `signInWithApple()`
- `signOut()`
- `resetPassword(email)`

**Database Helpers**:
- `getUserProfile(userId)`
- `updateUserProfile(userId, updates)`

**Storage Helpers**:
- `uploadFile(bucket, path, file)`
- `getPublicUrl(bucket, path)`
- `deleteFile(bucket, path)`

**Real-time Helpers**:
- `subscribeToTable(table, callback)`
- `unsubscribe(subscription)`

### TypeScript Types

All TypeScript types are centralized in `src/types/`:

- **Navigation Types** - Type-safe navigation params
- **Store Types** - Zustand store interfaces
- **Database Types** - Supabase schema types (generated)

## Key Features

### 1. Type-Safe Navigation

```typescript
import type { MainTabScreenProps } from '@/types/navigation';

type Props = MainTabScreenProps<'Home'>;

const HomeScreen = ({ navigation, route }: Props) => {
  // navigation and route are fully typed
  navigation.navigate('Workbook');
};
```

### 2. Optimized Store Selectors

```typescript
// Only re-renders when user changes
const user = useUser();

// Only re-renders when profile changes
const profile = useProfile();

// Access entire store (re-renders on any change)
const { user, profile, signOut } = useAuthStore();
```

### 3. Data Fetching with TanStack Query

```typescript
import { useUserProfile } from '@/hooks/useUser';

const { data: profile, isLoading, error } = useUserProfile();
```

### 4. Supabase Real-time

```typescript
useEffect(() => {
  const subscription = subscribeToTable('journal_entries', (payload) => {
    console.log('New journal entry:', payload);
  });

  return () => unsubscribe(subscription);
}, []);
```

## Development Guidelines

### File Organization

- **Screens**: Top-level UI components for navigation
- **Components**: Reusable UI components (to be created)
- **Hooks**: Custom React hooks for shared logic
- **Services**: External API integrations
- **Types**: TypeScript type definitions
- **Utils**: Helper functions (to be created)

### Code Style

- Use **functional components** with hooks
- Prefer **named exports** over default exports
- Always **type your props** with TypeScript
- Use **const** for everything except in rare cases
- Follow **React Navigation** best practices for navigation

### State Management Guidelines

**Use Zustand for**:
- UI state (theme, modal visibility)
- User preferences (settings)
- Authentication state
- App-wide state

**Use TanStack Query for**:
- Server data (database queries)
- API calls
- Cached data with automatic refetching
- Mutations (create, update, delete)

### Testing Strategy

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint
npm run lint
```

## Environment Variables

Required environment variables:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Development
DEV_MODE=true
```

## Next Steps

### Immediate (Week 1-2)
- [ ] Set up React Native project with `npx react-native init`
- [ ] Install all dependencies from package.json
- [ ] Configure Supabase environment variables
- [ ] Test navigation flow
- [ ] Implement authentication screens

### Short-term (Week 3-8)
- [ ] Build design system (colors, typography, components)
- [ ] Implement authentication with Apple Sign-In
- [ ] Create workbook phase screens
- [ ] Build voice journaling with Whisper
- [ ] Add meditation player

### Mid-term (Week 9-20)
- [ ] Complete all 10 workbook phases
- [ ] Implement AI chat with RAG
- [ ] Add vision board feature
- [ ] Integrate RevenueCat subscriptions
- [ ] Add analytics and error tracking

## Troubleshooting

### iOS Pod Install Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Type Errors
```bash
npm run type-check
```

## Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Supabase React Native Docs](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [React Native Docs](https://reactnative.dev/)

## License

Proprietary - All rights reserved
