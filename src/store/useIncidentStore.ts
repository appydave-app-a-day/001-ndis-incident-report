import { create } from 'zustand';

export interface IncidentMetadata {
  reporterName: string;
  participantName: string;
  eventDateTime: string;
  location: string;
}

export interface IncidentNarrative {
  before: string;
  during: string;
  end: string;
  postEvent: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  phase: 'before' | 'during' | 'end' | 'postEvent';
}

export interface ClarificationQuestions {
  before: ClarificationQuestion[];
  during: ClarificationQuestion[];
  end: ClarificationQuestion[];
  postEvent: ClarificationQuestion[];
}

export interface ClarificationAnswer {
  questionId: string;
  answer: string;
}

export interface ClarificationAnswers {
  before: ClarificationAnswer[];
  during: ClarificationAnswer[];
  end: ClarificationAnswer[];
  postEvent: ClarificationAnswer[];
}

export interface IncidentReport {
  metadata: IncidentMetadata;
  narrative: IncidentNarrative;
  clarificationAnswers: ClarificationAnswers;
}

type TestDataLevel = 'none' | 'basic' | 'full';

interface IncidentState {
  report: IncidentReport;
  clarificationQuestions: ClarificationQuestions | null;
  isLoadingQuestions: boolean;
  testDataLevel: TestDataLevel;
  updateMetadata: (metadata: Partial<IncidentMetadata>) => void;
  updateNarrative: (narrative: Partial<IncidentNarrative>) => void;
  updateClarificationAnswer: (phase: keyof ClarificationAnswers, questionId: string, answer: string) => void;
  setClarificationQuestions: (questions: ClarificationQuestions) => void;
  setLoadingQuestions: (loading: boolean) => void;
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
    before: '',
    during: '',
    end: '',
    postEvent: '',
  },
  clarificationAnswers: {
    before: [],
    during: [],
    end: [],
    postEvent: [],
  },
};

export const useIncidentStore = create<IncidentState>((set, get) => ({
  report: initialReport,
  clarificationQuestions: null,
  isLoadingQuestions: false,
  testDataLevel: 'none',
  
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
      narrative.before.trim() ||
      narrative.during.trim() ||
      narrative.end.trim() ||
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
        before: 'Lisa was sitting in the lounge room just watching a little bit of TV she was fairly calm and peaceful, And then a pizza delivery man came and bashed on the door really loudly',
        during: 'Lisa started getting incredibly agitated and started screaming intruder intruder, and went into the kitchen and grabbed a knife and threatened to hurt. Whoever was at the door',
        end: 'the police were called and they came and were able to subdue Lisa get the knife away from her and then she was taken to the local psychiatric hospital',
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
        before: [
          { id: 'b1', question: 'What was the participant doing before the incident?', phase: 'before' },
          { id: 'b2', question: 'Do you like green eggs?', phase: 'before' },
          { id: 'b3', question: 'What was the environment like before the incident?', phase: 'before' }
        ],
        during: [
          { id: 'd1', question: 'How long did the incident last?', phase: 'during' },
          { id: 'd2', question: 'Who else was present during the incident?', phase: 'during' },
          { id: 'd3', question: 'What interventions were attempted?', phase: 'during' }
        ],
        end: [
          { id: 'e1', question: 'How was the incident resolved?', phase: 'end' },
          { id: 'e2', question: 'Was anyone injured?', phase: 'end' },
          { id: 'e3', question: 'What was the immediate outcome?', phase: 'end' }
        ],
        postEvent: [
          { id: 'p1', question: 'What follow-up actions were taken?', phase: 'postEvent' },
          { id: 'p2', question: 'Was a supervisor or manager notified?', phase: 'postEvent' },
          { id: 'p3', question: 'What support was provided to the participant?', phase: 'postEvent' }
        ]
      };

      const testClarificationAnswers: ClarificationAnswers = {
        before: [
          { questionId: 'b1', answer: 'Lisa was sitting quietly on the couch, watching afternoon television and appeared relaxed' },
          { questionId: 'b2', answer: 'No, she prefers regular eggs' },
          { questionId: 'b3', answer: 'The living room was calm and quiet, with normal lighting and no other people present' }
        ],
        during: [
          { questionId: 'd1', answer: 'The incident lasted approximately 15-20 minutes from start to finish' },
          { questionId: 'd2', answer: 'Only the pizza delivery person at the door and myself as the support worker were present' },
          { questionId: 'd3', answer: 'I attempted verbal de-escalation and tried to explain who was at the door, but Lisa was too agitated to listen' }
        ],
        end: [
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
      });
    }
  },
    
  reset: () => set({ 
    report: initialReport,
    clarificationQuestions: null,
    isLoadingQuestions: false,
    testDataLevel: 'none'
  }),
}));