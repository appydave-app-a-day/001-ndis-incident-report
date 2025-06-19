# N8N API Integration Documentation

Complete guide for integrating the NDIS Incident Reporting application with N8N workflows.

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [API Endpoints](#api-endpoints)
4. [Service Usage](#service-usage)
5. [Mock vs Live Mode](#mock-vs-live-mode)
6. [Error Handling](#error-handling)
7. [N8N Workflow Setup](#n8n-workflow-setup)
8. [Testing](#testing)

## Overview

The N8N API integration provides two main capabilities:

1. **Clarification Questions**: Generate contextual questions based on incident narratives
2. **Narrative Consolidation**: Enhance narratives using clarification responses

Both endpoints support mock data for development and live N8N workflows for production.

## Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
# N8N Domain Configuration
VITE_N8N_DOMAIN=buildergeniobit.app.n8n.cloud

# API Mode: 'mock' or 'live'
VITE_API_MODE=mock
```

### TypeScript Configuration

The service automatically configures based on environment variables:

```typescript
import { n8nApi } from '@/lib/services/n8n-api';

// Service automatically detects mock/live mode
const config = n8nApi.getConfigInfo();
console.log('Current mode:', config.mode);
```

## API Endpoints

### 1. Clarification Questions Endpoint

**Purpose**: Generate relevant clarification questions for each incident phase.

#### Request
```http
POST https://{domain}/webhook/narrative-report-clarification
Content-Type: application/json

{
  "participant_name": "Lisa",
  "reporter_name": "David",
  "location": "Mascot Community Center",
  "before_event": "Lisa was sitting in the lounge room watching TV, appeared calm",
  "during_event": "Lisa became agitated when pizza delivery knocked loudly",
  "end_of_event": "Police were called and Lisa was taken to psychiatric hospital",
  "post_event_support": "Lisa returned home the next day"
}
```

#### Response
```json
{
  "before_event_questions": [
    "What was the participant doing before the incident?",
    "What was the environment like before the incident?",
    "Were there any unusual circumstances or triggers present?"
  ],
  "during_event_questions": [
    "How long did the incident last?",
    "Who else was present during the incident?",
    "What interventions were attempted?"
  ],
  "end_of_event_questions": [
    "How was the incident resolved?",
    "Was anyone injured during the incident?",
    "What was the immediate outcome?"
  ],
  "post_event_questions": [
    "What follow-up actions were taken?",
    "Was a supervisor or manager notified?",
    "What support was provided to the participant?"
  ]
}
```

#### curl Example
```bash
curl -X POST https://buildergeniobit.app.n8n.cloud/webhook/narrative-report-clarification \
  -H "Content-Type: application/json" \
  -d '{
    "participant_name": "Lisa",
    "reporter_name": "David", 
    "location": "Mascot Community Center",
    "before_event": "Lisa was sitting in the lounge room watching TV, appeared calm",
    "during_event": "Lisa became agitated when pizza delivery knocked loudly",
    "end_of_event": "Police were called and Lisa was taken to psychiatric hospital",
    "post_event_support": "Lisa returned home the next day"
  }'
```

### 2. Narrative Consolidation Endpoint

**Purpose**: Create enhanced narratives from clarification responses.

#### Request
```http
POST https://{domain}/webhook/narrative-consolidation
Content-Type: application/json

{
  "clarification_questions": [
    {
      "question": "What was the participant doing before the incident?",
      "answer": "Lisa was sitting quietly on the couch watching afternoon TV"
    },
    {
      "question": "What was the environment like?",
      "answer": "Living room was calm with normal lighting, no other people present"
    }
  ],
  "custom_instructions": "Focus on environmental factors and participant baseline state"
}
```

#### Response
```json
{
  "narrative_extra": "Additional context: The participant had been in a stable, calm environment for approximately 30 minutes prior to the incident. Environmental conditions were optimal for the participant's wellbeing, with appropriate lighting and minimal noise."
}
```

#### curl Example
```bash
curl -X POST https://buildergeniobit.app.n8n.cloud/webhook/narrative-consolidation \
  -H "Content-Type: application/json" \
  -d '{
    "clarification_questions": [
      {
        "question": "What was the participant doing before the incident?",
        "answer": "Lisa was sitting quietly on the couch watching afternoon TV"
      }
    ],
    "custom_instructions": "Focus on environmental factors and participant baseline state"
  }'
```

## Service Usage

### Basic Usage

```typescript
import { n8nApi } from '@/lib/services/n8n-api';
import type { IncidentDataForQuestions } from '@/lib/types/n8n-types';

// Get clarification questions
const incidentData: IncidentDataForQuestions = {
  participantName: 'Lisa',
  reporterName: 'David',
  location: 'Mascot Community Center',
  beforeEvent: 'Lisa was calm, watching TV',
  duringEvent: 'Lisa became agitated',
  endEvent: 'Police intervention required',
  postEvent: 'Lisa returned home',
};

const questionsResult = await n8nApi.getClarificationQuestions(incidentData);

if (questionsResult.success) {
  console.log('Questions:', questionsResult.data);
} else {
  console.error('Error:', questionsResult.error);
}
```

### Narrative Consolidation

```typescript
import type { ClarificationAnswersForConsolidation } from '@/lib/types/n8n-types';

// Consolidate single phase
const clarificationAnswers: ClarificationAnswersForConsolidation[] = [
  {
    questionId: 'b1',
    question: 'What was the participant doing before?',
    answer: 'Lisa was watching afternoon television quietly',
  },
];

const consolidationResult = await n8nApi.consolidateNarrative(
  clarificationAnswers,
  'before_event'
);

if (consolidationResult.success) {
  console.log('Enhanced narrative:', consolidationResult.data.narrative_extra);
}
```

### Consolidate All Phases

```typescript
// Consolidate all four phases in parallel
const allAnswers = {
  beforeEvent: [/* clarification answers */],
  duringEvent: [/* clarification answers */],
  endEvent: [/* clarification answers */],
  postEvent: [/* clarification answers */],
};

const allResults = await n8nApi.consolidateAllNarratives(allAnswers);

// Handle results for each phase
Object.entries(allResults).forEach(([phase, result]) => {
  if (result.success) {
    console.log(`${phase} enhanced:`, result.data.narrative_extra);
  } else {
    console.error(`${phase} error:`, result.error);
  }
});
```

## Mock vs Live Mode

### Mock Mode (Development)
```env
VITE_API_MODE=mock
```

- Uses local mock data
- Simulates API delays (1.5-2 seconds)
- No external network calls
- Comprehensive logging in development console
- Realistic test responses

### Live Mode (Production)
```env
VITE_API_MODE=live
```

- Makes actual HTTP requests to N8N
- Requires configured N8N workflows
- Real API responses and errors
- 30-second timeout protection

### Switching Modes

The service automatically detects the mode:

```typescript
import { isMockMode, isLiveMode } from '@/lib/config/api-config';

if (isMockMode()) {
  console.log('Using mock data for development');
} else {
  console.log('Making live API calls');
}
```

## Error Handling

### Response Structure

All API methods return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;        // Present when success is true
  error?: string;  // Present when success is false  
  status?: number; // HTTP status code
}
```

### Error Types

```typescript
// Network errors
{
  success: false,
  error: "Network connection failed",
  status: 0
}

// Validation errors  
{
  success: false,
  error: "Invalid request parameters",
  status: 400
}

// Server errors
{
  success: false,
  error: "Internal server error", 
  status: 500
}

// Timeout errors
{
  success: false,
  error: "Request timeout",
  status: 408
}
```

### Error Handling Example

```typescript
const result = await n8nApi.getClarificationQuestions(incidentData);

if (!result.success) {
  // Handle specific error types
  switch (result.status) {
    case 400:
      console.error('Validation error:', result.error);
      break;
    case 500:
      console.error('Server error:', result.error);
      break;
    case 0:
      console.error('Network error:', result.error);
      break;
    default:
      console.error('Unknown error:', result.error);
  }
  return;
}

// Success case
console.log('Questions received:', result.data);
```

## N8N Workflow Setup

### For Backend Developers

#### 1. Clarification Questions Workflow

**Webhook Configuration:**
```
Method: POST
Path: /webhook/narrative-report-clarification
Response Mode: Wait for webhook
Response Code: 200
```

**Input Parameters:**
- `participant_name` (string)
- `reporter_name` (string)
- `location` (string)
- `before_event` (string)
- `during_event` (string)
- `end_of_event` (string)
- `post_event_support` (string)

**LLM Prompt Template (N8N format):**
```
You are an NDIS incident reporting assistant. Generate relevant clarification questions for each phase of the incident.

**INCIDENT DETAILS:**
Participant: {{ $json.participant_name }}
Reporter: {{ $json.reporter_name }}
Location: {{ $json.location }}

**BEFORE EVENT:** {{ $json.before_event }}
**DURING EVENT:** {{ $json.during_event }}
**END OF EVENT:** {{ $json.end_of_event }}
**POST EVENT:** {{ $json.post_event_support }}

Generate 3-5 relevant clarification questions for each phase that would help provide additional context and detail for the incident report.

**RESPONSE FORMAT:**
Return as JSON with arrays for each phase:
{
  "before_event_questions": ["question1", "question2", ...],
  "during_event_questions": ["question1", "question2", ...],
  "end_of_event_questions": ["question1", "question2", ...],
  "post_event_questions": ["question1", "question2", ...]
}
```

#### 2. Narrative Consolidation Workflow

**Webhook Configuration:**
```
Method: POST  
Path: /webhook/narrative-consolidation
Response Mode: Wait for webhook
Response Code: 200
```

**Input Parameters:**
- `clarification_questions` (array of objects)
- `custom_instructions` (string)

**LLM Prompt Template (N8N format):**
```
You are a professional NDIS incident report writer. Consolidate clarification responses into a supplementary narrative.

**INSTRUCTIONS:**
{{ $json.custom_instructions }}

**CLARIFICATION RESPONSES:**
{{#each $json.clarification_questions}}
Q: {{ this.question }}
A: {{ this.answer }}
{{/each}}

**TASK:** Create a supplementary narrative that consolidates these clarification responses into additional contextual information.

**RESPONSE:** Return only the consolidated narrative text as a JSON object:
{
  "narrative_extra": "your consolidated narrative here"
}
```

### Phase-Specific Instructions

The system automatically provides these custom instructions based on the phase:

**Before Event:**
> Focus on environmental factors, participant's baseline state, and contextual circumstances that preceded the incident. Emphasize what was normal versus unusual in the setting.

**During Event:**
> Focus on specific behaviors observed, interventions attempted, timeline of events, and safety considerations. Be precise about actions, reactions, and escalation patterns.

**End Event:**
> Focus on resolution techniques used, de-escalation methods, and how the situation was brought under control. Emphasize successful interventions and outcome.

**Post Event:**
> Focus on follow-up actions taken, support provided to participant, notifications made, and ongoing considerations for care continuity.

## Testing

### Health Check

```typescript
const healthResult = await n8nApi.healthCheck();
console.log('Service status:', healthResult.data?.status);
console.log('Current mode:', healthResult.data?.mode);
```

### Mock Error Testing

```typescript
import { MockN8NApiService } from '@/lib/services/mock-n8n-service';

// Test different error scenarios
const networkError = await MockN8NApiService.simulateError('network');
const validationError = await MockN8NApiService.simulateError('validation');
const serverError = await MockN8NApiService.simulateError('server');
const timeoutError = await MockN8NApiService.simulateError('timeout');
```

### Configuration Validation

```typescript
import { validateConfig } from '@/lib/config/api-config';

const validation = validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}
```

### Development Console Logging

When in development mode, the service provides detailed logging:

- API request/response details
- Mock data information
- Configuration information
- Error details and stack traces

## Integration Checklist

### Development Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Configure `VITE_N8N_DOMAIN` 
- [ ] Set `VITE_API_MODE=mock`
- [ ] Test health check endpoint
- [ ] Verify mock responses work

### Production Setup
- [ ] Configure production N8N domain
- [ ] Set `VITE_API_MODE=live`
- [ ] Set up N8N clarification questions workflow
- [ ] Set up N8N narrative consolidation workflow
- [ ] Test both endpoints with real data
- [ ] Configure error monitoring
- [ ] Test timeout handling

### N8N Workflow Setup
- [ ] Create webhook endpoints
- [ ] Configure LLM integration (OpenAI/Claude)
- [ ] Implement prompt templates
- [ ] Test JSON response parsing
- [ ] Validate response format matches interfaces
- [ ] Test error scenarios
- [ ] Configure response timeouts

This documentation provides complete guidance for implementing and maintaining the N8N API integration.