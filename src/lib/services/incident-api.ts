import type {
  IIncidentAPI,
  GenerateClarificationQuestionsResponseFrontend,
  ClarificationAnswerWithQuestion,
  ApiResponse,
} from './types/api-types';
import type { IncidentNarrative, NarrativeExtras } from './types/incident-types';

import { MockIncidentAPI } from './providers/mock-incident-api';
import { N8NIncidentAPI } from './providers/n8n-incident-api';

/**
 * Unified Incident API - Single entry point for all incident-related API operations
 * 
 * Automatically routes requests to mock or live implementations based on configuration.
 * Provides a clean, consistent interface for the application to use.
 * 
 * Usage:
 *   const api = new IncidentAPI();
 *   const questions = await api.getClarificationQuestions(narrative, metadata);
 *   const enhanced = await api.enhanceNarrative(phase, narrative, answers);
 */
export class IncidentAPI implements IIncidentAPI {
  private mode: 'mock' | 'live';
  private mockAPI: MockIncidentAPI;
  private liveAPI: N8NIncidentAPI;

  constructor() {
    this.mode = this.detectMode();
    this.mockAPI = new MockIncidentAPI();
    this.liveAPI = new N8NIncidentAPI();

    // Log mode selection in development
    if (import.meta.env.DEV) {
      console.log(`🔧 IncidentAPI initialized in ${this.mode} mode`);
    }
  }

  /**
   * Generate clarification questions based on incident narrative
   */
  async getClarificationQuestions(
    narrative: IncidentNarrative,
    metadata: { reporterName: string; participantName: string; location: string }
  ): Promise<GenerateClarificationQuestionsResponseFrontend> {
    try {
      if (this.mode === 'mock') {
        return await this.mockAPI.getClarificationQuestions(narrative, metadata);
      } else {
        return await this.liveAPI.getClarificationQuestions(narrative, metadata);
      }
    } catch (error) {
      console.warn('Live API failed, falling back to mock:', error);
      
      // Fallback to mock if live fails
      if (this.mode === 'live') {
        return await this.mockAPI.getClarificationQuestions(narrative, metadata);
      }
      
      throw error;
    }
  }

  /**
   * Enhance narrative content using clarification answers
   */
  async enhanceNarrative(
    phase: keyof NarrativeExtras,
    originalNarrative: string,
    clarificationAnswers: ClarificationAnswerWithQuestion[]
  ): Promise<string> {
    try {
      if (this.mode === 'mock') {
        return await this.mockAPI.enhanceNarrative(phase, originalNarrative, clarificationAnswers);
      } else {
        return await this.liveAPI.enhanceNarrative(phase, originalNarrative, clarificationAnswers);
      }
    } catch (error) {
      console.warn('Live API failed, falling back to mock:', error);
      
      // Fallback to mock if live fails  
      if (this.mode === 'live') {
        return await this.mockAPI.enhanceNarrative(phase, originalNarrative, clarificationAnswers);
      }
      
      throw error;
    }
  }

  /**
   * Get current API mode
   */
  getMode(): 'mock' | 'live' {
    return this.mode;
  }

  /**
   * Update API mode at runtime (useful for testing)
   */
  setMode(mode: 'mock' | 'live'): void {
    this.mode = mode;
    
    // Persist user choice in session storage
    sessionStorage.setItem('apiMode', mode);
    
    if (import.meta.env.DEV) {
      console.log(`🔧 IncidentAPI mode changed to: ${mode}`);
    }
  }

  /**
   * Health check for the API service
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; mode: string }>> {
    if (this.mode === 'mock') {
      return await this.mockAPI.healthCheck();
    } else {
      try {
        return await this.liveAPI.healthCheck();
      } catch (error) {
        // Fallback to mock health check if live fails
        const mockResult = await this.mockAPI.healthCheck();
        return {
          ...mockResult,
          data: {
            status: 'Live mode configured but unavailable, using mock fallback',
            mode: 'live-fallback',
          },
        };
      }
    }
  }

  /**
   * Get current configuration information
   */
  getConfigInfo() {
    return {
      mode: this.mode,
      mockAvailable: true,
      liveAvailable: !!import.meta.env.VITE_N8N_DOMAIN,
      domain: import.meta.env.VITE_N8N_DOMAIN || 'buildergeniobit.app.n8n.cloud',
    };
  }

  /**
   * Detect current API mode from environment and user preferences
   */
  private detectMode(): 'mock' | 'live' {
    // Check session storage for user preference first
    const sessionMode = sessionStorage.getItem('apiMode') as 'mock' | 'live' | null;
    if (sessionMode && ['mock', 'live'].includes(sessionMode)) {
      return sessionMode;
    }
    
    // Check environment variable
    const envMode = import.meta.env.VITE_API_MODE as 'mock' | 'live';
    if (envMode && ['mock', 'live'].includes(envMode)) {
      return envMode;
    }
    
    // Default to mock mode for safety
    return 'mock';
  }
}

// ============================================================================
// Convenience Exports
// ============================================================================

/**
 * Default instance for easy importing
 * 
 * Usage:
 *   import { incidentAPI } from '@/lib/services/incident-api';
 *   const questions = await incidentAPI.getClarificationQuestions(narrative, metadata);
 */
export const incidentAPI = new IncidentAPI();

/**
 * Create a new instance (useful for testing with specific configurations)
 */
export const createIncidentAPI = () => new IncidentAPI();