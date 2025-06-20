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

interface IncidentState {
  report: IncidentReport;
  clarificationQuestions: ClarificationQuestions | null;
  isLoadingQuestions: boolean;
  testDataLevel: TestDataLevel;
  consolidationStatus: ConsolidationStatus;
  consolidationErrors: ConsolidationErrors;
  updateMetadata: (metadata: Partial<IncidentMetadata>) => void;
  updateNarrative: (narrative: Partial<IncidentNarrative>) => void;
  updateClarificationAnswer: (phase: keyof ClarificationAnswers, questionId: string, answer: string) => void;
  setClarificationQuestions: (questions: ClarificationQuestions) => void;
  setLoadingQuestions: (loading: boolean) => void;
  consolidatePhaseNarrative: (phase: keyof NarrativeExtras) => Promise<void>;
  setConsolidationStatus: (phase: keyof NarrativeExtras, status: ConsolidationStatus[keyof NarrativeExtras]) => void;
  setConsolidationError: (phase: keyof NarrativeExtras, error?: string) => void;
  setNarrativeExtra: (phase: keyof NarrativeExtras, extra: string) => void;
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

export const useIncidentStore = create<IncidentState>((set, get) => ({
  report: initialReport,
  clarificationQuestions: null,
  isLoadingQuestions: false,
  testDataLevel: 'none',
  consolidationStatus: initialConsolidationStatus,
  consolidationErrors: {},
  
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
      // Level 2: Load mock questions and populate clarification answers
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

      set((state) => ({
        report: {
          ...state.report,
          clarificationAnswers: testClarificationAnswers,
        },
        clarificationQuestions: mockQuestions,
        testDataLevel: 'full',
      }));
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

  consolidatePhaseNarrative: async (phase: keyof NarrativeExtras) => {
    const state = get();
    
    // Set loading state
    set((currentState) => ({
      consolidationStatus: {
        ...currentState.consolidationStatus,
        [phase]: 'loading',
      },
    }));

    try {
      // Import N8N API service dynamically to avoid circular dependencies
      const { n8nApi } = await import('../lib/services/n8n-api');
      
      // Get clarification answers for this phase
      const clarificationAnswers = state.report.clarificationAnswers[phase];
      const clarificationQuestions = state.clarificationQuestions?.[phase] || [];
      
      // Map to API format
      const apiData = clarificationAnswers.map(answer => {
        const question = clarificationQuestions.find(q => q.id === answer.questionId);
        return {
          questionId: answer.questionId,
          question: question?.question || 'Unknown question',
          answer: answer.answer,
        };
      });

      // Map phase names for API
      const apiPhase = phase === 'beforeEvent' ? 'before_event' as const :
                      phase === 'duringEvent' ? 'during_event' as const :
                      phase === 'endEvent' ? 'end_event' as const :
                      'post_event' as const;

      // Make API call
      const result = await n8nApi.consolidateNarrative(apiData, apiPhase);

      if (result.success && result.data) {
        // Update narrative extra and mark as complete
        set((currentState) => ({
          report: {
            ...currentState.report,
            narrativeExtras: {
              ...currentState.report.narrativeExtras,
              [phase]: result.data!.narrative_extra,
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
        }));
      } else {
        // Handle API error
        set((currentState) => ({
          consolidationStatus: {
            ...currentState.consolidationStatus,
            [phase]: 'error',
          },
          consolidationErrors: {
            ...currentState.consolidationErrors,
            [phase]: result.error || 'Consolidation failed',
          },
        }));
      }
    } catch (error) {
      // Handle unexpected errors
      set((currentState) => ({
        consolidationStatus: {
          ...currentState.consolidationStatus,
          [phase]: 'error',
        },
        consolidationErrors: {
          ...currentState.consolidationErrors,
          [phase]: error instanceof Error ? error.message : 'Unknown error',
        },
      }));
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
    
  reset: () => set({ 
    report: initialReport,
    clarificationQuestions: null,
    isLoadingQuestions: false,
    testDataLevel: 'none',
    consolidationStatus: initialConsolidationStatus,
    consolidationErrors: {},
  }),
}));