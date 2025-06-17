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
    <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
      <ProgressIndicator steps={steps} />
      <div className="wizard-content min-h-[500px]">
        <StepComponent />
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={!canGoBack()}
          className="min-w-[120px]"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isLastStep() && !canGoNext()}
          className="min-w-[120px]"
        >
          {isLastStep() ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Wizard;