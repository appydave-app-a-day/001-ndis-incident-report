# Epic 2: n8n Integration for Clarification & Basic Analysis

**Goal:** Integrate calls to n8n webhooks (and their mocks) for dynamic clarification questions during incident capture and for performing basic automated analysis (contributing factors, classification) post-submission.

## Story List

### Story 2.1: Integrate n8n Clarification Prompts into Wizard

-   **User Story / Goal:** As a Support Worker, after providing initial incident details (e.g., narrative sections), I want to be asked targeted clarification questions one at a time, so that I can provide comprehensive information efficiently and the system can capture more detailed context.
-   **Detailed Requirements:**
    * Identify specific points in the wizard flow (e.g., after each main narrative section from Story 1.3) where n8n clarification prompts should be triggered.
    * For each trigger point, the application will make a call to a designated n8n clarification webhook endpoint (or its corresponding mock handler, based on the toggle from Story 1.4).
    * The request to n8n should send the relevant current incident data (e.g., the text of the narrative section just completed).
    * The n8n workflow (or mock) is expected to respond with:
        * A specific question (string) to ask the user for clarification, OR
        * An indication that no further clarification is needed for that section.
    * The application UI will dynamically display the clarification question received from n8n (if any) to the user within the wizard, ideally one question at a time.
    * The user's answer to the clarification question will be captured and stored with the incident data (e.g., linked to the narrative section it clarifies, or as part of the `narrativeClarifications` array in the data model).
    * If n8n can return multiple clarification questions for a section iteratively, the UI should handle this flow (ask, capture, potentially re-query n8n with the new info). For MVP, one clarification question per trigger point might be sufficient.
    * The data structure for requests to and responses from the clarification n8n endpoint must be defined (referencing `docs/api-reference.md` and aligning with `docs/data-models.md`).
-   **Acceptance Criteria (ACs):**
    * AC1: After a user completes a designated narrative input field in the wizard, the system correctly calls the relevant n8n clarification service function (which then routes to mock or live endpoint).
    * AC2: The UI dynamically displays any clarification question returned by the n8n service call. If no question is returned, the wizard proceeds without a clarification step for that section.
    * AC3: The user can input an answer to the displayed clarification question, and this answer is captured and stored in the application's state associated with the incident.
    * AC4: The system correctly uses the mock handler for clarification prompts when n8n mode is set to "mock."
    * AC5: The request sent to the n8n clarification endpoint contains the necessary context (e.g., the narrative text being clarified).
-   **Tasks (Optional Initial Breakdown):**
    * [ ] Define specific trigger points in the wizard for clarification prompts.
    * [ ] Define the request/response JSON contract for the clarification n8n endpoint(s) in `docs/api-reference.md`.
    * [ ] Implement UI components to display dynamic questions from n8n and capture user responses.
    * [ ] Update the n8n service module (from Epic 1) to include functions for calling the clarification endpoint(s).
    * [ ] Implement mock handlers for the clarification endpoint(s) providing sample questions.
    * [ ] Integrate the clarification call-and-display logic into the main wizard flow at the defined trigger points.
    * [ ] Update application state management to store clarification Q&As.

---

### Story 2.2: Implement n8n Basic Analysis (Contributing Factors, Classification)

-   **User Story / Goal:** As a Team Leader (or Support Worker completing a report), I want the system to automatically suggest potential contributing factors and a classification for a reported incident using n8n, so that I can have an initial analytical overview quickly.
-   **Detailed Requirements:**
    * After all incident data is collected (including any clarification responses), likely at a "final review" step or just before the option to export, the application will trigger a call to an n8n webhook endpoint designated for basic analysis.
    * The complete incident data (all narratives, clarifications, and other fields) will be sent to this n8n analysis endpoint (or its mock).
    * The n8n workflow (or mock) is expected to respond with basic analysis results, such as:
        * A list of potential contributing factors (array of strings).
        * A suggested incident classification (string).
        * Optionally, a brief summary or rationale for the analysis.
    * This analysis data received from n8n will be stored alongside the incident data in the application's state for the current session.
    * The data structure for requests to and responses from the analysis n8n endpoint must be defined (referencing `docs/api-reference.md` and aligning with `docs/data-models.md`).
-   **Acceptance Criteria (ACs):**
    * AC1: Upon completion of all data entry in the wizard, the system correctly calls the n8n analysis service function (which then routes to mock or live endpoint) with the full incident data.
    * AC2: The system successfully receives and stores the suggested contributing factors (if any) from the n8n service response.
    * AC3: The system successfully receives and stores the suggested incident classification (if any) from the n8n service response.
    * AC4: The system correctly uses the mock handler for analysis when n8n mode is set to "mock," returning predefined sample analysis data.
    * AC5: The request sent to the n8n analysis endpoint contains the complete and accurate incident data collected through the wizard.
-   **Tasks (Optional Initial Breakdown):**
    * [ ] Define the request/response JSON contract for the analysis n8n endpoint in `docs/api-reference.md`.
    * [ ] Update the n8n service module to include a function for calling the analysis endpoint.
    * [ ] Implement a mock handler for the analysis endpoint providing sample contributing factors and classification.
    * [ ] Integrate the analysis call logic into the wizard flow (e.g., after the last data input step or on a review step).
    * [ ] Update application state management to store the received analysis results.
    * [ ] (Covered in Epic 3) Ensure the UI can display these analysis results.

---

## Change Log

| Change        | Date       | Version | Description                  | Author            |
| :------------ | :--------- | :------ | :--------------------------- | :---------------- |
| Initial Draft | 2025-06-05 | 0.1     | First draft of epic          | 2-project-manager |
| MVP Scoping   | 2025-06-05 | 0.2     | Ensured alignment with MVP focus | 2-project-manager |
