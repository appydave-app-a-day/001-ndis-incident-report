# Epic 5 Implementation Guide: AI-Assisted Report Analysis Workflow

## Overview

This guide captures lessons learned from Epic 4 and provides technical guidance for implementing Epic 5's Team Lead analysis workflow. Stories will be created just-in-time as development progresses.

## Key Patterns from Epic 4 to Reuse

### 1. Progressive Enhancement Pattern

**Epic 4 Learning**: Progressive consolidation after each clarification step proved superior to batch processing.

**Epic 5 Application**:
```typescript
// Story 5.1: Trigger progressive pre-fetch after narrative review
const handleReviewComplete = async () => {
  // Start async pre-fetch of analysis data
  await Promise.all([
    fetchContributingConditions(narrative),
    fetchIncidentClassifications(narrative)
  ]);
  wizard.nextStep();
};
```

### 2. Service Layer Architecture

**Epic 4 Pattern**: Flexible API service with mock/live switching
```typescript
// Reuse existing N8NApiService pattern
class AnalysisApiService extends N8NApiService {
  async fetchContributingConditions(narrative: string) {
    if (this.mode === 'mock') {
      return this.mockService.getContributingConditions();
    }
    return this.post('/analysis/contributing-conditions', { narrative });
  }
}
```

### 3. State Management Extension

**Epic 4 Pattern**: Layered Zustand store structure

**Epic 5 Extension**:
```typescript
interface AnalysisState {
  // Data layer
  analysisReport: {
    narrative: string; // From capture workflow
    contributingConditions: string;
    classifications: IncidentClassification[];
  };
  
  // UI state layer
  prefetchStatus: {
    conditions: 'idle' | 'loading' | 'success' | 'error';
    classifications: 'idle' | 'loading' | 'success' | 'error';
  };
  
  // Actions
  updateContributingConditions: (conditions: string) => void;
  addClassification: (classification: IncidentClassification) => void;
  removeClassification: (id: string) => void;
}
```

### 4. Component Reusability Patterns

**Epic 4 Success**: Reusable clarification steps saved significant time

**Epic 5 Opportunity**: Create reusable analysis components
- `ReadOnlyNarrative` component for Stories 5.1 and 5.4
- `EditableAnalysisField` for Story 5.2
- `ClassificationList` for Story 5.3

## API Contract Templates

### Analysis APIs Overview
Epic 5 requires two new N8N webhook endpoints for the Team Lead analysis workflow:

1. **Generate Analysis** - Produces both contributing conditions and incident classifications from the consolidated narrative
2. **Alternative**: Two separate endpoints for conditions and classifications

### Option 1: Combined Analysis Endpoint (Recommended)

```typescript
// Request to N8N webhook
// POST /webhook/generate-incident-analysis
export interface GenerateIncidentAnalysisRequest {
  // Consolidated narrative from capture workflow
  consolidated_narrative: string;
  
  // Metadata for context
  participant_name: string;
  reporter_name: string;
  location: string;
  incident_date: string;
  
  // Optional guidance for AI
  analysis_focus?: string;
}

// Response from N8N
export interface GenerateIncidentAnalysisResponse {
  contributing_conditions: {
    immediate_conditions: string;  // Primary analysis text
    environmental_factors?: string; // Optional additional context
    confidence: number; // 0-1
  };
  
  incident_classifications: Array<{
    incident_type: 'Behavioural' | 'Environmental' | 'Medical' | 'Communication' | 'Other';
    supporting_evidence: string;
    severity: 'Low' | 'Medium' | 'High';
    confidence: number; // 0-1
  }>;
  
  processing_metadata?: {
    model_used: string;
    processing_time: number;
    warnings?: string[];
  };
}
```

### Option 2: Separate Endpoints

#### Contributing Conditions API
```typescript
// Request
// POST /webhook/analyze-contributing-conditions
export interface AnalyzeContributingConditionsRequest {
  consolidated_narrative: string;
  participant_name: string;
  reporter_name: string;
  analysis_instructions?: string;
}

// Response
export interface AnalyzeContributingConditionsResponse {
  contributing_conditions: string; // AI-generated analysis
  environmental_factors?: string;
  suggested_interventions?: string[];
  confidence: number; // 0-1 confidence score
}
```

#### Incident Classifications API
```typescript
// Request
// POST /webhook/classify-incident-types
export interface ClassifyIncidentTypesRequest {
  consolidated_narrative: string;
  participant_name: string;
  contributing_conditions?: string; // Optional, if already analyzed
}

// Response
export interface ClassifyIncidentTypesResponse {
  classifications: Array<{
    incident_type: 'Behavioural' | 'Environmental' | 'Medical' | 'Communication' | 'Other';
    supporting_evidence: string;
    severity: 'Low' | 'Medium' | 'High';
    confidence: number;
    recommended_actions?: string[];
  }>;
  primary_classification: string; // Main incident type
  total_confidence: number;
}
```

### Frontend API Service Integration

```typescript
// Extend existing IIncidentAPI interface
export interface IAnalysisAPI extends IIncidentAPI {
  /**
   * Generate comprehensive incident analysis (Epic 5)
   */
  generateIncidentAnalysis(
    narrative: string,
    metadata: {
      participantName: string;
      reporterName: string;
      location: string;
      incidentDate: string;
    }
  ): Promise<{
    contributingConditions: string;
    classifications: IncidentClassification[];
  }>;
}

// Frontend type for classifications
export interface IncidentClassification {
  id: string; // Generated UUID for frontend tracking
  incidentType: 'Behavioural' | 'Environmental' | 'Medical' | 'Communication' | 'Other';
  supportingEvidence: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
}
```

### Mock Data Structure

```typescript
// Mock response for development
export const mockAnalysisResponse: GenerateIncidentAnalysisResponse = {
  contributing_conditions: {
    immediate_conditions: "The incident was triggered by unexpected loud noise from the pizza delivery, which startled Lisa who was in a calm state. Environmental factors include the participant being alone in the living room without immediate support available. The escalation from agitation to requiring police intervention suggests a lack of de-escalation strategies or support persons present.",
    environmental_factors: "Living room setting, alone, evening time, unexpected visitor",
    confidence: 0.85
  },
  incident_classifications: [
    {
      incident_type: 'Behavioural',
      supporting_evidence: "Participant became agitated and required police intervention",
      severity: 'High',
      confidence: 0.9
    },
    {
      incident_type: 'Environmental',
      supporting_evidence: "Loud unexpected noise from door knocking was the trigger",
      severity: 'Medium',
      confidence: 0.8
    }
  ]
};

## Developer Experience Considerations

### 1. Test Data Requirements
- Pre-populated narratives from Epic 4 capture workflow
- Mock AI responses for different incident types
- Edge cases: empty responses, API failures

### 2. Development Tools
- Analysis state inspector (similar to Epic 4's test data tools)
- Quick navigation between analysis steps
- Mock/live mode toggle in UI

## Story Implementation Guidelines

### Story 5.1: Review Full Narrative & Trigger Analysis
**Key Considerations**:
- Reuse narrative display from Epic 4's review step
- Implement progressive pre-fetch on "Next" click
- Show loading indicators for background fetching
- Handle API failures gracefully

### Story 5.2: Review and Edit Contributing Conditions
**Key Considerations**:
- Large textarea with proper styling
- Auto-save on blur or step navigation
- Character count indicator
- Markdown support (if needed)

### Story 5.3: Curate Incident Type Classification
**Key Considerations**:
- Dynamic list management (add/remove)
- Dropdown with all valid incident types
- Validation to prevent duplicates
- Clear visual hierarchy

### Story 5.4: Review and Complete
**Key Considerations**:
- Read-only summary of all analysis
- Clear visual sections
- "Complete Analysis" updates workflow status
- Consider print-friendly layout

## Technical Debt Prevention

### 1. Establish Patterns Early
```typescript
// src/patterns/analysis-patterns.ts
export const useAnalysisPrefetch = () => {
  // Reusable prefetch logic
};

export const AnalysisSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  // Consistent section styling
};
```

### 2. Error Handling Standards
```typescript
// Consistent error boundaries for analysis steps
const AnalysisErrorBoundary = ({ children, fallback }) => {
  // Graceful degradation for API failures
};
```

### 3. Loading State Management
```typescript
// Centralized loading UI for analysis operations
const AnalysisLoadingOverlay = ({ message }) => {
  // Consistent loading experience
};
```

## Testing Strategy

### 1. Mock Scenarios
- Successful analysis flow
- API timeout scenarios
- Empty classification results
- Network failure handling

### 2. State Transitions
- Narrative → Contributing Conditions
- Conditions → Classifications
- Complete workflow state

### 3. User Interactions
- Edit/save contributing conditions
- Add/remove classifications
- Navigation between steps

## Performance Considerations

### 1. Progressive Loading
- Don't block UI during pre-fetch
- Cache analysis results in memory
- Prevent duplicate API calls

### 2. State Updates
- Granular updates to prevent re-renders
- Debounce text field updates
- Optimistic UI updates

## Accessibility Requirements

### 1. Screen Reader Support
- Proper ARIA labels for dynamic lists
- Announce loading states
- Clear focus management

### 2. Keyboard Navigation
- Tab through all interactive elements
- Enter/Space for buttons
- Escape to cancel modals

## Next Steps

1. Create Story 5.1 when ready to begin implementation
2. Reference this guide during story creation
3. Update guide with discoveries during implementation
4. Extract reusable patterns as they emerge