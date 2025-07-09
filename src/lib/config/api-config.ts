import type { N8NApiConfig, PhaseCustomInstructions } from '../types/n8n-types';

/**
 * N8N API Configuration Management
 * Handles environment variable configuration and API settings
 */

// ============================================================================
// Environment Configuration
// ============================================================================

export const getN8NApiConfig = (): N8NApiConfig => {
  const domain = import.meta.env.VITE_N8N_DOMAIN || 'buildergeniobit.app.n8n.cloud';
  const mode = (import.meta.env.VITE_API_MODE as 'mock' | 'live') || 'mock';

  return {
    domain,
    mode,
    endpoints: {
      clarificationQuestions: 'generate-clarification-questions',
      narrativeConsolidation: 'enhance-narrative-content',
      contributingConditionsAnalysis: 'analyze-contributing-conditions',
      incidentAnalysis: 'generate-incident-analysis',
    },
  };
};

// ============================================================================
// API URLs
// ============================================================================

export const getApiUrls = () => {
  const config = getN8NApiConfig();
  const baseUrl = `https://${config.domain}/webhook`;

  return {
    clarificationQuestions: `${baseUrl}/${config.endpoints.clarificationQuestions}`,
    narrativeConsolidation: `${baseUrl}/${config.endpoints.narrativeConsolidation}`,
    contributingConditionsAnalysis: `${baseUrl}/${config.endpoints.contributingConditionsAnalysis}`,
    incidentAnalysis: `${baseUrl}/${config.endpoints.incidentAnalysis}`,
  };
};

// ============================================================================
// Phase-Specific Custom Instructions
// ============================================================================

export const PHASE_CUSTOM_INSTRUCTIONS: PhaseCustomInstructions = {
  before_event: 
    'Focus on environmental factors, participant\'s baseline state, and contextual circumstances that preceded the incident. Emphasize what was normal versus unusual in the setting.',
  
  during_event: 
    'Focus on specific behaviors observed, interventions attempted, timeline of events, and safety considerations. Be precise about actions, reactions, and escalation patterns.',
  
  end_event: 
    'Focus on resolution techniques used, de-escalation methods, and how the situation was brought under control. Emphasize successful interventions and outcome.',
  
  post_event: 
    'Focus on follow-up actions taken, support provided to participant, notifications made, and ongoing considerations for care continuity.',
};

// ============================================================================
// Request Headers
// ============================================================================

export const getRequestHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add authentication header if API key is provided
  const apiKey = import.meta.env.VITE_N8N_API_KEY;
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
    // Alternative: headers['X-API-Key'] = apiKey;
  }

  return headers;
};

// ============================================================================
// Timeout Configuration
// ============================================================================

export const API_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// Development Helpers
// ============================================================================

export const isDevelopment = () => import.meta.env.DEV;
export const isMockMode = (userMode?: 'mock' | 'live') => {
  // Check user override first, then environment
  if (userMode) {
    return userMode === 'mock';
  }
  
  // Check session storage for user preference
  const sessionMode = sessionStorage.getItem('apiMode') as 'mock' | 'live' | null;
  if (sessionMode) {
    return sessionMode === 'mock';
  }
  
  // Fall back to environment configuration
  return getN8NApiConfig().mode === 'mock';
};

export const isLiveMode = (userMode?: 'mock' | 'live') => !isMockMode(userMode);

// ============================================================================
// Configuration Validation
// ============================================================================

export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = getN8NApiConfig();

  if (!config.domain) {
    errors.push('N8N domain is not configured (VITE_N8N_DOMAIN)');
  }

  if (!['mock', 'live'].includes(config.mode)) {
    errors.push('API mode must be either "mock" or "live" (VITE_API_MODE)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// Debug Helpers
// ============================================================================

export const logConfigInfo = () => {
  if (isDevelopment()) {
    const config = getN8NApiConfig();
    const urls = getApiUrls();
    
    console.group('🔧 N8N API Configuration');
    console.log('Mode:', config.mode);
    console.log('Domain:', config.domain);
    console.log('Clarification Questions URL:', urls.clarificationQuestions);
    console.log('Narrative Consolidation URL:', urls.narrativeConsolidation);
    console.groupEnd();
  }
};