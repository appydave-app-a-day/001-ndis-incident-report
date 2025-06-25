import { create } from 'zustand';

import type { IncidentClassification } from '@/lib/services/types/api-types';

// ============================================================================
// Analysis State Types
// ============================================================================

export interface AnalysisReport {
  consolidated_narrative: string;
  contributing_conditions: string;
  classifications: IncidentClassification[];
}

export interface PrefetchStatus {
  conditions: 'idle' | 'loading' | 'success' | 'error';
  classifications: 'idle' | 'loading' | 'success' | 'error';
}

export interface PrefetchErrors {
  conditions?: string;
  classifications?: string;
}

interface AnalysisState {
  // Data layer
  analysisReport: AnalysisReport;
  
  // UI state layer
  prefetchStatus: PrefetchStatus;
  prefetchErrors: PrefetchErrors;
  
  // Workflow state
  isAnalysisComplete: boolean;
  currentStep: 'review' | 'conditions' | 'classifications' | 'complete';
  
  // Actions - Data Management
  setConsolidatedNarrative: (narrative: string) => void;
  updateContributingConditions: (conditions: string) => void;
  setClassifications: (classifications: IncidentClassification[]) => void;
  addClassification: (classification: Omit<IncidentClassification, 'id'>) => void;
  removeClassification: (id: string) => void;
  updateClassification: (id: string, updates: Partial<IncidentClassification>) => void;
  
  // Actions - Prefetch Management
  setPrefetchStatus: (type: keyof PrefetchStatus, status: PrefetchStatus[keyof PrefetchStatus]) => void;
  setPrefetchError: (type: keyof PrefetchErrors, error?: string) => void;
  clearPrefetchErrors: () => void;
  
  // Actions - Workflow Management
  setCurrentStep: (step: AnalysisState['currentStep']) => void;
  markAnalysisComplete: () => void;
  
  // Utility methods
  isReadyForConditionsStep: () => boolean;
  isReadyForClassificationsStep: () => boolean;
  getConsolidatedNarrative: () => string;
  
  // Reset
  reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialAnalysisReport: AnalysisReport = {
  consolidated_narrative: '',
  contributing_conditions: '',
  classifications: [],
};

const initialPrefetchStatus: PrefetchStatus = {
  conditions: 'idle',
  classifications: 'idle',
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate unique ID for new classifications
 */
const generateClassificationId = (): string => {
  return `classification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // Initial state
  analysisReport: initialAnalysisReport,
  prefetchStatus: initialPrefetchStatus,
  prefetchErrors: {},
  isAnalysisComplete: false,
  currentStep: 'review',
  
  // Data Management Actions
  setConsolidatedNarrative: (narrative) =>
    set((state) => ({
      analysisReport: {
        ...state.analysisReport,
        consolidated_narrative: narrative,
      },
    })),
    
  updateContributingConditions: (conditions) =>
    set((state) => ({
      analysisReport: {
        ...state.analysisReport,
        contributing_conditions: conditions,
      },
    })),
    
  setClassifications: (classifications) =>
    set((state) => ({
      analysisReport: {
        ...state.analysisReport,
        classifications,
      },
    })),
    
  addClassification: (classification) =>
    set((state) => ({
      analysisReport: {
        ...state.analysisReport,
        classifications: [
          ...state.analysisReport.classifications,
          {
            ...classification,
            id: generateClassificationId(),
          },
        ],
      },
    })),
    
  removeClassification: (id) =>
    set((state) => ({
      analysisReport: {
        ...state.analysisReport,
        classifications: state.analysisReport.classifications.filter(c => c.id !== id),
      },
    })),
    
  updateClassification: (id, updates) =>
    set((state) => ({
      analysisReport: {
        ...state.analysisReport,
        classifications: state.analysisReport.classifications.map(c =>
          c.id === id ? { ...c, ...updates } : c
        ),
      },
    })),
  
  // Prefetch Management Actions
  setPrefetchStatus: (type, status) =>
    set((state) => ({
      prefetchStatus: {
        ...state.prefetchStatus,
        [type]: status,
      },
    })),
    
  setPrefetchError: (type, error) =>
    set((state) => ({
      prefetchErrors: {
        ...state.prefetchErrors,
        [type]: error,
      },
    })),
    
  clearPrefetchErrors: () =>
    set({ prefetchErrors: {} }),
  
  // Workflow Management Actions
  setCurrentStep: (step) =>
    set({ currentStep: step }),
    
  markAnalysisComplete: () =>
    set({ 
      isAnalysisComplete: true,
      currentStep: 'complete',
    }),
  
  // Utility Methods
  isReadyForConditionsStep: () => {
    const state = get();
    return state.prefetchStatus.conditions === 'success' || 
           state.prefetchStatus.conditions === 'error';
  },
  
  isReadyForClassificationsStep: () => {
    const state = get();
    return state.prefetchStatus.classifications === 'success' || 
           state.prefetchStatus.classifications === 'error';
  },
  
  getConsolidatedNarrative: () => {
    const state = get();
    return state.analysisReport.consolidated_narrative;
  },
  
  // Reset
  reset: () =>
    set({
      analysisReport: initialAnalysisReport,
      prefetchStatus: initialPrefetchStatus,
      prefetchErrors: {},
      isAnalysisComplete: false,
      currentStep: 'review',
    }),
}));