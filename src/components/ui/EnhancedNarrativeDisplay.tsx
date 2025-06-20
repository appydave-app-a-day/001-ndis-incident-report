import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PhaseConsolidationStatus } from '@/components/ui/PhaseConsolidationStatus';
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

const PHASE_ICONS = {
  beforeEvent: '🔵',
  duringEvent: '🟡', 
  endEvent: '🟠',
  postEvent: '🟢',
};

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
  const [showOriginal, setShowOriginal] = useState(false);
  const phaseIcon = PHASE_ICONS[phase];

  // Render enhanced narrative when consolidation is complete
  if (consolidationStatus === 'complete' && enhancedNarrative) {
    return (
      <Card className={`enhanced-narrative-display ${className} mb-6`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{phaseIcon}</span>
              <h3 className="text-lg font-semibold text-gray-900">{phaseLabel}</h3>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Enhanced</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Narrative - Primary Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium text-green-800">✨ Enhanced Professional Narrative</span>
            </div>
            <p className="text-gray-800 leading-relaxed text-base">
              {enhancedNarrative}
            </p>
          </div>

          {/* Toggle to show/hide original */}
          {originalNarrative && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
              >
                {showOriginal ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Original Narrative
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    View Original Narrative
                  </>
                )}
              </Button>
              
              {showOriginal && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Original Entry
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {originalNarrative}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render original narrative with status when consolidation failed/pending
  return (
    <Card className={`enhanced-narrative-display ${className} mb-6`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{phaseIcon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{phaseLabel}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {consolidationStatus === 'error' ? (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Enhancement Failed</span>
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
      <CardContent>
        {/* Fallback to original narrative */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-yellow-800">📝 Original Narrative</span>
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
          <p className="text-gray-800 leading-relaxed text-base">
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