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

- **Story 4.8: Consolidate Narratives with AI**

  - **User Story:** As a frontline worker, after answering the clarification questions, I want the system to automatically combine my original notes and my answers into a polished, well-written narrative for each phase of the incident.
  - **Acceptance Criteria:**
    1.  Upon completion of the final clarification step, the application makes a single API call to the "Consolidate Narrative Sections" endpoint.
    2.  The request body contains the original narratives and the new clarification answers.
    3.  The application saves the four returned `_extra` string values into the `IncidentReport.narrative` object in the global state.

- **Story 4.9: Implement Dynamic "Add Question" Feature**

  - **User Story:** As a frontline worker, I want a simple button and text prompt on the clarification screens to suggest a new, useful question so I can help improve the reporting process.
  - **Acceptance Criteria:**
    1.  On each of the four clarification wizard steps (4.3, 4.4, 4.5, and 4.6), a button labeled "Suggest a New Question" is displayed.
    2.  Clicking this button reveals a text input field and a "Submit Suggestion" button.
    3.  A user can type a question into the input field and click "Submit Suggestion".
    4.  For the MVP, the submitted question text is logged to the browser's developer console. No backend action is required.
    5.  After submission, the input field is cleared and hidden, returning the UI to its previous state.
    6.  The new UI elements and their functionality are committed to version control.

- **Story 4.10: Implement "Review and Complete" Step**
  - **User Story:** As a frontline worker, I want a final review screen that consolidates my original narrative with all the answers from the clarification steps so I can confirm the complete report before finalizing it.
  - **Acceptance Criteria:**
    1.  The final step of the "Incident Capture" wizard is a read-only review screen.
    2.  The screen displays the polished, AI-consolidated `_extra` narrative for each of the four phases.
    3.  The information is presented in a clear, easy-to-read format.
    4.  A "Complete" button is displayed on this step.
    5.  Clicking the "Complete" button updates the application's state to mark the "Incident Capture" workflow as finished.
    6.  Upon completion, the "Analysis" workflow in the left-hand navigation menu becomes enabled and clickable.
    7.  This new wizard step is committed to version control.
