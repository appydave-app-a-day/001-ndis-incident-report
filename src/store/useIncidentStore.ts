import { create } from 'zustand';

import type { PanelType } from '@/components/wizard/StepHeader';

export interface IncidentMetadata {
  reporterName: string;
  participantName: string;
  eventDateTime: string;
  location: string;
}

export interface IncidentNarrative {
  beforeEvent: string;
  duringEvent: string;
  endEvent: string;
  postEvent: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  phase: 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent';
}

export interface ClarificationQuestions {
  beforeEvent: ClarificationQuestion[];
  duringEvent: ClarificationQuestion[];
  endEvent: ClarificationQuestion[];
  postEvent: ClarificationQuestion[];
}

export interface ClarificationAnswer {
  questionId: string;
  answer: string;
}

export interface ClarificationAnswers {
  beforeEvent: ClarificationAnswer[];
  duringEvent: ClarificationAnswer[];
  endEvent: ClarificationAnswer[];
  postEvent: ClarificationAnswer[];
}

export interface NarrativeExtras {
  beforeEvent: string;
  duringEvent: string;
  endEvent: string;
  postEvent: string;
}

export interface ConsolidationStatus {
  beforeEvent: 'pending' | 'loading' | 'complete' | 'error';
  duringEvent: 'pending' | 'loading' | 'complete' | 'error';
  endEvent: 'pending' | 'loading' | 'complete' | 'error';
  postEvent: 'pending' | 'loading' | 'complete' | 'error';
}

export interface ConsolidationHashes {
  beforeEvent?: string;
  duringEvent?: string;
  endEvent?: string;
  postEvent?: string;
}

export interface ConsolidationErrors {
  beforeEvent?: string;
  duringEvent?: string;
  endEvent?: string;
  postEvent?: string;
}

export interface IncidentReport {
  metadata: IncidentMetadata;
  narrative: IncidentNarrative;
  clarificationAnswers: ClarificationAnswers;
  narrativeExtras: NarrativeExtras;
}

type ApiMode = 'mock' | 'live';

interface LoadingOverlayState {
  isOpen: boolean;
  message: string;
  isError?: boolean;
}

interface IncidentState {
  report: IncidentReport;
  clarificationQuestions: ClarificationQuestions | null;
  lastNarrativeHash: string | null;
  isLoadingQuestions: boolean;
  consolidationStatus: ConsolidationStatus;
  consolidationErrors: ConsolidationErrors;
  consolidationHashes: ConsolidationHashes;
  apiMode: ApiMode;
  loadingOverlay: LoadingOverlayState;
  lastNarrativeScenarioIndex: number | null;
  updateMetadata: (metadata: Partial<IncidentMetadata>) => void;
  updateNarrative: (narrative: Partial<IncidentNarrative>) => void;
  updateClarificationAnswer: (phase: keyof ClarificationAnswers, questionId: string, answer: string) => void;
  setClarificationQuestions: (questions: ClarificationQuestions) => void;
  setLoadingQuestions: (loading: boolean) => void;
  consolidatePhaseNarrative: (phase: keyof NarrativeExtras, skipCache?: boolean) => Promise<void>;
  fetchClarificationQuestionsIfNeeded: () => Promise<void>;
  setConsolidationStatus: (phase: keyof NarrativeExtras, status: ConsolidationStatus[keyof NarrativeExtras]) => void;
  setConsolidationError: (phase: keyof NarrativeExtras, error?: string) => void;
  setNarrativeExtra: (phase: keyof NarrativeExtras, extra: string) => void;
  toggleApiMode: () => void;
  setApiMode: (mode: ApiMode) => void;
  showLoadingOverlay: (message: string) => void;
  showErrorOverlay: (message: string) => void;
  hideLoadingOverlay: () => void;
  populateTestData: (panelType?: PanelType) => void;
  populateQuestionAnswers: (phase?: keyof ClarificationQuestions) => Promise<void>;
  reset: () => void;
  isMetadataComplete: () => boolean;
  isNarrativeComplete: () => boolean;
}

const initialReport: IncidentReport = {
  metadata: {
    reporterName: '',
    participantName: '',
    eventDateTime: '',
    location: '',
  },
  narrative: {
    beforeEvent: '',
    duringEvent: '',
    endEvent: '',
    postEvent: '',
  },
  clarificationAnswers: {
    beforeEvent: [],
    duringEvent: [],
    endEvent: [],
    postEvent: [],
  },
  narrativeExtras: {
    beforeEvent: '',
    duringEvent: '',
    endEvent: '',
    postEvent: '',
  },
};

const initialConsolidationStatus: ConsolidationStatus = {
  beforeEvent: 'pending',
  duringEvent: 'pending',
  endEvent: 'pending',
  postEvent: 'pending',
};

// Get initial API mode from environment, default to mock
const getInitialApiMode = (): ApiMode => {
  const envMode = import.meta.env.VITE_API_MODE;
  const sessionMode = sessionStorage.getItem('apiMode') as ApiMode;
  
  // Prefer session storage, then environment, default to mock
  return sessionMode || (envMode === 'live' ? 'live' : 'mock');
};

// ============================================================================
// Constants
// ============================================================================

const PHASE_LABELS = {
  beforeEvent: 'Before Event',
  duringEvent: 'During Event',
  endEvent: 'End Event',
  postEvent: 'Post-Event Support',
} as const;

const MIN_LOADING_TIME = 2000; // 2 seconds minimum

// ============================================================================
// Hash Utility Functions
// ============================================================================

/**
 * Simple hash function for strings
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};

/**
 * Hash narrative content for dependency tracking
 */
const hashNarrative = (narrative: IncidentNarrative): string => {
  const content = `${narrative.beforeEvent}|${narrative.duringEvent}|${narrative.endEvent}|${narrative.postEvent}`;
  return simpleHash(content);
};

/**
 * Hash consolidation inputs (answers + narrative) for dependency tracking
 */
const hashConsolidationInputs = (
  answers: ClarificationAnswer[],
  narrative: IncidentNarrative,
  phase: keyof NarrativeExtras
): string => {
  const answersStr = JSON.stringify(answers.sort((a, b) => a.questionId.localeCompare(b.questionId)));
  const narrativeStr = narrative[phase];
  const content = `${answersStr}|${narrativeStr}`;
  return simpleHash(content);
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Helper to manage minimum loading time
 */
const waitForMinimumLoadingTime = async (startTime: number): Promise<void> => {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
};

/**
 * Helper to manage loading overlay state
 */
const createLoadingOverlayUpdate = (message: string, isOpen: boolean = true) => ({
  loadingOverlay: { 
    isOpen, 
    message: isOpen ? message : '' 
  }
});

export const useIncidentStore = create<IncidentState>((set, get) => ({
  report: initialReport,
  clarificationQuestions: null,
  lastNarrativeHash: null,
  isLoadingQuestions: false,
  consolidationStatus: initialConsolidationStatus,
  consolidationErrors: {},
  consolidationHashes: {},
  apiMode: getInitialApiMode(),
  loadingOverlay: { isOpen: false, message: '', isError: false },
  lastNarrativeScenarioIndex: null,
  
  updateMetadata: (metadata) =>
    set((state) => ({
      report: {
        ...state.report,
        metadata: { ...state.report.metadata, ...metadata },
      },
    })),
    
  updateNarrative: (narrative) =>
    set((state) => ({
      report: {
        ...state.report,
        narrative: { ...state.report.narrative, ...narrative },
      },
    })),
    
  updateClarificationAnswer: (phase, questionId, answer) =>
    set((state) => {
      const existingAnswers = state.report.clarificationAnswers[phase];
      const existingIndex = existingAnswers.findIndex(a => a.questionId === questionId);
      
      let updatedAnswers;
      if (existingIndex >= 0) {
        // Update existing answer
        updatedAnswers = existingAnswers.map((a, index) =>
          index === existingIndex ? { ...a, answer } : a
        );
      } else {
        // Add new answer
        updatedAnswers = [...existingAnswers, { questionId, answer }];
      }
      
      return {
        report: {
          ...state.report,
          clarificationAnswers: {
            ...state.report.clarificationAnswers,
            [phase]: updatedAnswers,
          },
        },
      };
    }),
    
  setClarificationQuestions: (questions) =>
    set({ clarificationQuestions: questions }),
    
  setLoadingQuestions: (loading) =>
    set({ isLoadingQuestions: loading }),
    
  isMetadataComplete: () => {
    const { metadata } = get().report;
    return !!(
      metadata.reporterName.trim() &&
      metadata.participantName.trim() &&
      metadata.eventDateTime.trim() &&
      metadata.location.trim()
    );
  },
  
  isNarrativeComplete: () => {
    const { narrative } = get().report;
    return !!(
      narrative.beforeEvent.trim() ||
      narrative.duringEvent.trim() ||
      narrative.endEvent.trim() ||
      narrative.postEvent.trim()
    );
  },

  populateTestData: (panelType?: PanelType) => {
    if (!panelType) {
      console.warn('No panel type provided to populateTestData');
      return;
    }

    switch (panelType) {
      case 'metadata-input': {
        // Populate metadata test data
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedDate = yesterday.toISOString().slice(0, 16);

        const testMetadata: IncidentMetadata = {
          reporterName: 'David',
          participantName: 'Lisa',
          eventDateTime: formattedDate,
          location: 'Mascot',
        };

        set((state) => ({
          report: {
            ...state.report,
            metadata: testMetadata,
          },
        }));
        break;
      }

      case 'narrative-input': {
        // Populate narrative test data with random scenario
        const narrativeScenarios = [
          {
            beforeEvent: 'Lisa was sitting in the lounge room just watching a little bit of TV she was fairly calm and peaceful, And then a pizza delivery man came and bashed on the door really loudly',
            duringEvent: 'Lisa started getting incredibly agitated and started screaming intruder intruder, and went into the kitchen and grabbed a knife and threatened to hurt. Whoever was at the door',
            endEvent: 'the police were called and they came and were able to subdue Lisa get the knife away from her and then she was taken to the local psychiatric hospital',
            postEvent: 'Lisa was is and kept overnight and returned back to the house the next day, she was calm',
          },
          {
            beforeEvent: 'Lisa had been having a good morning, enjoying her breakfast and reading a magazine. The house was quiet and she seemed relaxed when the doorbell rang multiple times',
            duringEvent: 'Lisa became extremely anxious and started pacing back and forth, muttering about strangers trying to break in. She began throwing cushions and knocked over a lamp',
            endEvent: 'I was able to guide Lisa to her room where she gradually calmed down after the visitor left. She sat quietly for about 20 minutes',
            postEvent: 'Lisa apologized for her reaction and helped clean up the living room. She spent the rest of the day gardening which always helps her feel better',
          },
          {
            beforeEvent: 'Lisa was preparing lunch in the kitchen and humming to herself when there was a loud knock at the back door. She immediately froze and looked frightened',
            duringEvent: 'Lisa dropped the plate she was holding and started hyperventilating. She crouched behind the kitchen counter and refused to move, saying someone was trying to hurt her',
            endEvent: 'After checking that it was just the meter reader, I helped Lisa with some breathing exercises and reassured her that she was safe',
            postEvent: 'Lisa remained shaky for the rest of the afternoon but was able to eat dinner and watch her favorite TV show before bed',
          }
        ];

        // Get available indices excluding the last used one
        const state = get();
        const lastIndex = state.lastNarrativeScenarioIndex;
        const availableIndices = [0, 1, 2].filter(index => index !== lastIndex);
        
        // Pick randomly from available indices
        const randomChoice = Math.floor(Math.random() * availableIndices.length);
        const scenarioIndex = availableIndices[randomChoice];
        const testNarrative: IncidentNarrative = narrativeScenarios[scenarioIndex];

        set((currentState) => ({
          report: {
            ...currentState.report,
            narrative: testNarrative,
          },
          lastNarrativeScenarioIndex: scenarioIndex,
        }));
        break;
      }

      case 'qa-clarification':
        // Call API to generate fake answers for current questions
        get().populateQuestionAnswers();
        break;

      default:
        console.warn(`Mock data not implemented for panel type: ${panelType}`);
        break;
    }
  },

  populateQuestionAnswers: async (providedPhase?: keyof ClarificationQuestions) => {
    const state = get();
    
    // Determine which phase we're on
    let currentPhase: keyof ClarificationQuestions | null = providedPhase || null;
    let phaseQuestions: ClarificationQuestion[] = [];
    
    if (currentPhase && state.clarificationQuestions) {
      // Use the provided phase
      phaseQuestions = state.clarificationQuestions[currentPhase];
    } else if (state.clarificationQuestions) {
      // Auto-detect phase based on available questions
      for (const phase of ['beforeEvent', 'duringEvent', 'endEvent', 'postEvent'] as const) {
        if (state.clarificationQuestions[phase].length > 0) {
          currentPhase = phase;
          phaseQuestions = state.clarificationQuestions[phase];
          break; // Take the first phase with questions
        }
      }
    }
    
    if (!currentPhase || phaseQuestions.length === 0) {
      console.warn('No questions available to generate answers for');
      return;
    }
    
    // Get the narrative for the current phase
    const phaseNarrative = state.report.narrative[currentPhase];
    
    // Show loading overlay
    set({
      ...createLoadingOverlayUpdate('Generating mock answers...', true)
    });
    
    try {
      // Dynamically import to avoid circular dependencies
      const { incidentAPI } = await import('../lib/services/incident-api');
      
      // Ensure API mode is set correctly
      if (state.apiMode !== incidentAPI.getMode()) {
        incidentAPI.setMode(state.apiMode);
      }
      
      // Call the API to generate mock answers
      const response = await incidentAPI.generateMockAnswers(
        currentPhase,
        phaseNarrative,
        phaseQuestions.map(q => ({ id: q.id, question: q.question })),
        {
          participantName: state.report.metadata.participantName,
          reporterName: state.report.metadata.reporterName,
          location: state.report.metadata.location,
        }
      );
      
      // Update the answers in the store
      const answers: ClarificationAnswer[] = response.answers.map((a) => ({
        questionId: a.question_id,
        answer: a.answer,
      }));
      
      set((currentState) => ({
        report: {
          ...currentState.report,
          clarificationAnswers: {
            ...currentState.report.clarificationAnswers,
            [currentPhase]: answers,
          },
        },
        ...createLoadingOverlayUpdate('', false)
      }));
      
      if (import.meta.env.DEV) {
        console.log(`✅ Mock answers generated for ${currentPhase}:`, answers.length);
      }
    } catch (error) {
      console.error('Failed to generate mock answers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate mock answers. Please try again.';
      set({
        loadingOverlay: {
          isOpen: true,
          message: errorMessage,
          isError: true
        }
      });
    }
  },

  // ============================================================================
  // Narrative Consolidation Methods
  // ============================================================================

  consolidatePhaseNarrative: async (phase: keyof NarrativeExtras, skipCache: boolean = false) => {
    const state = get();
    
    // Smart caching - check if work is needed unless skipCache is true
    if (!skipCache) {
      const answers = state.report.clarificationAnswers[phase];
      const currentInputHash = hashConsolidationInputs(answers, state.report.narrative, phase);
      const existingHash = state.consolidationHashes[phase];
      
      if (state.consolidationStatus[phase] === 'complete' && existingHash === currentInputHash) {
        return; // Skip if already consolidated and inputs haven't changed
      }
      
      // Store the hash before consolidation
      set((currentState) => ({
        consolidationHashes: {
          ...currentState.consolidationHashes,
          [phase]: currentInputHash
        }
      }));
    }
    
    const startTime = Date.now();
    const message = `Enhancing ${PHASE_LABELS[phase]} narrative with AI assistance...`;
    
    // Set loading state with overlay for both mock and live modes
    set((currentState) => ({
      consolidationStatus: {
        ...currentState.consolidationStatus,
        [phase]: 'loading',
      },
      ...createLoadingOverlayUpdate(message)
    }));

    try {
      // Import unified incident API
      const { incidentAPI } = await import('../lib/services/incident-api');
      
      // Get clarification answers for this phase
      const clarificationAnswers = state.report.clarificationAnswers[phase];
      const clarificationQuestions = state.clarificationQuestions?.[phase] || [];
      const originalNarrative = state.report.narrative[phase];
      
      // Set API mode if user has a preference
      if (state.apiMode !== incidentAPI.getMode()) {
        incidentAPI.setMode(state.apiMode);
      }

      // Resolve question IDs to actual question text for the API
      const resolvedAnswers = clarificationAnswers.map(answer => {
        const question = clarificationQuestions.find(q => q.id === answer.questionId);
        return {
          questionId: answer.questionId,
          question: question?.question || 'Unknown question',
          answer: answer.answer,
        };
      });

      // Make API call to enhance narrative
      const enhancedNarrative = await incidentAPI.enhanceNarrative(
        phase,
        originalNarrative,
        resolvedAnswers
      );

      // Ensure minimum loading time has elapsed
      await waitForMinimumLoadingTime(startTime);

      // Update narrative extra and mark as complete
      set((currentState) => ({
        report: {
          ...currentState.report,
          narrativeExtras: {
            ...currentState.report.narrativeExtras,
            [phase]: enhancedNarrative,
          },
        },
        consolidationStatus: {
          ...currentState.consolidationStatus,
          [phase]: 'complete',
        },
        consolidationErrors: {
          ...currentState.consolidationErrors,
          [phase]: undefined,
        },
        ...createLoadingOverlayUpdate('', false)
      }));
    } catch (error) {
      // Ensure minimum loading time has elapsed even for errors
      await waitForMinimumLoadingTime(startTime);

      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Consolidation error for ${phase}:`, errorMessage);
      
      set((currentState) => ({
        consolidationStatus: {
          ...currentState.consolidationStatus,
          [phase]: 'error',
        },
        consolidationErrors: {
          ...currentState.consolidationErrors,
          [phase]: errorMessage,
        },
        ...createLoadingOverlayUpdate('', false)
      }));
    }
  },

  // ============================================================================
  // Smart Wrapper Methods with Dependency Tracking
  // ============================================================================

  fetchClarificationQuestionsIfNeeded: async () => {
    const state = get();
    
    // Calculate current narrative hash
    const currentNarrativeHash = hashNarrative(state.report.narrative);
    
    // Skip if questions exist and narrative hasn't changed
    if (state.clarificationQuestions && state.lastNarrativeHash === currentNarrativeHash) {
      return;
    }
    
    const message = 'Analyzing narrative content to generate relevant clarification questions...';
    
    // Show loading overlay for both mock and live modes
    set({
      isLoadingQuestions: true,
      ...createLoadingOverlayUpdate(message)
    });
    
    try {
      // Import unified incident API
      const { incidentAPI } = await import('../lib/services/incident-api');
      
      // Set API mode if user has a preference
      if (state.apiMode !== incidentAPI.getMode()) {
        incidentAPI.setMode(state.apiMode);
      }
      
      // Prepare metadata
      const metadata = {
        reporterName: state.report.metadata.reporterName,
        participantName: state.report.metadata.participantName,
        location: state.report.metadata.location,
      };
      
      // Get clarification questions
      const response = await incidentAPI.getClarificationQuestions(state.report.narrative, metadata);
      
      // Transform response to match store format
      const questions = {
        beforeEvent: response.beforeEventQuestions.map((q, index) => ({
          id: `before-${index + 1}`,
          question: q,
          phase: 'beforeEvent' as const,
        })),
        duringEvent: response.duringEventQuestions.map((q, index) => ({
          id: `during-${index + 1}`,
          question: q,
          phase: 'duringEvent' as const,
        })),
        endEvent: response.endEventQuestions.map((q, index) => ({
          id: `end-${index + 1}`,
          question: q,
          phase: 'endEvent' as const,
        })),
        postEvent: response.postEventQuestions.map((q, index) => ({
          id: `post-${index + 1}`,
          question: q,
          phase: 'postEvent' as const,
        })),
      };
      
      // Update questions and hash
      set({
        clarificationQuestions: questions,
        lastNarrativeHash: currentNarrativeHash,
        isLoadingQuestions: false,
        ...createLoadingOverlayUpdate('', false)
      });
    } catch (error) {
      console.error('Failed to fetch clarification questions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clarification questions. Please try again.';
      set({ 
        isLoadingQuestions: false,
        loadingOverlay: {
          isOpen: true,
          message: errorMessage,
          isError: true
        }
      });
    }
  },

  setConsolidationStatus: (phase: keyof NarrativeExtras, status: ConsolidationStatus[keyof NarrativeExtras]) =>
    set((state) => ({
      consolidationStatus: {
        ...state.consolidationStatus,
        [phase]: status,
      },
    })),

  setConsolidationError: (phase: keyof NarrativeExtras, error?: string) =>
    set((state) => ({
      consolidationErrors: {
        ...state.consolidationErrors,
        [phase]: error,
      },
    })),

  setNarrativeExtra: (phase: keyof NarrativeExtras, extra: string) =>
    set((state) => ({
      report: {
        ...state.report,
        narrativeExtras: {
          ...state.report.narrativeExtras,
          [phase]: extra,
        },
      },
    })),

  // ============================================================================
  // API Mode Methods
  // ============================================================================

  toggleApiMode: () => {
    const currentMode = get().apiMode;
    const newMode = currentMode === 'mock' ? 'live' : 'mock';
    sessionStorage.setItem('apiMode', newMode);
    set({ apiMode: newMode });
  },

  setApiMode: (mode: ApiMode) => {
    sessionStorage.setItem('apiMode', mode);
    set({ apiMode: mode });
  },

  // ============================================================================
  // Loading Overlay Methods
  // ============================================================================

  showLoadingOverlay: (message: string) =>
    set({ 
      loadingOverlay: { 
        isOpen: true, 
        message,
        isError: false
      }
    }),

  showErrorOverlay: (message: string) =>
    set({ 
      loadingOverlay: { 
        isOpen: true, 
        message,
        isError: true
      }
    }),

  hideLoadingOverlay: () =>
    set({ 
      loadingOverlay: { isOpen: false, message: '', isError: false }
    }),
    
  reset: () => set({ 
    report: initialReport,
    clarificationQuestions: null,
    lastNarrativeHash: null,
    isLoadingQuestions: false,
    consolidationStatus: initialConsolidationStatus,
    consolidationErrors: {},
    consolidationHashes: {},
    apiMode: getInitialApiMode(),
    loadingOverlay: { isOpen: false, message: '', isError: false },
    lastNarrativeScenarioIndex: null,
  }),
}));