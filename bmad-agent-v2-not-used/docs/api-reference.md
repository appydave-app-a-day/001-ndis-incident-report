# NDIS Incident Capture / Analysis Tool API Reference

This document describes the API endpoints provided by n8n workflows that the React application will interact with. The application will use a configurable toggle to switch between calling these live n8n webhooks and local mock handlers.

## External APIs Consumed (n8n Webhooks)

The React application consumes n8n webhook endpoints for data enrichment (clarification) and basic analysis.

### 1. n8n Clarification Webhook

- **Purpose:** To obtain targeted clarification questions based on the incident data provided by the user, typically after a narrative section is completed.
- **HTTP Method:** `POST`
- **Endpoint URL (Example):** `/webhook/clarification`
  - _Note: The actual URL will be configurable via an environment variable (e.g., `REACT_APP_N8N_CLARIFICATION_URL`)._
- **Authentication:** For MVP, direct webhook access is assumed, especially if n8n is run locally or in a trusted environment. If security is required (e.g., for a publicly accessible n8n instance), it can be handled via n8n's built-in mechanisms (e.g., a secret in the path or a header like `X-N8N-API-KEY`, configured via environment variables). This is not explicitly detailed for MVP.
- **Request Body Schema:**
  The request sends context about the specific narrative section and the overall incident data collected so far.
  ```json
  {
    "incidentId": "string", // Locally generated UUID for the incident
    "promptedSectionKey": "string", // Key of the narrative section needing clarification (e.g., "preEvent", "duringEvent", "postEvent", "supportProvided")
    "narrativeSectionText": "string", // The text content of that narrative section
    "currentIncidentData": {
      /* Partial or full incident data object collected so far, aligning with docs/data-models.md */
    }
  }
  ```
- **Example Request:**
  ```json
  {
    "incidentId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "promptedSectionKey": "duringEvent",
    "narrativeSectionText": "The participant started shouting and pacing.",
    "currentIncidentData": {
      "reporterInfo": { "reporterName": "Jane Doe" },
      "participantInfo": { "participantName": "John Smith" },
      "eventDetails": {
        "eventTimestamp": "2025-07-15T10:30:00Z",
        "location": "Common Room"
      },
      "narrative": {
        "preEvent": "The participant was watching TV.",
        "duringEvent": "The participant started shouting and pacing."
      }
    }
  }
  ```
- **Success Response Schema (200 OK):**
  Returns a question if clarification is needed, or indicates no clarification is required.
  ```json
  {
    "clarificationNeeded": true, // boolean
    "questionToAsk": "string",   // The question to present to the user
    "promptedSection": "string"  // Echoes back the promptedSectionKey for context
  }
  // Or, if no clarification is needed for the provided section:
  {
    "clarificationNeeded": false,
    "promptedSection": "string" // Echoes back the promptedSectionKey
  }
  ```
  _Note: The user's answer to `questionToAsk` will be stored in the `narrativeClarifications` array as described in `docs/data-models.md`._
- **Example Success Response (Clarification Needed):**
  ```json
  {
    "clarificationNeeded": true,
    "questionToAsk": "What seemed to trigger the shouting and pacing?",
    "promptedSection": "duringEvent"
  }
  ```
- **Example Success Response (No Clarification Needed):**
  ```json
  {
    "clarificationNeeded": false,
    "promptedSection": "duringEvent"
  }
  ```
- **Error Response Schema (e.g., 400 Bad Request, 500 Internal Server Error):**
  ```json
  {
    "error": "string" // A message describing the error
  }
  ```

### 2. n8n Basic Analysis Webhook

- **Purpose:** To obtain basic automated analysis of the fully reported incident, including potential contributing factors and an incident classification.
- **HTTP Method:** `POST`
- **Endpoint URL (Example):** `/webhook/analysis`
  - _Note: The actual URL will be configurable via an environment variable (e.g., `REACT_APP_N8N_ANALYSIS_URL`)._
- **Authentication:** Same considerations as the Clarification Webhook.
- **Request Body Schema:**
  The request sends the complete incident data collected, including all narratives and any clarification Q&As. The structure should align with the export schema defined in `docs/data-models.md`.
  ```json
  // Full IncidentReport object as per docs/data-models.md
  // For example:
  {
    "incidentId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "reportGeneratedTimestamp": "2025-07-15T11:00:00Z",
    "reporterInfo": {
      /* ... */
    },
    "participantInfo": {
      /* ... */
    },
    "eventDetails": {
      /* ... */
    },
    "narrative": {
      /* ... */
    },
    "narrativeClarifications": [
      {
        "promptedSection": "duringEvent",
        "questionAsked": "What seemed to trigger the shouting and pacing?",
        "responseProvided": "Another participant changed the TV channel."
      }
    ]
    // ... other fields from data-models.md (excluding automatedAnalysis and versionInfo initially)
  }
  ```
- **Example Request:**
  _(A full JSON object representing the incident data, similar to the schema above)._
- **Success Response Schema (200 OK):**
  Returns the automated analysis results. This structure directly maps to the `automatedAnalysis` field in `docs/data-models.md`.
  ```json
  {
    "contributingFactors": ["string", "string"], // Array of strings
    "incidentClassification": "string",
    "analysisSummary": "string" // Optional: A brief summary from n8n
  }
  ```
- **Example Success Response:**
  ```json
  {
    "contributingFactors": [
      "Change in routine (TV channel changed)",
      "Sensory sensitivity"
    ],
    "incidentClassification": "Behavioral - Environmental Trigger - Minor",
    "analysisSummary": "The incident appears to be a reaction to an unexpected change in the environment."
  }
  ```
- **Error Response Schema (e.g., 400 Bad Request, 500 Internal Server Error):**
  ```json
  {
    "error": "string" // A message describing the error
  }
  ```

## Change Log

| Change        | Date       | Version | Description                                      | Author      |
| :------------ | :--------- | :------ | :----------------------------------------------- | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Initial draft detailing n8n webhook interactions | 3-architect |
