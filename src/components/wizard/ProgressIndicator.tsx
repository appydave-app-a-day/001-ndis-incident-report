import React from 'react';

import type { WizardStep } from './types';
import { useWizardStore } from './useWizardStore';

interface ProgressIndicatorProps {
  steps: WizardStep[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  const { currentStepIndex } = useWizardStore();

  return (
    <div className="w-full h-2 bg-border relative">
      <div
        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
        style={{
          width: steps.length > 1 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%',
        }}
      />
    </div>
  );
};

export default ProgressIndicator;