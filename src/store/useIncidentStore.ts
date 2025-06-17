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

export interface IncidentReport {
  metadata: IncidentMetadata;
  narrative: IncidentNarrative;
}

interface IncidentState {
  report: IncidentReport;
  updateMetadata: (metadata: Partial<IncidentMetadata>) => void;
  updateNarrative: (narrative: Partial<IncidentNarrative>) => void;
  reset: () => void;
  isMetadataComplete: () => boolean;
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
    
  isMetadataComplete: () => {
    const { metadata } = get().report;
    return !!(
      metadata.reporterName.trim() &&
      metadata.participantName.trim() &&
      metadata.eventDateTime.trim() &&
      metadata.location.trim()
    );
  },
    
  reset: () => set({ report: initialReport }),
}));