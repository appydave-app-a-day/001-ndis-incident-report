import React from 'react';

import { cn } from '@/lib/utils';

import type { WizardStep } from './types';
import { useWizardStore } from './useWizardStore';

interface ProgressIndicatorProps {
  steps: WizardStep[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  const { currentStepIndex, visitedSteps, setCurrentStepIndex } = useWizardStore();

  const handleStepClick = (index: number) => {
    if (visitedSteps.has(index)) {
      setCurrentStepIndex(index);
    }
  };

  const getStepState = (index: number) => {
    if (index === currentStepIndex) return 'current';
    if (visitedSteps.has(index)) return 'visited';
    return 'unvisited';
  };

  return (
    <div className="w-full h-2 bg-gray-200 relative">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ease-out"
        style={{
          width: steps.length > 1 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%',
        }}
      />
    </div>
  );
};

export default ProgressIndicator;