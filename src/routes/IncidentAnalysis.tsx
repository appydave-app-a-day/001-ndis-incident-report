import { useEffect, useCallback, useRef, useState } from 'react';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Wizard } from '@/components/wizard';
import type { WizardStep } from '@/components/wizard';
import ReviewNarrativeStep from '@/features/analysis/components/ReviewNarrativeStep';
import { useAnalysisPrefetch } from '@/features/analysis/hooks/useAnalysisPrefetch';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useIncidentStore } from '@/store/useIncidentStore';

// Wizard step components
const Step1 = () => <ReviewNarrativeStep />;

// Placeholder components for future stories
const Step2 = () => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contributing Conditions</h2>
    <p className="text-gray-600">Story 5.2 - Review and edit contributing conditions (Coming Soon)</p>
  </div>
);

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
  
  // Local loading state for workflow entry
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [workflowLoadingMessage, setWorkflowLoadingMessage] = useState('');

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
        console.log('🚀 Starting workflow entry consolidation...');
      }

      // Show BOTH loading overlays to ensure visibility
      setIsWorkflowLoading(true);
      setWorkflowLoadingMessage('Loading analysis workflow... Consolidating incident narrative and preparing analysis data.');
      incidentStore.showLoadingOverlay('Loading analysis workflow... Consolidating incident narrative and preparing analysis data.');
      
      // Set the consolidated narrative in analysis store
      analysisStore.setConsolidatedNarrative(consolidatedNarrative);
      
      // Run the analysis prefetch
      await prefetchAnalysisData();
      
      if (import.meta.env.DEV) {
        console.log('✅ Workflow entry consolidation completed successfully');
      }
    } catch (error) {
      console.error('❌ Workflow entry consolidation failed:', error);
    } finally {
      // Hide BOTH loading overlays
      setIsWorkflowLoading(false);
      setWorkflowLoadingMessage('');
      incidentStore.hideLoadingOverlay();
    }
  }, [
    analysisStore,
    incidentStore,
    hasNarrativeContent,
    getConsolidatedNarrative,
    prefetchAnalysisData,
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
      // Note: Consolidation now happens on workflow entry, not on step leave
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
      
      {/* Workflow-specific Loading Overlay */}
      <LoadingOverlay
        isOpen={isWorkflowLoading}
        message={workflowLoadingMessage}
      />
    </div>
  );
}
