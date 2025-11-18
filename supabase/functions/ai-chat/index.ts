/**
 * Supabase Edge Function: AI Chat with RAG
 *
 * This function handles AI monk companion chat with Retrieval Augmented Generation (RAG).
 *
 * Flow:
 * 1. Receive user message from React Native app
 * 2. Generate embedding for message via OpenAI API
 * 3. Query knowledge_embeddings table for relevant context (pgvector similarity search)
 * 4. Send context + message to Claude API
 * 5. Stream response back to user
 * 6. Save conversation to ai_conversations table
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

interface ChatRequest {
  message: string;
  conversationId?: string;
  stream?: boolean;
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
 * Call Claude API with context and user message
 */
async function callClaude(
  userMessage: string,
  context: KnowledgeMatch[],
  conversationHistory: Message[] = []
): Promise<string> {
  // Build system prompt with context
  const contextText = context
    .map((match) => `[Source: ${match.metadata.source || 'Unknown'}]\n${match.content}`)
    .join('\n\n---\n\n');

  const systemPrompt = `You are a wise AI monk companion for the "Manifest the Unseen" app, guiding users on their manifestation and spiritual journey.

**Your Knowledge Base:**
${contextText || 'No specific context retrieved for this query.'}

**Your Role:**
- Guide users with wisdom from manifestation principles, mindfulness, and spiritual growth
- Reference the workbook phases (10 phases: Self-Evaluation, Values & Vision, Goal Setting, etc.)
- Encourage journal reflection, meditation practice, and vision board creation
- Be compassionate, non-judgmental, and empowering
- Use metaphors and stories when helpful (Shi Heng Yi style)

**Guidelines:**
- Keep responses concise (2-4 paragraphs max)
- Ask thoughtful follow-up questions
- Reference relevant workbook exercises when appropriate
- Maintain a calm, grounding presence`;

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
      max_tokens: 1024,
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
 * Save or update conversation in database
 */
async function saveConversation(
  supabase: any,
  userId: string,
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
    // Create new conversation
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        title: newMessages[0]?.content.substring(0, 50) + '...',
        messages: newMessages,
      })
      .select('id')
      .single();

    if (error) throw error;
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
    const { message, conversationId, stream = false }: ChatRequest = await req.json();

    if (!message) {
      throw new Error('Message is required');
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

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`AI Chat request from user: ${user.id}`);

    // Step 1: Generate embedding for user message
    console.log('Generating embedding...');
    const embedding = await generateEmbedding(message);

    // Step 2: Search knowledge base
    console.log('Searching knowledge base...');
    const knowledgeMatches = await searchKnowledge(supabase, embedding, 0.7, 5);
    console.log(`Found ${knowledgeMatches.length} relevant knowledge matches`);

    // Step 3: Get conversation history if continuing existing conversation
    let conversationHistory: Message[] = [];
    if (conversationId) {
      const { data } = await supabase
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();

      conversationHistory = data?.messages || [];
    }

    // Step 4: Call Claude API
    console.log('Calling Claude API...');
    const assistantReply = await callClaude(message, knowledgeMatches, conversationHistory);

    // Step 5: Save conversation
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

    const updatedConversationId = await saveConversation(
      supabase,
      user.id,
      conversationId || null,
      newMessages
    );

    // Step 6: Return response
    return new Response(
      JSON.stringify({
        reply: assistantReply,
        conversationId: updatedConversationId,
        context: knowledgeMatches.map((m) => ({
          source: m.metadata.source,
          similarity: m.similarity,
        })),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI Chat error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred',
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
 * 1. Set environment variables:
 *    npx supabase secrets set OPENAI_API_KEY=sk-...
 *    npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *
 * 2. Deploy function:
 *    npx supabase functions deploy ai-chat
 *
 * 3. Test locally:
 *    npx supabase functions serve ai-chat
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/ai-chat' \
 *      --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
 *      --header 'Content-Type: application/json' \
 *      --data '{"message":"What is manifestation?"}'
 *
 * 4. Call from React Native:
 *    const { data, error } = await supabase.functions.invoke('ai-chat', {
 *      body: { message: 'What is manifestation?' }
 *    });
 */
