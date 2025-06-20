import type {
  ClarificationQuestionsRequest,
  ClarificationQuestionsResponse,
  NarrativeConsolidationRequest,
  NarrativeConsolidationResponse,
  ApiResponse,
  IncidentDataForQuestions,
  ClarificationAnswersForConsolidation,
  IncidentPhase,
  N8NApiError,
} from '../types/n8n-types';

import { 
  getApiUrls, 
  getRequestHeaders, 
  isMockMode, 
  API_TIMEOUT,
  PHASE_CUSTOM_INSTRUCTIONS,
  logConfigInfo,
} from '../config/api-config';
import { MockN8NApiService } from './mock-n8n-service';

/**
 * N8N API Service
 * Main service for interacting with N8N webhooks
 * Supports both mock and live modes based on configuration
 */

export class N8NApiService {
  private static instance: N8NApiService;

  constructor() {
    // Log configuration on first instantiation
    if (import.meta.env.DEV) {
      logConfigInfo();
    }
  }

  /**
   * Singleton pattern for service instance
   */
  static getInstance(): N8NApiService {
    if (!N8NApiService.instance) {
      N8NApiService.instance = new N8NApiService();
    }
    return N8NApiService.instance;
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  /**
   * Get clarification questions for an incident
   */
  async getClarificationQuestions(
    incidentData: IncidentDataForQuestions,
    userApiMode?: 'mock' | 'live'
  ): Promise<ApiResponse<ClarificationQuestionsResponse>> {
    try {
      const request = this.mapIncidentDataToRequest(incidentData);

      if (isMockMode(userApiMode)) {
        return await MockN8NApiService.getClarificationQuestions(request);
      }

      return await this.callClarificationQuestionsAPI(request);
    } catch (error) {
      return this.handleError(error, 'getClarificationQuestions');
    }
  }

  /**
   * Consolidate narrative for a specific phase
   */
  async consolidateNarrative(
    clarificationAnswers: ClarificationAnswersForConsolidation[],
    phase: IncidentPhase,
    userApiMode?: 'mock' | 'live'
  ): Promise<ApiResponse<NarrativeConsolidationResponse>> {
    try {
      const request = this.mapToConsolidationRequest(clarificationAnswers, phase);

      if (isMockMode(userApiMode)) {
        return await MockN8NApiService.consolidateNarrative(request, phase);
      }

      return await this.callNarrativeConsolidationAPI(request);
    } catch (error) {
      return this.handleError(error, 'consolidateNarrative');
    }
  }

  /**
   * Consolidate all narratives (four separate API calls)
   */
  async consolidateAllNarratives(
    allClarificationAnswers: {
      beforeEvent: ClarificationAnswersForConsolidation[];
      duringEvent: ClarificationAnswersForConsolidation[];
      endEvent: ClarificationAnswersForConsolidation[];
      postEvent: ClarificationAnswersForConsolidation[];
    }
  ): Promise<{
    beforeEvent: ApiResponse<NarrativeConsolidationResponse>;
    duringEvent: ApiResponse<NarrativeConsolidationResponse>;
    endEvent: ApiResponse<NarrativeConsolidationResponse>;
    postEvent: ApiResponse<NarrativeConsolidationResponse>;
  }> {
    // Execute all four consolidation calls in parallel
    const [beforeEvent, duringEvent, endEvent, postEvent] = await Promise.all([
      this.consolidateNarrative(allClarificationAnswers.beforeEvent, 'before_event'),
      this.consolidateNarrative(allClarificationAnswers.duringEvent, 'during_event'),
      this.consolidateNarrative(allClarificationAnswers.endEvent, 'end_event'),
      this.consolidateNarrative(allClarificationAnswers.postEvent, 'post_event'),
    ]);

    return {
      beforeEvent,
      duringEvent,
      endEvent,
      postEvent,
    };
  }

  // ============================================================================
  // Private API Call Methods
  // ============================================================================

  private async callClarificationQuestionsAPI(
    request: ClarificationQuestionsRequest
  ): Promise<ApiResponse<ClarificationQuestionsResponse>> {
    const urls = getApiUrls();
    
    const response = await fetch(urls.clarificationQuestions, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(API_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      status: response.status,
    };
  }

  private async callNarrativeConsolidationAPI(
    request: NarrativeConsolidationRequest
  ): Promise<ApiResponse<NarrativeConsolidationResponse>> {
    const urls = getApiUrls();
    
    const response = await fetch(urls.narrativeConsolidation, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(API_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      status: response.status,
    };
  }

  // ============================================================================
  // Data Mapping Methods
  // ============================================================================

  private mapIncidentDataToRequest(
    incidentData: IncidentDataForQuestions
  ): ClarificationQuestionsRequest {
    return {
      participant_name: incidentData.participantName,
      reporter_name: incidentData.reporterName,
      location: incidentData.location,
      before_event: incidentData.beforeEvent,
      during_event: incidentData.duringEvent,
      end_of_event: incidentData.endEvent,
      post_event_support: incidentData.postEvent,
    };
  }

  private mapToConsolidationRequest(
    clarificationAnswers: ClarificationAnswersForConsolidation[],
    phase: IncidentPhase
  ): NarrativeConsolidationRequest {
    return {
      clarification_questions: clarificationAnswers.map(answer => ({
        question: answer.question,
        answer: answer.answer,
      })),
      custom_instructions: PHASE_CUSTOM_INSTRUCTIONS[phase],
    };
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  private handleError(error: unknown, operation: string): ApiResponse<never> {
    const apiError: N8NApiError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      endpoint: operation,
      timestamp: new Date().toISOString(),
    };

    // Extract status code if available
    if (error instanceof Response) {
      apiError.status = error.status;
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('🚨 N8N API Error:', apiError);
    }

    return {
      success: false,
      error: apiError.message,
      status: apiError.status,
    };
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Health check for the API service
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; mode: string }>> {
    if (isMockMode()) {
      const mockResult = await MockN8NApiService.healthCheck();
      return {
        ...mockResult,
        data: {
          status: 'Mock mode operational',
          mode: 'mock',
        },
      };
    }

    // For live mode, we could implement a ping endpoint
    return {
      success: true,
      data: {
        status: 'Live mode configured',
        mode: 'live',
      },
    };
  }

  /**
   * Get current configuration info
   */
  getConfigInfo() {
    const urls = getApiUrls();
    return {
      mode: isMockMode() ? 'mock' : 'live',
      endpoints: urls,
      timeout: API_TIMEOUT,
    };
  }
}

// ============================================================================
// Convenience Export
// ============================================================================

/**
 * Default instance for easy importing
 */
export const n8nApi = N8NApiService.getInstance();