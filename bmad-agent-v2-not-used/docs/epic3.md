# Epic 3: Incident Review & Export

**Goal:** Develop the interface for Team Leaders (or Support Workers) to review submitted incidents (from the current session) with their associated analysis, and implement functionality to export incident data to JSON and Markdown formats to the clipboard.

## Story List

### Story 3.1: Develop Incident List / Review Interface (Current Session Data)

- **User Story / Goal:** As a Team Leader or Support Worker, after an incident report has been fully entered (including n8n analysis), I want to view a summary or list of incidents captured in the current session and select one to see its full details, so that I can review the information before potential export or finalization.
- **Detailed Requirements:**
  - For MVP, incident data is managed within the current browser session. If multiple incidents are captured in one session, the system should allow navigation between them or display a list of them.
  - If only one incident is processed at a time per session, this story focuses on a "Review" screen displaying the current incident's details.
  - The review interface must clearly display all captured information for a selected/current incident:
    - Basic incident details (reporter, participant, date/time, location).
    - Full narrative texts.
    - All clarification questions and their answers.
    - n8n-generated analysis (contributing factors, classification).
  - The layout should be clear, readable, and well-organized, using ShadCN components for consistency.
- **Acceptance Criteria (ACs):**
  - AC1: A dedicated review screen or section displays all data fields for the currently completed incident report.
  - AC2: All user-inputted data (basic info, narratives, clarification answers) is accurately displayed.
  - AC3: All n8n-generated analysis (contributing factors, classification) is accurately displayed.
  - AC4: The information is presented in a read-only, clear, and well-organized format.
  - AC5: (If multiple incidents per session supported for MVP) A simple list allows selection of incidents captured in the current session for review. If not, this AC is N/A.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Design the UI layout for the incident review screen.
  - [ ] Develop React components to display each section of the incident data (basic info, narratives, Q&As, analysis).
  - [ ] Ensure the review screen correctly sources all data from the application's state for the current incident.
  - [ ] (If applicable) Implement simple listing/navigation if multiple incidents can be held in session state.

---

### Story 3.2: Implement JSON Export to Clipboard

- **User Story / Goal:** As a user (Support Worker or Team Leader), I want to export the complete incident report (including all narratives, clarifications, and n8n-generated analysis) as a JSON object to my clipboard, so that I can easily paste it into other systems, save it as a file, or for data transfer.
- **Detailed Requirements:**
  - Provide a button or action (e.g., "Export to JSON") on the incident review screen or a similar appropriate location.
  - Clicking this button will:
    - Gather all data for the current incident from the application's state.
    - Format this data into a JSON string according to the structure defined in `docs/data-models.md` (which includes fields like incidentId, reporterInfo, eventDetails, narrative, narrativeClarifications, automatedAnalysis, etc.).
    - Copy the generated JSON string to the user's clipboard.
  - Provide clear user feedback upon successful copy (e.g., a toast notification: "Incident JSON copied to clipboard!").
  - Handle potential errors during the copy process gracefully with user feedback.
- **Acceptance Criteria (ACs):**
  - AC1: An "Export to JSON" button/action is available on the incident review interface.
  - AC2: Clicking the button generates a valid JSON string representing the full incident data, adhering to the defined schema in `docs/data-models.md`.
  - AC3: The generated JSON string is successfully copied to the user's clipboard.
  - AC4: The user receives a clear visual confirmation (e.g., toast message) that the JSON data has been copied.
  - AC5: If the clipboard copy operation fails, the user is informed with an appropriate error message.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Confirm final JSON export structure (as per `docs/data-models.md`).
  - [ ] Implement logic to serialize the current incident's state data into the defined JSON format.
  - [ ] Integrate a JavaScript library or use the browser's native Clipboard API for copying text to the clipboard.
  - [ ] Add the "Export to JSON" UI element (e.g., ShadCN Button) to the review screen.
  - [ ] Implement user feedback mechanisms (success/error notifications).

---

### Story 3.3: Implement Markdown Export to Clipboard

- **User Story / Goal:** As a user (Support Worker or Team Leader), I want to export the incident report in a human-readable Markdown format to my clipboard, so that I can easily paste it into emails, text-based reports, or internal documentation.
- **Detailed Requirements:**
  - Provide a button or action (e.g., "Export to Markdown") on the incident review screen or a similar appropriate location.
  - Clicking this button will:
    - Gather all data for the current incident from the application's state.
    - Format this data into a well-structured and human-readable Markdown string. This should include clear headings for each section (e.g., Incident Details, Narratives, Clarifications, Analysis).
    - Copy the generated Markdown string to the user's clipboard.
  - Provide clear user feedback upon successful copy (e.g., a toast notification: "Incident Markdown copied to clipboard!").
  - Handle potential errors during the copy process gracefully with user feedback.
- **Acceptance Criteria (ACs):**
  - AC1: An "Export to Markdown" button/action is available on the incident review interface.
  - AC2: Clicking the button generates a well-formatted Markdown string representing the incident data in a readable, sectioned format.
  - AC3: The generated Markdown string is successfully copied to the user's clipboard.
  - AC4: The user receives a clear visual confirmation (e.g., toast message) that the Markdown data has been copied.
  - AC5: If the clipboard copy operation fails, the user is informed with an appropriate error message.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Define the structure and formatting for the Markdown output (e.g., which headings to use, how to list arrays like contributing factors).
  - [ ] Implement logic to transform the current incident's state data into the defined Markdown format.
  - [ ] Integrate a JavaScript library or use the browser's native Clipboard API for copying text to the clipboard.
  - [ ] Add the "Export to Markdown" UI element (e.g., ShadCN Button) to the review screen.
  - [ ] Implement user feedback mechanisms (success/error notifications).

---

## Change Log

| Change        | Date       | Version | Description                                            | Author            |
| :------------ | :--------- | :------ | :----------------------------------------------------- | :---------------- |
| Initial Draft | 2025-06-05 | 0.1     | First draft of epic                                    | 2-project-manager |
| MVP Scoping   | 2025-06-05 | 0.2     | Ensured alignment with MVP focus (session data review) | 2-project-manager |
