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

  const handleNext = async () => {
    // Call onLeave callback if defined for current step
    if (currentStep.onLeave) {
      try {
        await currentStep.onLeave();
      } catch (error) {
        console.error('Error in onLeave callback:', error);
        // Continue anyway - don't block navigation on callback errors
      }
    }
    
    if (isLastStep() && onComplete) {
      onComplete();
    } else {
      goToNextStep();
    }
  };

  const canProceedNext = () => {
    const currentStepDef = steps[currentStepIndex];
    if (currentStepDef?.isValid) {
      return currentStepDef.isValid() && canGoNext();
    }
    return canGoNext();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden flex flex-col">
      <ProgressIndicator steps={steps} />
      <div className="wizard-content">
        <StepComponent />
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={!canGoBack()}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isLastStep() && !canProceedNext()}
        >
          {isLastStep() ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Wizard;