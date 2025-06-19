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

interface IncidentState {
  report: IncidentReport;
  clarificationQuestions: ClarificationQuestions | null;
  isLoadingQuestions: boolean;
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
    // Calculate date minus 1 day and format it
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
    }));
  },
    
  reset: () => set({ 
    report: initialReport,
    clarificationQuestions: null,
    isLoadingQuestions: false
  }),
}));