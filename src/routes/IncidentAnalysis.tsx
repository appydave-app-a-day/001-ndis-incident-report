import { useEffect, useCallback, useRef } from 'react';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Wizard } from '@/components/wizard';
import type { WizardStep } from '@/components/wizard';
import ContributingConditionsStep from '@/features/analysis/components/ContributingConditionsStep';
import ReviewNarrativeStep from '@/features/analysis/components/ReviewNarrativeStep';
import { useAnalysisPrefetch } from '@/features/analysis/hooks/useAnalysisPrefetch';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useIncidentStore } from '@/store/useIncidentStore';

// Wizard step components
const Step1 = () => <ReviewNarrativeStep />;
const Step2 = () => <ContributingConditionsStep />;

const Step3 = () => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Incident Classifications</h2>
    <p className="text-gray-600">Story 5.3 - Curate incident type classifications (Coming Soon)</p>
  </div>
);

const Step4 = () => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Review and Complete</h2>
    <p className="text-gray-600">Story 5.4 - Review and complete analysis (Coming Soon)</p>
  </div>
);

export default function IncidentAnalysis() {
  const analysisStore = useAnalysisStore();
  const incidentStore = useIncidentStore();
  const { prefetchAnalysisData, getConsolidatedNarrative } = useAnalysisPrefetch();
  const hasRunConsolidation = useRef(false);
  

  // Check if we have narrative content available for analysis
  const hasNarrativeContent = useCallback(() => {
    const { narrative, narrativeExtras } = incidentStore.report;
    return !!(
      narrative.beforeEvent.trim() ||
      narrative.duringEvent.trim() ||
      narrative.endEvent.trim() ||
      narrative.postEvent.trim() ||
      narrativeExtras.beforeEvent.trim() ||
      narrativeExtras.duringEvent.trim() ||
      narrativeExtras.endEvent.trim() ||
      narrativeExtras.postEvent.trim()
    );
  }, [incidentStore.report]);

  // Handle workflow entry consolidation - runs when component first mounts
  const handleWorkflowEntryConsolidation = useCallback(async () => {
    // Prevent multiple runs
    if (hasRunConsolidation.current) {
      return;
    }
    hasRunConsolidation.current = true;

    // Check if we already have consolidated narrative in analysis store
    const existingNarrative = analysisStore.getConsolidatedNarrative();
    
    if (existingNarrative.trim()) {
      // Already have consolidated narrative, no need to consolidate again
      if (import.meta.env.DEV) {
        console.log('✅ Using existing consolidated narrative');
      }
      return;
    }

    // Check if we have source narrative content to consolidate
    if (!hasNarrativeContent()) {
      if (import.meta.env.DEV) {
        console.log('⚠️ No narrative content available for consolidation');
      }
      return;
    }

    // We need to consolidate narrative - show modal and do the work
    const consolidatedNarrative = getConsolidatedNarrative();
    
    if (!consolidatedNarrative.trim()) {
      console.warn('No narrative content available for analysis');
      return;
    }

    try {
      if (import.meta.env.DEV) {
        console.log('🚀 Starting workflow entry consolidation (narrative only)...');
      }

      // Set the consolidated narrative in analysis store
      // Note: Prefetch will happen when user clicks "Next" from Step 1
      analysisStore.setConsolidatedNarrative(consolidatedNarrative);
      
      if (import.meta.env.DEV) {
        console.log('✅ Workflow entry consolidation completed - narrative ready for Step 1');
      }
    } catch (error) {
      console.error('❌ Workflow entry consolidation failed:', error);
    }
  }, [
    analysisStore,
    hasNarrativeContent,
    getConsolidatedNarrative,
  ]);

  // Run consolidation on component mount
  useEffect(() => {
    handleWorkflowEntryConsolidation();
  }, [handleWorkflowEntryConsolidation]);

  const steps: WizardStep[] = [
    {
      id: 'review-narrative',
      title: 'Review Narrative',
      component: Step1,
      isValid: hasNarrativeContent,
      onLeave: async () => {
        // Trigger prefetch when user clicks "Next" from Step 1
        if (import.meta.env.DEV) {
          console.log('🚀 Step 1 onLeave: Triggering analysis prefetch...');
        }
        
        // Show loading overlay during prefetch
        incidentStore.showLoadingOverlay('Analysing incident narrative and preparing contributing conditions...');
        
        try {
          await prefetchAnalysisData();
        } finally {
          // Hide loading overlay
          incidentStore.hideLoadingOverlay();
        }
      },
    },
    {
      id: 'contributing-conditions',
      title: 'Contributing Conditions',
      component: Step2,
      isValid: () => analysisStore.isReadyForConditionsStep(),
    },
    {
      id: 'incident-classifications',
      title: 'Incident Classifications',
      component: Step3,
      isValid: () => analysisStore.isReadyForClassificationsStep(),
    },
    {
      id: 'review-complete',
      title: 'Review & Complete',
      component: Step4,
    },
  ];

  const handleComplete = () => {
    analysisStore.markAnalysisComplete();
    alert('Incident analysis completed successfully!');
  };

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='wizard-container flex flex-col'>
          <Wizard steps={steps} onComplete={handleComplete} />
        </div>
      </div>
      
      {/* Global Loading Overlay (from incident store) */}
      <LoadingOverlay
        isOpen={incidentStore.loadingOverlay.isOpen}
        message={incidentStore.loadingOverlay.message}
      />
    </div>
  );
}
