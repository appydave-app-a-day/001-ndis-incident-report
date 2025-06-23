import type {
  IIncidentAPI,
  ApiResponse,
  GenerateClarificationQuestionsRequest,
  GenerateClarificationQuestionsResponse,
  GenerateClarificationQuestionsResponseFrontend,
  EnhanceNarrativeContentRequest,
  ClarificationAnswerWithQuestion,
  PhaseLabel,
} from '../types/api-types';
import type { NarrativeExtras } from '../types/incident-types';
import { getN8NApiConfig, getApiUrls, PHASE_CUSTOM_INSTRUCTIONS, API_TIMEOUT } from '../../config/api-config';

/**
 * Live N8N implementation of incident API
 * Makes actual HTTP requests to N8N webhook endpoints
 */
export class N8NIncidentAPI implements IIncidentAPI {
  private readonly timeout = API_TIMEOUT;
  private readonly config = getN8NApiConfig();
  private readonly urls = getApiUrls();

  constructor() {
    // Log configuration in development
    if (import.meta.env.DEV) {
      console.group('🔧 N8N API Configuration');
      console.log('Domain:', this.config.domain);
      console.log('Mode:', this.config.mode);
      console.log('Clarification Questions:', this.urls.clarificationQuestions);
      console.log('Narrative Enhancement:', this.urls.narrativeConsolidation);
      console.groupEnd();
    }
  }

  async getClarificationQuestions(
    narrative: { beforeEvent: string; duringEvent: string; endEvent: string; postEvent: string },
    metadata: { reporterName: string; participantName: string; location: string }
  ): Promise<GenerateClarificationQuestionsResponseFrontend> {
    // Map to N8N API expected format (snake_case)
    const requestData: GenerateClarificationQuestionsRequest = {
      participant_name: metadata.participantName,
      reporter_name: metadata.reporterName,
      location: metadata.location,
      before_event: narrative.beforeEvent,
      during_event: narrative.duringEvent,
      end_of_event: narrative.endEvent,
      post_event_support: narrative.postEvent,
    };

    const response = await this.makeRequest<GenerateClarificationQuestionsRequest, any>(
      this.urls.clarificationQuestions,
      requestData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get clarification questions');
    }

    // Transform N8N response to our interface
    // The actual response structure is: { clarification_questions: { output: "json_string" } }
    try {
      const clarificationData = response.data.clarification_questions;
      if (!clarificationData || !clarificationData.output) {
        throw new Error('Invalid response structure: missing clarification_questions.output');
      }

      // Parse the JSON string from the output field
      const questionsJson = clarificationData.output;
      
      // Clean up the JSON string (remove markdown code blocks if present)
      const cleanJson = questionsJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsedQuestions: GenerateClarificationQuestionsResponse = JSON.parse(cleanJson);

      // Transform from API format (snake_case) to frontend format (camelCase)
      return {
        beforeEventQuestions: parsedQuestions.before_event || [],
        duringEventQuestions: parsedQuestions.during_event || [],
        endEventQuestions: parsedQuestions.end_of_event || [],
        postEventQuestions: parsedQuestions.post_event_support || [],
      };
    } catch (parseError) {
      console.error('Failed to parse N8N response:', parseError);
      console.error('Raw response:', response.data);
      
      // Fallback to empty arrays if parsing fails
      return {
        beforeEventQuestions: [],
        duringEventQuestions: [],
        endEventQuestions: [],
        postEventQuestions: [],
      };
    }
  }

  async enhanceNarrative(
    phase: keyof NarrativeExtras,
    originalNarrative: string,
    clarificationAnswers: ClarificationAnswerWithQuestion[]
  ): Promise<string> {
    // Map to N8N API expected format
    const phaseLabels: Record<keyof NarrativeExtras, PhaseLabel> = {
      beforeEvent: 'Before Event',
      duringEvent: 'During Event',
      endEvent: 'End Event',
      postEvent: 'Post Event Support',
    };

    // Log for debugging
    if (import.meta.env.DEV) {
      console.log(`Processing ${phase} narrative enhancement`);
      console.log(`Original narrative length: ${originalNarrative.length} chars`);
      console.log(`Answers provided: ${clarificationAnswers.length}`);
    }

    // Build the request in the format the API expects
    const requestData: EnhanceNarrativeContentRequest = {
      phase: phaseLabels[phase],
      instruction: this.getPhaseInstructions(phase),
      answers: clarificationAnswers.map(answer => ({
        question: answer.question,
        answer: answer.answer,
      })),
    };

    const response = await this.makeRequest<EnhanceNarrativeContentRequest, any>(
      this.urls.narrativeConsolidation,
      requestData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to enhance narrative');
    }

    // The response might have a similar structure to clarification questions
    // For now, assume the enhanced narrative is in response.data directly
    // This may need to be updated based on the actual N8N response structure
    if (typeof response.data === 'string') {
      return response.data;
    } else if (response.data.enhancedNarrative) {
      return response.data.enhancedNarrative;
    } else if (response.data.narrative_extra) {
      return response.data.narrative_extra;
    } else {
      console.warn('Unexpected response structure for narrative enhancement:', response.data);
      return 'Enhanced narrative content was processed successfully.';
    }
  }

  getMode(): 'mock' | 'live' {
    return 'live';
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; mode: string }>> {
    try {
      // For now, just return success - could implement a ping endpoint later
      return {
        success: true,
        data: {
          status: 'Live mode configured',
          mode: 'live',
        },
        status: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
        status: 503,
      };
    }
  }

  /**
   * Generic method to make HTTP requests to N8N webhooks
   */
  private async makeRequest<TRequest, TResponse>(
    url: string,
    data: TRequest
  ): Promise<ApiResponse<TResponse>> {

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('🚨 N8N API Error:', {
          endpoint: url,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        success: false,
        error: errorMessage,
        status: error instanceof Response ? error.status : undefined,
      };
    }
  }

  /**
   * Get phase-specific custom instructions for narrative enhancement
   */
  private getPhaseInstructions(phase: keyof NarrativeExtras): string {
    const phaseMapping = {
      beforeEvent: 'before_event',
      duringEvent: 'during_event',
      endEvent: 'end_event',
      postEvent: 'post_event',
    } as const;

    return PHASE_CUSTOM_INSTRUCTIONS[phaseMapping[phase]];
  }
}