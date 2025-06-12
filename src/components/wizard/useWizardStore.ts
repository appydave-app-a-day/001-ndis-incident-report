import { create } from 'zustand';

import type { WizardState } from './types';

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStepIndex: 0,
  totalSteps: 0,
  visitedSteps: new Set([0]),
  
  setCurrentStepIndex: (index) =>
    set((state) => ({
      currentStepIndex: index,
      visitedSteps: new Set([...state.visitedSteps, index]),
    })),
    
  markStepAsVisited: (index) =>
    set((state) => ({
      visitedSteps: new Set([...state.visitedSteps, index]),
    })),
    
  goToNextStep: () =>
    set((state) => {
      const nextIndex = state.currentStepIndex + 1;
      if (nextIndex < state.totalSteps) {
        return {
          currentStepIndex: nextIndex,
          visitedSteps: new Set([...state.visitedSteps, nextIndex]),
        };
      }
      return state;
    }),
    
  goToPreviousStep: () =>
    set((state) => {
      const prevIndex = state.currentStepIndex - 1;
      if (prevIndex >= 0) {
        return { currentStepIndex: prevIndex };
      }
      return state;
    }),
    
  canGoNext: () => {
    const state = get();
    return state.currentStepIndex < state.totalSteps - 1;
  },
  
  canGoBack: () => {
    const state = get();
    return state.currentStepIndex > 0;
  },
  
  isLastStep: () => {
    const state = get();
    return state.currentStepIndex === state.totalSteps - 1;
  },
    
  reset: () =>
    set({
      currentStepIndex: 0,
      totalSteps: 0,
      visitedSteps: new Set([0]),
    }),
}));