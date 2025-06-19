/**
 * TypeScript interfaces for N8N API integration
 * Supports both clarification questions and narrative consolidation endpoints
 */

// ============================================================================
// Configuration Types
// ============================================================================

export interface N8NApiConfig {
  domain: string;
  mode: 'mock' | 'live';
  endpoints: {
    clarificationQuestions: 'narrative-report-clarification';
    narrativeConsolidation: 'narrative-consolidation';
  };
}

// ============================================================================
// Clarification Questions API Types
// ============================================================================

export interface ClarificationQuestionsRequest {
  participant_name: string;
  reporter_name: string;
  location: string;
  before_event: string;
  during_event: string;
  end_of_event: string;
  post_event_support: string;
}

export interface ClarificationQuestionsResponse {
  before_event_questions: string[];
  during_event_questions: string[];
  end_of_event_questions: string[];
  post_event_questions: string[];
}

// ============================================================================
// Narrative Consolidation API Types
// ============================================================================

export interface NarrativeConsolidationRequest {
  clarification_questions: Array<{
    question: string;
    answer: string;
  }>;
  custom_instructions: string;
}

export interface NarrativeConsolidationResponse {
  narrative_extra: string;
}

// ============================================================================
// Phase-Specific Types
// ============================================================================

export type IncidentPhase = 'before_event' | 'during_event' | 'end_event' | 'post_event';

export interface PhaseCustomInstructions {
  before_event: string;
  during_event: string;
  end_event: string;
  post_event: string;
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export interface N8NApiError {
  message: string;
  status?: number;
  endpoint?: string;
  timestamp: string;
}

// ============================================================================
// Integration Types (for mapping between internal and API formats)
// ============================================================================

export interface IncidentDataForQuestions {
  participantName: string;
  reporterName: string;
  location: string;
  beforeEvent: string;
  duringEvent: string;
  endEvent: string;
  postEvent: string;
}

export interface ClarificationAnswersForConsolidation {
  questionId: string;
  question: string;
  answer: string;
}