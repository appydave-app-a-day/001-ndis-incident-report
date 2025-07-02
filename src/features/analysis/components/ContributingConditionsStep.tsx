import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useAnalysisStore } from '@/store/useAnalysisStore';

import { useAnalysisPrefetch } from '../hooks/useAnalysisPrefetch';

import ConditionsEditor from './ConditionsEditor';

/**
 * Second step of the analysis wizard
 * Allows team leads to review and edit AI-generated contributing conditions
 */
export const ContributingConditionsStep: React.FC = () => {
  const analysisStore = useAnalysisStore();
  const { retryFailedPrefetch } = useAnalysisPrefetch();
  const [isRetrying, setIsRetrying] = useState(false);

  const {
    analysisReport,
    prefetchStatus,
    prefetchErrors,
  } = analysisStore;

  const conditionsStatus = prefetchStatus.conditions;
  const conditionsError = prefetchErrors.conditions;
  const currentConditions = analysisReport.contributing_conditions;

  // Handle retry of failed prefetch
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryFailedPrefetch();
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto-save conditions when they change
  const handleConditionsChange = (newConditions: string) => {
    analysisStore.updateContributingConditions(newConditions);
  };

  // Determine if we should show the editor
  const shouldShowEditor = conditionsStatus === 'success' || 
                          conditionsStatus === 'error' || 
                          (conditionsStatus === 'idle' && currentConditions) ||
                          conditionsStatus === 'loading';

  return (
    <div>
      <StepHeader
        stepNumber={2}
        title="Step 2: Review Contributing Conditions"
        subtitle="Review and edit the AI-generated analysis of contributing conditions. Make any necessary adjustments to ensure accuracy and completeness."
      />
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Loading State */}
          {conditionsStatus === 'loading' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3 py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <div className="text-center">
                    <div className="font-medium text-gray-900">
                      Analyzing Contributing Conditions
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      AI is analyzing the incident narrative to identify contributing factors...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {conditionsStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Analysis Failed</div>
                  <AlertDescription className="mt-2">
                    {conditionsError || 'Failed to analyze contributing conditions. You can retry the analysis or proceed with manual entry.'}
                  </AlertDescription>
                </div>
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  size="sm"
                  variant="outline"
                  className="ml-4 flex-shrink-0"
                >
                  {isRetrying ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Retry Analysis
                </Button>
              </div>
            </Alert>
          )}

          {/* Success State */}
          {conditionsStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="font-medium">Analysis Complete</div>
              <AlertDescription className="mt-2">
                AI analysis has been completed successfully. Review the contributing conditions below and make any necessary edits.
              </AlertDescription>
            </Alert>
          )}

          {/* Editor Component */}
          {shouldShowEditor && (
            <Card>
              <CardContent className="p-6">
                <ConditionsEditor
                  value={currentConditions}
                  onChange={handleConditionsChange}
                  placeholder={
                    conditionsStatus === 'error' 
                      ? "Analysis failed. Please manually enter the contributing conditions for this incident..."
                      : "AI analysis is loading. You can start entering contributing conditions manually if needed..."
                  }
                  disabled={conditionsStatus === 'loading'}
                />
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Alert className="border-accent/20 bg-accent/10 text-primary">
            <div className="font-medium">Editing Guidelines</div>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Review the AI-generated contributing conditions for accuracy and completeness</li>
                <li>Add any missing factors that may have contributed to the incident</li>
                <li>Remove or modify any conditions that don't apply to this situation</li>
                <li>Ensure the analysis is clear and actionable for follow-up actions</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Debug Info in Development */}
          {import.meta.env.DEV && (
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <div className="font-mono space-y-1">
                <div>Status: {conditionsStatus}</div>
                <div>Content Length: {currentConditions.length} chars</div>
                <div>Has Error: {conditionsError ? 'Yes' : 'No'}</div>
                {conditionsError && (
                  <div className="text-red-600">Error: {conditionsError}</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ContributingConditionsStep;