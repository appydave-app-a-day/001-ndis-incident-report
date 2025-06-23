import { create } from 'zustand';

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

type TestDataLevel = 'none' | 'basic' | 'full';
type ApiMode = 'mock' | 'live';

interface LoadingOverlayState {
  isOpen: boolean;
  message: string;
}

interface IncidentState {
  report: IncidentReport;
  clarificationQuestions: ClarificationQuestions | null;
  lastNarrativeHash: string | null;
  isLoadingQuestions: boolean;
  testDataLevel: TestDataLevel;
  consolidationStatus: ConsolidationStatus;
  consolidationErrors: ConsolidationErrors;
  consolidationHashes: ConsolidationHashes;
  apiMode: ApiMode;
  loadingOverlay: LoadingOverlayState;
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
  hideLoadingOverlay: () => void;
  populateTestData: () => void;
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
  testDataLevel: 'none',
  consolidationStatus: initialConsolidationStatus,
  consolidationErrors: {},
  consolidationHashes: {},
  apiMode: getInitialApiMode(),
  loadingOverlay: { isOpen: false, message: '' },
  
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

  populateTestData: () => {
    const currentLevel = get().testDataLevel;
    
    if (currentLevel === 'none') {
      // Level 1: Populate basic data (metadata + narrative)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedDate = yesterday.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

      const testMetadata: IncidentMetadata = {
        reporterName: 'David',
        participantName: 'Lisa',
        eventDateTime: formattedDate,
        location: 'mascot',
      };

      const testNarrative: IncidentNarrative = {
        beforeEvent: 'Lisa was sitting in the lounge room just watching a little bit of TV she was fairly calm and peaceful, And then a pizza delivery man came and bashed on the door really loudly',
        duringEvent: 'Lisa started getting incredibly agitated and started screaming intruder intruder, and went into the kitchen and grabbed a knife and threatened to hurt. Whoever was at the door',
        endEvent: 'the police were called and they came and were able to subdue Lisa get the knife away from her and then she was taken to the local psychiatric hospital',
        postEvent: 'Lisa was is and kept overnight and returned back to the house the next day, she was calm',
      };

      set((state) => ({
        report: {
          ...state.report,
          metadata: testMetadata,
          narrative: testNarrative,
        },
        testDataLevel: 'basic',
      }));
    } else if (currentLevel === 'basic') {
      // Level 2: Generate test data based on current API mode
      const state = get();
      
      if (state.apiMode === 'mock' || !state.clarificationQuestions) {
        // Mock mode: Load pre-defined mock questions and answers
        const mockQuestions: ClarificationQuestions = {
          beforeEvent: [
            { id: 'b1', question: 'What was the participant doing before the incident?', phase: 'beforeEvent' },
            { id: 'b2', question: 'Do you like green eggs?', phase: 'beforeEvent' },
            { id: 'b3', question: 'What was the environment like before the incident?', phase: 'beforeEvent' }
          ],
          duringEvent: [
            { id: 'd1', question: 'How long did the incident last?', phase: 'duringEvent' },
            { id: 'd2', question: 'Who else was present during the incident?', phase: 'duringEvent' },
            { id: 'd3', question: 'What interventions were attempted?', phase: 'duringEvent' }
          ],
          endEvent: [
            { id: 'e1', question: 'How was the incident resolved?', phase: 'endEvent' },
            { id: 'e2', question: 'Was anyone injured?', phase: 'endEvent' },
            { id: 'e3', question: 'What was the immediate outcome?', phase: 'endEvent' }
          ],
          postEvent: [
            { id: 'p1', question: 'What follow-up actions were taken?', phase: 'postEvent' },
            { id: 'p2', question: 'Was a supervisor or manager notified?', phase: 'postEvent' },
            { id: 'p3', question: 'What support was provided to the participant?', phase: 'postEvent' }
          ]
        };

        const testClarificationAnswers: ClarificationAnswers = {
          beforeEvent: [
            { questionId: 'b1', answer: 'Lisa was sitting quietly on the couch, watching afternoon television and appeared relaxed' },
            { questionId: 'b2', answer: 'No, she prefers regular eggs' },
            { questionId: 'b3', answer: 'The living room was calm and quiet, with normal lighting and no other people present' }
          ],
          duringEvent: [
            { questionId: 'd1', answer: 'The incident lasted approximately 15-20 minutes from start to finish' },
            { questionId: 'd2', answer: 'Only the pizza delivery person at the door and myself as the support worker were present' },
            { questionId: 'd3', answer: 'I attempted verbal de-escalation and tried to explain who was at the door, but Lisa was too agitated to listen' }
          ],
          endEvent: [
            { questionId: 'e1', answer: 'Police officers were able to calm Lisa down using verbal de-escalation techniques and safely removed the knife' },
            { questionId: 'e2', answer: 'No one was physically injured during the incident, though Lisa was emotionally distressed' },
            { questionId: 'e3', answer: 'Lisa was taken to the local psychiatric hospital for assessment and stabilization' }
          ],
          postEvent: [
            { questionId: 'p1', answer: 'Contact was made with Lisa\'s case manager and family, incident was documented, and debriefing was conducted' },
            { questionId: 'p2', answer: 'Yes, the on-call supervisor was immediately notified and arrived on-site within 30 minutes' },
            { questionId: 'p3', answer: 'Lisa received immediate psychiatric assessment and overnight monitoring before returning home the next day' }
          ]
        };

        set((currentState) => ({
          report: {
            ...currentState.report,
            clarificationAnswers: testClarificationAnswers,
          },
          clarificationQuestions: mockQuestions,
          testDataLevel: 'full',
        }));
      } else {
        // Live mode: Generate smart answers for existing N8N questions
        import('../lib/services/smart-test-data').then(({ generateAllTestAnswers }) => {
          const smartAnswers = generateAllTestAnswers(state.clarificationQuestions!, state.report.narrative);
          
          set((currentState) => ({
            report: {
              ...currentState.report,
              clarificationAnswers: smartAnswers,
            },
            testDataLevel: 'full',
          }));
        });
      }
    } else {
      // Level 3: Reset to empty state
      set({ 
        report: initialReport,
        clarificationQuestions: null,
        isLoadingQuestions: false,
        testDataLevel: 'none',
        consolidationStatus: initialConsolidationStatus,
        consolidationErrors: {},
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
      set({ 
        isLoadingQuestions: false,
        ...createLoadingOverlayUpdate('', false)
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
        message
      }
    }),

  hideLoadingOverlay: () =>
    set({ 
      loadingOverlay: { isOpen: false, message: '' }
    }),
    
  reset: () => set({ 
    report: initialReport,
    clarificationQuestions: null,
    lastNarrativeHash: null,
    isLoadingQuestions: false,
    testDataLevel: 'none',
    consolidationStatus: initialConsolidationStatus,
    consolidationErrors: {},
    consolidationHashes: {},
    apiMode: getInitialApiMode(),
    loadingOverlay: { isOpen: false, message: '' },
  }),
}));