/**
 * Guru Service
 *
 * Manages phase-based analysis conversations with the AI Guru.
 * Handles conversation storage and AI analysis requests.
 */

import { supabase } from './supabase';
import type {
  GuruConversation,
  GuruConversationInsert,
  GuruMessage,
  GuruAnalysisRequest,
  GuruAnalysisResponse,
  CompletedPhase,
} from '../types/guru';
import type { WorkbookProgress } from '../types/workbook';
import { WORKSHEETS_PER_PHASE } from '../types/workbook';
import { getAllWorkbookProgress } from './workbook';

/**
 * Get conversation for a specific phase
 */
export const getGuruConversation = async (
  userId: string,
  phaseNumber: number
): Promise<GuruConversation | null> => {
  const { data, error } = await supabase
    .from('guru_conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber)
    .single();

  // PGRST116 means no rows found - this is OK for first conversation
  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data as GuruConversation | null;
};

/**
 * Get all conversations for a user
 */
export const getAllGuruConversations = async (
  userId: string
): Promise<GuruConversation[]> => {
  const { data, error } = await supabase
    .from('guru_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('phase_number', { ascending: true });

  if (error) throw error;
  return (data as GuruConversation[]) || [];
};

/**
 * Create or update conversation
 */
export const upsertGuruConversation = async (
  userId: string,
  phaseNumber: number,
  messages: GuruMessage[]
): Promise<GuruConversation> => {
  const payload: GuruConversationInsert = {
    user_id: userId,
    phase_number: phaseNumber,
    messages,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('guru_conversations')
    .upsert(payload as any, {
      onConflict: 'user_id,phase_number',
    })
    .select()
    .single();

  if (error) throw error;
  return data as GuruConversation;
};

/**
 * Send message for AI analysis
 * Calls Supabase Edge Function to get Guru response
 */
export const sendGuruMessage = async (
  request: GuruAnalysisRequest
): Promise<GuruAnalysisResponse> => {
  const { data, error } = await supabase.functions.invoke('guru-analyze', {
    body: request,
  });

  if (error) throw error;
  return data as GuruAnalysisResponse;
};

/**
 * Delete conversation for a phase
 */
export const deleteGuruConversation = async (
  userId: string,
  phaseNumber: number
): Promise<void> => {
  const { error } = await supabase
    .from('guru_conversations')
    .delete()
    .eq('user_id', userId)
    .eq('phase_number', phaseNumber);

  if (error) throw error;
};

/**
 * Reset all Guru conversations for a user
 */
export const resetAllGuruConversations = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('guru_conversations')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

/**
 * Get Completed Phases
 * Returns list of phases that are 100% complete
 */
export const getCompletedPhases = async (userId: string): Promise<CompletedPhase[]> => {
  try {
    // Get all workbook progress
    const allProgress = await getAllWorkbookProgress(userId);

    // Group by phase
    const phaseMap = new Map<number, WorkbookProgress[]>();
    allProgress.forEach((worksheet) => {
      const existing = phaseMap.get(worksheet.phase_number) || [];
      phaseMap.set(worksheet.phase_number, [...existing, worksheet]);
    });

    // Check which phases are 100% complete
    const completedPhases: CompletedPhase[] = [];

    for (const [phaseNumber, worksheets] of phaseMap.entries()) {
      const expectedCount = WORKSHEETS_PER_PHASE[phaseNumber];
      const completedCount = worksheets.filter((w) => w.completed).length;

      // Phase is complete if all worksheets are completed
      if (expectedCount && completedCount === expectedCount) {
        // Find the most recent completion date
        const completionDates = worksheets
          .filter((w) => w.completed_at)
          .map((w) => new Date(w.completed_at!).getTime());

        const latestCompletion = Math.max(...completionDates);

        completedPhases.push({
          phaseNumber,
          phaseName: getPhaseNameByNumber(phaseNumber),
          completedAt: new Date(latestCompletion).toISOString(),
          worksheetCount: worksheets.length,
        });
      }
    }

    // Sort by phase number
    return completedPhases.sort((a, b) => a.phaseNumber - b.phaseNumber);
  } catch (error) {
    console.error('[guruService] Error getting completed phases:', error);
    throw error;
  }
};

/**
 * Get Phase Data for Analysis
 * Retrieves all worksheet data for a specific phase
 */
export const getPhaseDataForAnalysis = async (
  userId: string,
  phaseNumber: number
): Promise<WorkbookProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('workbook_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('phase_number', phaseNumber)
      .order('worksheet_id', { ascending: true });

    if (error) throw error;

    return (data as WorkbookProgress[]) || [];
  } catch (error) {
    console.error(
      '[guruService] Error getting phase data for analysis:',
      error
    );
    throw error;
  }
};

/**
 * Format Phase for AI Prompt
 * Converts worksheet data into a token-optimized string for AI analysis
 */
export const formatPhaseForPrompt = (
  phaseData: WorkbookProgress[]
): string => {
  if (!phaseData || phaseData.length === 0) {
    return 'No worksheet data available for this phase.';
  }

  const sections: string[] = [];

  phaseData.forEach((worksheet) => {
    const worksheetId = worksheet.worksheet_id;
    const data = worksheet.data;

    // Add worksheet header
    sections.push(`\n### ${formatWorksheetName(worksheetId)}`);

    // Format data based on structure
    const formattedData = formatWorksheetData(data);
    sections.push(formattedData);
  });

  return sections.join('\n');
};

/**
 * Helper: Format worksheet name from ID
 */
function formatWorksheetName(worksheetId: string): string {
  return worksheetId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper: Format worksheet data for readability
 */
function formatWorksheetData(data: Record<string, unknown>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    if (Array.isArray(value)) {
      lines.push(`${formattedKey}:`);
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          lines.push(`  ${index + 1}. ${JSON.stringify(item)}`);
        } else {
          lines.push(`  ${index + 1}. ${item}`);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${formattedKey}: ${JSON.stringify(value, null, 2)}`);
    } else {
      lines.push(`${formattedKey}: ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Helper: Get phase name by number
 */
function getPhaseNameByNumber(phaseNumber: number): string {
  const phaseNames: Record<number, string> = {
    1: 'Self-Evaluation',
    2: 'Values & Vision',
    3: 'Goal Setting',
    4: 'Facing Fears & Limiting Beliefs',
    5: 'Cultivating Self-Love & Self-Care',
    6: 'Manifestation Techniques',
    7: 'Practicing Gratitude',
    8: 'Turning Envy Into Inspiration',
    9: 'Trust & Surrender',
    10: 'Trust & Letting Go',
  };

  return phaseNames[phaseNumber] || `Phase ${phaseNumber}`;
}
