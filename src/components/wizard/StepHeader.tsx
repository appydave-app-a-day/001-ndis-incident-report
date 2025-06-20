import { Eye, Database } from 'lucide-react';
import React from 'react';

import { ApiModeToggle } from '@/components/ui/ApiModeToggle';
import { useIncidentStore } from '@/store/useIncidentStore';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  onViewContent?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber: _stepNumber,
  title,
  subtitle,
  onViewContent,
}) => {
  const { populateTestData, testDataLevel } = useIncidentStore();

  const handleTestData = () => {
    populateTestData();
  };

  const getTooltipText = () => {
    switch (testDataLevel) {
      case 'none': return 'Populate basic test data (8 fields)';
      case 'basic': return 'Add clarification answers (12 fields)';
      case 'full': return 'Reset all data';
      default: return 'Populate test data';
    }
  };

  return (
    <div className="step-header-improved">
      <ApiModeToggle />
      
      <button
        onClick={handleTestData}
        className="debug-button z-10"
        title={getTooltipText()}
        style={{ right: '3.5rem' }}
      >
        <Database className="w-4 h-4" />
      </button>
      
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