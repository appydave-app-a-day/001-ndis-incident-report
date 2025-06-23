# API Integration Architecture

## Overview

The application uses a flexible service layer architecture that supports both mock and live API modes. This design enables local development without backend dependencies while maintaining the same interface for production API calls.

## Core Architecture

### Service Layer Structure

```
src/lib/
├── config/
│   └── api-config.ts      // API configuration and environment settings
├── services/
│   ├── api.ts            // Main API service orchestrator
│   ├── n8n-api.ts        // Live N8N API implementation
│   └── mock-n8n-service.ts // Mock service implementation
└── types/
    └── n8n-types.ts      // Shared TypeScript interfaces
```

### Design Principles

1. **Interface Segregation** - Mock and live services implement the same interface
2. **Environment Flexibility** - Runtime switching between mock/live modes
3. **Type Safety** - Comprehensive TypeScript interfaces for all API contracts
4. **Error Resilience** - Graceful degradation and retry mechanisms
5. **Progressive Enhancement** - Support for incremental data processing

## Implementation Patterns

### 1. API Service Interface

```typescript
interface ApiService {
  fetchClarificationQuestions(
    narrative: IncidentNarrative
  ): Promise<ClarificationQuestions>;
  
  consolidateNarrative(
    phase: NarrativePhase,
    narrative: string,
    clarifications: ClarificationAnswer[]
  ): Promise<string>;
}
```

### 2. Service Orchestrator Pattern

```typescript
// src/lib/services/api.ts
export class ApiService {
  private mode: ApiMode;
  private mockService: MockN8NService;
  private liveService: N8NApiService;
  
  constructor() {
    this.mode = getApiMode();
    this.mockService = new MockN8NService();
    this.liveService = new N8NApiService();
  }
  
  async fetchClarificationQuestions(narrative: IncidentNarrative) {
    try {
      if (this.mode === 'mock') {
        return await this.mockService.fetchClarificationQuestions(narrative);
      }
      return await this.liveService.fetchClarificationQuestions(narrative);
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock if live fails
      if (this.mode === 'live') {
        return await this.mockService.fetchClarificationQuestions(narrative);
      }
      throw error;
    }
  }
}
```

### 3. Configuration Management

```typescript
// src/lib/config/api-config.ts
export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    clarificationQuestions: string;
    narrativeConsolidation: string;
  };
  timeout: number;
  retryAttempts: number;
}

export const getApiConfig = (): ApiConfig => {
  const baseUrl = import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678';
  
  return {
    baseUrl,
    endpoints: {
      clarificationQuestions: '/webhook/narrative-report-clarification',
      narrativeConsolidation: '/webhook/narrative-report-consolidation'
    },
    timeout: 30000,
    retryAttempts: 3
  };
};
```

## API Contracts

### Clarification Questions Endpoint

**Request:**
```typescript
interface ClarificationQuestionsRequest {
  beforeEvent: string;
  duringEvent: string;
  endEvent: string;
  postEvent: string;
}
```

**Response:**
```typescript
interface ClarificationQuestionsResponse {
  beforeEvent: Array<{
    id: string;
    question: string;
  }>;
  duringEvent: Array<{
    id: string;
    question: string;
  }>;
  endEvent: Array<{
    id: string;
    question: string;
  }>;
  postEvent: Array<{
    id: string;
    question: string;
  }>;
}
```

### Narrative Consolidation Endpoint

**Request:**
```typescript
interface ConsolidationRequest {
  phase: 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent';
  originalNarrative: string;
  clarificationAnswers: Array<{
    question: string;
    answer: string;
  }>;
}
```

**Response:**
```typescript
interface ConsolidationResponse {
  consolidatedNarrative: string;
  phase: string;
  processingTime?: number;
}
```

## Error Handling Strategy

### 1. Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}
```

### 2. Error Types

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string = 'Validation failed',
    public validationErrors?: Record<string, string[]>
  ) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}
```

### 3. Graceful Degradation

```typescript
class ApiServiceWithFallback {
  async consolidateNarrative(
    phase: string,
    narrative: string,
    answers: ClarificationAnswer[]
  ): Promise<string> {
    try {
      // Try live API
      return await this.liveApi.consolidate(phase, narrative, answers);
    } catch (error) {
      console.warn('Live API failed, falling back to mock:', error);
      
      // Fallback to mock
      try {
        return await this.mockApi.consolidate(phase, narrative, answers);
      } catch (mockError) {
        console.error('Mock API also failed:', mockError);
        
        // Final fallback: return original narrative
        return narrative;
      }
    }
  }
}
```

## Mock Service Implementation

### Design Principles

1. **Realistic Delays** - Simulate network latency
2. **Consistent Data** - Return contextually appropriate responses
3. **Error Scenarios** - Support testing error conditions
4. **Deterministic Results** - Same input produces same output

### Example Implementation

```typescript
export class MockN8NService {
  private delay = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));
  
  async fetchClarificationQuestions(
    narrative: IncidentNarrative
  ): Promise<ClarificationQuestions> {
    // Simulate network delay
    await this.delay(800);
    
    // Generate contextual questions based on narrative
    return {
      beforeEvent: this.generateQuestions(narrative.beforeEvent, 'before'),
      duringEvent: this.generateQuestions(narrative.duringEvent, 'during'),
      endEvent: this.generateQuestions(narrative.endEvent, 'end'),
      postEvent: this.generateQuestions(narrative.postEvent, 'post')
    };
  }
  
  private generateQuestions(text: string, phase: string): Question[] {
    if (!text || text.length < 10) return [];
    
    // Generate 3 contextual questions
    const templates = QUESTION_TEMPLATES[phase];
    return templates.slice(0, 3).map((template, index) => ({
      id: `${phase}-q-${index + 1}`,
      question: template
    }));
  }
}
```

## Performance Optimization

### 1. Request Deduplication

```typescript
class ApiCache {
  private cache = new Map<string, Promise<any>>();
  
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 60000
  ): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const promise = fetcher();
    this.cache.set(key, promise);
    
    // Auto-expire after TTL
    setTimeout(() => this.cache.delete(key), ttl);
    
    return promise;
  }
}
```

### 2. Progressive Loading

```typescript
// Load data incrementally as user progresses
async function progressiveLoad(phases: Phase[]) {
  for (const phase of phases) {
    // Load only when needed
    if (shouldLoadPhase(phase)) {
      await loadPhaseData(phase);
    }
  }
}
```

### 3. Optimistic Updates

```typescript
// Update UI immediately, sync with server in background
function optimisticUpdate(data: any) {
  // Update local state immediately
  store.updateLocal(data);
  
  // Sync with server asynchronously
  api.sync(data)
    .then(() => store.confirmUpdate())
    .catch(() => store.revertUpdate());
}
```

## Testing Strategy

### 1. Mock Mode Testing

```typescript
describe('Mock API Service', () => {
  beforeEach(() => {
    process.env.VITE_API_MODE = 'mock';
  });
  
  it('should return clarification questions', async () => {
    const service = new ApiService();
    const questions = await service.fetchClarificationQuestions({
      beforeEvent: 'Test narrative',
      // ...
    });
    
    expect(questions.beforeEvent).toHaveLength(3);
    expect(questions.beforeEvent[0]).toHaveProperty('id');
    expect(questions.beforeEvent[0]).toHaveProperty('question');
  });
});
```

### 2. Integration Testing

```typescript
describe('API Integration', () => {
  it('should handle network errors gracefully', async () => {
    // Force network error
    jest.spyOn(global, 'fetch').mockRejectedValue(
      new Error('Network error')
    );
    
    const service = new ApiService();
    const result = await service.consolidateNarrative(
      'beforeEvent',
      'Test narrative',
      []
    );
    
    // Should fallback to original narrative
    expect(result).toBe('Test narrative');
  });
});
```

## Environment Configuration

### Development
```env
VITE_API_MODE=mock
VITE_N8N_BASE_URL=http://localhost:5678
VITE_API_TIMEOUT=30000
```

### Production
```env
VITE_API_MODE=live
VITE_N8N_BASE_URL=https://api.production.com
VITE_API_TIMEOUT=10000
```

## Security Considerations

1. **API Key Management** - Never expose keys in client code
2. **CORS Configuration** - Properly configure allowed origins
3. **Input Validation** - Validate all data before sending
4. **Error Messages** - Don't expose sensitive information
5. **Rate Limiting** - Implement client-side throttling

## Migration Guide

When transitioning from mock to live API:

1. **Verify Contracts** - Ensure mock matches live API
2. **Test Error Scenarios** - Verify error handling works
3. **Monitor Performance** - Check response times
4. **Gradual Rollout** - Use feature flags for control
5. **Fallback Strategy** - Keep mock as backup

## Future Enhancements

1. **WebSocket Support** - For real-time updates
2. **Offline Mode** - Queue requests when offline
3. **Response Caching** - Persistent cache layer
4. **Request Batching** - Combine multiple requests
5. **GraphQL Migration** - More efficient data fetching