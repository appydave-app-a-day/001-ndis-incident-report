/**
 * DEPRECATED - N8N Types moved to api-types.ts
 * 
 * This file contains legacy N8N-specific configuration types.
 * All API request/response types have been moved to:
 * @see src/lib/services/types/api-types.ts
 */

// ============================================================================
// Configuration Types (kept for backward compatibility)
// ============================================================================

export interface N8NApiConfig {
  domain: string;
  mode: 'mock' | 'live';
  endpoints: {
    clarificationQuestions: string;
    narrativeConsolidation: string;
  };
}

// ============================================================================
// Phase-Specific Types (kept for config)
// ============================================================================

export type IncidentPhase = 'before_event' | 'during_event' | 'end_event' | 'post_event';

export interface PhaseCustomInstructions {
  before_event: string;
  during_event: string;
  end_event: string;
  post_event: string;
}

// ============================================================================
// Error Types 
// ============================================================================

export interface N8NApiError {
  message: string;
  status?: number;
  endpoint?: string;
  timestamp: string;
}

// NOTE: All other types have been moved to api-types.ts for better organization