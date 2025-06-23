import type {
  IIncidentAPI,
  GenerateClarificationQuestionsResponseFrontend,
  ClarificationAnswerWithQuestion,
  ApiResponse,
} from '../types/api-types';
import type { NarrativeExtras } from '../types/incident-types';

/**
 * Mock implementation of incident API for development and testing
 * Provides realistic test data with simulated network delays
 */
export class MockIncidentAPI implements IIncidentAPI {
  private readonly delays = {
    clarificationQuestions: 1500, // 1.5 seconds
    narrativeEnhancement: 2000,   // 2 seconds
    healthCheck: 100,             // 0.1 seconds
  };

  async getClarificationQuestions(
    narrative: { beforeEvent: string; duringEvent: string; endEvent: string; postEvent: string },
    metadata: { reporterName: string; participantName: string; location: string }
  ): Promise<GenerateClarificationQuestionsResponseFrontend> {
    // Simulate API delay
    await this.delay(this.delays.clarificationQuestions);

    // Log request in development
    if (import.meta.env.DEV) {
      console.group('🔄 Mock API: Clarification Questions Request');
      console.log('Participant:', metadata.participantName);
      console.log('Reporter:', metadata.reporterName);
      console.log('Location:', metadata.location);
      console.log('Before Event Length:', narrative.beforeEvent.length, 'chars');
      console.log('During Event Length:', narrative.duringEvent.length, 'chars');
      console.log('End Event Length:', narrative.endEvent.length, 'chars');
      console.log('Post Event Length:', narrative.postEvent.length, 'chars');
      console.groupEnd();
    }

    // Return the same structure as the real N8N API would
    const mockQuestions = {
      before_event: [
        'What was the participant doing before the incident?',
        'What was the environment like before the incident?',
        'Were there any unusual circumstances or triggers present?',
        'Who else was present in the area before the incident?',
        'What was the participant\'s mood or behavior immediately before?',
      ],
      during_event: [
        'How long did the incident last?',
        'Who else was present during the incident?',
        'What interventions were attempted?',
        'What specific behaviors or actions were observed?',
        'Were there any safety concerns during the incident?',
      ],
      end_of_event: [
        'How was the incident resolved?',
        'Was anyone injured during the incident?',
        'What was the immediate outcome?',
        'What techniques were successful in de-escalation?',
        'How did the participant respond to interventions?',
      ],
      post_event_support: [
        'What follow-up actions were taken?',
        'Was a supervisor or manager notified?',
        'What support was provided to the participant?',
        'Were there any environmental changes made?',
        'What debriefing or documentation was completed?',
      ],
    };

    return {
      beforeEventQuestions: mockQuestions.before_event,
      duringEventQuestions: mockQuestions.during_event,
      endEventQuestions: mockQuestions.end_of_event,
      postEventQuestions: mockQuestions.post_event_support,
    };
  }

  async enhanceNarrative(
    phase: keyof NarrativeExtras,
    originalNarrative: string,
    clarificationAnswers: ClarificationAnswerWithQuestion[]
  ): Promise<string> {
    // Simulate API delay
    await this.delay(this.delays.narrativeEnhancement);

    // Log request in development
    if (import.meta.env.DEV) {
      console.group(`🔄 Mock API: Narrative Enhancement (${phase})`);
      console.log('Original narrative length:', originalNarrative.length, 'chars');
      console.log('Clarification answers:', clarificationAnswers.length);
      clarificationAnswers.forEach((answer, index) => {
        if (answer.answer.trim()) {
          console.log(`Q${index + 1}:`, answer.answer.substring(0, 50) + '...');
        }
      });
      console.groupEnd();
    }

    // Generate phase-specific enhanced narratives
    const enhancements = {
      beforeEvent: 'Additional context: The participant had been in a stable, calm environment for approximately 30 minutes prior to the incident. Environmental conditions were optimal for the participant\'s wellbeing, with appropriate lighting and minimal noise. No known triggers or stressors were present in the immediate area during this period.',
      
      duringEvent: 'Additional details: The incident escalated gradually over a 15-20 minute period, with clear behavioral indicators preceding the peak intensity. Support staff maintained visual contact throughout and implemented de-escalation techniques consistently. Safety protocols were followed and no physical harm occurred to any individuals present.',
      
      endEvent: 'Resolution details: The situation was resolved through patient verbal de-escalation and environmental modifications. The participant responded positively to calming techniques and gradually returned to baseline behavior. Professional intervention was effective in ensuring a safe outcome for all involved parties.',
      
      postEvent: 'Follow-up actions: Comprehensive documentation was completed within 2 hours of the incident. The participant received appropriate support and monitoring, with no ongoing concerns identified. All relevant parties were notified according to protocol, and preventive measures were discussed for future situations.',
    };

    // Return enhanced narrative for the phase
    return enhancements[phase] || 'Additional contextual information has been consolidated from the clarification responses provided.';
  }

  getMode(): 'mock' | 'live' {
    return 'mock';
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; mode: string }>> {
    await this.delay(this.delays.healthCheck);

    return {
      success: true,
      data: {
        status: 'Mock service operational',
        mode: 'mock',
      },
      status: 200,
    };
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simulate different error scenarios for testing
   */
  async simulateError(
    type: 'network' | 'validation' | 'server' | 'timeout'
  ): Promise<ApiResponse<never>> {
    await this.delay(1000);

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
}