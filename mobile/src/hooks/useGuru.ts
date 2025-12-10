/**
 * useGuru Hook
 *
 * Manages phase-based analysis conversations with the AI Guru.
 * Handles subscription checking, phase selection, and message sending.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { getAllWorkbookProgress } from '../services/workbook';
import { guruService } from '../services';
import { supabase } from '../services/supabase';
import type { GuruMessage } from '../types/guru';

export interface UseGuruReturn {
  // Subscription check
  hasAccess: boolean;
  subscriptionTier: string;

  // Phase data
  completedPhases: number[];
  isLoadingPhases: boolean;

  // Conversation state
  selectedPhase: number | null;
  messages: GuruMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: Error | null;

  // Actions
  selectPhase: (phaseNumber: number) => void;
  clearSelectedPhase: () => void;
  sendMessage: (message: string) => Promise<void>;
  startNewConversation: () => void;
}

/**
 * Main Guru Hook
 */
export function useGuru(): UseGuruReturn {
  const queryClient = useQueryClient();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  // Get subscription tier
  const tier = useSubscriptionStore((state) => state.tier);
  const hasAccess = tier === 'enlightenment';

  // Get current user ID
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    fetchUser();
  }, []);

  // Query for completed phases
  const {
    data: workbookProgress,
    isLoading: isLoadingPhases,
  } = useQuery({
    queryKey: ['workbook-progress', userId],
    queryFn: () => getAllWorkbookProgress(userId!),
    enabled: !!userId && hasAccess,
  });

  // Calculate completed phases
  const completedPhases = useMemo(() => {
    if (!workbookProgress) return [];

    const phaseMap = new Map<number, { completed: number; total: number }>();

    // Total worksheets per phase
    const totalPerPhase: Record<number, number> = {
      1: 4, 2: 3, 3: 3, 4: 3, 5: 3,
      6: 3, 7: 3, 8: 3, 9: 3, 10: 3,
    };

    // Count completed worksheets per phase
    workbookProgress.forEach((progress) => {
      const phaseNum = progress.phase_number;
      if (!phaseMap.has(phaseNum)) {
        phaseMap.set(phaseNum, {
          completed: 0,
          total: totalPerPhase[phaseNum] || 3,
        });
      }

      const phaseData = phaseMap.get(phaseNum)!;
      if (progress.completed) {
        phaseData.completed++;
      }
    });

    // Return phases that are 100% complete
    const completed: number[] = [];
    phaseMap.forEach((data, phaseNum) => {
      if (data.completed >= data.total) {
        completed.push(phaseNum);
      }
    });

    return completed.sort((a, b) => a - b);
  }, [workbookProgress]);

  // Query for current conversation
  const {
    data: conversation,
    isLoading: isLoadingConversation,
    error: conversationError,
  } = useQuery({
    queryKey: ['guru-conversation', userId, selectedPhase],
    queryFn: () => guruService.getGuruConversation(userId!, selectedPhase!),
    enabled: !!userId && !!selectedPhase && hasAccess,
  });

  // Extract messages
  const messages = conversation?.messages || [];

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!userId || !selectedPhase) {
        throw new Error('User ID and phase must be selected');
      }

      // Get worksheet data for the selected phase
      const phaseWorksheets = workbookProgress?.filter(
        (p) => p.phase_number === selectedPhase && p.completed
      ) || [];

      const worksheetData = phaseWorksheets.map((w) => ({
        worksheet_id: w.worksheet_id,
        data: w.data,
        completed_at: w.completed_at,
      }));

      // Call Edge Function for AI analysis
      const response = await guruService.sendGuruMessage({
        conversationId: conversation?.id,
        phaseNumber: selectedPhase,
        userMessage: message,
        worksheetData,
      });

      return response;
    },
    onMutate: async (message: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['guru-conversation', userId, selectedPhase],
      });

      // Snapshot previous value
      const previousConversation = queryClient.getQueryData([
        'guru-conversation',
        userId,
        selectedPhase,
      ]);

      // Optimistically add user message
      if (conversation) {
        const optimisticMessage: GuruMessage = {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        };

        queryClient.setQueryData(
          ['guru-conversation', userId, selectedPhase],
          {
            ...conversation,
            messages: [...conversation.messages, optimisticMessage],
          }
        );
      }

      return { previousConversation };
    },
    onError: (_err, _message, context) => {
      // Rollback on error
      if (context?.previousConversation) {
        queryClient.setQueryData(
          ['guru-conversation', userId, selectedPhase],
          context.previousConversation
        );
      }
    },
    onSuccess: (data) => {
      // Update conversation with AI response
      queryClient.invalidateQueries({
        queryKey: ['guru-conversation', userId, selectedPhase],
      });
    },
  });

  // Action: Select phase
  const selectPhase = useCallback((phaseNumber: number) => {
    setSelectedPhase(phaseNumber);
  }, []);

  // Action: Clear phase selection
  const clearSelectedPhase = useCallback(() => {
    setSelectedPhase(null);
  }, []);

  // Action: Send message
  const sendMessage = useCallback(
    async (message: string) => {
      await sendMessageMutation.mutateAsync(message);
    },
    [sendMessageMutation]
  );

  // Action: Start new conversation
  const startNewConversation = useCallback(() => {
    if (!userId || !selectedPhase) return;

    // Clear current conversation from cache
    queryClient.removeQueries({
      queryKey: ['guru-conversation', userId, selectedPhase],
    });

    // Optionally delete from database
    guruService.deleteGuruConversation(userId, selectedPhase);
  }, [userId, selectedPhase, queryClient]);

  return {
    // Subscription
    hasAccess,
    subscriptionTier: tier,

    // Phase data
    completedPhases,
    isLoadingPhases,

    // Conversation state
    selectedPhase,
    messages,
    isLoading: isLoadingConversation,
    isSending: sendMessageMutation.isPending,
    error: conversationError || sendMessageMutation.error,

    // Actions
    selectPhase,
    clearSelectedPhase,
    sendMessage,
    startNewConversation,
  };
}
