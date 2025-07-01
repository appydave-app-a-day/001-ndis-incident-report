import { Eye, Database } from 'lucide-react';
import React from 'react';

import { ApiModeToggle } from '@/components/ui/ApiModeToggle';
import { useIncidentStore } from '@/store/useIncidentStore';

// Panel type classification for context-aware mock data
export type PanelType = 
  | 'metadata-input'      // Form-based structured data input
  | 'narrative-input'     // Multi-textarea narrative input  
  | 'qa-clarification'    // Dynamic Q&A with optional answers
  | 'review-display'      // Read-only data review/display
  | 'ai-editor'          // AI-assisted content editing
  | 'placeholder';       // Coming soon/placeholder content

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  onViewContent?: () => void;
  panelType?: PanelType;  // New prop for panel context
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber: _stepNumber,
  title,
  subtitle,
  onViewContent,
  panelType,
}) => {
  const { populateTestData } = useIncidentStore();

  const handleTestData = () => {
    // Pass panel context to the store method
    populateTestData(panelType);
  };

  const getTooltipText = () => {
    switch (panelType) {
      case 'metadata-input':
        return 'Populate metadata test data (reporter, participant, etc.)';
      case 'narrative-input':
        return 'Populate narrative test data (before/during/end/post events)';
      case 'qa-clarification':
        return 'Generate fake answers for current questions';
      case 'review-display':
      case 'ai-editor':
      case 'placeholder':
        return 'Mock data not available for this panel type';
      default:
        return 'Populate test data';
    }
  };

  const isMockDataAvailable = () => {
    return panelType === 'metadata-input' || 
           panelType === 'narrative-input' || 
           panelType === 'qa-clarification';
  };

  return (
    <div className="step-header-improved">
      <ApiModeToggle />
      
      {isMockDataAvailable() && (
        <button
          onClick={handleTestData}
          className="debug-button z-10"
          title={getTooltipText()}
          style={{ right: '3.5rem' }}
        >
          <Database className="w-4 h-4" />
        </button>
      )}
      
      {onViewContent && (
        <button
          onClick={onViewContent}
          className="debug-button z-10"
          title="View form data (debug)"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      
      <h1 className="text-3xl font-bold text-white mb-3 leading-tight relative z-10">
        {title}
      </h1>
      
      <p className="text-xl text-white/90 relative z-10">
        {subtitle}
      </p>
    </div>
  );
};

export default StepHeader;