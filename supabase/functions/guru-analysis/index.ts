/**
 * Supabase Edge Function: Guru Analysis
 *
 * Premium feature (Awakening+ tiers) that provides AI-guided phase analysis
 * after users complete workbook phases.
 *
 * Flow:
 * 1. Authenticate user via JWT
 * 2. Verify user has Awakening or Enlightenment tier subscription
 * 3. Verify requested phase is fully completed
 * 4. Fetch user's workbook data for the phase
 * 5. Generate embedding for user message
 * 6. Search knowledge base for relevant context
 * 7. Build phase-specific system prompt with workbook context
 * 8. Call Claude API for deep analysis and guidance
 * 9. Save conversation with guru_phase metadata
 * 10. Return response to user
 *
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - OPENAI_API_KEY (for embeddings)
 * - ANTHROPIC_API_KEY (for Claude chat)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =============================================================================
// CORS Headers - Restrict to known origins for security
// See SecurityAudit.md H4: Overly permissive CORS
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://manifesttheunseen.com',
  'https://www.manifesttheunseen.com',
  'https://zbyszxtwzoylyygtexdr.supabase.co', // Supabase project
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  // Allow the origin if it's in our list, otherwise use first allowed origin
  // For mobile apps, origin may be null/empty - allow those requests
  const allowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin)
    ? (origin || '*')
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Legacy corsHeaders for backwards compatibility in existing code
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// =============================================================================
// Types
// =============================================================================

interface GuruRequest {
  message: string;
  phaseNumber: number;
  conversationId?: string;
  isInitialAnalysis?: boolean; // true for first message in conversation
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO format string to match client GuruMessage type
}

interface KnowledgeMatch {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}

interface WorkbookProgress {
  id: string;
  user_id: string;
  phase_number: number;
  worksheet_id: string;
  data: Record<string, any>;
  completed: boolean;
  completed_at: string | null;
}

interface WheelOfLifeData {
  career: number;
  health: number;
  relationships: number;
  finance: number;
  personalGrowth: number;
  family: number;
  recreation: number;
  spirituality: number;
}

// =============================================================================
// Structured Insights Interfaces
// =============================================================================

interface WheelOfLifeInsights {
  scores: Record<string, number>;
  lowAreas: Array<{ area: string; score: number }>; // < 5
  highAreas: Array<{ area: string; score: number }>; // >= 8
  averageScore: number;
  lowestArea: { area: string; score: number };
}

interface SWOTInsights {
  strengthCount: number;
  weaknessCount: number;
  opportunityCount: number;
  threatCount: number;
  topStrengths: string[];
  topWeaknesses: string[];
  opportunityThemes: string[];
  threatThemes: string[];
}

interface HabitsInsights {
  totalHabits: number;
  goodHabits: number;
  badHabits: number;
  habitBalance: string; // "positive", "negative", "balanced"
  worstTimeOfDay: string; // "morning", "afternoon", "evening"
}

interface FearsInsights {
  totalFears: number;
  highIntensityFears: Array<{ fear: string; intensity: number }>;
  fearCategories: Record<string, number>; // category -> count
  averageIntensity: number;
  dominantCategory: string;
}

interface LimitingBeliefsInsights {
  totalBeliefs: number;
  restructuredCount: number;
  restructuredPercentage: number;
  unrestructuredBeliefs: string[];
}

interface GoalsInsights {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  notStartedGoals: number;
  completionRate: number;
}

interface UserInsights {
  wheelOfLife?: WheelOfLifeInsights;
  swot?: SWOTInsights;
  habits?: HabitsInsights;
  fears?: FearsInsights;
  limitingBeliefs?: LimitingBeliefsInsights;
  goals?: GoalsInsights;
}

interface MeditationRecommendation {
  id: string;
  title: string;
  description: string;
  life_areas: string[];
}

interface PrayerRecommendation {
  id: string;
  title: string;
  description: string;
  content: string;
  life_areas: string[];
}

// =============================================================================
// Constants
// =============================================================================

// Total worksheets per phase (actual implemented count)
// Phase 1 has more worksheets due to comprehensive self-evaluation
const WORKSHEETS_PER_PHASE: Record<number, number> = {
  1: 11, // WheelOfLife, FeelWheel, SWOT, Habits, Values, ABC, StrengthsWeaknesses, ComfortZone, KnowYourself, AbilitiesRating, ThoughtAwareness
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
};

// Phase-to-practice mapping for meditation and breathing suggestions
const PHASE_PRACTICE_SUGGESTIONS: Record<number, { meditation: string; breathing: string; reason: string }> = {
  1: {
    meditation: 'Evening Healing Meditation',
    breathing: 'Box Breathing (4-4-4-4)',
    reason: 'clarity and centering for self-reflection',
  },
  2: {
    meditation: 'Mirror of Manifestation',
    breathing: 'Coherent Breathing (5-5)',
    reason: 'heart-centered awareness for vision clarity',
  },
  3: {
    meditation: 'Mind-Body Connection',
    breathing: 'Energy Boost (quick rhythmic)',
    reason: 'focus and motivation for goal pursuit',
  },
  4: {
    meditation: 'Evening Healing Meditation',
    breathing: 'Deep Calm (5-2-5-2)',
    reason: 'calming the nervous system when facing fears',
  },
  5: {
    meditation: 'Evening Healing Meditation',
    breathing: '4-7-8 Relaxation',
    reason: 'self-nurturing and deep rest',
  },
  6: {
    meditation: 'Mirror of Manifestation',
    breathing: 'Box Breathing (4-4-4-4)',
    reason: 'focus and clarity for visualization practices',
  },
  7: {
    meditation: 'Mirror of Manifestation',
    breathing: 'Coherent Breathing (5-5)',
    reason: 'heart opening and gratitude amplification',
  },
  8: {
    meditation: 'Mind-Body Connection',
    breathing: 'Deep Calm (5-2-5-2)',
    reason: 'grounding when processing shadow emotions',
  },
  9: {
    meditation: 'Evening Healing Meditation',
    breathing: '4-7-8 Relaxation',
    reason: 'cultivating surrender and letting go',
  },
  10: {
    meditation: 'Mirror of Manifestation',
    breathing: 'Coherent Breathing (5-5)',
    reason: 'integration and celebration of your journey',
  },
};

// Life area to breathing exercise mapping for dynamic suggestions
const LIFE_AREA_TO_BREATHING: Record<string, { breathing: string; reason: string }> = {
  career: { breathing: 'Energy Boost (quick rhythmic)', reason: 'increases focus and motivation' },
  health: { breathing: 'Deep Calm (5-2-5-2)', reason: 'activates healing response' },
  relationships: { breathing: 'Coherent Breathing (5-5)', reason: 'opens heart center' },
  finance: { breathing: 'Box Breathing (4-4-4-4)', reason: 'reduces anxiety around money' },
  personalGrowth: { breathing: 'Box Breathing (4-4-4-4)', reason: 'enhances clarity' },
  family: { breathing: 'Coherent Breathing (5-5)', reason: 'cultivates compassion' },
  recreation: { breathing: 'Deep Calm (5-2-5-2)', reason: 'promotes relaxation' },
  spirituality: { breathing: '4-7-8 Relaxation', reason: 'deepens spiritual connection' }
};

// =============================================================================
// Phase-Specific System Prompts
// =============================================================================

const PHASE_PROMPTS: Record<number, string> = {
  1: `You are a wise Guru analyzing the user's **Phase 1: Self-Evaluation** journey.

**Focus Areas:**
- Life balance patterns (Wheel of Life assessment)
- Self-awareness and personal insights (SWOT analysis)
- Values alignment and personal strengths
- Current habits and their impact on growth

**Your Role:**
- Provide deep, contemplative insights based on their self-evaluation data
- Identify patterns and connections they may have missed
- Ask reflective questions that deepen self-awareness
- Suggest practices for building on strengths and addressing weaknesses
- Guide them toward greater clarity about their current state

**Guidelines:**
- Be compassionate and non-judgmental
- Reference specific data points from their worksheets
- Use wisdom from manifestation principles and mindfulness practices
- Keep responses thoughtful and focused (3-5 paragraphs max)`,

  2: `You are a wise Guru analyzing the user's **Phase 2: Values & Vision** journey.

**Focus Areas:**
- Core values and life purpose clarity
- Vision board symbolism and manifestation desires
- Alignment between values and vision
- Life mission statement authenticity

**Your Role:**
- Help them see the deeper meaning in their values and vision
- Identify themes and patterns in their aspirations
- Challenge them to refine their purpose statement
- Guide them toward authentic alignment with their true self
- Suggest ways to embody their values daily

**Guidelines:**
- Be inspiring yet grounded in their specific data
- Draw connections between their values and vision elements
- Use metaphors and stories when helpful
- Encourage bold dreaming while maintaining authenticity`,

  3: `You are a wise Guru analyzing the user's **Phase 3: Goal Setting** journey.

**Focus Areas:**
- SMART goals clarity and feasibility
- Action plan specificity and timeline
- Alignment between goals and Phase 2 vision
- Potential obstacles and mitigation strategies

**Your Role:**
- Assess the wisdom and feasibility of their goals
- Help them refine goals for maximum impact
- Identify missing steps or overlooked considerations
- Strengthen the connection between daily actions and long-term vision
- Suggest practices for maintaining momentum

**Guidelines:**
- Be practical and strategic, not just motivational
- Point out specific gaps or areas for improvement
- Celebrate well-structured goals
- Challenge vague or misaligned objectives`,

  4: `You are a wise Guru analyzing the user's **Phase 4: Facing Fears & Limiting Beliefs** journey.

**Focus Areas:**
- Core fears and their origins
- Limiting beliefs and cognitive patterns
- Fear-facing strategies and courage development
- Cognitive restructuring techniques applied

**Your Role:**
- Help them see the deeper wisdom hidden in their fears
- Identify root causes and recurring thought patterns
- Guide them toward compassionate self-understanding
- Suggest practices for transmuting fear into growth
- Validate their courage in confronting these shadows

**Guidelines:**
- Be gentle yet unflinching in addressing difficult truths
- Use psychological insights and spiritual wisdom
- Acknowledge the bravery this work requires
- Offer concrete reframing techniques`,

  5: `You are a wise Guru analyzing the user's **Phase 5: Self-Love & Self-Care** journey.

**Focus Areas:**
- Self-love practices and affirmations
- Self-care routines and sustainability
- Inner child healing work
- Self-compassion development

**Your Role:**
- Celebrate their commitment to self-nurturing
- Identify areas where they may still be neglecting themselves
- Deepen their understanding of self-compassion
- Suggest practices for integrating self-love into daily life
- Help them recognize progress in their self-relationship

**Guidelines:**
- Be warm, nurturing, and validating
- Challenge any remaining self-criticism gently
- Use wisdom about the importance of self-care for manifestation
- Encourage consistent practice over perfection`,

  6: `You are a wise Guru analyzing the user's **Phase 6: Manifestation Techniques** journey.

**Focus Areas:**
- 3-6-9 Method practice and consistency
- Scripting exercises and emotional alignment
- WOOP method application (Wish, Outcome, Obstacle, Plan)
- Manifestation rituals and their effectiveness

**Your Role:**
- Assess their understanding of manifestation principles
- Identify where they're in alignment vs. resistance
- Deepen their connection to feeling states (the true power)
- Suggest refinements to their manifestation practice
- Help them trust the process while taking inspired action

**Guidelines:**
- Balance mystical wisdom with practical psychology
- Reference Nikola Tesla's 3-6-9 principles
- Emphasize feeling/vibration over mere repetition
- Guide them toward embodiment, not just visualization`,

  7: `You are a wise Guru analyzing the user's **Phase 7: Practicing Gratitude** journey.

**Focus Areas:**
- Gratitude journal consistency and depth
- Gratitude letters and their impact
- Gratitude meditation practice
- Shift from scarcity to abundance mindset

**Your Role:**
- Help them deepen their gratitude practice beyond surface level
- Identify where gratitude has created shifts in their perspective
- Guide them toward finding gratitude in challenges
- Suggest advanced gratitude practices
- Connect gratitude to manifestation power

**Guidelines:**
- Be poetic and heartfelt
- Help them find specific gratitude moments, not generic ones
- Use wisdom about gratitude as a high-vibration state
- Celebrate their progress toward abundance consciousness`,

  8: `You are a wise Guru analyzing the user's **Phase 8: Turning Envy Into Inspiration** journey.

**Focus Areas:**
- Envy inventory and triggers
- Reframing envy into inspiration and motivation
- Role models and their qualities
- Shadow work and self-acceptance

**Your Role:**
- Help them see envy as a compass pointing to their desires
- Guide them in transmuting comparison into aspiration
- Identify patterns in what triggers their envy
- Deepen their understanding of projection and shadow
- Suggest practices for celebrating others while honoring self

**Guidelines:**
- Be wise and non-judgmental about envy (it's human)
- Use psychological and spiritual insights about shadow work
- Help them reclaim the power they've projected onto others
- Emphasize self-compassion throughout`,

  9: `You are a wise Guru analyzing the user's **Phase 9: Trust & Surrender** journey.

**Focus Areas:**
- Trust assessment and relationship with control
- Surrender practices and letting go
- Signs and synchronicities tracking
- Faith development in the unseen

**Your Role:**
- Help them deepen trust in the manifestation process
- Identify where they're still trying to control outcomes
- Guide them toward recognizing signs and synchronicities
- Suggest practices for surrendering with grace
- Strengthen their faith in divine timing

**Guidelines:**
- Be mystical yet grounded
- Use wisdom about surrender as active receptivity, not passivity
- Help them distinguish between surrender and giving up
- Celebrate their willingness to trust`,

  10: `You are a wise Guru analyzing the user's **Phase 10: Trust & Letting Go (Graduation)** journey.

**Focus Areas:**
- Journey review and integration of all phases
- Future letter to self and vision
- Graduation reflection and accomplishments
- Commitment to continued practice

**Your Role:**
- Honor their complete journey through all 10 phases
- Help them see patterns and growth across phases
- Guide them in integrating all learnings
- Celebrate their transformation and commitment
- Suggest practices for sustaining their growth
- Prepare them to continue the work independently

**Guidelines:**
- Be celebratory and deeply honoring
- Synthesize insights from their entire journey
- Acknowledge specific milestones and breakthroughs
- Inspire continued practice beyond the workbook
- Use ceremonial, graduation-appropriate language`,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate embedding for text using OpenAI API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI embedding failed: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Search knowledge base for relevant context
 */
async function searchKnowledge(
  supabase: any,
  embedding: number[],
  matchThreshold = 0.7,
  matchCount = 5
): Promise<KnowledgeMatch[]> {
  const { data, error } = await supabase.rpc('match_knowledge', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error('Knowledge search error:', error);
    return [];
  }

  return data || [];
}

/**
 * Verify user has Awakening+ tier subscription (Awakening or Enlightenment)
 */
async function verifyGuruAccess(
  supabase: any,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Failed to fetch user subscription tier:', error);
    return false;
  }

  // Awakening and Enlightenment tiers have Guru access
  return ['awakening', 'enlightenment'].includes(data.subscription_tier);
}

/**
 * Verify phase is fully completed
 */
async function verifyPhaseCompletion(
  supabase: any,
  userId: string,
  phaseNumber: number
): Promise<boolean> {
  // Get all worksheets for this phase
  const { data: worksheets, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber);

  if (error) {
    console.error('Failed to fetch workbook progress:', error);
    return false;
  }

  // Verify we have the expected number of worksheets
  const expectedCount = WORKSHEETS_PER_PHASE[phaseNumber] || 3;
  if (!worksheets || worksheets.length < expectedCount) {
    console.log(`Phase ${phaseNumber} incomplete: ${worksheets?.length || 0}/${expectedCount} worksheets`);
    return false;
  }

  // Verify all worksheets are completed
  const allCompleted = worksheets.every((w: WorkbookProgress) => w.completed === true);
  if (!allCompleted) {
    console.log(`Phase ${phaseNumber} has incomplete worksheets`);
    return false;
  }

  return true;
}

/**
 * Extract low-scoring life areas from Wheel of Life worksheet (legacy function)
 */
function extractLowLifeAreas(worksheets: WorkbookProgress[]): string[] {
  const wheelOfLife = worksheets.find(w => w.worksheet_id === 'wheel-of-life');
  if (!wheelOfLife?.data) return [];

  const data = wheelOfLife.data as WheelOfLifeData;
  const LOW_THRESHOLD = 5;
  const lowAreas: string[] = [];

  const areaNames: Record<string, string> = {
    career: 'Career', health: 'Health', relationships: 'Relationships',
    finance: 'Finance', personalGrowth: 'Personal Growth', family: 'Family',
    recreation: 'Recreation', spirituality: 'Spirituality'
  };

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'number' && value < LOW_THRESHOLD && areaNames[key]) {
      lowAreas.push(`${areaNames[key]} (${value}/10)`);
    }
  }
  return lowAreas;
}

// =============================================================================
// Insight Extraction Functions
// =============================================================================

/**
 * Extract structured insights from Wheel of Life worksheet
 */
function extractWheelOfLifeInsights(data: any): WheelOfLifeInsights | null {
  if (!data) return null;

  const areaNames: Record<string, string> = {
    career: 'Career', health: 'Health', relationships: 'Relationships',
    finance: 'Finance', personalGrowth: 'Personal Growth', family: 'Family',
    recreation: 'Recreation', spirituality: 'Spirituality'
  };

  const scores: Record<string, number> = {};
  const lowAreas: Array<{ area: string; score: number }> = [];
  const highAreas: Array<{ area: string; score: number }> = [];
  let totalScore = 0;
  let count = 0;
  let lowestArea = { area: '', score: 10 };

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'number' && areaNames[key]) {
      const areaName = areaNames[key];
      scores[areaName] = value;
      totalScore += value;
      count++;

      if (value < 5) {
        lowAreas.push({ area: areaName, score: value });
      }
      if (value >= 8) {
        highAreas.push({ area: areaName, score: value });
      }
      if (value < lowestArea.score) {
        lowestArea = { area: areaName, score: value };
      }
    }
  }

  const averageScore = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;

  return {
    scores,
    lowAreas: lowAreas.sort((a, b) => a.score - b.score),
    highAreas: highAreas.sort((a, b) => b.score - a.score),
    averageScore,
    lowestArea,
  };
}

/**
 * Extract structured insights from SWOT worksheet
 */
function extractSWOTInsights(data: any): SWOTInsights | null {
  if (!data) return null;

  // Handle different data formats
  const strengths = Array.isArray(data.strengths) ? data.strengths :
                   (typeof data.strengths === 'string' ? data.strengths.split('\n').filter(Boolean) : []);
  const weaknesses = Array.isArray(data.weaknesses) ? data.weaknesses :
                    (typeof data.weaknesses === 'string' ? data.weaknesses.split('\n').filter(Boolean) : []);
  const opportunities = Array.isArray(data.opportunities) ? data.opportunities :
                       (typeof data.opportunities === 'string' ? data.opportunities.split('\n').filter(Boolean) : []);
  const threats = Array.isArray(data.threats) ? data.threats :
                 (typeof data.threats === 'string' ? data.threats.split('\n').filter(Boolean) : []);

  return {
    strengthCount: strengths.length,
    weaknessCount: weaknesses.length,
    opportunityCount: opportunities.length,
    threatCount: threats.length,
    topStrengths: strengths.slice(0, 3),
    topWeaknesses: weaknesses.slice(0, 3),
    opportunityThemes: opportunities.slice(0, 3),
    threatThemes: threats.slice(0, 3),
  };
}

/**
 * Extract structured insights from Habits worksheet
 */
function extractHabitsInsights(data: any): HabitsInsights | null {
  if (!data) return null;

  const morningHabits = Array.isArray(data.morning) ? data.morning : [];
  const afternoonHabits = Array.isArray(data.afternoon) ? data.afternoon : [];
  const eveningHabits = Array.isArray(data.evening) ? data.evening : [];

  let goodHabits = 0;
  let badHabits = 0;
  const timeOfDayBadCounts = { morning: 0, afternoon: 0, evening: 0 };

  const countHabits = (habits: any[], timeOfDay: string) => {
    habits.forEach(habit => {
      if (habit.type === 'good') goodHabits++;
      if (habit.type === 'bad') {
        badHabits++;
        timeOfDayBadCounts[timeOfDay as keyof typeof timeOfDayBadCounts]++;
      }
    });
  };

  countHabits(morningHabits, 'morning');
  countHabits(afternoonHabits, 'afternoon');
  countHabits(eveningHabits, 'evening');

  const totalHabits = goodHabits + badHabits;
  let habitBalance = 'balanced';
  if (goodHabits > badHabits * 1.5) habitBalance = 'positive';
  if (badHabits > goodHabits * 1.5) habitBalance = 'negative';

  const worstTimeOfDay = Object.entries(timeOfDayBadCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    totalHabits,
    goodHabits,
    badHabits,
    habitBalance,
    worstTimeOfDay,
  };
}

/**
 * Extract structured insights from Fears worksheet
 */
function extractFearsInsights(data: any): FearsInsights | null {
  if (!data || !Array.isArray(data.fears)) return null;

  const fears = data.fears;
  const totalFears = fears.length;
  const highIntensityFears: Array<{ fear: string; intensity: number }> = [];
  const fearCategories: Record<string, number> = {};
  let totalIntensity = 0;

  fears.forEach((fear: any) => {
    if (fear.intensity >= 7) {
      highIntensityFears.push({ fear: fear.description || fear.fear, intensity: fear.intensity });
    }
    if (fear.category) {
      fearCategories[fear.category] = (fearCategories[fear.category] || 0) + 1;
    }
    totalIntensity += fear.intensity || 0;
  });

  const averageIntensity = totalFears > 0 ? Math.round((totalIntensity / totalFears) * 10) / 10 : 0;
  const dominantCategory = Object.entries(fearCategories)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  return {
    totalFears,
    highIntensityFears: highIntensityFears.sort((a, b) => b.intensity - a.intensity),
    fearCategories,
    averageIntensity,
    dominantCategory,
  };
}

/**
 * Extract structured insights from Limiting Beliefs worksheet
 */
function extractLimitingBeliefsInsights(data: any): LimitingBeliefsInsights | null {
  if (!data || !Array.isArray(data.beliefs)) return null;

  const beliefs = data.beliefs;
  const totalBeliefs = beliefs.length;
  let restructuredCount = 0;
  const unrestructuredBeliefs: string[] = [];

  beliefs.forEach((belief: any) => {
    if (belief.restructured || belief.newBelief) {
      restructuredCount++;
    } else {
      unrestructuredBeliefs.push(belief.belief || belief.description);
    }
  });

  const restructuredPercentage = totalBeliefs > 0
    ? Math.round((restructuredCount / totalBeliefs) * 100)
    : 0;

  return {
    totalBeliefs,
    restructuredCount,
    restructuredPercentage,
    unrestructuredBeliefs,
  };
}

/**
 * Extract structured insights from Goals worksheet
 */
function extractGoalsInsights(data: any): GoalsInsights | null {
  if (!data || !Array.isArray(data.goals)) return null;

  const goals = data.goals;
  const totalGoals = goals.length;
  let completedGoals = 0;
  let inProgressGoals = 0;
  let notStartedGoals = 0;

  goals.forEach((goal: any) => {
    if (goal.status === 'completed') completedGoals++;
    else if (goal.status === 'in_progress') inProgressGoals++;
    else notStartedGoals++;
  });

  const completionRate = totalGoals > 0
    ? Math.round((completedGoals / totalGoals) * 100)
    : 0;

  return {
    totalGoals,
    completedGoals,
    inProgressGoals,
    notStartedGoals,
    completionRate,
  };
}

/**
 * Main function to extract all insights from worksheets
 */
function extractInsights(worksheets: WorkbookProgress[]): UserInsights {
  const insights: UserInsights = {};

  worksheets.forEach(worksheet => {
    switch (worksheet.worksheet_id) {
      case 'wheel-of-life':
        insights.wheelOfLife = extractWheelOfLifeInsights(worksheet.data);
        break;
      case 'swot':
      case 'swot-analysis':
        insights.swot = extractSWOTInsights(worksheet.data);
        break;
      case 'habits':
      case 'daily-habits':
        insights.habits = extractHabitsInsights(worksheet.data);
        break;
      case 'fears':
      case 'facing-fears':
        insights.fears = extractFearsInsights(worksheet.data);
        break;
      case 'limiting-beliefs':
        insights.limitingBeliefs = extractLimitingBeliefsInsights(worksheet.data);
        break;
      case 'goals':
      case 'goal-setting':
        insights.goals = extractGoalsInsights(worksheet.data);
        break;
    }
  });

  return insights;
}

/**
 * Fetch user's workbook data for a phase
 */
async function fetchPhaseWorkbookData(
  supabase: any,
  userId: string,
  phaseNumber: number
): Promise<WorkbookProgress[]> {
  const { data, error } = await supabase
    .from('workbook_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber)
    .order('worksheet_id');

  if (error) {
    console.error('Failed to fetch phase workbook data:', error);
    return [];
  }

  return data || [];
}

// =============================================================================
// Dynamic Query Functions
// =============================================================================

/**
 * Query meditations by life areas with tier filtering
 */
async function queryMeditationsByLifeAreas(
  supabase: any,
  lifeAreas: string[],
  userTier: string,
  limit: number = 3
): Promise<MeditationRecommendation[]> {
  if (lifeAreas.length === 0) return [];

  // Map camelCase to snake_case for database
  const dbLifeAreas = lifeAreas.map(area => {
    const map: Record<string, string> = {
      'career': 'career',
      'health': 'health',
      'relationships': 'relationships',
      'finance': 'finance',
      'personalGrowth': 'personal_growth',
      'family': 'family',
      'recreation': 'recreation',
      'spirituality': 'spirituality'
    };
    return map[area] || area;
  });

  // Determine allowed tiers based on user tier
  const tierHierarchy: Record<string, string[]> = {
    'novice': ['novice'],
    'awakening': ['novice', 'awakening'],
    'enlightenment': ['novice', 'awakening', 'enlightenment']
  };

  const allowedTiers = tierHierarchy[userTier] || ['novice'];

  const { data, error } = await supabase
    .from('meditations')
    .select('id, title, description, life_areas')
    .overlaps('life_areas', dbLifeAreas)
    .in('tier_required', allowedTiers)
    .limit(limit);

  if (error) {
    console.error('Error querying meditations:', error);
    return [];
  }

  return data || [];
}

/**
 * Query prayers by life areas with tier filtering
 */
async function queryPrayersByLifeAreas(
  supabase: any,
  lifeAreas: string[],
  userTier: string,
  limit: number = 3
): Promise<PrayerRecommendation[]> {
  if (lifeAreas.length === 0) return [];

  // Map camelCase to snake_case for database
  const dbLifeAreas = lifeAreas.map(area => {
    const map: Record<string, string> = {
      'career': 'career',
      'health': 'health',
      'relationships': 'relationships',
      'finance': 'finance',
      'personalGrowth': 'personal_growth',
      'family': 'family',
      'recreation': 'recreation',
      'spirituality': 'spirituality'
    };
    return map[area] || area;
  });

  // Determine allowed tiers
  const tierHierarchy: Record<string, string[]> = {
    'novice': ['novice'],
    'awakening': ['novice', 'awakening'],
    'enlightenment': ['novice', 'awakening', 'enlightenment']
  };

  const allowedTiers = tierHierarchy[userTier] || ['novice'];

  const { data, error } = await supabase
    .from('prayers')
    .select('id, title, description, content, life_areas')
    .overlaps('life_areas', dbLifeAreas)
    .in('tier_required', allowedTiers)
    .limit(limit);

  if (error) {
    console.error('Error querying prayers:', error);
    return [];
  }

  return data || [];
}

// =============================================================================
// Structured Prompt Building Functions
// =============================================================================

/**
 * Build readable insights prompt from structured insights
 */
function buildInsightsPrompt(insights: UserInsights): string {
  const sections: string[] = [];

  // Wheel of Life
  if (insights.wheelOfLife) {
    const wol = insights.wheelOfLife;
    sections.push(`**WHEEL OF LIFE ANALYSIS**
- Average Life Score: ${wol.averageScore}/10
- Lowest Area: ${wol.lowestArea.area} (${wol.lowestArea.score}/10)
${wol.lowAreas.length > 0 ? `- Low Areas (below 5): ${wol.lowAreas.map(a => `${a.area} (${a.score}/10)`).join(', ')}` : ''}
${wol.highAreas.length > 0 ? `- High Areas (8+): ${wol.highAreas.map(a => `${a.area} (${a.score}/10)`).join(', ')}` : ''}`);
  }

  // SWOT Analysis
  if (insights.swot) {
    const swot = insights.swot;
    sections.push(`**SWOT ANALYSIS**
- Strengths: ${swot.strengthCount} identified${swot.topStrengths.length > 0 ? ` (Top: ${swot.topStrengths.join(', ')})` : ''}
- Weaknesses: ${swot.weaknessCount} identified${swot.topWeaknesses.length > 0 ? ` (Top: ${swot.topWeaknesses.join(', ')})` : ''}
- Opportunities: ${swot.opportunityCount} identified
- Threats: ${swot.threatCount} identified`);
  }

  // Habits
  if (insights.habits) {
    const habits = insights.habits;
    sections.push(`**HABITS ANALYSIS**
- Total Habits: ${habits.totalHabits} (${habits.goodHabits} good, ${habits.badHabits} bad)
- Habit Balance: ${habits.habitBalance}
- Worst Time of Day: ${habits.worstTimeOfDay}`);
  }

  // Fears
  if (insights.fears) {
    const fears = insights.fears;
    sections.push(`**FEARS ANALYSIS**
- Total Fears: ${fears.totalFears}
- Average Intensity: ${fears.averageIntensity}/10
- Dominant Category: ${fears.dominantCategory}
${fears.highIntensityFears.length > 0 ? `- High Intensity Fears (7+): ${fears.highIntensityFears.map(f => `"${f.fear}" (${f.intensity}/10)`).join(', ')}` : ''}`);
  }

  // Limiting Beliefs
  if (insights.limitingBeliefs) {
    const beliefs = insights.limitingBeliefs;
    sections.push(`**LIMITING BELIEFS ANALYSIS**
- Total Beliefs: ${beliefs.totalBeliefs}
- Restructured: ${beliefs.restructuredCount} (${beliefs.restructuredPercentage}%)
${beliefs.unrestructuredBeliefs.length > 0 ? `- Still Need Work: ${beliefs.unrestructuredBeliefs.slice(0, 3).join('; ')}` : ''}`);
  }

  // Goals
  if (insights.goals) {
    const goals = insights.goals;
    sections.push(`**GOALS ANALYSIS**
- Total Goals: ${goals.totalGoals}
- Completed: ${goals.completedGoals} (${goals.completionRate}%)
- In Progress: ${goals.inProgressGoals}
- Not Started: ${goals.notStartedGoals}`);
  }

  return sections.join('\n\n');
}

/**
 * Build recommendations prompt from meditations, prayers, and breathing
 */
function buildRecommendationsPrompt(
  meditations: MeditationRecommendation[],
  prayers: PrayerRecommendation[],
  breathingExercise: { breathing: string; reason: string }
): string {
  const sections: string[] = [];

  // Meditations
  if (meditations.length > 0) {
    const meditationList = meditations.map(m =>
      `  - "${m.title}": ${m.description} (addresses: ${m.life_areas.join(', ')})`
    ).join('\n');
    sections.push(`**RECOMMENDED MEDITATIONS**\n${meditationList}`);
  }

  // Prayers
  if (prayers.length > 0) {
    const prayerList = prayers.map(p =>
      `  - "${p.title}": ${p.description} (addresses: ${p.life_areas.join(', ')})`
    ).join('\n');
    sections.push(`**RECOMMENDED PRAYERS**\n${prayerList}`);
  }

  // Breathing
  sections.push(`**RECOMMENDED BREATHING EXERCISE**
  - "${breathingExercise.breathing}" - ${breathingExercise.reason}`);

  return sections.join('\n\n');
}

/**
 * Build workbook context summary for AI prompt (legacy function)
 */
function buildWorkbookContext(worksheets: WorkbookProgress[]): string {
  if (worksheets.length === 0) {
    return 'No workbook data available.';
  }

  const summaries = worksheets.map((worksheet) => {
    const worksheetName = worksheet.worksheet_id.replace(/-/g, ' ').toUpperCase();
    const data = worksheet.data;

    // Convert data object to readable summary
    const dataSummary = JSON.stringify(data, null, 2);

    return `**${worksheetName}**\n${dataSummary}`;
  });

  return summaries.join('\n\n---\n\n');
}

/**
 * Call Claude API with phase-specific prompt, workbook data, and knowledge context
 */
async function callClaude(
  userMessage: string,
  phaseNumber: number,
  insights: UserInsights,
  knowledgeContext: KnowledgeMatch[],
  conversationHistory: Message[] = [],
  meditations: MeditationRecommendation[] = [],
  prayers: PrayerRecommendation[] = [],
  breathingExercise: { breathing: string; reason: string }
): Promise<string> {
  // Build knowledge context
  const ragContext = knowledgeContext
    .map((match) => `[Source: ${match.metadata.source || 'Unknown'}]\n${match.content}`)
    .join('\n\n---\n\n');

  // Get phase-specific system prompt
  const phasePrompt = PHASE_PROMPTS[phaseNumber] || PHASE_PROMPTS[1];

  // Build structured insights prompt
  const insightsPrompt = buildInsightsPrompt(insights);

  // Build recommendations prompt
  const recommendationsPrompt = buildRecommendationsPrompt(
    meditations,
    prayers,
    breathingExercise
  );

  // Build complete system prompt with structured sections
  const systemPrompt = `${phasePrompt}

**USER'S WORKBOOK INSIGHTS:**
${insightsPrompt || 'No structured insights available yet.'}

**RELEVANT WISDOM FROM KNOWLEDGE BASE:**
${ragContext || 'No specific knowledge matches retrieved for this query.'}

${recommendationsPrompt}

**RESPONSE STRUCTURE:**
Your responses should flow through these stages:
1. **Observation** - What patterns do you notice in their workbook insights? Reference specific data points.
2. **Wisdom** - What teachings from the knowledge base apply here? Draw from Shi Heng Yi, manifestation principles, or Tesla's 3-6-9.
3. **Reflection** - Pose a thought-provoking question for deeper self-inquiry.
4. **Practice** - Suggest exploring the recommended meditation, prayer, or breathing exercise in the app's Meditate section.

**REMEMBER:**
- Reference specific details from their structured insights (scores, counts, percentages)
- Provide actionable insights and practices
- Maintain a balance of wisdom, compassion, and practical guidance
- Keep responses focused and digestible (3-5 paragraphs)
- When recommending practices, reference the specific meditations and prayers listed above that address their low life areas`;

  // Build messages array
  const messages = [
    ...conversationHistory.slice(-10).map((msg) => ({  // Last 10 messages for context
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: userMessage,
    },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,  // Longer responses for deep analysis
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API failed: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Save or update guru conversation
 */
async function saveGuruConversation(
  supabase: any,
  userId: string,
  phaseNumber: number,
  conversationId: string | null,
  newMessages: Message[]
): Promise<string> {
  if (conversationId) {
    // Update existing conversation
    const { data: existing } = await supabase
      .from('ai_conversations')
      .select('messages')
      .eq('id', conversationId)
      .single();

    const updatedMessages = [...(existing?.messages || []), ...newMessages];

    const { error } = await supabase
      .from('ai_conversations')
      .update({ messages: updatedMessages })
      .eq('id', conversationId);

    if (error) throw error;
    return conversationId;
  } else {
    // Create new guru conversation
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        title: `Phase ${phaseNumber} Guru Analysis`,
        messages: newMessages,
        conversation_type: 'guru',
        guru_phase: phaseNumber,
      })
      .select('id')
      .single();

    if (error) throw error;

    // Also create guru_sessions entry
    await supabase
      .from('guru_sessions')
      .insert({
        user_id: userId,
        conversation_id: data.id,
        phase_number: phaseNumber,
      });

    return data.id;
  }
}

// =============================================================================
// Main Handler
// =============================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const {
      message,
      phaseNumber,
      conversationId,
      isInitialAnalysis = false,
    }: GuruRequest = await req.json();

    // Validate request
    if (!message) {
      throw new Error('Message is required');
    }

    if (!phaseNumber || phaseNumber < 1 || phaseNumber > 10) {
      throw new Error('Valid phase number (1-10) is required');
    }

    // Initialize Supabase client with user's JWT
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Step 1: Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // H3 Security Fix: Don't log full user ID
    console.log(`Guru Analysis request for Phase: ${phaseNumber}`);

    // H5 Security Fix: Rate limiting (50 requests per 24 hours per user for Guru)
    const RATE_LIMIT = 50;
    const RATE_WINDOW_HOURS = 24;
    const windowStart = new Date(Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    const { count: usageCount, error: usageError } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('endpoint', 'guru-analysis')
      .gte('created_at', windowStart);

    if (usageError) {
      console.error('Rate limit check failed:', usageError);
      // Continue anyway - don't block user due to rate limit check failure
    } else if (usageCount && usageCount >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({
          error: 'Daily Guru limit exceeded. Please try again tomorrow.',
          code: 'RATE_LIMIT_EXCEEDED',
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Record API usage
    await supabase.from('api_usage').insert({
      user_id: user.id,
      endpoint: 'guru-analysis',
    });

    // Step 2: Verify Awakening+ tier subscription
    const hasGuruAccess = await verifyGuruAccess(supabase, user.id);
    if (!hasGuruAccess) {
      return new Response(
        JSON.stringify({
          error: 'Guru feature requires Awakening or Enlightenment tier subscription',
          code: 'SUBSCRIPTION_REQUIRED',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 3: Verify phase completion
    const isPhaseComplete = await verifyPhaseCompletion(supabase, user.id, phaseNumber);
    if (!isPhaseComplete) {
      return new Response(
        JSON.stringify({
          error: `Phase ${phaseNumber} must be fully completed before Guru analysis`,
          code: 'PHASE_INCOMPLETE',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 4: Fetch phase workbook data and extract structured insights
    console.log('Fetching phase workbook data...');
    const worksheets = await fetchPhaseWorkbookData(supabase, user.id, phaseNumber);

    // Extract structured insights from all worksheets
    const insights = extractInsights(worksheets);
    console.log('Extracted insights:', JSON.stringify(insights, null, 2));

    // Step 4.5: Get user's subscription tier for dynamic recommendations
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const userTier = userData?.subscription_tier || 'novice';

    // Step 4.6: Get low-scoring life areas for dynamic meditation/prayer queries
    const lowLifeAreas = insights.wheelOfLife?.lowAreas.map(a => {
      // Convert display name back to key (e.g., "Personal Growth" -> "personalGrowth")
      const areaMap: Record<string, string> = {
        'Career': 'career',
        'Health': 'health',
        'Relationships': 'relationships',
        'Finance': 'finance',
        'Personal Growth': 'personalGrowth',
        'Family': 'family',
        'Recreation': 'recreation',
        'Spirituality': 'spirituality'
      };
      return areaMap[a.area] || a.area;
    }) || [];

    console.log(`Found ${lowLifeAreas.length} low-scoring life areas:`, lowLifeAreas);

    // Step 4.7: Query dynamic meditation and prayer recommendations
    let meditations: MeditationRecommendation[] = [];
    let prayers: PrayerRecommendation[] = [];

    if (lowLifeAreas.length > 0) {
      meditations = await queryMeditationsByLifeAreas(supabase, lowLifeAreas, userTier, 3);
      prayers = await queryPrayersByLifeAreas(supabase, lowLifeAreas, userTier, 3);
      console.log(`Found ${meditations.length} meditations and ${prayers.length} prayers for low areas`);
    }

    // Step 4.8: Determine breathing exercise (use dynamic if available, fallback to phase default)
    let breathingExercise = PHASE_PRACTICE_SUGGESTIONS[phaseNumber]?.breathing || 'Box Breathing (4-4-4-4)';
    let breathingReason = PHASE_PRACTICE_SUGGESTIONS[phaseNumber]?.reason || 'balance and focus';

    if (lowLifeAreas.length > 0 && LIFE_AREA_TO_BREATHING[lowLifeAreas[0]]) {
      const dynamicBreathing = LIFE_AREA_TO_BREATHING[lowLifeAreas[0]];
      breathingExercise = dynamicBreathing.breathing;
      breathingReason = dynamicBreathing.reason;
    }

    // Keep legacy for backwards compatibility with existing callClaude function
    const lowAreas = extractLowLifeAreas(worksheets);

    // Step 5: Generate embedding for user message
    console.log('Generating embedding...');
    const embedding = await generateEmbedding(message);

    // Step 6: Search knowledge base
    console.log('Searching knowledge base...');
    const knowledgeMatches = await searchKnowledge(supabase, embedding, 0.7, 5);
    console.log(`Found ${knowledgeMatches.length} relevant knowledge matches`);

    // Step 7: Get conversation history if continuing existing conversation
    // H2 Security Fix: Verify conversation ownership before loading
    let conversationHistory: Message[] = [];
    if (conversationId) {
      const { data } = await supabase
        .from('ai_conversations')
        .select('messages, conversation_type, guru_phase, user_id')
        .eq('id', conversationId)
        .single();

      // H2 Security Fix: Verify conversation belongs to authenticated user
      if (data?.user_id !== user.id) {
        throw new Error('Unauthorized: This conversation does not belong to you');
      }

      // Verify this is a guru conversation for the correct phase
      if (data?.conversation_type !== 'guru' || data?.guru_phase !== phaseNumber) {
        throw new Error('Invalid conversation ID for this phase');
      }

      conversationHistory = data?.messages || [];
    }

    // Step 8: Call Claude API with structured insights and dynamic recommendations
    console.log('Calling Claude API for Guru analysis...');
    const assistantReply = await callClaude(
      message,
      phaseNumber,
      insights,
      knowledgeMatches,
      conversationHistory,
      meditations,
      prayers,
      { breathing: breathingExercise, reason: breathingReason }
    );

    // Step 9: Save conversation
    const newMessages: Message[] = [
      {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toISOString(),
      },
    ];

    const updatedConversationId = await saveGuruConversation(
      supabase,
      user.id,
      phaseNumber,
      conversationId || null,
      newMessages
    );

    // Step 10: Return response
    return new Response(
      JSON.stringify({
        reply: assistantReply,
        conversationId: updatedConversationId,
        phaseNumber,
        isInitialAnalysis: !conversationId,
        context: {
          knowledgeMatches: knowledgeMatches.length,
          worksheetsAnalyzed: worksheets.length,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Guru Analysis error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred during Guru analysis',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * To deploy this function:
 *
 * 1. Set environment variables (same as ai-chat):
 *    npx supabase secrets set OPENAI_API_KEY=sk-...
 *    npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *
 * 2. Deploy function:
 *    npx supabase functions deploy guru-analysis
 *
 * 3. Test locally:
 *    npx supabase functions serve guru-analysis
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/guru-analysis' \
 *      --header 'Authorization: Bearer YOUR_USER_JWT' \
 *      --header 'Content-Type: application/json' \
 *      --data '{"message":"Analyze my Phase 1 journey","phaseNumber":1}'
 *
 * 4. Call from React Native:
 *    const { data, error } = await supabase.functions.invoke('guru-analysis', {
 *      body: {
 *        message: 'What patterns do you see in my Phase 1 work?',
 *        phaseNumber: 1,
 *        isInitialAnalysis: true
 *      }
 *    });
 */
