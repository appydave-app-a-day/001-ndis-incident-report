import type {
  ApiResponse,
  ClarificationAnswerWithQuestion,
  GenerateClarificationQuestionsResponseFrontend,
  GenerateIncidentAnalysisResponseFrontend,
  GenerateMockAnswersResponse,
  IIncidentAPI,
  IncidentClassification,
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
    incidentAnalysis: 2500,       // 2.5 seconds
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
    // Simulate API delay
    await this.delay(this.delays.incidentAnalysis);

    // Log request in development
    if (import.meta.env.DEV) {
      console.group('🔄 Mock API: Analyze Contributing Conditions');
      console.log('Participant:', metadata.participantName);
      console.log('Reporter:', metadata.reporterName);
      console.log('Location:', metadata.location);
      console.log('Event DateTime:', metadata.eventDateTime);
      console.log('Before Event Length:', narrativeSections.beforeEvent.length, 'chars');
      console.log('During Event Length:', narrativeSections.duringEvent.length, 'chars');
      console.log('End Event Length:', narrativeSections.endEvent.length, 'chars');
      console.log('Post Event Length:', narrativeSections.postEvent.length, 'chars');
      console.groupEnd();
    }

    // Generate realistic contributing conditions in markdown format
    return this.generateMockContributingConditionsMarkdown(narrativeSections, metadata);
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
    // Simulate API delay
    await this.delay(this.delays.incidentAnalysis);

    // Log request in development
    if (import.meta.env.DEV) {
      console.group('🔄 Mock API: Generate Incident Analysis');
      console.log('Participant:', metadata.participantName);
      console.log('Reporter:', metadata.reporterName);
      console.log('Location:', metadata.location);
      console.log('Incident Date:', metadata.incidentDate);
      console.log('Consolidated Narrative Length:', consolidatedNarrative.length, 'chars');
      console.groupEnd();
    }

    // Generate realistic mock analysis based on the narrative content
    const contributingConditions = this.generateMockContributingConditions(consolidatedNarrative, metadata);
    const classifications = this.generateMockClassifications(consolidatedNarrative, metadata);

    return {
      contributingConditions,
      classifications,
    };
  }

  getMode(): 'mock' | 'live' {
    return 'mock';
  }

  async generateMockAnswers(
    phase: string,
    phaseNarrative: string,
    questions: Array<{ id: string; question: string }>,
    metadata: { participantName: string; reporterName: string; location: string }
  ): Promise<GenerateMockAnswersResponse> {
    // Simulate API delay
    await this.delay(this.delays.narrativeEnhancement);

    // Log request in development
    if (import.meta.env.DEV) {
      console.group(`🔄 Mock API: Generate Mock Answers (${phase})`);
      console.log('Participant:', metadata.participantName);
      console.log('Phase narrative:', phaseNarrative);
      console.log('Questions count:', questions.length);
      console.groupEnd();
    }

    // Generate contextual answers based on the narrative
    const answers = questions.map(q => {
      let answer = '';
      
      // Generate answers based on question content and narrative context
      const questionLower = q.question.toLowerCase();
      const narrativeLower = phaseNarrative.toLowerCase();
      
      if (questionLower.includes('what was') && questionLower.includes('doing')) {
        if (narrativeLower.includes('watching tv')) {
          answer = `${metadata.participantName} was sitting calmly in the lounge, watching TV, and appearing peaceful before the delivery person arrived.`;
        } else if (narrativeLower.includes('eating') || narrativeLower.includes('breakfast')) {
          answer = `${metadata.participantName} was enjoying their meal and seemed relaxed and content.`;
        } else {
          answer = `${metadata.participantName} was engaged in their usual activities and appeared to be in a calm state.`;
        }
      } else if (questionLower.includes('environment') || questionLower.includes('conditions')) {
        if (narrativeLower.includes('quiet')) {
          answer = `It was a quiet afternoon in the lounge area, with the TV softly playing and no other significant noises besides the delivery knock.`;
        } else {
          answer = `The environment was typical for that time of day at ${metadata.location}, with normal ambient sounds and activities.`;
        }
      } else if (questionLower.includes('warning signs') || questionLower.includes('notice')) {
        if (narrativeLower.includes('calm') || narrativeLower.includes('peaceful')) {
          answer = `There were no apparent warning signs. ${metadata.participantName} seemed calm and regulated before the incident.`;
        } else {
          answer = `${metadata.participantName} didn't show any unusual behaviors or signs of distress prior to the triggering event.`;
        }
      } else if (questionLower.includes('how long')) {
        answer = `The incident lasted approximately 15-20 minutes from the initial trigger until ${metadata.participantName} began to calm down.`;
      } else if (questionLower.includes('who else') || questionLower.includes('present')) {
        answer = `${metadata.reporterName} was present as the support worker. No other participants or staff were in the immediate area.`;
      } else if (questionLower.includes('intervention') || questionLower.includes('attempted')) {
        answer = `${metadata.reporterName} attempted verbal de-escalation techniques and tried to create a calm environment by speaking softly and reassuringly.`;
      } else if (questionLower.includes('resolved') || questionLower.includes('outcome')) {
        if (narrativeLower.includes('police')) {
          answer = `The situation was resolved when police arrived and helped de-escalate. ${metadata.participantName} was safely transported for further assessment.`;
        } else {
          answer = `${metadata.reporterName} was able to help ${metadata.participantName} calm down using breathing exercises and by removing the trigger.`;
        }
      } else if (questionLower.includes('follow-up') || questionLower.includes('support')) {
        answer = `A debrief was conducted with the team, and ${metadata.participantName}'s support plan was reviewed to prevent similar incidents.`;
      } else {
        // Default contextual answer
        answer = `Based on the incident, ${metadata.reporterName} noted that ${metadata.participantName} responded to the situation as described in the narrative.`;
      }
      
      return {
        question_id: q.id,
        question: q.question,
        answer
      };
    });

    return { answers };
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
   * Generate mock contributing conditions in markdown format
   */
  private generateMockContributingConditionsMarkdown(
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
    metadata: { participantName: string; reporterName: string; location: string; eventDateTime: string }
  ): string {
    // Combine all narrative text for analysis
    const fullNarrative = [
      narrativeSections.beforeEvent,
      narrativeSections.beforeEventExtra,
      narrativeSections.duringEvent,
      narrativeSections.duringEventExtra,
      narrativeSections.endEvent,
      narrativeSections.endEventExtra,
      narrativeSections.postEvent,
      narrativeSections.postEventExtra,
    ].join(' ').toLowerCase();

    // Analyze content for keywords
    const hasLoudNoise = fullNarrative.includes('loud') || fullNarrative.includes('noise') || fullNarrative.includes('knock');
    const hasDelivery = fullNarrative.includes('delivery') || fullNarrative.includes('pizza');
    const hasAgitation = fullNarrative.includes('agitated') || fullNarrative.includes('yelling') || fullNarrative.includes('throwing');
    const hasPolice = fullNarrative.includes('police');
    const hasAlone = fullNarrative.includes('alone') || fullNarrative.includes('by herself') || fullNarrative.includes('by himself');

    let markdown = '\n**Immediate Contributing Conditions**\n\n';

    if (hasLoudNoise && hasDelivery) {
      markdown += '### Unexpected Sensory Trigger\n';
      markdown += `- Loud knocking from pizza delivery person startled ${metadata.participantName} who was not expecting visitors\n`;
      markdown += `- ${metadata.participantName} was in a calm, regulated state when the sudden loud noise occurred\n`;
      markdown += '- Known sensitivity to unexpected loud noises was not adequately managed\n\n';
    }

    if (hasAlone) {
      markdown += '### Delayed Support Response\n';
      markdown += `- ${metadata.participantName} was alone when the trigger occurred\n`;
      markdown += '- No immediate support staff presence to intervene quickly\n';
      markdown += '- Staff member was not in immediate vicinity to prevent escalation\n\n';
    }

    if (hasAgitation) {
      markdown += '### Ineffective De-escalation\n';
      markdown += '- Verbal de-escalation techniques attempted were unsuccessful\n';
      markdown += `- ${metadata.participantName} continued to escalate despite intervention attempts\n`;
      markdown += '- Physical environment allowed for object throwing (items within reach)\n\n';
    }

    markdown += '### Environmental Factors\n';
    markdown += '- Quiet environment was suddenly disrupted without warning\n';
    if (fullNarrative.includes('afternoon')) {
      markdown += '- Afternoon timing may have contributed to reduced tolerance\n';
    }
    markdown += '- No protocols in place for managing unexpected visitors\n';

    if (hasPolice) {
      markdown += '\n### Emergency Response Escalation\n';
      markdown += '- Situation escalated beyond standard support capabilities\n';
      markdown += '- Police intervention required due to safety concerns\n';
      markdown += '- Indicates need for enhanced crisis management protocols\n';
    }

    markdown += '\n';

    return markdown;
  }

  /**
   * Generate mock contributing conditions based on narrative content (legacy method)
   */
  private generateMockContributingConditions(
    narrative: string,
    metadata: { participantName: string; reporterName: string; location: string; incidentDate: string }
  ): string {
    // Analyze narrative content for relevant keywords to generate contextual conditions
    const hasLoudNoise = narrative.toLowerCase().includes('loud') || narrative.toLowerCase().includes('noise') || narrative.toLowerCase().includes('banging') || narrative.toLowerCase().includes('bashing');
    const hasKitchen = narrative.toLowerCase().includes('kitchen');
    const hasKnife = narrative.toLowerCase().includes('knife');
    const hasPolice = narrative.toLowerCase().includes('police');
    const hasAgitation = narrative.toLowerCase().includes('agitated') || narrative.toLowerCase().includes('screaming');
    const hasDelivery = narrative.toLowerCase().includes('delivery') || narrative.toLowerCase().includes('pizza');

    let conditions = `The incident involving ${metadata.participantName} appears to have been triggered by `;

    if (hasLoudNoise && hasDelivery) {
      conditions += 'an unexpected loud disturbance from a food delivery person knocking/banging on the door. ';
    } else if (hasLoudNoise) {
      conditions += 'an unexpected loud noise or disturbance in the environment. ';
    } else {
      conditions += 'environmental factors and unexpected changes to routine. ';
    }

    conditions += `Environmental factors contributing to the escalation include: `;

    if (hasAgitation) {
      conditions += `the participant being in a vulnerable state when startled, `;
    }

    conditions += `the absence of immediate support personnel to provide de-escalation, `;

    if (hasKitchen && hasKnife) {
      conditions += `easy access to potentially dangerous items in the kitchen area, `;
    }

    conditions += `and the participant's likely underlying anxiety or trauma responses to unexpected visitors or loud noises. `;

    if (hasPolice) {
      conditions += `The escalation to requiring police intervention suggests that standard de-escalation techniques were either not available or ineffective in this situation, `;
      conditions += `indicating a need for improved crisis management protocols and potentially additional staff training.`;
    } else {
      conditions += `The situation required external intervention, highlighting the need for improved crisis management protocols.`;
    }

    return conditions;
  }

  /**
   * Generate mock incident classifications based on narrative content
   */
  private generateMockClassifications(
    narrative: string,
    _metadata: { participantName: string; reporterName: string; location: string; incidentDate: string }
  ): IncidentClassification[] {
    const classifications: IncidentClassification[] = [];
    const lowerNarrative = narrative.toLowerCase();

    // Behavioral classification - always include if there's agitation, screaming, or aggressive behavior
    if (lowerNarrative.includes('agitated') || lowerNarrative.includes('screaming') || 
        lowerNarrative.includes('knife') || lowerNarrative.includes('threatened') ||
        lowerNarrative.includes('police')) {
      classifications.push({
        id: 'classification-behavioral-1',
        incidentType: 'Behavioural',
        supportingEvidence: 'Participant became agitated and exhibited threatening behavior, requiring police intervention for safety',
        severity: 'High',
        confidence: 0.95,
      });
    }

    // Environmental classification - if there are triggers from the environment
    if (lowerNarrative.includes('loud') || lowerNarrative.includes('noise') || 
        lowerNarrative.includes('delivery') || lowerNarrative.includes('door') ||
        lowerNarrative.includes('banging') || lowerNarrative.includes('bashing')) {
      classifications.push({
        id: 'classification-environmental-1',
        incidentType: 'Environmental',
        supportingEvidence: 'Incident was triggered by unexpected loud noise from door knocking/banging',
        severity: 'Medium',
        confidence: 0.85,
      });
    }

    // Communication classification - if there are issues with communication or understanding
    if (lowerNarrative.includes('intruder') || lowerNarrative.includes('explain') ||
        lowerNarrative.includes('de-escalation') || lowerNarrative.includes('listen')) {
      classifications.push({
        id: 'classification-communication-1',
        incidentType: 'Communication',
        supportingEvidence: 'Participant misinterpreted the situation (thinking it was an intruder) and was unable to process explanations during agitation',
        severity: 'Medium',
        confidence: 0.75,
      });
    }

    // Medical classification - if there are references to psychiatric hospital or mental health
    if (lowerNarrative.includes('psychiatric') || lowerNarrative.includes('hospital') ||
        lowerNarrative.includes('assessment') || lowerNarrative.includes('medical')) {
      classifications.push({
        id: 'classification-medical-1',
        incidentType: 'Medical',
        supportingEvidence: 'Participant required psychiatric hospital assessment and overnight monitoring',
        severity: 'High',
        confidence: 0.80,
      });
    }

    // Ensure we have at least one classification
    if (classifications.length === 0) {
      classifications.push({
        id: 'classification-behavioral-default',
        incidentType: 'Behavioural',
        supportingEvidence: 'Incident involved behavioral changes requiring intervention',
        severity: 'Medium',
        confidence: 0.70,
      });
    }

    return classifications;
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