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
    <div className="w-full px-4 py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: steps.length > 1 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%',
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const state = getStepState(index);
            const isClickable = visitedSteps.has(index);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-not-allowed'
                )}
                aria-label={`Step ${index + 1}: ${step.title}`}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all duration-200',
                    state === 'current' && 'border-primary bg-primary text-white',
                    state === 'visited' && 'border-primary bg-white text-primary hover:bg-primary/10',
                    state === 'unvisited' && 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  <span className="text-sm font-semibold">{index + 1}</span>
                </div>

                {/* Step Title - Hidden on mobile */}
                <span
                  className={cn(
                    'mt-2 hidden text-xs font-medium md:block',
                    state === 'current' && 'text-primary',
                    state === 'visited' && 'text-gray-700',
                    state === 'unvisited' && 'text-gray-400'
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;