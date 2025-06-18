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

export interface IncidentReport {
  metadata: IncidentMetadata;
  narrative: IncidentNarrative;
}

interface IncidentState {
  report: IncidentReport;
  clarificationQuestions: ClarificationQuestions | null;
  isLoadingQuestions: boolean;
  updateMetadata: (metadata: Partial<IncidentMetadata>) => void;
  updateNarrative: (narrative: Partial<IncidentNarrative>) => void;
  setClarificationQuestions: (questions: ClarificationQuestions) => void;
  setLoadingQuestions: (loading: boolean) => void;
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
    
  reset: () => set({ 
    report: initialReport,
    clarificationQuestions: null,
    isLoadingQuestions: false
  }),
}));