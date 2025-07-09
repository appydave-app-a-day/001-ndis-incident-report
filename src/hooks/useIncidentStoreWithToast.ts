import { useCallback } from 'react';

import { useToastHelpers } from '@/components/ui/toast';
import { useIncidentStore } from '@/store/useIncidentStore';
import type { NarrativeExtras } from '@/store/useIncidentStore';

/**
 * Enhanced version of useIncidentStore that includes toast notifications for API errors
 */
export const useIncidentStoreWithToast = () => {
  const store = useIncidentStore();
  const toast = useToastHelpers();

  // Enhanced fetchClarificationQuestionsIfNeeded with toast notifications
  const fetchClarificationQuestionsIfNeeded = useCallback(async () => {
    try {
      await store.fetchClarificationQuestionsIfNeeded();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clarification questions';
      
      // Show appropriate toast based on error type
      if (errorMessage.includes('CORS')) {
        toast.corsError('N8N server');
      } else if (errorMessage.includes('Authentication failed')) {
        toast.error('Authentication Error', 'Please check your API key configuration');
      } else if (errorMessage.includes('timeout')) {
        toast.warning('Request Timeout', 'The server is taking too long to respond');
      } else {
        toast.apiError('clarification questions endpoint', errorMessage);
      }
      
      throw error; // Re-throw so calling code can handle it
    }
  }, [store, toast]);

  // Enhanced consolidatePhaseNarrative with toast notifications
  const consolidatePhaseNarrative = useCallback(async (phase: keyof NarrativeExtras, skipCache?: boolean) => {
    try {
      await store.consolidatePhaseNarrative(phase, skipCache);
      
      // Show success toast
      toast.success('Narrative Enhanced', `${phase} narrative has been successfully enhanced`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enhance narrative';
      
      // Show appropriate toast based on error type
      if (errorMessage.includes('CORS')) {
        toast.corsError('N8N server');
      } else if (errorMessage.includes('Authentication failed')) {
        toast.error('Authentication Error', 'Please check your API key configuration');
      } else if (errorMessage.includes('timeout')) {
        toast.warning('Request Timeout', 'The server is taking too long to respond');
      } else {
        toast.apiError('narrative enhancement endpoint', errorMessage);
      }
      
      throw error; // Re-throw so calling code can handle it
    }
  }, [store, toast]);

  // Enhanced populateQuestionAnswers with toast notifications
  const populateQuestionAnswers = useCallback(async (phase?: keyof NarrativeExtras) => {
    try {
      await store.populateQuestionAnswers(phase);
      toast.success('Mock Answers Generated', 'Question answers have been populated with test data');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate mock answers';
      toast.apiError('mock answers endpoint', errorMessage);
      throw error;
    }
  }, [store, toast]);

  // Return the store with enhanced methods
  return {
    ...store,
    fetchClarificationQuestionsIfNeeded,
    consolidatePhaseNarrative,
    populateQuestionAnswers,
  };
};

export default useIncidentStoreWithToast;