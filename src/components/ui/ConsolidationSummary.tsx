import { CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ConsolidationStatus } from '@/store/useIncidentStore';

interface ConsolidationSummaryProps {
  consolidationStatus: ConsolidationStatus;
  className?: string;
}

export const ConsolidationSummary: React.FC<ConsolidationSummaryProps> = ({
  consolidationStatus,
  className = '',
}) => {
  // Calculate summary statistics
  const phases = ['beforeEvent', 'duringEvent', 'endEvent', 'postEvent'] as const;
  const statusCounts = phases.reduce((counts, phase) => {
    const status = consolidationStatus[phase];
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const completedCount = statusCounts.complete || 0;
  const loadingCount = statusCounts.loading || 0;
  const errorCount = statusCounts.error || 0;
  const pendingCount = statusCounts.pending || 0;
  const totalPhases = phases.length;

  // Determine overall status and message
  const getOverallStatus = () => {
    if (completedCount === totalPhases) {
      return {
        type: 'success' as const,
        icon: <Sparkles className="h-5 w-5 text-green-600" />,
        title: 'All Narratives Enhanced',
        message: `All ${totalPhases} phases have been successfully enhanced with professional AI assistance.`,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
      };
    }

    if (loadingCount > 0) {
      return {
        type: 'loading' as const,
        icon: <Clock className="h-5 w-5 text-blue-600 animate-pulse" />,
        title: 'Enhancement in Progress',
        message: `${loadingCount} phase${loadingCount > 1 ? 's' : ''} currently being enhanced. ${completedCount} of ${totalPhases} complete.`,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
      };
    }

    if (errorCount > 0) {
      return {
        type: 'partial' as const,
        icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
        title: 'Partial Enhancement',
        message: `${completedCount} of ${totalPhases} phases enhanced successfully. ${errorCount} enhancement${errorCount > 1 ? 's' : ''} failed but original narratives are preserved.`,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
      };
    }

    return {
      type: 'pending' as const,
      icon: <Clock className="h-5 w-5 text-gray-600" />,
      title: 'Enhancement Pending',
      message: 'Narrative enhancement will begin as you complete each clarification step.',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
    };
  };

  const status = getOverallStatus();

  return (
    <Card className={`consolidation-summary ${className}`}>
      <CardHeader className="pb-4">
        <div className="section-heading-secondary">
          <h3 className="section-heading-secondary-text">Enhancement Status</h3>
        </div>
      </CardHeader>
      <CardContent className="card-content-padded">
        <Alert className={`${status.bgColor} ${status.borderColor}`}>
          <div>
            <h4 className={`font-semibold ${status.textColor} mb-2 text-lg`}>
              {status.title}
            </h4>
            <AlertDescription className={`${status.textColor} text-base leading-relaxed`}>
              {status.message}
            </AlertDescription>
          </div>
        </Alert>

        {/* Detailed breakdown when there are mixed states */}
        {(completedCount > 0 || errorCount > 0 || loadingCount > 0) && (
          <div className="mt-4 space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Phase Breakdown:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {completedCount > 0 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{completedCount} Enhanced</span>
                </div>
              )}
              {loadingCount > 0 && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span>{loadingCount} Processing</span>
                </div>
              )}
              {errorCount > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorCount} Failed</span>
                </div>
              )}
              {pendingCount > 0 && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{pendingCount} Pending</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};