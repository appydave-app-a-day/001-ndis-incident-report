/**
 * Unified API Types for NDIS Incident Report System
 * 
 * This file contains all API request/response types for the two supported endpoints:
 * 1. generate-clarification-questions
 * 2. enhance-narrative-content
 * 
 * Types are named clearly to indicate:
 * - Which endpoint they're for
 * - Whether they're Request or Response
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export type PhaseLabel = 'Before Event' | 'During Event' | 'End Event' | 'Post Event Support';

// ============================================================================
// Generate Clarification Questions API
// ============================================================================

/**
 * Request to generate clarification questions from incident narrative
 * Endpoint: POST /webhook/generate-clarification-questions
 */
export interface GenerateClarificationQuestionsRequest {
  participant_name: string;
  reporter_name: string;
  location: string;
  before_event: string;
  during_event: string;
  end_of_event: string;
  post_event_support: string;
}

/**
 * Response from generate clarification questions API
 * Returns arrays of question strings for each phase
 */
export interface GenerateClarificationQuestionsResponse {
  before_event: string[];
  during_event: string[];
  end_of_event: string[];
  post_event_support: string[];
}

/**
 * Internal frontend representation after transformation
 * (camelCase fields for frontend consumption)
 */
export interface GenerateClarificationQuestionsResponseFrontend {
  beforeEventQuestions: string[];
  duringEventQuestions: string[];
  endEventQuestions: string[];
  postEventQuestions: string[];
}

// ============================================================================
// Enhance Narrative Content API
// ============================================================================

/**
 * Request to enhance narrative content using clarification answers
 * Endpoint: POST /webhook/enhance-narrative-content
 */
export interface EnhanceNarrativeContentRequest {
  phase: PhaseLabel;
  instruction: string;
  answers: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Response from enhance narrative content API
 * Returns enhanced narrative text
 */
export interface EnhanceNarrativeContentResponse {
  enhancedNarrative: string;
  phase: PhaseLabel;
  processingTime?: number;
}

// ============================================================================
// Integration Types (Frontend to API mapping)
// ============================================================================

/**
 * Answer with question text for API requests
 * Used when we need both question ID (for tracking) and question text (for API)
 */
export interface ClarificationAnswerWithQuestion {
  questionId: string;
  question: string;
  answer: string;
}

/**
 * Helper type for transforming frontend data to API format
 */
export interface IncidentNarrativeForAPI {
  participantName: string;
  reporterName: string;
  location: string;
  beforeEvent: string;
  duringEvent: string;
  endEvent: string;
  postEvent: string;
}

// ============================================================================
// API Configuration Types
// ============================================================================

export interface ApiConfig {
  mode: 'mock' | 'live';
  domain: string;
  endpoints: {
    generateClarificationQuestions: string;
    enhanceNarrativeContent: string;
  };
  timeout: number;
}

export interface ApiError {
  message: string;
  status?: number;
  endpoint?: string;
  timestamp: string;
}

// ============================================================================
// Service Interface
// ============================================================================

/**
 * Interface that both Mock and Live API providers must implement
 */
export interface IIncidentAPI {
  /**
   * Generate clarification questions based on incident narrative
   */
  getClarificationQuestions(
    narrative: { beforeEvent: string; duringEvent: string; endEvent: string; postEvent: string },
    metadata: { reporterName: string; participantName: string; location: string }
  ): Promise<GenerateClarificationQuestionsResponseFrontend>;

  /**
   * Enhance narrative content using clarification answers
   * 
   * @param phase - The narrative phase being enhanced
   * @param originalNarrative - The original narrative text (may not be used by API)
   * @param clarificationAnswers - Array of question/answer pairs
   */
  enhanceNarrative(
    phase: keyof { beforeEvent: string; duringEvent: string; endEvent: string; postEvent: string },
    originalNarrative: string,
    clarificationAnswers: ClarificationAnswerWithQuestion[]
  ): Promise<string>;

  /**
   * Get current API mode
   */
  getMode(): 'mock' | 'live';

  /**
   * Health check for the API service
   */
  healthCheck(): Promise<ApiResponse<{ status: string; mode: string }>>;
}