import { useCallback } from 'react';

import { incidentAPI } from '@/lib/services/incident-api';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useIncidentStore } from '@/store/useIncidentStore';

/**
 * Custom hook for managing analysis data prefetching
 * 
 * Provides methods to prefetch contributing conditions and incident classifications
 * in the background after the user reviews the consolidated narrative.
 * 
 * Features:
 * - Parallel prefetch of analysis data
 * - Non-blocking UI operations
 * - Error handling and retry logic
 * - Status tracking for loading states
 */
export const useAnalysisPrefetch = () => {
  const analysisStore = useAnalysisStore();
  const incidentStore = useIncidentStore();

  /**
   * Get consolidated narrative from incident store
   */
  const getConsolidatedNarrative = useCallback((): string => {
    const { report } = incidentStore;
    const { narrative, narrativeExtras } = report;

    // Combine original narrative with enhanced extras
    const sections = [
      narrativeExtras.beforeEvent || narrative.beforeEvent,
      narrativeExtras.duringEvent || narrative.duringEvent,
      narrativeExtras.endEvent || narrative.endEvent,
      narrativeExtras.postEvent || narrative.postEvent,
    ].filter(section => section.trim() !== '');

    return sections.join('\n\n');
  }, [incidentStore]);

  /**
   * Get metadata for API requests
   */
  const getMetadata = useCallback(() => {
    const { report } = incidentStore;
    return {
      participantName: report.metadata.participantName,
      reporterName: report.metadata.reporterName,
      location: report.metadata.location,
      incidentDate: report.metadata.eventDateTime,
    };
  }, [incidentStore]);

  /**
   * Prefetch contributing conditions analysis
   */
  const prefetchContributingConditions = useCallback(async (): Promise<void> => {
    try {
      analysisStore.setPrefetchStatus('conditions', 'loading');
      analysisStore.setPrefetchError('conditions', undefined);

      const consolidatedNarrative = getConsolidatedNarrative();
      const metadata = getMetadata();

      if (!consolidatedNarrative.trim()) {
        throw new Error('No narrative content available for analysis');
      }

      // Make API call for analysis
      const analysisResult = await incidentAPI.generateIncidentAnalysis(
        consolidatedNarrative,
        metadata
      );

      // Store the contributing conditions
      analysisStore.updateContributingConditions(analysisResult.contributingConditions);
      analysisStore.setPrefetchStatus('conditions', 'success');

      if (import.meta.env.DEV) {
        console.log('✅ Contributing conditions prefetch completed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      analysisStore.setPrefetchError('conditions', errorMessage);
      analysisStore.setPrefetchStatus('conditions', 'error');

      if (import.meta.env.DEV) {
        console.error('❌ Contributing conditions prefetch failed:', errorMessage);
      }
    }
  }, [analysisStore, getConsolidatedNarrative, getMetadata]);

  /**
   * Prefetch incident classifications analysis
   */
  const prefetchIncidentClassifications = useCallback(async (): Promise<void> => {
    try {
      analysisStore.setPrefetchStatus('classifications', 'loading');
      analysisStore.setPrefetchError('classifications', undefined);

      const consolidatedNarrative = getConsolidatedNarrative();
      const metadata = getMetadata();

      if (!consolidatedNarrative.trim()) {
        throw new Error('No narrative content available for analysis');
      }

      // Make API call for analysis
      const analysisResult = await incidentAPI.generateIncidentAnalysis(
        consolidatedNarrative,
        metadata
      );

      // Store the classifications
      analysisStore.setClassifications(analysisResult.classifications);
      analysisStore.setPrefetchStatus('classifications', 'success');

      if (import.meta.env.DEV) {
        console.log('✅ Incident classifications prefetch completed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      analysisStore.setPrefetchError('classifications', errorMessage);
      analysisStore.setPrefetchStatus('classifications', 'error');

      if (import.meta.env.DEV) {
        console.error('❌ Incident classifications prefetch failed:', errorMessage);
      }
    }
  }, [analysisStore, getConsolidatedNarrative, getMetadata]);

  /**
   * Prefetch both contributing conditions and classifications in parallel
   * This is the main method called when user navigates from narrative review
   */
  const prefetchAnalysisData = useCallback(async (): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        console.log('🚀 Starting parallel analysis prefetch...');
      }

      // Set consolidated narrative in analysis store
      const consolidatedNarrative = getConsolidatedNarrative();
      analysisStore.setConsolidatedNarrative(consolidatedNarrative);

      // Run both prefetch operations in parallel
      await Promise.allSettled([
        prefetchContributingConditions(),
        prefetchIncidentClassifications(),
      ]);

      if (import.meta.env.DEV) {
        console.log('🎉 Parallel analysis prefetch completed');
      }
    } catch (error) {
      // Individual errors are handled in the specific prefetch methods
      if (import.meta.env.DEV) {
        console.error('💥 Analysis prefetch coordination error:', error);
      }
    }
  }, [
    analysisStore,
    getConsolidatedNarrative,
    prefetchContributingConditions,
    prefetchIncidentClassifications,
  ]);

  /**
   * Retry failed prefetch operations
   */
  const retryFailedPrefetch = useCallback(async (): Promise<void> => {
    const { prefetchStatus } = analysisStore;

    const retryPromises: Promise<void>[] = [];

    if (prefetchStatus.conditions === 'error') {
      retryPromises.push(prefetchContributingConditions());
    }

    if (prefetchStatus.classifications === 'error') {
      retryPromises.push(prefetchIncidentClassifications());
    }

    if (retryPromises.length > 0) {
      await Promise.allSettled(retryPromises);
    }
  }, [analysisStore, prefetchContributingConditions, prefetchIncidentClassifications]);

  /**
   * Check if analysis data is ready for use
   */
  const isAnalysisDataReady = useCallback((): boolean => {
    const { prefetchStatus } = analysisStore;
    return (
      (prefetchStatus.conditions === 'success' || prefetchStatus.conditions === 'error') &&
      (prefetchStatus.classifications === 'success' || prefetchStatus.classifications === 'error')
    );
  }, [analysisStore]);

  /**
   * Check if any prefetch operations are currently loading
   */
  const isPrefetchLoading = useCallback((): boolean => {
    const { prefetchStatus } = analysisStore;
    return prefetchStatus.conditions === 'loading' || prefetchStatus.classifications === 'loading';
  }, [analysisStore]);

  /**
   * Clear all prefetch errors
   */
  const clearPrefetchErrors = useCallback(() => {
    analysisStore.clearPrefetchErrors();
  }, [analysisStore]);

  return {
    // Main prefetch operations
    prefetchAnalysisData,
    prefetchContributingConditions,
    prefetchIncidentClassifications,
    
    // Utility operations
    retryFailedPrefetch,
    clearPrefetchErrors,
    
    // Status checks
    isAnalysisDataReady,
    isPrefetchLoading,
    
    // Data getters
    getConsolidatedNarrative,
    getMetadata,
  };
};