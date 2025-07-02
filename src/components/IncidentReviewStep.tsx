import { FileText } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { ConsolidationSummary } from '@/components/ui/ConsolidationSummary';
import { EnhancedNarrativeDisplay } from '@/components/ui/EnhancedNarrativeDisplay';
import { MetadataDisplay } from '@/components/ui/MetadataDisplay';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useIncidentStore } from '@/store/useIncidentStore';

const PHASE_LABELS = {
  beforeEvent: 'Before Event',
  duringEvent: 'During Event',
  endEvent: 'End Event', 
  postEvent: 'Post-Event Support',
};

export const IncidentReviewStep: React.FC = () => {
  const {
    report,
    consolidationStatus,
    consolidationErrors,
    consolidatePhaseNarrative,
  } = useIncidentStore();

  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('IncidentReviewStep - Data:', {
      narrativeExtras: report.narrativeExtras,
      consolidationStatus,
      consolidationErrors,
    });
  }

  // Handle retry for individual phases
  const handleRetryConsolidation = (phase: keyof typeof PHASE_LABELS) => {
    consolidatePhaseNarrative(phase);
  };

  // Handle complete report submission
  const handleCompleteReport = () => {
    console.log('📋 Incident Report Completed!');
    console.log('Report Data:', {
      metadata: report.metadata,
      narrative: report.narrative,
      narrativeExtras: report.narrativeExtras,
      consolidationStatus,
    });
    
    // For MVP - show success message
    alert('✅ Incident report completed successfully!\n\nYour enhanced incident report has been generated and is ready for submission.');
  };

  const phases = ['beforeEvent', 'duringEvent', 'endEvent', 'postEvent'] as const;

  return (
    <div className="incident-review-step">
      <StepHeader
        stepNumber={7}
        title="Step 7: Review & Complete"
        subtitle="Review your complete incident report before submission"
        onViewContent={() => console.log('View content clicked')}
      />
      
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Metadata Section */}
          <MetadataDisplay 
            metadata={report.metadata}
            className="mb-8"
          />

          {/* Enhancement Status Summary */}
          <ConsolidationSummary 
            consolidationStatus={consolidationStatus}
            className="mb-8"
          />

          {/* Enhanced Narratives Section */}
          <div className="enhanced-narratives-section">
            <div className="section-heading-primary">
              <FileText className="h-6 w-6 section-heading-primary-icon" />
              <h2 className="section-heading-primary-text">
                Professional Incident Report
              </h2>
            </div>

            <div className="space-y-6">
              {phases.map((phase) => (
                <EnhancedNarrativeDisplay
                  key={phase}
                  phase={phase}
                  phaseLabel={PHASE_LABELS[phase]}
                  originalNarrative={report.narrative[phase]}
                  enhancedNarrative={report.narrativeExtras[phase]}
                  consolidationStatus={consolidationStatus[phase]}
                  error={consolidationErrors[phase]}
                  onRetry={() => handleRetryConsolidation(phase)}
                />
              ))}
            </div>
          </div>

          {/* Completion Actions */}
          <div className="completion-actions">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="completion-title">
                  Ready to Complete
                </h3>
                <p className="completion-description">
                  Your incident report is ready for submission. Enhanced narratives will be included where available.
                </p>
              </div>
              
              <Button
                onClick={handleCompleteReport}
                size="lg"
                className="completion-button"
              >
                <FileText className="h-5 w-5 mr-2" />
                Complete Report
              </Button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="completion-note">
            <p className="completion-note-text">
              <strong>Note:</strong> Your original narratives are preserved alongside the enhanced versions. 
              Enhanced narratives provide professional context while maintaining the authenticity of your initial observations.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};