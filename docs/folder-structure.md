# Manifest the Unseen - Folder Structure

**Document Version:** 1.0
**Last Updated:** November 17, 2025

---

## Complete Monorepo Structure

```
manifest-the-unseen/
├── docs/                           # Project documentation
│   ├── manifest-the-unseen-prd.md  # Product Requirements Document
│   ├── manifest-the-unseen-tdd.md  # Technical Design Document
│   ├── manifest-the-unseen-summary.md
│   ├── react-native-setup-guide.md # This setup guide
│   ├── folder-structure.md         # This document
│   ├── example-configs/            # Example configuration files
│   └── transcripts/                # Source wisdom content
│
├── mobile/                         # React Native iOS app
│   ├── android/                    # Android native code (future)
│   ├── ios/                        # iOS native code
│   │   ├── Pods/                   # CocoaPods dependencies
│   │   ├── ManifestTheUnseen/      # iOS project files
│   │   ├── ManifestTheUnseen.xcodeproj/
│   │   ├── ManifestTheUnseen.xcworkspace/
│   │   ├── Podfile
│   │   └── Podfile.lock
│   │
│   ├── src/                        # Source code
│   │   ├── components/             # UI Components
│   │   │   ├── common/             # Reusable components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Text.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── BottomSheet.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── forms/              # Form components
│   │   │   │   ├── FormInput.tsx
│   │   │   │   ├── FormTextArea.tsx
│   │   │   │   ├── FormSelect.tsx
│   │   │   │   ├── FormCheckbox.tsx
│   │   │   │   ├── FormSlider.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── layouts/            # Layout components
│   │   │   │   ├── Screen.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── screens/                # Screen components
│   │   │   ├── auth/               # Authentication
│   │   │   │   ├── SignInScreen.tsx
│   │   │   │   ├── SignUpScreen.tsx
│   │   │   │   ├── OnboardingScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── workbook/           # Workbook phases
│   │   │   │   ├── WorkbookHomeScreen.tsx
│   │   │   │   ├── PhaseDetailScreen.tsx
│   │   │   │   ├── WorksheetScreen.tsx
│   │   │   │   ├── phases/
│   │   │   │   │   ├── Phase1Screen.tsx  # Self-Evaluation
│   │   │   │   │   ├── Phase2Screen.tsx  # Values & Vision
│   │   │   │   │   ├── Phase3Screen.tsx  # Goal Setting
│   │   │   │   │   └── ... (up to Phase10)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── journal/            # Voice journaling
│   │   │   │   ├── JournalHomeScreen.tsx
│   │   │   │   ├── JournalEntryScreen.tsx
│   │   │   │   ├── VoiceRecordScreen.tsx
│   │   │   │   ├── JournalDetailScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── meditation/         # Meditation & breathing
│   │   │   │   ├── MeditationHomeScreen.tsx
│   │   │   │   ├── MeditationPlayerScreen.tsx
│   │   │   │   ├── BreathingExerciseScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ai/                 # AI Monk Chat
│   │   │   │   ├── AIChatScreen.tsx
│   │   │   │   ├── ChatHistoryScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── vision-board/       # Vision boards
│   │   │   │   ├── VisionBoardHomeScreen.tsx
│   │   │   │   ├── VisionBoardEditorScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── settings/           # Settings
│   │   │   │   ├── SettingsHomeScreen.tsx
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   ├── SubscriptionScreen.tsx
│   │   │   │   ├── NotificationsScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/             # Navigation setup
│   │   │   ├── RootNavigator.tsx   # Root navigator
│   │   │   ├── AuthStack.tsx       # Auth flow stack
│   │   │   ├── MainTabs.tsx        # Main tab navigator
│   │   │   ├── WorkbookStack.tsx   # Workbook stack
│   │   │   ├── types.ts            # Navigation types
│   │   │   └── index.ts
│   │   │
│   │   ├── services/               # External services
│   │   │   ├── api/                # API clients
│   │   │   │   ├── client.ts       # Base API client
│   │   │   │   ├── auth.ts         # Auth API
│   │   │   │   ├── workbook.ts     # Workbook API
│   │   │   │   ├── journal.ts      # Journal API
│   │   │   │   ├── meditation.ts   # Meditation API
│   │   │   │   ├── ai.ts           # AI API
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── supabase/           # Supabase integration
│   │   │   │   ├── client.ts       # Supabase client
│   │   │   │   ├── auth.ts         # Auth queries
│   │   │   │   ├── queries.ts      # Database queries
│   │   │   │   ├── realtime.ts     # Realtime subscriptions
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── storage/            # Local storage
│   │   │   │   ├── asyncStorage.ts # AsyncStorage wrapper
│   │   │   │   ├── secureStorage.ts # Keychain wrapper
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── audio/              # Audio services
│   │   │   │   ├── recorder.ts     # Voice recording
│   │   │   │   ├── player.ts       # Audio playback
│   │   │   │   ├── whisper.ts      # Whisper transcription
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useWorkbook.ts
│   │   │   ├── useJournal.ts
│   │   │   ├── useMeditation.ts
│   │   │   ├── useAI.ts
│   │   │   ├── useSubscription.ts
│   │   │   ├── useVoiceRecorder.ts
│   │   │   ├── useAudioPlayer.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── store/                  # State management (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── workbookStore.ts
│   │   │   ├── journalStore.ts
│   │   │   ├── meditationStore.ts
│   │   │   ├── aiStore.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── date.ts
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   ├── permissions.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                  # TypeScript types
│   │   │   ├── models.ts
│   │   │   ├── navigation.ts
│   │   │   ├── api.ts
│   │   │   ├── nativewind.d.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── assets/                 # Static assets
│   │   │   ├── images/             # Images
│   │   │   │   ├── logo.png
│   │   │   │   ├── onboarding/
│   │   │   │   ├── phases/
│   │   │   │   └── icons/
│   │   │   │
│   │   │   ├── fonts/              # Custom fonts
│   │   │   │   └── (to be added)
│   │   │   │
│   │   │   └── audio/              # Audio files
│   │   │       └── meditations/
│   │   │           ├── morning-manifestation-male.m4a
│   │   │           ├── morning-manifestation-female.m4a
│   │   │           └── ...
│   │   │
│   │   └── constants/              # App constants
│   │       ├── colors.ts
│   │       ├── config.ts
│   │       ├── routes.ts
│   │       └── index.ts
│   │
│   ├── __tests__/                  # Test files
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── __mocks__/                  # Mock files for testing
│   │   ├── fileMock.js
│   │   └── audioMock.js
│   │
│   ├── App.tsx                     # Root app component
│   ├── index.js                    # Entry point
│   ├── app.json                    # React Native config
│   ├── package.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── tailwind.config.js
│   ├── jest.config.js
│   ├── jest.setup.js
│   ├── .eslintrc.js
│   ├── .prettierrc.js
│   └── .gitignore
│
├── packages/                       # Shared packages
│   └── shared/                     # Shared TypeScript code
│       ├── src/
│       │   ├── models/
│       │   │   └── index.ts        # Data models
│       │   ├── validation/
│       │   │   └── index.ts        # Zod schemas
│       │   ├── constants/
│       │   │   └── index.ts        # Shared constants
│       │   ├── utils/
│       │   │   └── index.ts        # Utility functions
│       │   ├── api/
│       │   │   └── index.ts        # API clients
│       │   ├── hooks/
│       │   │   └── index.ts        # Shared hooks
│       │   └── index.ts            # Package entry
│       │
│       ├── dist/                   # Built output
│       ├── package.json
│       ├── tsconfig.json
│       ├── jest.config.js
│       └── .eslintrc.js
│
├── supabase/                       # Supabase backend
│   ├── migrations/                 # Database migrations
│   │   ├── 20250101000000_initial_schema.sql
│   │   ├── 20250101000001_add_rls_policies.sql
│   │   └── ...
│   │
│   ├── functions/                  # Edge Functions (Deno)
│   │   ├── ai-chat/
│   │   │   └── index.ts
│   │   ├── embeddings/
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── seed.sql                    # Seed data
│   └── config.toml                 # Supabase config
│
├── agent-orchestration/            # AI agent orchestration
│   ├── orchestrator/
│   ├── agents/
│   ├── tasks/
│   │   ├── active/
│   │   │   └── TASK-2025-11-003.md
│   │   ├── completed/
│   │   ├── blocked/
│   │   └── templates/
│   ├── workstreams/
│   ├── logs/
│   └── prompts/
│
├── package.json                    # Monorepo root package.json
├── .gitignore
├── README.md
├── CLAUDE.md                       # Claude Code instructions
└── LICENSE

```

---

## Key Directories Explained

### `/mobile/src/components/`
Reusable UI components organized by purpose:
- **common/**: Basic building blocks (Button, Input, Card)
- **forms/**: Form-specific components with validation
- **layouts/**: Screen layouts and containers

### `/mobile/src/screens/`
Full-screen components (pages) organized by feature:
- Each feature has its own subdirectory
- Uses React Navigation for routing
- Composed of components from `/components/`

### `/mobile/src/services/`
External service integrations:
- **api/**: HTTP API clients
- **supabase/**: Supabase client and queries
- **storage/**: Local storage (AsyncStorage, Keychain)
- **audio/**: Audio recording/playback/transcription

### `/mobile/src/hooks/`
Custom React hooks for:
- Data fetching (TanStack Query)
- State management (Zustand)
- Side effects (audio, permissions, etc.)

### `/mobile/src/store/`
Zustand state management stores:
- One store per feature domain
- Used for global client state
- Server state managed by TanStack Query

### `/packages/shared/`
Shared TypeScript code:
- **models/**: Type definitions
- **validation/**: Zod schemas
- **constants/**: Configuration
- **utils/**: Helper functions
- Imported as `@manifest/shared` in mobile app

### `/supabase/`
Backend infrastructure:
- **migrations/**: SQL schema changes
- **functions/**: Serverless Edge Functions
- **seed.sql**: Initial data

---

## Import Path Examples

### Using shared package in mobile app:

```typescript
// Import models
import { User, WorkbookProgress } from '@manifest/shared';

// Import validation
import { signUpSchema } from '@manifest/shared';

// Import constants
import { TIER_LIMITS, WORKBOOK_PHASES } from '@manifest/shared';

// Import utilities
import { formatDate, truncate } from '@manifest/shared';
```

### Using path aliases in mobile app:

```typescript
// Import components
import { Button, Input } from '@/components';

// Import screens
import { SignInScreen } from '@/screens';

// Import hooks
import { useAuth } from '@/hooks';

// Import services
import { supabase } from '@/services/supabase';

// Import store
import { useAuthStore } from '@/store';

// Import constants
import { ROUTES } from '@/constants';
```

---

## File Naming Conventions

### Components
- **PascalCase** for component files: `Button.tsx`, `SignInScreen.tsx`
- Export as default or named export
- Co-locate styles if using StyleSheet

### Hooks
- **camelCase** with `use` prefix: `useAuth.ts`, `useWorkbook.ts`
- Export as default function

### Services/Utils
- **camelCase**: `auth.ts`, `validation.ts`
- Export named functions

### Types
- **PascalCase** for type names: `User`, `WorkbookProgress`
- File names in **camelCase**: `models.ts`, `navigation.ts`

### Constants
- **SCREAMING_SNAKE_CASE** for constant values: `API_URL`, `MAX_LENGTH`
- File names in **camelCase**: `colors.ts`, `config.ts`

---

## Testing Structure

Test files mirror source structure:

```
__tests__/
├── components/
│   └── Button.test.tsx
├── screens/
│   └── SignInScreen.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── utils/
    └── validation.test.ts
```

Or co-locate tests next to source:

```
src/components/Button.tsx
src/components/Button.test.tsx
```

---

## Asset Organization

### Images
- Organize by feature: `assets/images/onboarding/`, `assets/images/phases/`
- Use descriptive names: `phase-1-self-evaluation.png`
- Multiple resolutions: `@2x`, `@3x` suffixes for iOS

### Audio
- Separate by type: `meditations/`, `breathing/`, `sounds/`
- Naming convention: `[name]-[narrator]-[variant].m4a`
- Example: `morning-manifestation-male.m4a`

### Fonts
- Place custom fonts in `assets/fonts/`
- Link in `Info.plist` (iOS) and `react-native.config.js`

---

## Environment-Specific Files

### Development
- `.env.development` - Dev API keys
- `metro.config.js` - Dev bundler config

### Production
- `.env.production` - Prod API keys
- Build configs in Xcode/Android Studio

### Testing
- `jest.config.js` - Test configuration
- `jest.setup.js` - Test environment setup
- `__mocks__/` - Mock implementations

---

## Best Practices

### 1. Keep Components Small
- One component per file
- Max 200-300 lines per component
- Extract complex logic to hooks

### 2. Use Index Files
- Export all public items from `index.ts`
- Simplifies imports
- Example: `import { Button, Input } from '@/components'`

### 3. Co-locate Related Files
- Keep component, test, and styles together
- Feature-based organization

### 4. Separate Concerns
- **Components**: UI rendering only
- **Hooks**: State and side effects
- **Services**: External integrations
- **Utils**: Pure functions

### 5. Shared vs Mobile
- **Shared**: Platform-agnostic TypeScript
- **Mobile**: React Native-specific code

---

This structure supports:
- ✅ Scalability (room to grow)
- ✅ Maintainability (clear organization)
- ✅ Code reuse (shared package)
- ✅ Developer experience (clear imports)
- ✅ Testing (easy to find test files)

**Ready for implementation!** 🚀
