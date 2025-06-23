/**
 * Legacy incident types - DEPRECATED
 * 
 * This file is being phased out in favor of:
 * - Store types: @/store/useIncidentStore (for internal state)
 * - API types: ./api-types (for API communication)
 * 
 * Import and re-export store types for backward compatibility
 */

import type {
  IncidentNarrative,
  ClarificationQuestions,
  ClarificationAnswer,
  ClarificationAnswers,
  NarrativeExtras,
} from '@/store/useIncidentStore';

// Re-export store types for backward compatibility
export type {
  IncidentNarrative,
  ClarificationQuestions,
  ClarificationAnswer,
  ClarificationAnswers,
  NarrativeExtras,
};

// Re-export new unified API types
export type {
  ApiResponse,
  PhaseLabel,
  ClarificationAnswerWithQuestion,
  IIncidentAPI,
  GenerateClarificationQuestionsRequest,
  GenerateClarificationQuestionsResponse,
  GenerateClarificationQuestionsResponseFrontend,
  EnhanceNarrativeContentRequest,
  EnhanceNarrativeContentResponse,
  IncidentNarrativeForAPI,
} from './api-types';

// Deprecated aliases for backward compatibility
export type {
  GenerateClarificationQuestionsResponseFrontend as ClarificationQuestionsResponse,
  EnhanceNarrativeContentRequest as NarrativeEnhancementRequest,
  EnhanceNarrativeContentResponse as NarrativeEnhancementResponse,
} from './api-types';