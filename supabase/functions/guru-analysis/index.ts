/**
 * Supabase Edge Function: Guru Analysis
 *
 * Premium feature (Enlightenment tier only) that provides AI-guided phase analysis
 * after users complete workbook phases.
 *
 * Flow:
 * 1. Authenticate user via JWT
 * 2. Verify user has Enlightenment tier subscription
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
// CORS Headers
// =============================================================================

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
  timestamp: number;
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

// =============================================================================
// Constants
// =============================================================================

// Total worksheets per phase (from workbook.ts)
const WORKSHEETS_PER_PHASE: Record<number, number> = {
  1: 4,
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
 * Verify user has Enlightenment tier subscription
 */
async function verifyEnlightenmentTier(
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

  return data.subscription_tier === 'enlightenment';
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

/**
 * Build workbook context summary for AI prompt
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
  workbookContext: string,
  knowledgeContext: KnowledgeMatch[],
  conversationHistory: Message[] = []
): Promise<string> {
  // Build knowledge context
  const ragContext = knowledgeContext
    .map((match) => `[Source: ${match.metadata.source || 'Unknown'}]\n${match.content}`)
    .join('\n\n---\n\n');

  // Get phase-specific system prompt
  const phasePrompt = PHASE_PROMPTS[phaseNumber] || PHASE_PROMPTS[1];

  // Build complete system prompt
  const systemPrompt = `${phasePrompt}

**User's Workbook Data for Phase ${phaseNumber}:**
${workbookContext}

**Relevant Wisdom from Knowledge Base:**
${ragContext || 'No specific knowledge matches retrieved for this query.'}

**Remember:**
- Reference specific details from their workbook data
- Provide actionable insights and practices
- Ask thoughtful follow-up questions
- Maintain a balance of wisdom, compassion, and practical guidance
- Keep responses focused and digestible (3-5 paragraphs)`;

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

    console.log(`Guru Analysis request from user: ${user.id}, Phase: ${phaseNumber}`);

    // Step 2: Verify Enlightenment tier subscription
    const hasEnlightenmentTier = await verifyEnlightenmentTier(supabase, user.id);
    if (!hasEnlightenmentTier) {
      return new Response(
        JSON.stringify({
          error: 'Guru feature requires Enlightenment tier subscription',
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

    // Step 4: Fetch phase workbook data
    console.log('Fetching phase workbook data...');
    const worksheets = await fetchPhaseWorkbookData(supabase, user.id, phaseNumber);
    const workbookContext = buildWorkbookContext(worksheets);

    // Step 5: Generate embedding for user message
    console.log('Generating embedding...');
    const embedding = await generateEmbedding(message);

    // Step 6: Search knowledge base
    console.log('Searching knowledge base...');
    const knowledgeMatches = await searchKnowledge(supabase, embedding, 0.7, 5);
    console.log(`Found ${knowledgeMatches.length} relevant knowledge matches`);

    // Step 7: Get conversation history if continuing existing conversation
    let conversationHistory: Message[] = [];
    if (conversationId) {
      const { data } = await supabase
        .from('ai_conversations')
        .select('messages, conversation_type, guru_phase')
        .eq('id', conversationId)
        .single();

      // Verify this is a guru conversation for the correct phase
      if (data?.conversation_type !== 'guru' || data?.guru_phase !== phaseNumber) {
        throw new Error('Invalid conversation ID for this phase');
      }

      conversationHistory = data?.messages || [];
    }

    // Step 8: Call Claude API
    console.log('Calling Claude API for Guru analysis...');
    const assistantReply = await callClaude(
      message,
      phaseNumber,
      workbookContext,
      knowledgeMatches,
      conversationHistory
    );

    // Step 9: Save conversation
    const newMessages: Message[] = [
      {
        role: 'user',
        content: message,
        timestamp: Date.now(),
      },
      {
        role: 'assistant',
        content: assistantReply,
        timestamp: Date.now(),
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
