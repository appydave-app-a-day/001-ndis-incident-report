import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { ProgressIndicator } from './ProgressIndicator';
import type { WizardProps } from './types';
import { useWizardStore } from './useWizardStore';

export const Wizard: React.FC<WizardProps> = ({ steps, onComplete }) => {
  const {
    currentStepIndex,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoBack,
    isLastStep,
    reset,
  } = useWizardStore();

  useEffect(() => {
    useWizardStore.setState({ totalSteps: steps.length });
    
    return () => {
      reset();
    };
  }, [steps.length, reset]);

  if (steps.length === 0) {
    return <div className="p-4 text-center text-gray-500">No steps provided</div>;
  }

  const currentStep = steps[currentStepIndex];
  if (!currentStep) {
    return <div className="p-4 text-center text-red-500">Invalid step index</div>;
  }

  const StepComponent = currentStep.component;

  const handleNext = () => {
    if (isLastStep() && onComplete) {
      onComplete();
    } else {
      goToNextStep();
    }
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  return (
    <div className="wizard-container flex flex-col h-full">
      <ProgressIndicator steps={steps} />
      <div className="wizard-content flex-1 overflow-auto">
        <StepComponent />
      </div>
      <div className="wizard-navigation border-t p-4 flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={!canGoBack()}
          className="min-w-[100px]"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isLastStep() && !canGoNext()}
          className="min-w-[100px]"
        >
          {isLastStep() ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Wizard;