# iOS Mobile App Development Workflow
## A Complete Guide for Building Production Apps

**Project**: Manifest the Unseen
**Framework**: React Native + Expo
**Target**: iOS (with Android future expansion)
**Purpose**: Learning reference for first-time iOS development and beyond

---

## Table of Contents

1. [The Complete Build & Deployment Workflow](#the-complete-build--deployment-workflow)
2. [What We're Building](#what-were-building)
3. [Tech Stack Breakdown](#tech-stack-breakdown)
4. [Key Concepts Explained](#key-concepts-explained)
5. [Common Development Commands](#common-development-commands)
6. [Environment Management](#environment-management)
7. [Security Best Practices](#security-best-practices)
8. [Testing Strategy](#testing-strategy)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## The Complete Build & Deployment Workflow

### Overview: Local → GitHub → EAS Cloud → TestFlight → App Store

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Your Computer  │ --> │    GitHub    │ --> │   EAS Cloud     │ --> │  TestFlight  │
│  (Development)  │     │ (Code Repo)  │     │ (Build Server)  │     │  (Testing)   │
└─────────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
```

### Step-by-Step Workflow

#### 1. **Local Development** (Your Machine)

**What happens here:**
- Write code in your editor (VS Code, etc.)
- Test changes in iOS Simulator or physical device
- Install dependencies (`npm install`)
- Run the app (`npm run ios`)

**Key files you work with:**
- `mobile/src/` - All your React Native code (components, screens, hooks)
- `mobile/package.json` - Dependencies and scripts
- `mobile/app.json` - Expo configuration (app name, icon, version)
- `mobile/eas.json` - Build profiles (development, preview, production)
- `mobile/.env` - **Local only** environment variables (NEVER commit!)

**Example workflow:**
```bash
cd mobile

# Install a new package
npm install expo-secure-store

# Rebuild native code (when adding native modules)
npx expo prebuild --clean

# Run on iOS simulator
npm run ios

# Run on your iPhone (connected via USB)
npm run ios:device

# Type check your code
npm run type-check
```

**When to rebuild native code:**
- After installing packages with native modules (expo-secure-store, react-native-track-player)
- After changing `app.json` config (permissions, bundle ID, version)
- After updating Expo SDK version

---

#### 2. **Commit to GitHub** (Version Control)

**What happens here:**
- Stage your changes (`git add`)
- Create a commit with clear message (`git commit`)
- Push to GitHub (`git push`)
- **This is the source of truth for production builds**

**Example workflow:**
```bash
# Check what changed
git status

# Stage specific files
git add mobile/package.json mobile/src/components/

# Or stage everything
git add .

# Commit with clear message
git commit -m "feat(auth): implement secure token storage with expo-secure-store"

# Push to GitHub
git push
```

**Important:**
- EAS builds pull from **GitHub**, not your local machine
- Always commit `package.json` and `package-lock.json` changes
- **Never commit** `.env` files (sensitive API keys)
- Use `.gitignore` to exclude secrets

---

#### 3. **EAS Secrets** (Cloud Environment Variables)

**What happens here:**
- Store sensitive API keys in Expo's secure cloud
- These are injected into your app **at build time**
- Never stored in code or GitHub

**One-time setup:**
```bash
cd mobile/scripts
./setup-eas-secrets.sh  # Mac/Linux
# or
setup-eas-secrets.bat   # Windows
```

**What gets stored in EAS Secrets:**
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Public API key (client-safe)
- `EXPO_PUBLIC_OPENAI_API_KEY` - OpenAI API key
- `EXPO_PUBLIC_ANTHROPIC_API_KEY` - Claude API key
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` - RevenueCat subscription key

**View your secrets:**
```bash
eas secret:list
```

**Update a secret:**
```bash
eas secret:create --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-new-key-here" --type string --force
```

---

#### 4. **EAS Build** (Cloud Build Servers)

**What happens here:**
- Expo's servers pull your code from **GitHub**
- Install all dependencies from `package.json`
- Inject **EAS Secrets** as environment variables
- Compile native iOS app (Xcode, CocoaPods, etc.)
- Output: `.ipa` file ready for TestFlight

**Build profiles** (defined in `mobile/eas.json`):

1. **Development** - For testing on your device
   ```bash
   eas build --profile development --platform ios
   ```
   - Includes dev tools, console logs
   - Faster build time
   - Not for App Store

2. **Preview** - Internal testing build
   ```bash
   eas build --profile preview --platform ios
   ```
   - Production-like environment
   - Can be distributed via ad-hoc or TestFlight
   - Good for QA testing

3. **Production** - App Store / TestFlight release
   ```bash
   eas build --profile production --platform ios
   ```
   - Optimized, minified code
   - Console logs stripped
   - Code signing for App Store
   - **This is what users download**

**The build process:**
```
1. EAS pulls latest code from GitHub main branch
2. Runs: npm install (gets expo-secure-store, all dependencies)
3. Runs: npx expo prebuild (generates native iOS code)
4. Injects EAS Secrets as process.env variables
5. Runs: xcodebuild (compiles iOS app)
6. Signs app with your Apple Developer certificates
7. Outputs: .ipa file (iOS app package)
8. (Optional) Auto-submits to TestFlight
```

**Monitor build progress:**
- In terminal after running `eas build`
- At https://expo.dev/accounts/[your-account]/projects/manifest-the-unseen/builds

---

#### 5. **TestFlight** (Beta Testing)

**What happens here:**
- Your `.ipa` file uploaded to App Store Connect
- Internal testers (you + team) can install via TestFlight app
- External testers (up to 10,000) can test before public release
- Collect feedback, crash reports, usage data

**How to submit to TestFlight:**

**Option A: Automatic** (during build)
```bash
eas build --profile production --platform ios --auto-submit
```

**Option B: Manual** (after build)
```bash
eas submit --platform ios
```

**Testing on TestFlight:**
1. Install TestFlight app from App Store on your iPhone
2. Open email invite from App Store Connect
3. Tap "View in TestFlight" → Install
4. Launch app and test features
5. Submit feedback via TestFlight app

**Benefits of TestFlight:**
- Test on real devices before public launch
- Catch bugs in production environment
- No need to manage device UDIDs manually
- Crash reporting and diagnostics
- Gradual rollout (10%, 50%, 100% of testers)

---

#### 6. **App Store Release** (Public Launch)

**What happens here:**
- Submit your TestFlight build for App Review
- Apple reviews app (2-48 hours typically)
- If approved, you can release to public
- Users download from App Store

**Submission process:**
```bash
# After TestFlight testing, use the same build for production
# In App Store Connect:
# 1. Select your TestFlight build
# 2. Add screenshots, description, keywords
# 3. Submit for review
# 4. Wait for approval
# 5. Release manually or auto-release after approval
```

---

## What We're Building

### Manifest the Unseen
**A transformative iOS app combining mindfulness, AI wisdom, and personal growth**

**Core Features:**
1. **Digital Workbook** - 202-page manifestation workbook with 10 phases
   - Phase 1: Self-Evaluation (Wheel of Life, SWOT analysis)
   - Phase 2: Values & Vision (vision boards, purpose)
   - Phase 3: Goal Setting (SMART goals, action plans)
   - Phases 4-10: Fear work, self-love, manifestation techniques, gratitude, etc.

2. **Voice Journaling** - Speak your thoughts, AI transcribes
   - On-device transcription (OpenAI Whisper)
   - Privacy-first (audio never leaves device)
   - Searchable journal entries

3. **AI Wisdom Chat** - Claude-powered monk companion
   - Trained on manifestation knowledge base
   - RAG (Retrieval Augmented Generation) architecture
   - Context-aware responses based on your progress

4. **Meditation Library** - Guided sessions with background audio
   - 12 meditations (6 sessions × 2 narrators)
   - Background playback support
   - Session tracking and statistics

5. **Subscription Tiers** - RevenueCat integration
   - 7-day free trial
   - 3 tiers: Novice, Awakening, Enlightenment
   - In-app purchases managed by RevenueCat

**Target Users:**
- People seeking personal transformation
- Manifestation practitioners
- Meditation enthusiasts
- Self-improvement community

**Monetization:**
- Freemium model (limited free access)
- Monthly/annual subscriptions ($7.99-$19.99/mo)
- Target: 25-35% trial-to-paid conversion

---

## Tech Stack Breakdown

### Frontend (Mobile App)

#### **React Native** - Cross-platform mobile framework
**Why we use it:**
- Write once in JavaScript/TypeScript, deploy to iOS and Android
- Hot reload for fast development (see changes instantly)
- Huge ecosystem of libraries and community support
- Native performance (renders to actual native iOS/Android components)

**How it works:**
```typescript
// Your JSX code (looks like React for web)
<View style={styles.container}>
  <Text>Hello iOS!</Text>
</View>

// Renders to actual native iOS components:
// View → UIView (iOS native)
// Text → UILabel (iOS native)
```

---

#### **TypeScript** - Type-safe JavaScript
**Why we use it:**
- Catch bugs at compile time (before running code)
- Better autocomplete and IntelliSense
- Self-documenting code with type definitions
- Easier refactoring

**Example:**
```typescript
// Without TypeScript (JavaScript)
function greet(name) {
  return `Hello ${name.toUppercase()}`; // Typo! Runtime error
}

// With TypeScript
function greet(name: string): string {
  return `Hello ${name.toUppercase()}`; // Error caught immediately!
  //                   ~~~~~~~~~~
  // Property 'toUppercase' does not exist. Did you mean 'toUpperCase'?
}
```

---

#### **Expo** - React Native development platform
**Why we use it:**
- Simplifies native module integration (camera, storage, etc.)
- EAS Build (cloud build servers - no need for Xcode locally for builds)
- Over-the-air updates (push small updates without App Store review)
- Managed workflow (less native code to maintain)

**Key Expo packages we use:**
- `expo-secure-store` - Hardware-backed encryption (Keychain on iOS)
- `expo-audio` - Audio recording/playback
- `expo-router` (or React Navigation) - Screen navigation
- `expo-constants` - Environment variables access

---

#### **NativeWind** - Tailwind CSS for React Native
**Why we use it:**
- Utility-first styling (like Tailwind for web)
- Consistent design system
- Faster UI development

**Example:**
```typescript
// Traditional React Native styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9333ea',
    padding: 16,
  }
});
<View style={styles.container}>

// NativeWind (Tailwind-style)
<View className="flex-1 bg-purple-600 p-4">
```

---

#### **Zustand** - State management
**Why we use it:**
- Lightweight (1KB vs Redux's 3KB+)
- Simple API (no boilerplate)
- Works seamlessly with React hooks
- Persistence built-in

**How we use it:**
```typescript
// Define a store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      signIn: async (email, password) => {
        const { user, session } = await supabase.auth.signIn({ email, password });
        set({ user, session });
      },
      signOut: () => set({ user: null, session: null }),
    }),
    {
      name: 'auth-storage',
      storage: createHybridStorage(), // Encrypted tokens + fast profile access
    }
  )
);

// Use in components
function HomeScreen() {
  const { user, signOut } = useAuthStore();

  return <Text>Welcome {user.email}</Text>;
}
```

---

#### **TanStack Query (React Query)** - Data fetching & caching
**Why we use it:**
- Automatic caching (no redundant API calls)
- Optimistic updates (instant UI, sync in background)
- Auto-refetch on focus, reconnect
- Loading/error states handled automatically

**How we use it:**
```typescript
// Fetch workbook progress
function WorkbookScreen() {
  const { data: progress, isLoading, error } = useQuery({
    queryKey: ['workbook', userId],
    queryFn: () => supabase.from('workbook_progress').select('*'),
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading workbook</Text>;

  return <WorkbookPhases progress={data} />;
}

// Mutation with optimistic update
const mutation = useMutation({
  mutationFn: (entry) => supabase.from('journal_entries').insert(entry),
  onMutate: async (newEntry) => {
    // Optimistically update UI before server responds
    queryClient.setQueryData(['journal'], (old) => [...old, newEntry]);
  },
});
```

---

### Backend (Supabase)

#### **Supabase** - All-in-one backend platform
**Why we use it:**
- **PostgreSQL database** - Robust, scalable SQL database
- **Authentication** - Email, OAuth (Apple Sign-In), magic links
- **Storage** - File uploads (vision board images, meditation audio)
- **Real-time** - Live data sync across devices
- **Edge Functions** - Serverless functions (Deno runtime)
- **pgvector** - AI embeddings for RAG (no separate vector DB needed)

**Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │ │
│  │   Database   │  │  (Apple ID)  │  │   (Images)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   pgvector   │  │  Edge Funcs  │  │   Realtime   │ │
│  │ (AI Embeds)  │  │   (AI RAG)   │  │    (Sync)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key tables:**
- `users` - User profiles (synced with Supabase Auth)
- `workbook_progress` - JSONB field for flexible worksheet data
- `journal_entries` - Voice journal transcriptions (encrypted)
- `meditations` - Audio metadata, tier gating
- `ai_conversations` - Chat history with AI monk
- `knowledge_embeddings` - Vector embeddings for RAG (vector(1536))

**Row Level Security (RLS):**
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Enforced at database level (can't be bypassed)
```

---

#### **OpenAI Whisper** - Voice transcription
**Why we use it:**
- Runs **on-device** (privacy-first, no cloud upload)
- Fast (1-2 seconds per journal entry)
- Accurate speech-to-text
- Zero cost per transcription (one-time model download)

**How it works:**
```typescript
import { AudioRecorder } from 'react-native-audio-recorder-player';
import { WhisperContext } from 'react-native-whisper';

// 1. Record audio
const audioPath = await AudioRecorder.startRecording();
await AudioRecorder.stopRecording();

// 2. Transcribe on-device
const whisper = await WhisperContext.initialize('ggml-base.bin');
const { text } = await whisper.transcribe(audioPath);

// 3. Save text to Supabase (audio deleted for privacy)
await supabase.from('journal_entries').insert({ content: text });
```

---

#### **Claude API (Anthropic)** - AI wisdom companion
**Why we use it:**
- Best-in-class conversational AI
- Large context window (200K tokens)
- Safer outputs (less hallucination)
- Steerable personality (monk companion persona)

**RAG (Retrieval Augmented Generation) flow:**
```
1. User asks: "How do I overcome fear?"
2. Generate embedding of question (OpenAI API)
3. Search pgvector for similar knowledge (PostgreSQL)
   → Finds: Shi Heng Yi teachings on fear, workbook Phase 4
4. Send to Claude API:
   - System prompt: "You are a wise monk..."
   - Context: Retrieved knowledge passages
   - User message: "How do I overcome fear?"
5. Claude generates response using context
6. Stream response back to user
7. Save conversation to Supabase
```

**Implementation:**
```typescript
// Supabase Edge Function
export async function chat(userMessage: string, userId: string) {
  // 1. Generate embedding
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userMessage,
  });

  // 2. Similarity search
  const { data: context } = await supabase.rpc('match_knowledge', {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.78,
    match_count: 5,
  });

  // 3. Call Claude
  const stream = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: userMessage }],
    system: `You are a wise monk. Use this context: ${context.map(c => c.content).join('\n')}`,
    stream: true,
  });

  return stream;
}
```

---

#### **RevenueCat** - Subscription management
**Why we use it:**
- Handles Apple In-App Purchases complexity
- Cross-platform (iOS, Android, web)
- Real-time entitlement checks
- Subscription analytics
- Handles price changes, refunds, cancellations

**How it works:**
```typescript
import Purchases from 'react-native-purchases';

// Initialize
await Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });

// Check subscription status
const { entitlements } = await Purchases.getCustomerInfo();
const isPremium = entitlements.active['enlightenment_path'] !== undefined;

// Purchase subscription
const { customerInfo } = await Purchases.purchasePackage(package);

// Feature gating
if (!isPremium && currentPhase > 5) {
  showUpgradePrompt();
}
```

**Subscription tiers:**
| Tier | Price | Features |
|------|-------|----------|
| Novice Path | $7.99/mo | Phases 1-5, 3 meditations, 50 journals/mo |
| Awakening Path | $12.99/mo | Phases 1-8, 6 meditations, 200 journals/mo |
| Enlightenment Path | $19.99/mo | All 10 phases, unlimited everything |

---

## Key Concepts Explained

### 1. **Native Modules vs JavaScript**

**JavaScript code** (your app logic):
- Runs in JavaScript thread
- UI updates, state management, business logic
- Fast enough for most operations

**Native modules** (iOS/Android code):
- Access device features (camera, Keychain, biometrics)
- Performance-critical operations
- Installed via `npm install`, require rebuild

**When you need native rebuild:**
```bash
# After installing packages like:
npm install expo-secure-store        # Native (needs rebuild)
npm install react-native-track-player # Native (needs rebuild)
npm install zustand                   # Pure JS (no rebuild needed)
npm install @tanstack/react-query     # Pure JS (no rebuild needed)

# Rebuild command:
npx expo prebuild --clean
```

---

### 2. **Environment Variables**

**Three layers of env vars:**

1. **Local development** (`.env` file)
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   EXPO_PUBLIC_OPENAI_API_KEY=sk-local-test-key
   ```
   - **NEVER commit to GitHub**
   - Used when running `npm run ios` locally

2. **EAS Secrets** (cloud, production builds)
   ```bash
   eas secret:create --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-prod-key"
   ```
   - Injected at **build time** by EAS servers
   - Used in TestFlight and App Store builds

3. **Runtime config** (app.json / eas.json)
   ```json
   {
     "extra": {
       "eas": { "projectId": "abc123" }
     }
   }
   ```
   - Non-sensitive configuration
   - Safe to commit

**Access in code:**
```typescript
import Constants from 'expo-constants';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const projectId = Constants.expoConfig?.extra?.eas?.projectId;
```

---

### 3. **Code Signing & Certificates**

**What is code signing?**
- Apple requires all apps to be digitally signed
- Proves the app comes from you (not malware)
- Required for installing on devices and App Store

**EAS handles this automatically:**
```bash
# First build - EAS creates certificates
eas build --profile production --platform ios

# EAS prompts:
# "Would you like to generate a new Apple Distribution Certificate?"
# → Answer: Yes

# Certificates stored in your Expo account
# Automatically applied to all future builds
```

**What gets created:**
- **Apple Distribution Certificate** - Signs app for App Store
- **Provisioning Profile** - Links app to your Apple Developer account
- **Push Notification Certificate** - For push notifications (if needed)

**You don't need Xcode for this!** EAS manages everything.

---

### 4. **Hot Reload vs Native Rebuild**

**Hot Reload** (instant updates):
```typescript
// Change this:
<Text>Hello World</Text>

// To this:
<Text>Hello iOS!</Text>

// Save → App updates in ~1 second (no rebuild)
```
- Works for JavaScript/TypeScript changes
- UI updates, logic changes, styling
- Enabled by default in development

**Native Rebuild** (slow, 5-10 minutes):
- Required when changing native code
- After installing native modules
- After updating `app.json` permissions
- After changing bundle identifier

**How to know which you need:**
- **Hot reload**: If you're editing `.ts`, `.tsx`, `.js` files
- **Native rebuild**: If you ran `npm install <native-package>` or changed `app.json`

---

### 5. **Optimistic Updates**

**The concept:**
Update the UI immediately, sync with server in background

**Why it matters:**
- App feels instant (no loading spinners)
- Better user experience
- Graceful handling of offline mode

**Example:**
```typescript
// Traditional approach (slow UX)
async function saveJournal(entry) {
  setLoading(true);
  await supabase.from('journal_entries').insert(entry);
  setLoading(false);
  refetchEntries(); // Wait for server response
}

// Optimistic update (instant UX)
const mutation = useMutation({
  mutationFn: (entry) => supabase.from('journal_entries').insert(entry),
  onMutate: async (newEntry) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['journal'] });

    // Snapshot current state
    const previous = queryClient.getQueryData(['journal']);

    // Optimistically update UI
    queryClient.setQueryData(['journal'], (old) => [...old, newEntry]);

    return { previous }; // Context for rollback
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['journal'], context.previous);
  },
  onSettled: () => {
    // Refetch to ensure sync
    queryClient.invalidateQueries({ queryKey: ['journal'] });
  },
});

// User sees new entry immediately, even if server takes 2 seconds
```

---

### 6. **Encryption at Rest**

**What is it?**
Data stored on device in encrypted format, unreadable without key

**Why we use it:**
- Protect sensitive journal entries
- Secure auth tokens
- Privacy compliance (GDPR, CCPA)

**How we implement it:**
```typescript
// Without encryption (BAD)
await AsyncStorage.setItem('journal_entry', userJournal);
// Stored as plain text on device - anyone with device access can read

// With encryption (GOOD)
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('auth_token', token);
// Stored in iOS Keychain (hardware-encrypted, requires biometrics/passcode)
```

**What we encrypt:**
- Auth tokens (access_token, refresh_token)
- Journal entries (sensitive personal data)
- User session data

**What we don't encrypt:**
- User profile (name, email) - Fast access, non-sensitive
- App preferences (theme, settings) - Better performance

---

## Common Development Commands

### Project Setup
```bash
# Clone repository
git clone https://github.com/your-username/manifest-the-unseen-ios.git
cd manifest-the-unseen-ios/mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator (requires Xcode)
npm run ios

# Run on physical iPhone (USB connected)
npm run ios:device

# Run on Android (future)
npm run android
```

### Development Workflow
```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix  # Auto-fix issues

# Testing
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Clear cache (if app behaving strangely)
npx expo start --clear
```

### Native Code Management
```bash
# Rebuild native code after installing native modules
npx expo prebuild --clean

# iOS specific rebuild
npx expo run:ios

# Check for outdated dependencies
npm outdated

# Update Expo SDK
npx expo upgrade
```

### EAS Build & Deploy
```bash
# Login to Expo
eas login

# Check build configuration
eas build:configure

# Development build (for testing on device)
eas build --profile development --platform ios

# Preview build (internal testing)
eas build --profile preview --platform ios

# Production build (TestFlight / App Store)
eas build --profile production --platform ios

# Auto-submit to TestFlight after build
eas build --profile production --platform ios --auto-submit

# Manual submit (if build already complete)
eas submit --platform ios

# Check build status
eas build:list
```

### Supabase Management
```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# Reset local database
npx supabase db reset

# Push migrations to production
npx supabase db push

# Pull remote schema to local
npx supabase db pull

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/database.types.ts

# Run Edge Functions locally
npx supabase functions serve

# Deploy Edge Function
npx supabase functions deploy ai-chat
```

### Database Operations
```bash
# Connect to local database
npx supabase db psql

# Run SQL migration
npx supabase migration new add_journal_encryption

# Apply pending migrations
npx supabase db push
```

---

## Environment Management

### Local Development (.env)

**File**: `mobile/.env` (Git-ignored)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Services
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...

# Dev flags
EXPO_PUBLIC_DEV_SKIP_AUTH=false
```

**Never commit this file!** It's in `.gitignore`.

---

### Production (EAS Secrets)

**Setup once:**
```bash
cd mobile/scripts
./setup-eas-secrets.sh  # Interactive prompt for all keys
```

**Manual setup:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://xxx.supabase.co" --type string

eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY \
  --value "sk-..." --type string
```

**View secrets:**
```bash
eas secret:list
```

**Delete secret:**
```bash
eas secret:delete --name EXPO_PUBLIC_OLD_KEY
```

---

### Build-Time vs Runtime

**Build-time** (injected during EAS build):
- `EXPO_PUBLIC_*` variables from EAS Secrets
- Baked into the app binary
- Can't be changed without rebuilding

**Runtime** (fetched after app launches):
- Feature flags from Supabase
- A/B test configurations
- Dynamic content from CMS
- Can change without app update

---

## Security Best Practices

### 1. **Never Commit Secrets**
```bash
# Bad (hardcoded key)
const apiKey = "sk-proj-abcd1234";

# Good (environment variable)
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
```

### 2. **Use Secure Storage for Tokens**
```typescript
// Bad (plain AsyncStorage)
await AsyncStorage.setItem('token', authToken);

// Good (hardware-encrypted)
await SecureStore.setItemAsync('auth_token', authToken);
```

### 3. **Sanitize Logs in Production**
```typescript
// Bad (logs sensitive data)
console.log('User data:', { email, password, token });

// Good (use secure logger)
import { logger } from '@/utils/logger';
logger.info('User signed in', { email }); // Auto-redacts password, token
```

### 4. **Validate User Input**
```typescript
// Bad (no validation)
async function signUp(email: string, password: string) {
  await supabase.auth.signUp({ email, password });
}

// Good (Zod validation)
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

async function signUp(email: string, password: string) {
  const validated = signUpSchema.parse({ email, password });
  await supabase.auth.signUp(validated);
}
```

### 5. **Encrypt Sensitive Data**
```typescript
// Journal entries with encryption
import { encryptWorksheetData } from '@/services/workbook';

const encrypted = encryptWorksheetData({
  journal: userJournal,
  reflections: userThoughts,
});

await supabase.from('workbook_progress').upsert(encrypted);
```

### 6. **Use Row Level Security (RLS)**
```sql
-- In Supabase, enable RLS on all tables
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users view own entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Testing Strategy

### Unit Tests (Jest)
```bash
# Test utilities, hooks, business logic
npm test src/utils/logger.test.ts
npm test src/hooks/useWorkbook.test.ts
```

**Example:**
```typescript
// logger.test.ts
import { logger } from './logger';

describe('Secure Logger', () => {
  it('redacts passwords from logs', () => {
    const spy = jest.spyOn(console, 'log');
    logger.info('User data', { email: 'test@example.com', password: 'secret' });

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('[REDACTED]')
    );
    expect(spy).not.toHaveBeenCalledWith(
      expect.stringContaining('secret')
    );
  });
});
```

### Component Tests (React Native Testing Library)
```bash
npm test src/components/Button.test.tsx
```

**Example:**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

test('calls onPress when tapped', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress}>Click Me</Button>);

  fireEvent.press(getByText('Click Me'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
```

### Integration Tests (Supabase)
```bash
# Test with local Supabase instance
npx supabase start
npm test src/services/auth.integration.test.ts
```

### E2E Tests (Detox - Future)
```bash
# Full user flow testing
detox test --configuration ios.sim.debug
```

**Example:**
```typescript
describe('Sign In Flow', () => {
  it('should sign in successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('sign-in-button')).tap();

    await expect(element(by.text('Welcome back!'))).toBeVisible();
  });
});
```

---

## Troubleshooting Guide

### "Unable to resolve module..."
**Problem**: Missing dependency or Metro bundler cache issue

**Solution:**
```bash
# Clear Metro cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild native code
npx expo prebuild --clean
```

---

### "Build failed on EAS"
**Problem**: Build error on Expo's servers

**Solution:**
1. Check build logs: `eas build:list` → Click failed build
2. Common causes:
   - Missing EAS Secrets → `eas secret:list`
   - TypeScript errors → `npm run type-check`
   - Missing dependencies in `package.json`
3. Fix locally, commit, rebuild:
   ```bash
   npm run type-check
   git add .
   git commit -m "fix: resolve build errors"
   git push
   eas build --profile production --platform ios
   ```

---

### "API key not working in production"
**Problem**: EAS Secrets not injected correctly

**Solution:**
```bash
# Verify secret exists
eas secret:list

# Recreate if missing
eas secret:create --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-..." --type string --force

# Rebuild app (secrets injected at build time)
eas build --profile production --platform ios
```

---

### "App crashes on launch (TestFlight)"
**Problem**: Production-specific error

**Solution:**
1. Check Xcode crash reports (App Store Connect → TestFlight → Crashes)
2. Add error tracking:
   ```bash
   npm install @sentry/react-native
   npx expo prebuild
   ```
3. Reproduce locally in release mode:
   ```bash
   npx expo run:ios --configuration Release
   ```

---

### "Supabase queries fail"
**Problem**: RLS blocking queries or network issue

**Solution:**
```bash
# Test query in Supabase Dashboard SQL Editor
SELECT * FROM journal_entries WHERE user_id = '...';

# Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'journal_entries';

# Bypass RLS temporarily (testing only!)
SET LOCAL ROLE authenticated;
SELECT * FROM journal_entries;
```

---

### "Encryption not working"
**Problem**: `expo-secure-store` not installed or native code not rebuilt

**Solution:**
```bash
# Install
npm install expo-secure-store

# Rebuild (REQUIRED for native modules)
npx expo prebuild --clean
npx expo run:ios

# Verify native module linked
npx expo config --type introspect
```

---

## Key Takeaways

### For This Project:
1. **Local dev** = Fast iteration with hot reload
2. **GitHub** = Source of truth for production
3. **EAS Secrets** = Secure API key management
4. **EAS Build** = Cloud builds from GitHub code
5. **TestFlight** = Beta testing before App Store

### For Future Projects:
- This workflow applies to **any React Native + Expo app**
- Supabase is optional (could use Firebase, AWS Amplify, etc.)
- EAS Build is optional (could use Xcode locally, but EAS is easier)
- Core concepts transfer: state management, navigation, API integration

### Best Practices:
- ✅ Always test locally before building for production
- ✅ Use TypeScript for type safety
- ✅ Commit early, commit often (clear messages)
- ✅ Never commit `.env` files
- ✅ Encrypt sensitive data at rest
- ✅ Use RLS for database security
- ✅ Test on real devices before TestFlight

---

## Resources

### Official Docs
- **Expo**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/docs/getting-started
- **Supabase**: https://supabase.com/docs
- **RevenueCat**: https://www.revenuecat.com/docs

### Community
- **Expo Discord**: https://chat.expo.dev/
- **React Native Community**: https://reactnative.dev/community/overview
- **Supabase Discord**: https://discord.supabase.com/

### Learning
- **React Native Express**: https://www.reactnative.express/
- **Expo Snacks** (practice): https://snack.expo.dev/
- **Supabase University**: https://supabase.com/docs/guides/getting-started

---

**Document Version**: 1.0
**Last Updated**: December 12, 2025
**Next App**: Let's make it happen! 🚀
