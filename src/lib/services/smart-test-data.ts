/**
 * Smart Test Data Generator
 * 
 * Generates realistic answers for any clarification questions based on:
 * - Question text analysis (keywords, patterns)
 * - Narrative context extraction
 * - Common incident reporting patterns
 */

import type { IncidentNarrative, ClarificationQuestion, ClarificationAnswer } from '@/store/useIncidentStore';

interface AnswerTemplate {
  keywords: string[];
  templates: string[];
  contextExtractor?: (narrative: IncidentNarrative) => string[];
}

// Answer generation templates based on common question patterns
const ANSWER_TEMPLATES: AnswerTemplate[] = [
  // Timing questions
  {
    keywords: ['how long', 'duration', 'lasted', 'time', 'minutes', 'hours'],
    templates: [
      'Approximately 15-20 minutes from start to finish',
      'The incident lasted about 10-15 minutes',
      'Started around {time} and concluded within 20 minutes'
    ]
  },
  
  // People/witnesses questions
  {
    keywords: ['who', 'present', 'witnesses', 'people', 'staff', 'others'],
    templates: [
      'Support worker, participant, and {people} were present',
      'Only myself as the support worker and the participant',
      'Support staff, participant, and one other resident in the area'
    ],
    contextExtractor: (narrative) => {
      const people = [];
      if (narrative.beforeEvent.toLowerCase().includes('delivery')) people.push('delivery person');
      if (narrative.duringEvent.toLowerCase().includes('police')) people.push('police officers');
      if (narrative.postEvent.toLowerCase().includes('supervisor')) people.push('supervisor');
      return people;
    }
  },
  
  // Environment questions
  {
    keywords: ['environment', 'location', 'setting', 'where', 'room', 'area'],
    templates: [
      'The {location} was calm and quiet with normal lighting',
      'Indoor environment with good visibility and minimal distractions',
      'Safe, familiar environment with appropriate supervision'
    ],
    contextExtractor: (narrative) => {
      const locations = [];
      if (narrative.beforeEvent.toLowerCase().includes('lounge')) locations.push('lounge room');
      if (narrative.beforeEvent.toLowerCase().includes('kitchen')) locations.push('kitchen area');
      if (narrative.beforeEvent.toLowerCase().includes('room')) locations.push('common area');
      return locations.length > 0 ? locations : ['support area'];
    }
  },
  
  // Actions/interventions questions
  {
    keywords: ['intervention', 'actions', 'attempted', 'tried', 'response', 'approach'],
    templates: [
      'Verbal de-escalation techniques and environmental modifications',
      'Calm verbal communication and space management',
      'Used established de-escalation protocols and safety procedures'
    ]
  },
  
  // Injury questions
  {
    keywords: ['injury', 'injured', 'hurt', 'harm', 'physical'],
    templates: [
      'No physical injuries occurred during the incident',
      'No one was physically harmed, though participant experienced emotional distress',
      'All individuals remained physically safe throughout the incident'
    ]
  },
  
  // Resolution questions
  {
    keywords: ['resolved', 'concluded', 'ended', 'outcome', 'result'],
    templates: [
      'Situation de-escalated through patient verbal communication',
      'Incident resolved using established safety protocols',
      'Successful de-escalation with return to baseline behavior'
    ]
  },
  
  // Follow-up questions
  {
    keywords: ['follow-up', 'after', 'support', 'supervisor', 'notify'],
    templates: [
      'Supervisor notified, documentation completed, and debriefing conducted',
      'Appropriate notifications made and ongoing support provided',
      'Full incident documentation and follow-up care arranged'
    ]
  },
  
  // Participant state questions
  {
    keywords: ['participant', 'doing', 'behavior', 'mood', 'state'],
    templates: [
      'Participant was calm and engaged in routine activities',
      'Participant appeared settled and content before the incident',
      'Normal baseline behavior with no signs of agitation'
    ],
    contextExtractor: (narrative) => {
      if (narrative.beforeEvent.toLowerCase().includes('tv')) return ['watching television'];
      if (narrative.beforeEvent.toLowerCase().includes('drawing')) return ['drawing quietly'];
      if (narrative.beforeEvent.toLowerCase().includes('sitting')) return ['sitting peacefully'];
      return ['engaged in quiet activities'];
    }
  }
];

/**
 * Generates a realistic answer for a question based on content analysis
 */
export function generateRealisticAnswer(
  question: string, 
  narrative: IncidentNarrative,
  _questionId: string
): string {
  const questionLower = question.toLowerCase();
  
  // Find matching template based on keywords
  const matchingTemplate = ANSWER_TEMPLATES.find(template =>
    template.keywords.some(keyword => questionLower.includes(keyword))
  );
  
  if (matchingTemplate) {
    // Extract context if available
    let contextValues: string[] = [];
    if (matchingTemplate.contextExtractor) {
      contextValues = matchingTemplate.contextExtractor(narrative);
    }
    
    // Select a random template
    const template = matchingTemplate.templates[
      Math.floor(Math.random() * matchingTemplate.templates.length)
    ];
    
    // Replace placeholders with context
    let answer = template;
    if (contextValues.length > 0) {
      answer = answer.replace('{people}', contextValues[0]);
      answer = answer.replace('{location}', contextValues[0]);
      answer = answer.replace('{time}', '2:30 PM');
    }
    
    return answer;
  }
  
  // Fallback for unmatched questions - try to extract relevant info from narrative
  return generateContextualFallback(question, narrative);
}

/**
 * Generates contextual fallback answer when no template matches
 */
function generateContextualFallback(question: string, narrative: IncidentNarrative): string {
  const questionLower = question.toLowerCase();
  
  // Try to determine which phase the question relates to
  if (questionLower.includes('before')) {
    return extractRelevantDetail(narrative.beforeEvent) || 
           'As described in the narrative above';
  }
  
  if (questionLower.includes('during')) {
    return extractRelevantDetail(narrative.duringEvent) || 
           'Details provided in the incident description';
  }
  
  if (questionLower.includes('end') || questionLower.includes('resolution')) {
    return extractRelevantDetail(narrative.endEvent) || 
           'Resolution details provided in the narrative';
  }
  
  if (questionLower.includes('after') || questionLower.includes('post')) {
    return extractRelevantDetail(narrative.postEvent) || 
           'Follow-up information included in the report';
  }
  
  // Generic fallback
  return 'Information provided in the incident narrative above';
}

/**
 * Extracts the most relevant sentence from a narrative section
 */
function extractRelevantDetail(text: string): string | null {
  if (!text || text.length < 10) return null;
  
  // Split into sentences and take the first substantial one
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length > 0) {
    return sentences[0].trim() + '.';
  }
  
  return null;
}

/**
 * Generates test answers for all questions in a phase
 */
export function generateAnswersForQuestions(
  questions: ClarificationQuestion[],
  narrative: IncidentNarrative
): ClarificationAnswer[] {
  return questions.map(question => ({
    questionId: question.id,
    answer: generateRealisticAnswer(question.question, narrative, question.id)
  }));
}

/**
 * Generates realistic answers for all phases
 */
export function generateAllTestAnswers(
  questions: { 
    beforeEvent: ClarificationQuestion[];
    duringEvent: ClarificationQuestion[];
    endEvent: ClarificationQuestion[];
    postEvent: ClarificationQuestion[];
  },
  narrative: IncidentNarrative
) {
  return {
    beforeEvent: generateAnswersForQuestions(questions.beforeEvent, narrative),
    duringEvent: generateAnswersForQuestions(questions.duringEvent, narrative),
    endEvent: generateAnswersForQuestions(questions.endEvent, narrative),
    postEvent: generateAnswersForQuestions(questions.postEvent, narrative),
  };
}