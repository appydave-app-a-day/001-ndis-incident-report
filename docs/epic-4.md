### Epic 4: Guided Incident Capture Workflow

- **Goal:** To implement the full business logic and specific UI screens for the frontline worker's incident capture process, leveraging the wizard framework built in Epic 2. The workflow must be highly intuitive, allowing a non-technical user to complete the process without prior training.

#### Stories:

- **Story 4.1: Implement Metadata Input Step**

  - **User Story:** As a frontline worker, I want to enter the basic details of an incident (my name, participant's name, date/time, location) on the first step of the wizard so that the report is correctly categorized.
  - **Acceptance Criteria:**
    1.  The first step of the "Incident Capture" wizard presents a form with input fields for "Reporter Name," "Participant Name," "Event Date/Time," and "Location."
    2.  Each input field is clearly labeled.
    3.  The "Event Date/Time" field provides a user-friendly date and time picker interface.
    4.  The values entered by the user in these fields are captured and stored in the application's state when they proceed to the next step.
    5.  This new wizard step, including the form components, is committed to version control.

- **Story 4.2: Implement Multi-Section Narrative Input Step & Pre-fetch Clarifications**

  - **User Story:** As a frontline worker, I want a single screen with four separate text areas to capture my entire narrative for the "Before," "During," "End," and "Post-Event" phases of the incident so I can provide all context in one go.
  - **Acceptance Criteria:**
    1.  The second step of the "Incident Capture" wizard displays a single screen/view.
    2.  The screen contains four distinct and clearly labeled multi-line text areas, one for each of the following: "Before the Event," "During the Event," "End of the Event," and "Post-Event Support."
    3.  Each text area is suitably large to encourage detailed input from the user.
    4.  The text entered into each of the four fields is captured and stored separately in the application's state.
    5.  Upon the user clicking "Next" to leave this step, the application shall trigger a single, asynchronous request to retrieve the clarifying questions for all four narrative sections at once.
    6.  This new wizard step is committed to version control.

- **Story 4.3: Implement "Before Event" Clarification Step**

  - **User Story:** As a frontline worker, I want to be presented with a list of clarifying questions specifically about the "Before the Event" narrative I provided, with the ability to provide optional answers.
  - **Acceptance Criteria:**
    1.  The third step of the "Incident Capture" wizard is dedicated to "Before the Event" clarifications.
    2.  The system displays the list of pre-fetched questions that are relevant to the "Before the Event" phase.
    3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
    4.  The user can navigate to the next step without entering text into any of the answer fields (i.e., answering is optional).
    5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
    6.  This new wizard step is committed to version control.

- **Story 4.4: Implement "During Event" Clarification Step**

  - **User Story:** As a frontline worker, I want to move to a new step to answer clarifying questions specifically about the "During the Event" narrative.
  - **Acceptance Criteria:**
    1.  The fourth step of the "Incident Capture" wizard is dedicated to "During the Event" clarifications.
    2.  The system displays the list of pre-fetched questions that are relevant to the "During the Event" phase.
    3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
    4.  The user can navigate to the next step without entering text into any of the answer fields.
    5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
    6.  This new wizard step is committed to version control.

- **Story 4.5: Implement "End of Event" Clarification Step**

  - **User Story:** As a frontline worker, I want to move to a new step to answer clarifying questions specifically about the "End of the Event" narrative.
  - **Acceptance Criteria:**
    1.  The fifth step of the "Incident Capture" wizard is dedicated to "End of the Event" clarifications.
    2.  The system displays the list of pre-fetched questions that are relevant to the "End of the Event" phase.
    3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
    4.  The user can navigate to the next step without entering text into any of the answer fields.
    5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
    6.  This new wizard step is committed to version control.

- **Story 4.6: Implement "Post-Event Support" Clarification Step**

  - **User Story:** As a frontline worker, I want to move to a new step to answer clarifying questions specifically about the "Post-Event Support" narrative.
  - **Acceptance Criteria:**
    1.  The sixth step of the "Incident Capture" wizard is dedicated to "Post-Event Support" clarifications.
    2.  The system displays the list of pre-fetched questions that are relevant to the "Post-Event Support" phase.
    3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
    4.  The user can navigate to the next step without entering text into any of the answer fields.
    5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
    6.  This new wizard step is committed to version control.

- **Story 4.7: Add Test Data Pre-Population Button**

  - **User Story:** As a developer/tester, I want a quick way to populate all form fields with realistic test data so I can efficiently test and demonstrate the incident capture workflow without manually entering data every time.
  - **Acceptance Criteria:**
    1.  A "Test Data" button is added to the wizard header, positioned to the left of the existing "View" button.
    2.  The button uses an appropriate icon (Flask, TestTube, or Data icon) with clear visual styling.
    3.  Clicking the button instantly populates all 8 form fields across metadata and narrative sections with realistic test data.
    4.  All populated data is immediately saved to the application state using existing store methods.
    5.  The test data includes proper formatting for date/time fields (current date minus 1 day).
    6.  Button functionality works from any wizard step and maintains design system consistency.

- **Story 4.8: Enhance Test Data with Clarification Answers**

  - **User Story:** As a developer/tester, I want the test data button to support progressive population so I can efficiently test both the basic incident capture workflow and the complete clarification workflow without manually entering dozens of form fields.
  - **Acceptance Criteria:**
    1.  The existing test data button supports progressive population with multi-level functionality.
    2.  First click populates the 8 basic fields (metadata + narrative) as currently implemented.
    3.  Second click loads mock clarification questions and populates all 12 clarification answers with realistic responses.
    4.  Third click resets all data to empty state for fresh testing.
    5.  Clarification answers extend the David/Lisa incident scenario with contextually appropriate responses.
    6.  Progressive population works seamlessly with existing state management across all wizard steps.

- **Story 4.9: Refactor Narrative Field Names for API Alignment**

  - **User Story:** As a developer working with the incident capture system, I want descriptive and semantically clear field names so that the code is more maintainable, API integration is straightforward, and the data model is self-documenting.
  - **Acceptance Criteria:**
    1.  All narrative field names are refactored from generic to descriptive names.
    2.  Field name changes: `before` → `beforeEvent`, `during` → `duringEvent`, `end` → `endEvent`, `postEvent` remains unchanged.
    3.  All TypeScript interfaces, form components, and clarification steps use the new field names consistently.
    4.  Test data and API service layer use the new field names for proper request/response mapping.
    5.  All existing functionality continues to work without regression.
    6.  Code maintains consistent camelCase naming conventions throughout.

- **Story 4.10: Implement N8N API Integration Foundation**

  - **User Story:** As a developer integrating with N8N workflows, I want a complete API service foundation with proper configuration, error handling, and documentation so that I can seamlessly switch between mock and live API modes and have clear contracts for backend workflow development.
  - **Acceptance Criteria:**
    1.  API service architecture with configurable domain via environment variables.
    2.  Two distinct API endpoints: clarification questions and narrative consolidation.
    3.  Complete TypeScript interfaces and error handling for both endpoints.
    4.  Mock mode functionality preserved for development.
    5.  Comprehensive documentation with curl examples and N8N setup instructions.
    6.  LLM prompts written in N8N interpolation format.
    7.  Phase-specific custom instructions for narrative consolidation.

- **Story 4.11: Consolidate Narratives with AI**

  - **User Story:** As a frontline worker, after answering the clarification questions, I want the system to automatically combine my original notes and my answers into a polished, well-written narrative for each phase of the incident.
  - **Acceptance Criteria:**
    1.  Upon completion of the final clarification step, the application makes a single API call to the "Consolidate Narrative Sections" endpoint.
    2.  The request body contains the original narratives and the new clarification answers.
    3.  The application saves the four returned `_extra` string values into the `IncidentReport.narrative` object in the global state.

- **Story 4.12: Implement Enhanced Review and Complete Step**

  - **User Story:** As a frontline worker, I want a comprehensive review screen that shows all my incident data including the AI-enhanced narratives, so I can review the complete report before submitting and see how my original information has been professionally enhanced.
  - **Acceptance Criteria:**
    1.  The final step of the "Incident Capture" wizard is a comprehensive review screen replacing the current placeholder.
    2.  The screen displays all collected incident information including metadata, original narratives, and AI-enhanced supplementary narratives.
    3.  Enhanced narratives are prominently showcased with consolidation status indicators.
    4.  Original narratives are accessible through show/hide toggle functionality.
    5.  The information is presented in a clear, easy-to-read professional format.
    6.  A "Complete Report" button finalizes the incident capture process.
    7.  Error states are handled gracefully with fallback to original content when consolidation fails.
    8.  The review experience showcases the value of the AI enhancement process.

- **Story 4.13: Enhanced Consolidation UX & Controls**

  - **User Story:** As a frontline worker, I want clear feedback about which narrative phase is being enhanced with a prominent processing dialog, and I want the ability to switch between mock and live API modes, so I can better understand what's happening and have control over the enhancement process.
  - **Acceptance Criteria:**
    1. Fix phase alignment bug where all four clarification steps show incorrect consolidation messages when pressing "Next".
    2. Replace small spinner with modal dialog during consolidation process showing clear title, phase-specific message, and prominent spinner.
    3. Add dynamic mock/live mode toggle icon in wizard header that overrides environment variable and persists user choice.
    4. Modal blocks user interaction during processing, auto-closes on success, and advances wizard automatically.
    5. Error handling with retry functionality and graceful degradation when consolidation fails.
    6. Integration with existing wizard framework maintains responsive design and accessibility standards.

