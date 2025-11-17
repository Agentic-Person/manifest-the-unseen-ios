# Manifest the Unseen - Technical Design Document (TDD)
## React Native + Supabase

**Version:** 1.0  
**Date:** November 16, 2025  
**Platform:** iOS (React Native)  
**For:** Claude Code Development

---

## 1. Tech Stack

### Frontend - React Native
- **Framework:** React Native (latest stable)
- **Language:** TypeScript
- **Navigation:** React Navigation 6+
- **State Management:** Zustand + TanStack Query (React Query)
- **Design System:** NativeWind (Tailwind CSS for React Native)
- **UI Components:** Custom components styled with NativeWind
- **Forms:** React Hook Form + Zod validation
- **Audio:** react-native-track-player
- **Voice Recording:** react-native-audio-recorder-player
- **Transcription:** OpenAI Whisper (on-device via react-native-whisper)

### Web App (Future/Companion)
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand + TanStack Query (shared with mobile)
- **Deployment:** Vercel

### Shared Business Logic
- **Package:** `@manifest/shared` (TypeScript)
- **Domain Models:** User, Session, Project, Journal, Workbook, Meditation
- **Validation:** Zod schemas
- **Pure Functions:** Pricing, scoring, data transforms
- **API Client:** Shared TypeScript client with type-safe endpoints
- **Hooks:** Shared React hooks for data fetching/mutations

### Backend - Supabase (Primary)

- **Database:** PostgreSQL with pgvector
- **Authentication:** Supabase Auth (Apple Sign-In, email/password, social logins)
- **Real-time:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (vision board images, audio files)
- **Functions:** Supabase Edge Functions (Deno)
- **AI:** Claude API + OpenAI GPT-4 (via Edge Functions)
- **Cost:** Free tier: 500MB DB, 1GB storage, 2GB bandwidth
- **Pros:** All-in-one solution, generous free tier, pgvector built-in, mature ecosystem, great documentation
- **Cons:** Vendor lock-in (but with good export options), PostgreSQL learning curve

**Why Supabase:**
- ✅ All backend services in one platform (auth, database, storage, functions)
- ✅ Built-in pgvector for efficient local vector search (no API costs)
- ✅ Excellent React Native support with official SDK
- ✅ Real-time subscriptions out of the box
- ✅ Row Level Security (RLS) for data protection
- ✅ Mature, battle-tested with large community
- ✅ Easy migration path if needed (standard PostgreSQL)
- ✅ Free tier covers MVP and early growth

### Alternative: Neon (If Needed)

**Neon - Serverless PostgreSQL (Optional Alternative)**
- **Database:** Serverless PostgreSQL with pgvector
- **Authentication:** Supabase Auth (can be used separately)
- **Real-time:** Supabase Realtime or custom solution
- **Storage:** Supabase Storage or Vercel Blob
- **Functions:** Vercel Serverless Functions
- **Cost:** Free tier: 0.5GB storage, generous compute
- **Pros:** Serverless (scales to zero), database branching, Vercel integration
- **Cons:** Need to piece together services, less integrated

**Note:** For MVP, stick with Supabase all-in-one. Consider Neon only if you need serverless Postgres with database branching for complex dev workflows.

### Services
- **Authentication:** Clerk (user management, social logins, MFA)
- **Subscriptions:** RevenueCat (React Native SDK)
- **Analytics:** TelemetryDeck or Mixpanel
- **Error Tracking:** Sentry
- **Push Notifications:** OneSignal or Expo Notifications

### Development & Deployment
- **Version Control:** GitHub
- **Deployment:** Vercel (web app, API routes, serverless functions)
- **CI/CD:** GitHub Actions + Vercel
- **Design:** Canva (marketing assets, social media, app screenshots)
- **Code Editor:** VS Code with extensions (Prettier, ESLint, Tailwind IntelliSense)

---

## 2. Project Structure

```
manifest-the-unseen/
├── packages/
│   └── shared/                 # Shared TypeScript package
│       ├── src/
│       │   ├── models/        # Domain models + types
│       │   ├── validation/    # Zod schemas
│       │   ├── utils/         # Pure functions
│       │   ├── api/           # API client + types
│       │   └── hooks/         # React hooks (adaptable to RN)
│       ├── package.json
│       └── tsconfig.json
│
├── mobile/                     # React Native app
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── components/        # Reusable UI components
│   │   ├── navigation/        # Navigation setup
│   │   ├── store/             # Zustand stores (optional)
│   │   ├── hooks/             # RN-specific hooks
│   │   ├── services/          # RN-native services
│   │   ├── lib/               # Supabase client setup
│   │   ├── theme/             # NativeWind config + design tokens
│   │   ├── utils/             # RN utilities
│   │   └── App.tsx
│   ├── ios/                   # iOS native code
│   ├── android/               # Android (future)
│   ├── tailwind.config.js     # NativeWind config
│   ├── package.json
│   └── tsconfig.json
│
├── web/                        # Next.js web app (optional companion)
│   ├── app/                   # Next.js 14 App Router
│   ├── components/            # shadcn/ui + custom components
│   ├── lib/                   # Supabase client, utilities
│   ├── styles/                # Global Tailwind styles
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/                   # Supabase backend
│   ├── migrations/            # Database migrations
│   │   └── 20240101000000_initial_schema.sql
│   ├── functions/             # Edge Functions
│   │   ├── ai-chat/           # AI chat with RAG
│   │   └── process-audio/     # Audio processing (if needed)
│   ├── seed.sql              # Initial data (meditations, embeddings)
│   └── config.toml           # Supabase config
│
├── .github/
│   └── workflows/             # CI/CD pipelines
│       ├── mobile-ios.yml
│       └── web-deploy.yml
│
└── package.json               # Root package.json (workspaces)
```

---

## 3. Data Architecture

### Supabase Database Schema (PostgreSQL)

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users (synced with Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('novice', 'awakening', 'enlightenment')),
  subscription_status TEXT DEFAULT 'none',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workbook Progress
CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phase_number INT NOT NULL,
  worksheet_id TEXT NOT NULL,
  data JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, phase_number, worksheet_id)
);

CREATE INDEX idx_workbook_user ON workbook_progress(user_id);
CREATE INDEX idx_workbook_phase ON workbook_progress(user_id, phase_number);

-- Journal Entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  encrypted_content TEXT,
  tags TEXT[],
  mood TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_journal_user ON journal_entries(user_id);
CREATE INDEX idx_journal_date ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_tags ON journal_entries USING GIN(tags);

-- Full-text search on journal content
ALTER TABLE journal_entries ADD COLUMN content_search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX idx_journal_search ON journal_entries USING GIN(content_search);

-- Meditations
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INT NOT NULL,
  audio_url TEXT NOT NULL,
  narrator_gender TEXT CHECK (narrator_gender IN ('male', 'female')),
  tier_required TEXT CHECK (tier_required IN ('novice', 'awakening', 'enlightenment')),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meditation_tier ON meditations(tier_required);

-- Meditation Sessions
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meditation_id UUID REFERENCES meditations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON meditation_sessions(user_id);
CREATE INDEX idx_sessions_meditation ON meditation_sessions(meditation_id);

-- AI Conversations
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_conversations_date ON ai_conversations(user_id, updated_at DESC);

-- Vision Boards
CREATE TABLE vision_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vision_boards_user ON vision_boards(user_id);

-- Knowledge Embeddings (for AI RAG)
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_embeddings_vector ON knowledge_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own workbook" ON workbook_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workbook" ON workbook_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workbook" ON workbook_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own journals" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journals" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for meditation_sessions, ai_conversations, vision_boards
-- Meditations table is public (read-only)
CREATE POLICY "Anyone can view meditations" ON meditations
  FOR SELECT USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workbook_updated_at BEFORE UPDATE ON workbook_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vision_boards_updated_at BEFORE UPDATE ON vision_boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('novice', 'awakening', 'enlightenment')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workbook Progress
CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phase_number INT NOT NULL,
  worksheet_id TEXT NOT NULL,
  data JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, phase_number, worksheet_id)
);

-- Journal Entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  encrypted_content TEXT,
  tags TEXT[],
  mood TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Meditations
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INT NOT NULL,
  audio_url TEXT NOT NULL,
  narrator_gender TEXT CHECK (narrator_gender IN ('male', 'female')),
  tier_required TEXT CHECK (tier_required IN ('novice', 'awakening', 'enlightenment')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Meditation Sessions
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meditation_id UUID REFERENCES meditations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Conversations
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vision Boards
CREATE TABLE vision_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Embeddings (for AI RAG)
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 4. Shared Package Architecture

### Domain Models (`@manifest/shared/models`)

```typescript
// User model
export interface User {
  id: string;
  email: string;
  fullName?: string;
  subscriptionTier: 'novice' | 'awakening' | 'enlightenment';
  createdAt: Date;
  updatedAt: Date;
}

// Journal Entry model
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  tags?: string[];
  mood?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Workbook Progress model
export interface WorkbookProgress {
  id: string;
  userId: string;
  phaseNumber: number;
  worksheetId: string;
  data: Record<string, any>;
  completed: boolean;
  completedAt?: Date;
  updatedAt: Date;
}
```

### Validation (`@manifest/shared/validation`)

```typescript
import { z } from 'zod';

export const journalEntrySchema = z.object({
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()).optional(),
  mood: z.string().optional(),
});

export const workbookDataSchema = z.object({
  phaseNumber: z.number().min(1).max(10),
  worksheetId: z.string(),
  data: z.record(z.any()),
  completed: z.boolean().optional(),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type WorkbookDataInput = z.infer<typeof workbookDataSchema>;
```

### API Client (`@manifest/shared/api`)

```typescript
// Using Supabase Client
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types'; // Generated types

export class ManifestAPI {
  private supabase: SupabaseClient<Database>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  // Journal methods
  async createJournalEntry(entry: JournalEntryInput) {
    const { data, error } = await this.supabase
      .from('journal_entries')
      .insert({
        content: entry.content,
        tags: entry.tags,
        mood: entry.mood,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getJournalEntries(limit = 50) {
    const { data, error } = await this.supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async searchJournalEntries(searchQuery: string) {
    const { data, error } = await this.supabase
      .from('journal_entries')
      .select('*')
      .textSearch('content_search', searchQuery)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Workbook methods
  async saveWorkbookProgress(progress: WorkbookDataInput) {
    const { data, error } = await this.supabase
      .from('workbook_progress')
      .upsert({
        phase_number: progress.phaseNumber,
        worksheet_id: progress.worksheetId,
        data: progress.data,
        completed: progress.completed || false,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getWorkbookProgress(phaseNumber: number) {
    const { data, error } = await this.supabase
      .from('workbook_progress')
      .select('*')
      .eq('phase_number', phaseNumber)
      .order('worksheet_id');
    
    if (error) throw error;
    return data;
  }

  // Meditation methods
  async getMeditations(tierRequired?: string) {
    let query = this.supabase
      .from('meditations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (tierRequired) {
      query = query.eq('tier_required', tierRequired);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  async startMeditationSession(meditationId: string) {
    const { data, error } = await this.supabase
      .from('meditation_sessions')
      .insert({
        meditation_id: meditationId,
        completed: false,
        duration_seconds: 0,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToJournalEntries(callback: (payload: any) => void) {
    return this.supabase
      .channel('journal_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journal_entries' },
        callback
      )
      .subscribe();
  }
}
```

### Shared Hooks (`@manifest/shared/hooks`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Journal hooks
export function useJournalEntries(limit = 50) {
  return useQuery({
    queryKey: ['journal-entries', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: { content: string; tags?: string[]; mood?: string }) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
    },
  });
}

export function useSearchJournalEntries(searchQuery: string) {
  return useQuery({
    queryKey: ['journal-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .textSearch('content_search', searchQuery);
      
      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery,
  });
}

// Workbook hooks
export function useWorkbookProgress(phaseNumber: number) {
  return useQuery({
    queryKey: ['workbook-progress', phaseNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workbook_progress')
        .select('*')
        .eq('phase_number', phaseNumber);
      
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveWorkbookProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progress: {
      phaseNumber: number;
      worksheetId: string;
      data: any;
      completed?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('workbook_progress')
        .upsert({
          phase_number: progress.phaseNumber,
          worksheet_id: progress.worksheetId,
          data: progress.data,
          completed: progress.completed || false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workbook-progress', variables.phaseNumber],
      });
    },
  });
}

// Meditation hooks
export function useMeditations(tierRequired?: string) {
  return useQuery({
    queryKey: ['meditations', tierRequired],
    queryFn: async () => {
      let query = supabase.from('meditations').select('*');
      
      if (tierRequired) {
        query = query.eq('tier_required', tierRequired);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

export function useStartMeditationSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (meditationId: string) => {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert({
          meditation_id: meditationId,
          completed: false,
          duration_seconds: 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditation-sessions'] });
    },
  });
}
```

**Note:** These hooks work in both React Native and Next.js web apps with minimal adjustments!

---

## 5. React Native Specific Implementation

### What's Different from Web

**UI Components:**
- Use `<View>`, `<Text>`, `<ScrollView>`, `<FlatList>` instead of HTML
- Use `StyleSheet.create()` or styled-components for React Native
- Use React Native Paper or NativeBase for pre-built components

**Storage:**
- Use `@react-native-async-storage/async-storage` instead of localStorage
- Use `react-native-keychain` for sensitive data (tokens)
- Use `react-native-mmkv` for high-performance storage

**Navigation:**
- Use React Navigation instead of React Router
- Stack, Tab, and Drawer navigators

**Native Features:**
- Audio: `react-native-track-player`
- Voice recording: `react-native-audio-recorder-player`
- Whisper: `@whisper.rn/core` or custom native module
- Biometrics: `react-native-biometrics`
- Push notifications: `@react-native-firebase/messaging` or Expo

**Platform-Specific Code:**
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
```

---

## 6. Key Features Implementation

### Voice Journaling Flow

1. User taps record button
2. `react-native-audio-recorder-player` records audio
3. On stop, audio file is saved locally
4. Audio sent to Whisper (on-device) for transcription
5. Transcribed text saved to Supabase via shared API client
6. Audio file deleted (privacy)
7. Entry appears in journal list

### AI Chat with RAG (Supabase Implementation)

**Supabase Edge Function:**
```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { message, conversationId } = await req.json();
    
    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');
    
    // 1. Generate embedding for user message
    const embeddingResponse = await fetch(
      'https://api.openai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: message,
        }),
      }
    );
    const { data: [{ embedding }] } = await embeddingResponse.json();
    
    // 2. Search knowledge base with pgvector
    const { data: matches, error: searchError } = await supabase.rpc(
      'match_knowledge',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
      }
    );
    
    if (searchError) throw searchError;
    
    // 3. Build context from matches
    const context = matches?.map((m: any) => m.content).join('\n\n') || '';
    
    // 4. Call Claude API
    const claudeResponse = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `You are a wise monk companion helping users on their manifestation journey. Use this context to inform your responses:\n\n${context}`,
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      }
    );
    
    const claudeData = await claudeResponse.json();
    const assistantMessage = claudeData.content[0].text;
    
    // 5. Save conversation
    let finalConversationId = conversationId;
    
    if (!conversationId) {
      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          messages: [],
        })
        .select()
        .single();
      
      if (convError) throw convError;
      finalConversationId = newConv.id;
    }
    
    // Get existing conversation
    const { data: conversation, error: getError } = await supabase
      .from('ai_conversations')
      .select('messages')
      .eq('id', finalConversationId)
      .single();
    
    if (getError) throw getError;
    
    // Append new messages
    const updatedMessages = [
      ...(conversation.messages || []),
      { role: 'user', content: message, timestamp: Date.now() },
      { role: 'assistant', content: assistantMessage, timestamp: Date.now() },
    ];
    
    // Update conversation
    await supabase
      .from('ai_conversations')
      .update({ messages: updatedMessages })
      .eq('id', finalConversationId);
    
    return new Response(
      JSON.stringify({
        conversationId: finalConversationId,
        message: assistantMessage,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
```

**React Native Usage:**
```typescript
// mobile/src/screens/AIChat.tsx
import { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export function AIChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: message.trim(),
          conversationId,
        },
      });
      
      if (error) throw error;
      
      setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: message.trim() },
        { role: 'assistant', content: data.message },
      ]);
      setMessage('');
    } catch (error) {
      console.error('AI chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View className={`p-4 ${item.role === 'user' ? 'bg-gray-100' : ''}`}>
            <Text className="font-semibold mb-1">
              {item.role === 'user' ? 'You' : 'Monk'}
            </Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      
      <View className="flex-row p-4 border-t border-gray-200">
        <TextInput
          className="flex-1 bg-gray-100 rounded-lg px-4 py-2"
          value={message}
          onChangeText={setMessage}
          placeholder="Ask your monk companion..."
          editable={!loading}
        />
        <Button onPress={handleSend} disabled={loading} className="ml-2">
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </View>
    </View>
  );
}
```

### Meditation Player

**Setup:**
```typescript
import TrackPlayer, { State } from 'react-native-track-player';

// Initialize player
await TrackPlayer.setupPlayer();

// Add track
await TrackPlayer.add({
  id: meditation.id,
  url: meditation.audioUrl,
  title: meditation.title,
  artist: 'Manifest the Unseen',
  duration: meditation.durationSeconds,
});

// Play
await TrackPlayer.play();

// Track progress
TrackPlayer.addEventListener('playback-progress-updated', async (event) => {
  // Save session progress
});
```

### Subscription Management (RevenueCat)

```typescript
import Purchases from 'react-native-purchases';

// Initialize
await Purchases.configure({
  apiKey: 'YOUR_REVENUECAT_KEY',
});

// Fetch offerings
const offerings = await Purchases.getOfferings();
const current = offerings.current;

// Purchase
const { customerInfo } = await Purchases.purchasePackage(package);

// Check entitlements
const entitlement = customerInfo.entitlements.active['enlightenment'];
if (entitlement) {
  // User has access
}
```

---

## 7. State Management

### Zustand Stores

```typescript
// auth.store.ts
import { create } from 'zustand';
import { User } from '@manifest/shared/models';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### TanStack Query Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

---

## 8. Security

### Authentication
- Apple Sign-In (mandatory for App Store)
- Email/password as backup
- Biometric lock (Face ID/Touch ID) for app access

### Data Protection
- Encrypt journal entries before sending to Supabase
- Store encryption keys in Keychain (`react-native-keychain`)
- Enable RLS (Row Level Security) on all Supabase tables
- Sensitive data never logged

### API Security
- All API calls authenticated with Supabase JWT
- API keys stored in environment variables (never hardcoded)
- Rate limiting on Edge Functions

---

## 9. Offline Support

**Offline-First Strategy:**
- Store all workbook phases locally (pre-loaded)
- Queue API mutations when offline
- Sync when connection restored
- Use TanStack Query for automatic retry

**Implementation:**
```typescript
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

// Monitor network status
NetInfo.addEventListener(state => {
  onlineManager.setOnline(state.isConnected ?? false);
});

// Offline queue
const offlineQueue = [];

async function queueMutation(mutation) {
  if (!onlineManager.isOnline()) {
    offlineQueue.push(mutation);
  } else {
    await mutation();
  }
}
```

---

## 10. Performance Optimization

### React Native Best Practices
- Use `FlatList` for long lists (virtualization)
- Memoize expensive computations with `useMemo`
- Prevent unnecessary re-renders with `React.memo`
- Use `useCallback` for event handlers
- Lazy load screens with `React.lazy`
- Optimize images with `react-native-fast-image`

### Bundle Size
- Use Hermes JavaScript engine (enabled by default)
- Remove unused dependencies
- Code splitting for large features

---

## 11. Development Workflow for Claude Code

### Phase-by-Phase Implementation

**Phase 1: Setup & Foundation (Week 1-2)**
1. Initialize React Native project with TypeScript
2. Set up monorepo with shared package
3. Configure Supabase project + database schema
4. Set up navigation structure
5. Implement authentication (Apple + email)
6. Create basic UI components

**Phase 2: Core Features (Week 3-6)**
7. Implement workbook phases 1-3 (forms + validation)
8. Build journal entry UI + voice recording
9. Integrate Whisper for transcription
10. Create meditation player
11. Build AI chat interface
12. Implement vision board

**Phase 3: Polish & Launch (Week 7-8)**
13. Add subscription paywall (RevenueCat)
14. Implement analytics tracking
15. Add error handling + Sentry
16. Performance optimization
17. Testing (unit + integration)
18. App Store submission prep

### Prompting Strategy for Claude Code

**Effective Prompts:**
- "Create a Zustand store for authentication with login/logout/session persistence"
- "Build a journal entry form using React Hook Form with Zod validation"
- "Implement a meditation player using react-native-track-player with play/pause/progress"
- "Create a reusable API client for Supabase with TypeScript types"

**Iterative Development:**
- Start with basic implementation
- Add error handling
- Add loading states
- Add offline support
- Optimize performance

---

## 12. Testing Strategy

### Unit Tests (Jest)
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useJournalEntries } from '@manifest/shared/hooks';

test('fetches journal entries', async () => {
  const { result, waitFor } = renderHook(() => useJournalEntries('user-123'));
  
  await waitFor(() => result.current.isSuccess);
  
  expect(result.current.data).toHaveLength(5);
});
```

### Component Tests (React Native Testing Library)
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { JournalEntryForm } from './JournalEntryForm';

test('submits journal entry', () => {
  const onSubmit = jest.fn();
  const { getByPlaceholder, getByText } = render(
    <JournalEntryForm onSubmit={onSubmit} />
  );
  
  fireEvent.changeText(getByPlaceholder('Write your thoughts...'), 'Test entry');
  fireEvent.press(getByText('Save'));
  
  expect(onSubmit).toHaveBeenCalledWith({ content: 'Test entry' });
});
```

---

## 13. Deployment & CI/CD

### Vercel Deployment (Web App)

**Project Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd web
vercel --prod
```

**Environment Variables (Vercel):**
- `CONVEX_DEPLOYMENT` - Convex production URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

**Next.js Config:**
```typescript
// web/next.config.js
module.exports = {
  images: {
    domains: ['convex.cloud'],
  },
  env: {
    CONVEX_URL: process.env.CONVEX_DEPLOYMENT,
  },
};
```

### Convex Deployment

```bash
# Deploy to production
npx convex deploy

# Set environment variables
npx convex env set ANTHROPIC_API_KEY your-key
npx convex env set OPENAI_API_KEY your-key
npx convex env set CLERK_ISSUER_URL your-url
```

### GitHub Actions CI/CD

**iOS Build Pipeline:**
```yaml
# .github/workflows/ios-build.yml
name: iOS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: ./mobile
        run: npm install
        
      - name: Install Pods
        working-directory: ./mobile/ios
        run: pod install
        
      - name: Run tests
        working-directory: ./mobile
        run: npm test
        
      - name: Build iOS
        working-directory: ./mobile
        run: |
          xcodebuild -workspace ios/ManifestTheUnseen.xcworkspace \
                     -scheme ManifestTheUnseen \
                     -configuration Release \
                     -sdk iphoneos \
                     build
```

**Web Deployment Pipeline:**
```yaml
# .github/workflows/web-deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Vercel CLI
        run: npm install -g vercel
        
      - name: Deploy to Vercel
        working-directory: ./web
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### iOS Build Process
1. Configure Xcode project (bundle ID, signing)
2. Set up environment variables (API keys)
3. Build release version: `npx react-native run-ios --configuration Release`
4. Archive in Xcode
5. Upload to App Store Connect
6. Submit for review

### Environment Variables
```bash
# .env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
REVENUECAT_KEY=xxx
```

### CI/CD (GitHub Actions)
```yaml
name: Build iOS
on: push
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Build iOS
        run: npx react-native run-ios --configuration Release
```

---

## 14. Monitoring & Analytics

### TelemetryDeck Events
- App opened
- User signed up
- Subscription purchased
- Journal entry created
- Meditation completed
- AI chat message sent
- Workbook phase completed

### Sentry Error Tracking
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
});

// Capture errors
try {
  // risky code
} catch (error) {
  Sentry.captureException(error);
}
```

---

## 15. Success Metrics

**Technical Metrics:**
- App crashes < 0.5%
- Average load time < 2s
- API response time < 500ms
- Offline sync success > 99%

**Business Metrics:**
- 7-day trial conversion > 25%
- DAU/MAU ratio > 30%
- Meditation completion rate > 60%
- Journal entries per user per week > 3

---

## Summary

This TDD provides a **focused, actionable blueprint** for building Manifest the Unseen with React Native, Supabase, and Claude Code. 

### ✅ Final Tech Stack

**Frontend:**
- React Native with TypeScript
- NativeWind (Tailwind CSS for React Native)
- React Navigation
- TanStack Query (React Query)
- Supabase Auth (authentication)

**Backend:**
- Supabase (PostgreSQL, auth, storage, real-time, functions)
- OpenAI API (embeddings for RAG, Whisper transcription)
- Claude API (AI wisdom monk)
- pgvector (local vector search, no API costs)

**Shared:**
- Monorepo with `@manifest/shared` package
- Zod validation
- Type-safe API client (Supabase)
- Shared hooks and utilities (TanStack Query)

**Deployment & Tools:**
- GitHub (version control)
- Vercel (web app hosting)
- Supabase (automatic backend deployment)
- GitHub Actions (CI/CD)
- RevenueCat (subscriptions)
- Sentry (error tracking)
- Canva (design assets)

### 💰 Estimated Monthly Costs

| Service | Month 1 | Month 6 | Month 12 |
|---------|---------|---------|----------|
| Supabase | $0 | $25 | $25-75 |
| OpenAI API | $10 | $30 | $75 |
| Claude API | $30 | $100 | $300 |
| Vercel | $0 | $20 | $20 |
| RevenueCat | $0 | $0 | $0 |
| Sentry | $0 | $0 | $26 |
| **Total** | **$40** | **$175** | **$446-496** |

### 🎯 Why This Stack?

✅ **All-in-One Backend** - Supabase handles auth, database, storage, real-time, functions  
✅ **Local Vector Search** - pgvector saves API costs vs. cloud embeddings  
✅ **Battle-Tested** - Mature ecosystem, excellent documentation  
✅ **Type Safety** - End-to-end types with Supabase generated types  
✅ **Shared Code** - 60%+ code reuse between mobile and web  
✅ **Cost Effective** - Free tier covers MVP, low costs at scale  
✅ **Real-Time Built-in** - PostgreSQL Realtime subscriptions  
✅ **Best for React Native** - Official SDK with excellent offline support  

### 🚀 Next Steps:
1. Initialize React Native project with TypeScript
2. Set up monorepo with `@manifest/shared` package
3. Create Supabase project + run database migrations
4. Configure Supabase Auth (Apple Sign-In)
5. Install NativeWind for styling
6. Set up GitHub repository + CI/CD
7. Create Canva brand kit for design assets
8. Deploy Supabase Edge Functions (AI chat)
9. Start with authentication + navigation
10. Build iteratively with Claude Code

**Ready to build something transformative with Supabase! 🙏✨**
