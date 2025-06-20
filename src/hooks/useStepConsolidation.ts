import { useEffect, useRef } from 'react';

import { useIncidentStore } from '@/store/useIncidentStore';

/**
 * Hook to handle automatic narrative consolidation when leaving a clarification step
 */
export const useStepConsolidation = (
  phase: 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent'
) => {
  const { 
    report, 
    consolidationStatus,
    consolidatePhaseNarrative 
  } = useIncidentStore();
  
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Cleanup function to trigger consolidation when component unmounts (user navigates away)
    return () => {
      const phaseAnswers = report.clarificationAnswers[phase];
      const currentStatus = consolidationStatus[phase];
      
      // Only trigger if:
      // 1. We haven't already triggered consolidation for this phase
      // 2. There are clarification answers for this phase
      // 3. The phase isn't already loading, complete, or error
      if (
        !hasTriggeredRef.current &&
        phaseAnswers.length > 0 &&
        currentStatus === 'pending'
      ) {
        hasTriggeredRef.current = true;
        
        // Trigger consolidation asynchronously to not block navigation
        setTimeout(() => {
          consolidatePhaseNarrative(phase);
        }, 100);
      }
    };
  }, [phase, report.clarificationAnswers, consolidationStatus, consolidatePhaseNarrative]);

  // Reset trigger flag when phase status changes to pending (e.g., after reset)
  useEffect(() => {
    if (consolidationStatus[phase] === 'pending') {
      hasTriggeredRef.current = false;
    }
  }, [consolidationStatus, phase]);
};