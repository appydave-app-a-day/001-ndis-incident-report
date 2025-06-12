import type { ComponentType } from 'react';

export interface WizardStep {
  id: string;
  title: string;
  component: ComponentType;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete?: () => void;
}

export interface WizardState {
  currentStepIndex: number;
  totalSteps: number;
  visitedSteps: Set<number>;
  setCurrentStepIndex: (index: number) => void;
  markStepAsVisited: (index: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: () => boolean;
  canGoBack: () => boolean;
  isLastStep: () => boolean;
  reset: () => void;
}