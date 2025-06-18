import type { ClarificationQuestions, IncidentNarrative } from '@/store/useIncidentStore';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678';

// Mock data for development
const mockClarificationQuestions: ClarificationQuestions = {
  before: [
    { id: 'b1', question: 'What was the participant doing before the incident?', phase: 'before' },
    { id: 'b2', question: 'Do you like green eggs?', phase: 'before' },
    { id: 'b3', question: 'What was the environment like before the incident?', phase: 'before' }
  ],
  during: [
    { id: 'd1', question: 'How long did the incident last?', phase: 'during' },
    { id: 'd2', question: 'Who else was present during the incident?', phase: 'during' },
    { id: 'd3', question: 'What interventions were attempted?', phase: 'during' }
  ],
  end: [
    { id: 'e1', question: 'How was the incident resolved?', phase: 'end' },
    { id: 'e2', question: 'Was anyone injured?', phase: 'end' },
    { id: 'e3', question: 'What was the immediate outcome?', phase: 'end' }
  ],
  postEvent: [
    { id: 'p1', question: 'What follow-up actions were taken?', phase: 'postEvent' },
    { id: 'p2', question: 'Was a supervisor or manager notified?', phase: 'postEvent' },
    { id: 'p3', question: 'What support was provided to the participant?', phase: 'postEvent' }
  ]
};

/**
 * Fetches clarification questions based on incident narrative
 */
export const fetchClarificationQuestions = async (
  narrative: IncidentNarrative
): Promise<ClarificationQuestions> => {
  try {
    // Check if we're in mock mode or live mode
    if (import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL) {
      // Mock mode - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return mockClarificationQuestions;
    }

    // Live mode - make actual API call
    const response = await fetch(`${API_BASE_URL}/webhook/get-clarifying-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        narrative_before: narrative.before,
        narrative_during: narrative.during,
        narrative_end: narrative.end,
        narrative_post_event: narrative.postEvent,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform API response to match our interface
    return {
      before: data.before_questions?.map((q: string, index: number) => ({
        id: `b${index + 1}`,
        question: q,
        phase: 'before' as const
      })) || [],
      during: data.during_questions?.map((q: string, index: number) => ({
        id: `d${index + 1}`,
        question: q,
        phase: 'during' as const
      })) || [],
      end: data.end_questions?.map((q: string, index: number) => ({
        id: `e${index + 1}`,
        question: q,
        phase: 'end' as const
      })) || [],
      postEvent: data.post_event_questions?.map((q: string, index: number) => ({
        id: `p${index + 1}`,
        question: q,
        phase: 'postEvent' as const
      })) || []
    };
  } catch (error) {
    console.error('Error fetching clarification questions:', error);
    throw error;
  }
};

/**
 * API service class for incident-related operations
 */
export class IncidentApiService {
  static async getClarificationQuestions(narrative: IncidentNarrative): Promise<ClarificationQuestions> {
    return fetchClarificationQuestions(narrative);
  }
}