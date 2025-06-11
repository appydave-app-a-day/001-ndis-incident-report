# NDIS Incident Capture / Analysis Tool Data Models

This document outlines the primary data model for an NDIS Incident Report within the application. It serves as the schema for:

1.  The data structure managed internally by the application (e.g., in the Zustand state store).
2.  The data payload sent to the n8n analysis webhook.
3.  The structure of the JSON export.

## 1. Incident Report JSON Schema

The following JSON schema defines the structure of an incident report object. This schema is based on the content provided in `data-models.md`.

```json
{
  "incidentId": "uuid-string-generated-locally",
  "reportGeneratedTimestamp": "iso-8601-datetime",
  "reporterInfo": {
    "reporterName": "string"
  },
  "participantInfo": {
    "participantName": "string"
  },
  "eventDetails": {
    "eventTimestamp": "iso-8601-datetime",
    "location": "string"
  },
  "narrative": {
    "preEvent": "string", // "What was occurring before the event?"
    "duringEvent": "string", // "What was occurring during the event?"
    "postEvent": "string", // "How did the event end?"
    "supportProvided": "string" // "What support was given in the two hours following the event?"
  },
  "narrativeClarifications": [
    // Array to hold Q&A clarifications from n8n interaction
    {
      "promptedSection": "string", // e.g., "preEvent", "duringEvent". Matches n8n clarification request context.
      "questionAsked": "string", // Question received from n8n
      "responseProvided": "string" // User's answer to the question
    }
    // ... more clarification Q&As for different sections or iterative questions
  ],
  "narrativeClarification": {
    // Note: See discussion point below regarding this field.
    "preEventClarification": "string",
    "duringEventClarification": "string",
    "postEventClarification": "string",
    "supportProvidedClarification": "string"
  },
  "automatedAnalysis": {
    // Populated by the n8n analysis webhook
    "contributingFactors": [
      "string" // List of identified factors
    ],
    "incidentClassification": "string", // Suggested classification
    "analysisSummary": "string" // Optional summary text from n8n
  },
  "versionInfo": {
    "exportSchemaVersion": "1.0", // Version of this JSON schema
    "applicationVersion": "string" // Version of the app that generated the export
  }
}
```

## 2. Notes and Discussion Points

- **Internal State Model:** It is recommended that this `IncidentReport` schema (potentially with minor adaptations for UI-specific flags if necessary, though preferably kept separate) serves as the primary structure for managing the incident data within the Zustand global state store. This simplifies data handling, especially for populating n8n requests and generating exports.
- **Clarification Fields (`narrativeClarifications` vs. `narrativeClarification`):**
  - The schema includes two fields related to clarifications:
    - `narrativeClarifications` (array): This array seems well-suited for storing a list of dynamic question-and-answer pairs, where each object contains the specific section prompted, the question asked by n8n, and the user's response. This aligns with the n8n clarification workflow where questions can be targeted and iterative.
    - `narrativeClarification` (object): This object contains specific clarification fields per narrative section (e.g., `preEventClarification`).
  - **Recommendation for MVP:** To maintain simplicity and flexibility with dynamic n8n clarification prompts, it's recommended to primarily use the `narrativeClarifications` array. The purpose and population strategy for the singular `narrativeClarification` object and its sub-fields should be clarified. If it's intended as a summary or an alternative way to store clarifications, its role needs to be defined. For the MVP, focusing on the `narrativeClarifications` array for storing Q&A pairs from n8n interactions might be sufficient and more straightforward. We should decide if the `narrativeClarification` object is still needed or if it should be removed/modified to avoid redundancy or confusion.
- **Timestamps:** Ensure all timestamp fields (`reportGeneratedTimestamp`, `eventTimestamp`) are stored in a consistent format, ISO 8601 is specified and recommended.
- **`incidentId`**: This should be generated client-side (e.g., using a UUID library) when a new incident report is initiated.

## 3. Other Data Models

For the MVP, the `IncidentReport` is the primary complex data model. Other state managed by the application (e.g., UI state like loading flags, n8n mock/live mode toggle) will be simpler and defined directly within the Zustand store, not necessarily requiring separate formal model documents here.

## 4. Change Log

| Change        | Date       | Version | Description                                                       | Author      |
| :------------ | :--------- | :------ | :---------------------------------------------------------------- | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Formalized based on user-provided schema and architectural review | 3-architect |
