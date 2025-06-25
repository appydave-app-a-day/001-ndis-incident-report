# Epic 5: Analysis API Reference

## Overview

This document defines the API contracts for Epic 5's Team Lead analysis workflow. These endpoints extend the existing N8N integration to support incident analysis and classification.

## Endpoints

### 1. Generate Incident Analysis

Analyzes the consolidated incident narrative to produce contributing conditions and incident type classifications.

#### Endpoint
```
POST https://{domain}/webhook/generate-incident-analysis
```

#### Request Schema

```typescript
interface GenerateIncidentAnalysisRequest {
  // Required fields
  consolidated_narrative: string;    // Full enriched narrative from capture workflow
  participant_name: string;          // Name of the participant involved
  reporter_name: string;             // Name of the staff member reporting
  location: string;                  // Location where incident occurred
  incident_date: string;             // ISO 8601 date format
  
  // Optional fields
  analysis_focus?: string;           // Specific aspects to focus on
  previous_incidents?: boolean;      // Flag if participant has history
}
```

#### Response Schema

```typescript
interface GenerateIncidentAnalysisResponse {
  contributing_conditions: {
    immediate_conditions: string;    // Primary analysis of contributing factors
    environmental_factors?: string;  // Environmental aspects that contributed
    participant_factors?: string;    // Participant-specific factors
    confidence: number;              // 0-1 confidence score
  };
  
  incident_classifications: Array<{
    incident_type: 'Behavioural' | 'Environmental' | 'Medical' | 'Communication' | 'Other';
    supporting_evidence: string;     // Evidence from narrative supporting this classification
    severity: 'Low' | 'Medium' | 'High';
    confidence: number;              // 0-1 confidence for this classification
    recommended_actions?: string[];  // Optional follow-up recommendations
  }>;
  
  processing_metadata?: {
    model_used: string;              // AI model used for analysis
    processing_time: number;         // Time in milliseconds
    warnings?: string[];             // Any processing warnings
  };
}
```

#### Example Request

```bash
curl -X POST https://buildergeniobit.app.n8n.cloud/webhook/generate-incident-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "consolidated_narrative": "Initial Event: Lisa was sitting in the lounge room watching afternoon television in a calm state. The environment was quiet with normal lighting and no other people present.\n\nIncident Trigger: At approximately 3:30 PM, a pizza delivery person knocked loudly on the door, startling Lisa who was not expecting visitors.\n\nEscalation: Lisa became extremely agitated, began yelling and throwing objects. Staff member David attempted verbal de-escalation techniques but Lisa continued to escalate.\n\nResolution: Police were called at 3:45 PM and arrived at 4:00 PM. Lisa was assessed and transported to the psychiatric unit at the local hospital for evaluation.\n\nPost-Incident: Lisa was discharged the following day and returned home. A debrief was held with the support team to discuss trigger management strategies.",
    "participant_name": "Lisa Thompson",
    "reporter_name": "David Smith",
    "location": "Mascot Community Center - Unit 4",
    "incident_date": "2024-06-20T15:30:00Z"
  }'
```

#### Example Response

```json
{
  "contributing_conditions": {
    "immediate_conditions": "The primary contributing factor was an unexpected sensory trigger (loud knocking) that startled Lisa while she was in a calm, regulated state. The absence of support staff in the immediate vicinity meant intervention was delayed. Lisa's known sensitivity to unexpected loud noises, combined with being alone at the time, created conditions for rapid escalation.",
    "environmental_factors": "Quiet environment suddenly disrupted, participant alone without immediate support, afternoon timing (potential fatigue factor)",
    "participant_factors": "Known sensory sensitivities, particularly to unexpected loud sounds. History of escalation when startled.",
    "confidence": 0.88
  },
  "incident_classifications": [
    {
      "incident_type": "Behavioural",
      "supporting_evidence": "Participant exhibited aggressive behaviors including yelling and throwing objects, requiring police intervention",
      "severity": "High",
      "confidence": 0.92,
      "recommended_actions": [
        "Review sensory management plan",
        "Consider doorbell modifications",
        "Ensure support staff proximity during high-risk times"
      ]
    },
    {
      "incident_type": "Environmental",
      "supporting_evidence": "Unexpected loud noise from door was the clear environmental trigger for the incident",
      "severity": "Medium",
      "confidence": 0.85
    }
  ],
  "processing_metadata": {
    "model_used": "gpt-4",
    "processing_time": 2340,
    "warnings": []
  }
}
```

### 2. Alternative: Separate Endpoints

If preferred, the analysis can be split into two separate API calls:

#### 2a. Analyze Contributing Conditions

```
POST https://{domain}/webhook/analyze-contributing-conditions
```

**Request/Response**: Similar structure but only returns contributing conditions

#### 2b. Classify Incident Types

```
POST https://{domain}/webhook/classify-incident-types
```

**Request/Response**: Similar structure but only returns classifications

## N8N Workflow Implementation Guide

### Webhook Setup

1. Create a new webhook node with POST method
2. Set path to `/webhook/generate-incident-analysis`
3. Configure response mode as "Wait for workflow completion"
4. Set response code to 200

### AI/LLM Node Configuration

Use the following prompt template:

```
You are an expert NDIS incident analyst. Analyze the following incident report and provide:
1. Contributing conditions analysis
2. Incident type classifications with evidence

INCIDENT REPORT:
Participant: {{ $json.participant_name }}
Reporter: {{ $json.reporter_name }}
Location: {{ $json.location }}
Date: {{ $json.incident_date }}

NARRATIVE:
{{ $json.consolidated_narrative }}

Provide your analysis in the following JSON format:
{
  "contributing_conditions": {
    "immediate_conditions": "detailed analysis of immediate contributing factors",
    "environmental_factors": "environmental aspects that contributed",
    "participant_factors": "participant-specific factors",
    "confidence": 0.0-1.0
  },
  "incident_classifications": [
    {
      "incident_type": "Behavioural|Environmental|Medical|Communication|Other",
      "supporting_evidence": "specific evidence from the narrative",
      "severity": "Low|Medium|High",
      "confidence": 0.0-1.0,
      "recommended_actions": ["action 1", "action 2"]
    }
  ]
}

Focus on:
- Identifying all contributing factors (immediate, environmental, participant-related)
- Classifying the incident accurately with clear evidence
- Providing actionable insights for prevention
- Being specific and referencing the narrative directly
```

### Error Handling

Configure error responses for:
- Invalid JSON in request (400)
- AI processing errors (500)
- Timeout after 30 seconds (408)

## Frontend Integration

### Service Implementation

```typescript
// Extend the existing n8n-api service
export class N8NAnalysisAPI extends N8NIncidentAPI {
  async generateIncidentAnalysis(
    narrative: string,
    metadata: AnalysisMetadata
  ): Promise<AnalysisResult> {
    const request: GenerateIncidentAnalysisRequest = {
      consolidated_narrative: narrative,
      participant_name: metadata.participantName,
      reporter_name: metadata.reporterName,
      location: metadata.location,
      incident_date: metadata.incidentDate
    };

    const response = await this.makeRequest<
      GenerateIncidentAnalysisRequest,
      GenerateIncidentAnalysisResponse
    >(this.urls.incidentAnalysis, request);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to generate analysis');
    }

    // Transform to frontend format
    return {
      contributingConditions: response.data.contributing_conditions.immediate_conditions,
      environmentalFactors: response.data.contributing_conditions.environmental_factors,
      classifications: response.data.incident_classifications.map(c => ({
        id: generateId(),
        incidentType: c.incident_type,
        supportingEvidence: c.supporting_evidence,
        severity: c.severity,
        confidence: c.confidence
      }))
    };
  }
}
```

### Mock Service Implementation

```typescript
export class MockAnalysisAPI {
  async generateIncidentAnalysis(
    narrative: string,
    metadata: AnalysisMetadata
  ): Promise<AnalysisResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock data based on narrative content
    const hasBehavioural = narrative.toLowerCase().includes('agitated') || 
                          narrative.toLowerCase().includes('aggressive');
    const hasEnvironmental = narrative.toLowerCase().includes('noise') || 
                            narrative.toLowerCase().includes('trigger');

    return {
      contributingConditions: mockAnalysisData.contributingConditions,
      environmentalFactors: mockAnalysisData.environmentalFactors,
      classifications: mockAnalysisData.classifications.filter(c => {
        if (c.incidentType === 'Behavioural' && !hasBehavioural) return false;
        if (c.incidentType === 'Environmental' && !hasEnvironmental) return false;
        return true;
      })
    };
  }
}
```

## Testing

### Manual Testing with curl

Test the analysis endpoint:

```bash
# Test with sample narrative
curl -X POST https://buildergeniobit.app.n8n.cloud/webhook/generate-incident-analysis \
  -H "Content-Type: application/json" \
  -d @test-analysis-request.json

# Test error handling
curl -X POST https://buildergeniobit.app.n8n.cloud/webhook/generate-incident-analysis \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

### Mock Data Scenarios

The mock service should provide different responses for:
1. **Behavioural incident** - High severity with multiple classifications
2. **Medical incident** - Single classification with clear evidence
3. **Environmental trigger** - Medium severity with prevention recommendations
4. **Communication breakdown** - Low severity with process improvements
5. **Complex multi-factor** - Multiple classifications of varying severity

## Migration Notes

When transitioning from Epic 4 to Epic 5:

1. The consolidated narrative from Epic 4 becomes the input for analysis
2. Metadata from the incident capture is passed through
3. Analysis results are stored separately from capture data
4. UI state tracks prefetch status during Story 5.1 navigation

## Security Considerations

1. **Input Validation**: Validate narrative length (max 10,000 characters)
2. **Sanitization**: Strip any HTML/script tags from narrative
3. **Rate Limiting**: Consider implementing rate limits in N8N
4. **Authentication**: Future consideration for API key authentication