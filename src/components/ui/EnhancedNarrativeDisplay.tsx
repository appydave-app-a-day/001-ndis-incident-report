import { CheckCircle2, AlertCircle } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PhaseConsolidationStatus } from '@/components/ui/PhaseConsolidationStatus';
import { QADisplay } from '@/components/ui/QADisplay';
import type { ConsolidationStatus } from '@/store/useIncidentStore';

interface EnhancedNarrativeDisplayProps {
  phase: 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent';
  phaseLabel: string;
  originalNarrative: string;
  enhancedNarrative: string;
  consolidationStatus: ConsolidationStatus[keyof ConsolidationStatus];
  error?: string;
  onRetry?: () => void;
  className?: string;
}

// const PHASE_COLORS = {
//   beforeEvent: 'blue',
//   duringEvent: 'yellow', 
//   endEvent: 'orange',
//   postEvent: 'green',
// };

export const EnhancedNarrativeDisplay: React.FC<EnhancedNarrativeDisplayProps> = ({
  phase,
  phaseLabel,
  originalNarrative,
  enhancedNarrative,
  consolidationStatus,
  error,
  onRetry,
  className = '',
}) => {
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log(`EnhancedNarrativeDisplay - ${phase}:`, {
      consolidationStatus,
      enhancedNarrativeLength: enhancedNarrative?.length || 0,
      hasEnhancedNarrative: !!enhancedNarrative,
      originalNarrativeLength: originalNarrative?.length || 0,
      error,
    });
  }

  // Render enhanced narrative when consolidation is complete
  const shouldShowEnhanced = consolidationStatus === 'complete' && enhancedNarrative && enhancedNarrative.trim().length > 0;
  
  if (import.meta.env.DEV) {
    console.log(`${phase} render decision:`, {
      consolidationStatus,
      hasEnhancedNarrative: !!enhancedNarrative,
      enhancedLength: enhancedNarrative?.length || 0,
      shouldShowEnhanced,
    });
  }

  if (shouldShowEnhanced) {
    if (import.meta.env.DEV) {
      console.log(`Rendering ENHANCED view for ${phase}:`, enhancedNarrative.substring(0, 100) + '...');
    }
    return (
      <Card className={`enhanced-narrative-display ${className} mb-6`}>
        <CardHeader className="p-0">
          <div className="phase-heading">
            <div className="phase-heading-left">
              <h3 className="phase-heading-text">{phaseLabel}</h3>
            </div>
            <div className="phase-heading-status enhanced">
              <CheckCircle2 className="h-4 w-4" />
              <span>Enhanced</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="card-content-padded">
          {/* Original Narrative - Show at top */}
          {originalNarrative && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Original Entry
              </h4>
              <p className="text-gray-800 text-base leading-relaxed bg-gray-50 p-4 rounded-md border-l-4 border-gray-300">
                {originalNarrative}
              </p>
            </div>
          )}

          {/* Enhanced Narrative - Primary Display */}
          <div>
            <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">
              Enhanced Professional Narrative
            </h4>
            <QADisplay text={enhancedNarrative} />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render original narrative with status when consolidation failed/pending
  if (import.meta.env.DEV) {
    console.log(`Rendering FALLBACK view for ${phase} - Status: ${consolidationStatus}`);
  }
  return (
    <Card className={`enhanced-narrative-display ${className} mb-6`}>
      <CardHeader className="p-0">
        <div className="phase-heading">
          <div className="phase-heading-left">
            <h3 className="phase-heading-text">{phaseLabel}</h3>
          </div>
          <div className="phase-heading-status">
            {consolidationStatus === 'error' ? (
              <div className="flex items-center space-x-2 phase-heading-status error">
                <AlertCircle className="h-4 w-4" />
                <span>Enhancement Failed</span>
              </div>
            ) : consolidationStatus === 'loading' ? (
              <PhaseConsolidationStatus
                phase={phase}
                status={consolidationStatus}
                error={error}
                onRetry={onRetry}
              />
            ) : (
              <span className="text-sm text-gray-500">Not enhanced</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="card-content-padded">
        {/* Fallback to original narrative */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Original Narrative
            </h4>
            {consolidationStatus === 'error' && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-6 px-2 text-xs text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                Retry Enhancement
              </Button>
            )}
          </div>
          <p className="text-gray-800 leading-relaxed text-base bg-gray-50 p-4 rounded-md border-l-4 border-gray-300">
            {originalNarrative || 'No narrative provided for this phase.'}
          </p>
          
          {consolidationStatus === 'error' && error && (
            <div className="mt-3 text-xs text-red-600">
              Error: {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};