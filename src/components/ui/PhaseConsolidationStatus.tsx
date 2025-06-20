import { CheckCircle2, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import type { ConsolidationStatus } from '@/store/useIncidentStore';

interface PhaseConsolidationStatusProps {
  phase: 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent';
  status: ConsolidationStatus[keyof ConsolidationStatus];
  error?: string;
  onRetry?: () => void;
  className?: string;
}

const PHASE_LABELS = {
  beforeEvent: 'Before Event',
  duringEvent: 'During Event', 
  endEvent: 'End Event',
  postEvent: 'Post Event',
};

export const PhaseConsolidationStatus: React.FC<PhaseConsolidationStatusProps> = ({
  phase,
  status,
  error,
  onRetry,
  className = '',
}) => {
  const phaseLabel = PHASE_LABELS[phase];

  const renderStatusIndicator = () => {
    switch (status) {
      case 'pending':
        return null; // Don't show anything for pending state

      case 'loading':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Enhancing {phaseLabel}...</span>
          </div>
        );

      case 'complete':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">✓ {phaseLabel} enhanced</span>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">❌ {phaseLabel} enhancement failed</span>
              {error && (
                <span className="text-xs text-red-500">{error}</span>
              )}
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="h-6 px-2 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const statusIndicator = renderStatusIndicator();
  
  if (!statusIndicator) {
    return null;
  }

  return (
    <div className={`phase-consolidation-status ${className}`}>
      {statusIndicator}
    </div>
  );
};