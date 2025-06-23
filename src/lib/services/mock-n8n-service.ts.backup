import type {
  ClarificationQuestionsRequest,
  ClarificationQuestionsResponse,
  NarrativeConsolidationRequest,
  NarrativeConsolidationResponse,
  ApiResponse,
} from '../types/n8n-types';

/**
 * Mock N8N API Service
 * Provides realistic test data for development and testing
 */

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CLARIFICATION_QUESTIONS: ClarificationQuestionsResponse = {
  before_event_questions: [
    'What was the participant doing before the incident?',
    'What was the environment like before the incident?',
    'Were there any unusual circumstances or triggers present?',
    'Who else was present in the area before the incident?',
    'What was the participant\'s mood or behavior immediately before?',
  ],
  during_event_questions: [
    'How long did the incident last?',
    'Who else was present during the incident?',
    'What interventions were attempted?',
    'What specific behaviors or actions were observed?',
    'Were there any safety concerns during the incident?',
  ],
  end_of_event_questions: [
    'How was the incident resolved?',
    'Was anyone injured during the incident?',
    'What was the immediate outcome?',
    'What techniques were successful in de-escalation?',
    'How did the participant respond to interventions?',
  ],
  post_event_questions: [
    'What follow-up actions were taken?',
    'Was a supervisor or manager notified?',
    'What support was provided to the participant?',
    'Were there any environmental changes made?',
    'What debriefing or documentation was completed?',
  ],
};

const MOCK_NARRATIVE_EXTRAS = {
  before_event: 'Additional context: The participant had been in a stable, calm environment for approximately 30 minutes prior to the incident. Environmental conditions were optimal for the participant\'s wellbeing, with appropriate lighting and minimal noise. No known triggers or stressors were present in the immediate area during this period.',
  
  during_event: 'Additional details: The incident escalated gradually over a 15-20 minute period, with clear behavioral indicators preceding the peak intensity. Support staff maintained visual contact throughout and implemented de-escalation techniques consistently. Safety protocols were followed and no physical harm occurred to any individuals present.',
  
  end_event: 'Resolution details: The situation was resolved through patient verbal de-escalation and environmental modifications. The participant responded positively to calming techniques and gradually returned to baseline behavior. Professional intervention was effective in ensuring a safe outcome for all involved parties.',
  
  post_event: 'Follow-up actions: Comprehensive documentation was completed within 2 hours of the incident. The participant received appropriate support and monitoring, with no ongoing concerns identified. All relevant parties were notified according to protocol, and preventive measures were discussed for future situations.',
};

// ============================================================================
// Simulation Delays
// ============================================================================

const MOCK_API_DELAY = {
  clarificationQuestions: 1500, // 1.5 seconds
  narrativeConsolidation: 2000, // 2 seconds
};

// ============================================================================
// Mock Service Implementation
// ============================================================================

export class MockN8NApiService {
  /**
   * Mock implementation of clarification questions API
   */
  static async getClarificationQuestions(
    request: ClarificationQuestionsRequest
  ): Promise<ApiResponse<ClarificationQuestionsResponse>> {
    try {
      // Simulate API delay
      await new Promise(resolve => 
        setTimeout(resolve, MOCK_API_DELAY.clarificationQuestions)
      );

      // Log request in development
      if (import.meta.env.DEV) {
        console.group('🔄 Mock N8N: Clarification Questions Request');
        console.log('Participant:', request.participant_name);
        console.log('Reporter:', request.reporter_name);
        console.log('Location:', request.location);
        console.log('Before Event Length:', request.before_event.length, 'chars');
        console.log('During Event Length:', request.during_event.length, 'chars');
        console.log('End Event Length:', request.end_of_event.length, 'chars');
        console.log('Post Event Length:', request.post_event_support.length, 'chars');
        console.groupEnd();
      }

      return {
        success: true,
        data: MOCK_CLARIFICATION_QUESTIONS,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mock API error',
      };
    }
  }

  /**
   * Mock implementation of narrative consolidation API
   */
  static async consolidateNarrative(
    request: NarrativeConsolidationRequest,
    phase: 'before_event' | 'during_event' | 'end_event' | 'post_event'
  ): Promise<ApiResponse<NarrativeConsolidationResponse>> {
    try {
      // Simulate API delay
      await new Promise(resolve => 
        setTimeout(resolve, MOCK_API_DELAY.narrativeConsolidation)
      );

      // Log request in development
      if (import.meta.env.DEV) {
        console.group(`🔄 Mock N8N: Narrative Consolidation (${phase})`);
        console.log('Questions:', request.clarification_questions.length);
        console.log('Custom Instructions:', request.custom_instructions);
        request.clarification_questions.forEach((qa, index) => {
          console.log(`Q${index + 1}:`, qa.question);
          console.log(`A${index + 1}:`, qa.answer.substring(0, 100) + '...');
        });
        console.groupEnd();
      }

      // Simulate different responses based on phase
      const narrativeExtra = MOCK_NARRATIVE_EXTRAS[phase] || 
        'Additional contextual information has been consolidated from the clarification responses provided.';

      return {
        success: true,
        data: {
          narrative_extra: narrativeExtra,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mock consolidation error',
      };
    }
  }

  /**
   * Mock error scenarios for testing
   */
  static async simulateError(
    type: 'network' | 'validation' | 'server' | 'timeout'
  ): Promise<ApiResponse<never>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const errors = {
      network: 'Network connection failed',
      validation: 'Invalid request parameters',
      server: 'Internal server error',
      timeout: 'Request timeout',
    };

    const statusCodes = {
      network: 0,
      validation: 400,
      server: 500,
      timeout: 408,
    };

    return {
      success: false,
      error: errors[type],
      status: statusCodes[type],
    };
  }

  /**
   * Health check for mock service
   */
  static async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      data: {
        status: 'Mock service operational',
        timestamp: new Date().toISOString(),
      },
    };
  }
}