import { AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useAnalysisStore } from '@/store/useAnalysisStore';

import { useAnalysisPrefetch } from '../hooks/useAnalysisPrefetch';

import NarrativeDisplay from './NarrativeDisplay';



// No props needed - navigation is handled by the Wizard component

/**
 * First step of the analysis wizard
 * Displays the consolidated narrative and triggers prefetch of analysis data
 */
export const ReviewNarrativeStep: React.FC = () => {
  const analysisStore = useAnalysisStore();
  const { getConsolidatedNarrative } = useAnalysisPrefetch();

  const consolidatedNarrative = getConsolidatedNarrative();

  // Automatically set the consolidated narrative when component mounts
  useEffect(() => {
    if (consolidatedNarrative && !analysisStore.analysisReport.consolidated_narrative) {
      analysisStore.setConsolidatedNarrative(consolidatedNarrative);
    }
  }, [consolidatedNarrative, analysisStore]);

  // Check if we have any narrative content
  const hasNarrativeContent = consolidatedNarrative.trim().length > 0;

  return (
    <div>
      <StepHeader
        stepNumber={1}
        title="Step 1: Review Consolidated Narrative"
        subtitle="Review the complete incident narrative before beginning your analysis. The Next button will begin background preparation of analysis data."
      />
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">

              {/* Content Warning */}
              {!hasNarrativeContent && (
                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <div className="font-medium">No Narrative Content</div>
                  <AlertDescription className="mt-2">
                    No consolidated narrative is available. Please complete the incident capture workflow first.
                  </AlertDescription>
                </Alert>
              )}

              {/* Narrative Display */}
              {hasNarrativeContent && (
                <NarrativeDisplay
                  title="Consolidated Incident Narrative"
                  content={consolidatedNarrative}
                  className="min-h-[300px]"
                />
              )}

              {/* Instructions */}
              {hasNarrativeContent && (
                <Alert className="border-accent/20 bg-accent/10 text-primary">
                  <div className="font-medium">Ready for Analysis</div>
                  <AlertDescription className="mt-2">
                    Click "Next" to begin the AI-assisted analysis process. This will analyze the narrative and prepare contributing conditions and incident classifications.
                  </AlertDescription>
                </Alert>
              )}

              {/* Debug Info in Development */}
              {import.meta.env.DEV && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <div className="font-mono">
                    <div>Narrative Length: {consolidatedNarrative.length} chars</div>
                    <div>Has Content: {hasNarrativeContent ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewNarrativeStep;