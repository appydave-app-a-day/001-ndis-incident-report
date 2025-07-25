import { getN8NApiConfig, getApiUrls, PHASE_CUSTOM_INSTRUCTIONS, API_TIMEOUT, getRequestHeaders } from '../../config/api-config';
import type {
  IIncidentAPI,
  ApiResponse,
  GenerateClarificationQuestionsRequest,
  GenerateClarificationQuestionsResponse,
  GenerateClarificationQuestionsResponseFrontend,
  EnhanceNarrativeContentRequest,
  ClarificationAnswerWithQuestion,
  PhaseLabel,
  AnalyzeContributingConditionsRequest,
  AnalyzeContributingConditionsResponse,
  GenerateIncidentAnalysisRequest,
  GenerateIncidentAnalysisResponse,
  GenerateIncidentAnalysisResponseFrontend,
  GenerateMockAnswersRequest,
  GenerateMockAnswersResponse,
} from '../types/api-types';
import type { NarrativeExtras } from '../types/incident-types';

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

    const response = await this.makeRequest<GenerateClarificationQuestionsRequest, Record<string, unknown>>(
      this.urls.clarificationQuestions,
      requestData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get clarification questions');
    }

    // Transform N8N response to our interface
    // The actual response structure is: { clarification_questions: { output: "json_string" } }
    try {
      const responseData = response.data as Record<string, unknown>;
      const clarificationData = responseData.clarification_questions as Record<string, unknown> | undefined;
      if (!clarificationData || !(clarificationData.output)) {
        throw new Error('Invalid response structure: missing clarification_questions.output');
      }

      // Parse the JSON string from the output field
      const questionsJson = clarificationData.output as string;
      
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

    // Debug log the request in development
    if (import.meta.env.DEV) {
      console.log('🔗 N8N Request Data:', JSON.stringify(requestData, null, 2));
    }

    const response = await this.makeRequest<EnhanceNarrativeContentRequest, Record<string, unknown>>(
      this.urls.narrativeConsolidation,
      requestData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to enhance narrative');
    }

    // Handle the actual N8N response structure which contains both 'output' and 'narrative' fields
    const responseData = response.data as Record<string, unknown>;
    if (typeof response.data === 'string') {
      return response.data;
    } else if (responseData.output) {
      // Use the 'output' field as it contains the enhanced narrative
      return responseData.output as string;
    } else if (responseData.narrative) {
      // Fallback to 'narrative' field if output is not available
      return responseData.narrative as string;
    } else if (responseData.enhancedNarrative) {
      return responseData.enhancedNarrative as string;
    } else if (responseData.narrative_extra) {
      return responseData.narrative_extra as string;
    } else {
      console.error('Unable to extract enhanced narrative from response:', response.data);
      throw new Error('Invalid response structure from narrative enhancement endpoint');
    }
  }

  async analyzeContributingConditions(
    narrativeSections: {
      beforeEvent: string;
      beforeEventExtra: string;
      duringEvent: string;
      duringEventExtra: string;
      endEvent: string;
      endEventExtra: string;
      postEvent: string;
      postEventExtra: string;
    },
    metadata: {
      participantName: string;
      reporterName: string;
      location: string;
      eventDateTime: string;
    }
  ): Promise<string> {
    // Map to N8N API expected format
    const requestData: AnalyzeContributingConditionsRequest = {
      reporter_name: metadata.reporterName,
      participant_name: metadata.participantName,
      event_datetime: metadata.eventDateTime,
      location: metadata.location,
      before_event: narrativeSections.beforeEvent,
      before_event_extra: narrativeSections.beforeEventExtra,
      during_event: narrativeSections.duringEvent,
      during_event_extra: narrativeSections.duringEventExtra,
      end_of_event: narrativeSections.endEvent,
      end_of_event_extra: narrativeSections.endEventExtra,
      post_event_support: narrativeSections.postEvent,
      post_event_support_extra: narrativeSections.postEventExtra,
    };

    // Debug log the request in development
    if (import.meta.env.DEV) {
      console.log('🔗 N8N Contributing Conditions Request Data:', JSON.stringify(requestData, null, 2));
    }

    const response = await this.makeRequest<AnalyzeContributingConditionsRequest, AnalyzeContributingConditionsResponse>(
      this.urls.contributingConditionsAnalysis,
      requestData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to analyze contributing conditions');
    }

    // Extract the conditions markdown from the response
    const apiData = response.data;
    
    // Return the conditions_markdown field, fallback to output if needed
    return apiData.conditions_markdown || apiData.output || '';
  }

  async generateIncidentAnalysis(
    consolidatedNarrative: string,
    metadata: {
      participantName: string;
      reporterName: string;
      location: string;
      incidentDate: string;
    }
  ): Promise<GenerateIncidentAnalysisResponseFrontend> {
    // Map to N8N API expected format
    const requestData: GenerateIncidentAnalysisRequest = {
      consolidated_narrative: consolidatedNarrative,
      participant_name: metadata.participantName,
      reporter_name: metadata.reporterName,
      location: metadata.location,
      incident_date: metadata.incidentDate,
    };

    // Debug log the request in development
    if (import.meta.env.DEV) {
      console.log('🔗 N8N Analysis Request Data:', JSON.stringify(requestData, null, 2));
    }

    const response = await this.makeRequest<GenerateIncidentAnalysisRequest, GenerateIncidentAnalysisResponse>(
      this.urls.incidentAnalysis,
      requestData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to generate incident analysis');
    }

    // Transform the API response to frontend format
    const apiData = response.data;
    
    return {
      contributingConditions: apiData.contributing_conditions.immediate_conditions,
      classifications: apiData.incident_classifications.map((classification, index) => ({
        id: `api-classification-${index + 1}`,
        incidentType: classification.incident_type,
        supportingEvidence: classification.supporting_evidence,
        severity: classification.severity,
        confidence: classification.confidence,
      })),
    };
  }

  async generateMockAnswers(
    phase: string,
    phaseNarrative: string,
    questions: Array<{ id: string; question: string }>,
    metadata: { participantName: string; reporterName: string; location: string }
  ): Promise<GenerateMockAnswersResponse> {
    // Map to N8N API expected format
    const requestData: GenerateMockAnswersRequest = {
      participant_name: metadata.participantName,
      reporter_name: metadata.reporterName,
      location: metadata.location,
      phase: phase,
      phase_narrative: phaseNarrative,
      questions: questions,
    };

    // Make the API request
    const result = await this.makeRequest<GenerateMockAnswersRequest, GenerateMockAnswersResponse>(
      `${this.config.domain}/webhook/generate-mock-answers`,
      requestData
    );

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to generate mock answers');
    }

    return result.data;
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
        headers: getRequestHeaders(),
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
      let errorMessage = 'Unknown error';
      let errorType: 'cors' | 'auth' | 'timeout' | 'forbidden' | 'not_found' | 'server_error' | 'network' = 'network';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Identify specific error types
        if (error.message.includes('Failed to fetch')) {
          errorType = 'cors';
          errorMessage = 'CORS policy is blocking the request. Please contact your administrator to configure the server.';
        } else if (error.message.includes('401')) {
          errorType = 'auth';
          errorMessage = 'Authentication failed. Please check your API key configuration.';
        } else if (error.message.includes('timeout')) {
          errorType = 'timeout';
          errorMessage = 'Request timed out. The server may be overloaded or unreachable.';
        } else if (error.message.includes('403')) {
          errorType = 'forbidden';
          errorMessage = 'Access denied. Please verify your permissions.';
        } else if (error.message.includes('404')) {
          errorType = 'not_found';
          errorMessage = 'API endpoint not found. Please verify the server configuration.';
        } else if (error.message.includes('500')) {
          errorType = 'server_error';
          errorMessage = 'Server error occurred. Please try again later.';
        }
      }
      
      // Log error in development with more context
      if (import.meta.env.DEV) {
        console.error('🚨 N8N API Error:', {
          endpoint: url,
          error: errorMessage,
          errorType,
          originalError: error,
          timestamp: new Date().toISOString(),
          hasApiKey: !!import.meta.env.VITE_N8N_API_KEY,
        });
      }

      return {
        success: false,
        error: errorMessage,
        errorType,
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