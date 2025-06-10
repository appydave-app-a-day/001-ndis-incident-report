# NDIS Incident Documentation Assistant Product Requirements Document (PRD)

## 1. Goal, Objective and Context

**Goal:** The primary goal is to address the inconsistent and inadequate methods currently used for NDIS incident reporting, such as Slack, Excel, or paper. We will create a structured, user-friendly system that captures the immediate, firsthand account of an incident from a frontline support worker and then intelligently enriches that narrative with crucial details. The entire reporting and enrichment process should be completed within a few hours of the incident to ensure maximum accuracy.

**Objective (for this MVP):** The core objective of this MVP is to develop a compelling, high-fidelity demonstration tool for potential NDIS service provider clients. We aim to validate the hypothesis that our guided, question-based workflow can produce significantly higher-quality and more detailed incident reports than traditional methods.

**Context:** This MVP is the first step towards a full-fledged commercial SaaS solution designed to standardize and streamline incident reporting across the NDIS landscape. While the long-term vision includes advanced AI analytics and full compliance features, this MVP will be a front-end-only application focused entirely on demonstrating the core reporting and analysis workflow. It will prove the value of our approach before we invest in a full backend infrastructure.

## 2. Functional Requirements (MVP)

### Incident Capture Workflow

* The system shall provide a step-by-step wizard-style interface for incident reporting.
* The system shall capture the following incident metadata: `reporter_name`, `participant_name`, `event_datetime`, and `location`.
* The system shall allow the user to input separate text narratives for the four key phases of an incident: before, during, end, and post-event support.
* The system shall present the user with clarifying follow-up questions for each of the four narrative sections after the initial text has been provided.
* The system shall display a consolidated view of the final narrative, which includes both the original input and the additional context gathered from the clarifying questions.

### Basic Analysis Workflow

* The system shall allow a secondary user to review the consolidated narrative from the capture workflow.
* The system shall provide a mechanism for the secondary user to identify and record "Contributing Conditions".
* The system shall provide a mechanism for the secondary user to classify the incident based on a predefined list of incident categories.

### Core System Functionality

* The system shall provide a function to export the complete report (consolidated narrative and analysis) to the user's clipboard in JSON or Markdown format.

## 3. Non-Functional Requirements (MVP)

As this project is a non-production MVP intended for demonstration purposes only, most traditional non-functional requirements are out of scope. The focus is on successfully demonstrating the core user workflow.

* **Usability:**
    * The user interface must be modern, professional, and intuitive. A high degree of usability is required to make a compelling demonstration.
    * The user experience should be simple and guided, especially for the frontline worker.
* **Security & Privacy:**
    * Production-grade security is **out of scope** for this MVP.
    * The system will not have user authentication or access control.
    * The demonstration will use anonymized data to ensure data privacy is not a concern.
* **Reliability:**
    * The system does not have a defined uptime requirement. As a front-end-only application, its reliability is dependent on the user's browser.
* **Performance:**
    * There are no specific performance or load time requirements for this MVP. The application is expected to be responsive for a single user.
* **Error Handling:**
    * Detailed error handling is explicitly **out of scope** for this MVP. The demonstration will focus on the primary "happy path" workflow.

## 4. User Interaction and Design Goals

* **Overall Vision & Experience:** The application must project a modern, clean, and professional aesthetic. The user experience is paramount and must be simple, intuitive, and feel guided, especially for the frontline worker who is not a technical user.
* **Key Interaction Paradigms:** The core of the application will be a **step-by-step wizard**. This guides the user through the process, presenting them with one task at a time to reduce cognitive load and ensure all necessary information is captured sequentially.
* **Core Screens/Views (Conceptual):**
    * **Incident Metadata Screen:** A simple form to capture the initial details of the incident.
    * **Narrative Input Screens:** A series of four screens for the user to input their narrative for each phase of the incident (Before, During, End, Post-Event Support).
    * **Narrative Clarification Screens:** A series of dynamic screens that present follow-up questions to enrich the narrative.
    * **Analysis Screen:** A view for the secondary user (Team Leader/Manager) to read the consolidated narrative and input their analysis (Contributing Factors, Incident Type).
    * **Final Report Screen:** A read-only view of the complete, final report with clear functions to copy the content to the clipboard in either Markdown or JSON format.
* **Target Devices/Platforms:** The MVP is envisioned as a web application, designed primarily for use on desktop browsers, as it will be used in demonstration settings.

## 5. Technical Assumptions

### Core Architecture & Technology

* **Repository Structure:** The project will be developed within a **Monorepo**.
* **High-Level Service Architecture:** The MVP will be a **front-end-only application**. There is no requirement for a backend service or a persistent database.
* **Frontend Platform:** The application should be built using **React**.
* **Database Requirements:** No database is required for the MVP. The application will operate with an in-memory or local browser storage system.
* **LLM Interaction Modes:** The system must be able to operate in two distinct modes for generating clarifying questions:
    1.  **Live Mode:** Interacting with a live N8N API endpoint.
    2.  **Mock Mode:** Using local, pre-defined mock data to simulate the API call and response.
    * A switch or other mechanism must be available within the application to toggle between these two modes.

### Testing requirements

* **Validation Approach:** Formal automated testing (unit, integration, E2E) is **out of scope** for the MVP. The primary validation method will be manual run-throughs of the demonstration script to ensure the "happy path" workflow functions as expected.

## 6. Epic Overview

---

### **Epic 1: Project Foundation & Initial Setup**

* **Goal:** To establish the foundational structure of the React application, including project scaffolding, dependency installation, and basic file structure, to support all future development.

* **Stories:**
    * **Story 1.1: Initial Application Scaffolding**
        * **User Story:** As a developer, I want to create the initial React application using a standard scaffolding tool (e.g., Vite) so that we have a basic, runnable starting point for the project.
        * **Acceptance Criteria:**
            1.  A new React project is successfully created in the project's monorepo.
            2.  Running the standard `dev` command (e.g., `npm run dev`) successfully starts the local development server without errors.
            3.  The default application starter page is accessible and renders correctly in a web browser.
            4.  The initial project files are successfully committed to the main branch of the version control system.
    * **Story 1.2: Install Core Dependencies**
        * **User Story:** As a developer, I want to install and configure the core project dependencies, including the chosen UI library (e.g., Tailwind CSS or shadcn/ui), so that foundational tools are available for all subsequent development.
        * **Acceptance Criteria:**
            1.  The chosen UI library (e.g., Tailwind CSS or shadcn/ui) is successfully installed.
            2.  The necessary configuration files for the UI library (e.g., `tailwind.config.js`, `postcss.config.js`) are created and correctly configured.
            3.  The application's main stylesheet is updated to include the necessary directives for the UI library.
            4.  The application successfully compiles and runs with the new dependencies installed.
            5.  All changes, including updates to `package.json` (and lock files) and new configuration files, are committed to version control.
    * **Story 1.3: Establish Directory Structure**
        * **User Story:** As a developer, I want to create the primary top-level directory structure (e.g., `src/components`, `src/features`, `src/lib`) so that all future code can be organized consistently.
        * **Acceptance Criteria:**
            1.  The following directories are created within the application's `src` folder: `/components`, `/features`, `/lib`, `/hooks`, `/store`, and `/types`.
            2.  Each newly created directory contains a basic `README.md` file that briefly explains the directory's purpose (e.g., "This directory holds reusable React components.").
            3.  The application continues to compile and run without errors after the new directories are added.
            4.  The new empty directories and their `README.md` files are committed to version control.
    * **Story 1.4: Configure Linter and Formatter**
        * **User Story:** As a developer, I want to set up and configure ESLint and Prettier so that a consistent code style is enforced across the entire project from the beginning.
        * **Acceptance Criteria:**
            1.  ESLint and Prettier packages, along with any necessary plugins, are installed as development dependencies.
            2.  Configuration files (e.g., `.eslintrc.json`, `.prettierrc`) are created in the project root.
            3.  Scripts to run the linter and formatter are added to `package.json` (e.g., `lint`, `format`).
            4.  Running the `format` script on the initial project codebase completes successfully.
            5.  Running the `lint` script on the initial project codebase passes without any errors.
            6.  All new configuration files and changes to `package.json` are committed to version control.

---

### **Epic 2: Core Wizard & Navigation Framework**

* **Goal:** To build a reusable, generic wizard component that includes a visual progress indicator at the top of the screen and standard navigation controls (Next, Back). This epic will also include a top-level screen to allow a user to select which workflow to start (e.g., "Incident Capture" or "Basic Analysis").

* **Stories:**
    * **Story 2.1: Create Reusable Wizard Component Shell**
        * **User Story:** As a developer, I want to create a generic wizard component that can accept a list of steps so that we have a reusable framework for all multi-step processes.
        * **Acceptance Criteria:**
            1.  A new component named `Wizard.tsx` is created in the `src/components/` directory.
            2.  The component accepts a `steps` prop, which is an array of objects, where each object represents a step and contains the content to be rendered.
            3.  The component correctly manages the state of the current step index, defaulting to the first step.
            4.  When rendered, the component displays the content for the currently active step.
            5.  The component is added to a temporary page or a Storybook story for basic visualization and testing.
            6.  The new component file is committed to version control.
    * **Story 2.2: Implement Wizard Navigation Controls**
        * **User Story:** As a developer, I want to add "Next" and "Back" buttons to the wizard component shell so that a user can navigate between steps.
        * **Acceptance Criteria:**
            1.  The `Wizard` component renders "Next" and "Back" buttons.
            2.  Clicking the "Next" button advances the wizard to the subsequent step and displays its content.
            3.  Clicking the "Back" button returns the wizard to the previous step and displays its content.
            4.  The "Back" button is disabled or hidden when the user is on the first step.
            5.  On the final step of the wizard, the "Next" button is replaced by a "Finish" button.
            6.  The new "Finish" button on the last step does not need to have any functionality yet, beyond being visible.
            7.  All changes to the `Wizard` component are committed to version control.
    * **Story 2.3: Implement Visual Progress Indicator**
        * **User Story:** As a developer, I want to add a visual progress bar to the top of the wizard component so that users can clearly see which step they are on, how far they have to go, and navigate back to previously completed steps.
        * **Acceptance Criteria:**
            1.  A progress indicator is displayed at the top of the `Wizard` component.
            2.  The indicator visually communicates the total number of steps and clearly highlights which step is currently active.
            3.  The `Wizard` component tracks which steps have been "visited". A step is considered visited after the user navigates away from it using the "Next" button.
            4.  The step markers in the progress indicator for all visited steps are clickable.
            5.  Clicking a visited step in the indicator navigates the user directly to that step.
            6.  Step markers for unvisited steps are visually distinct (e.g., grayed out) and are not clickable.
            7.  The active step in the indicator updates correctly when the user navigates with the "Next," "Back," or clickable progress indicator markers.
            8.  All changes to the `Wizard` component are committed to version control.
    * **Story 2.4: Create Application Shell with Workflow Navigation**
        * **User Story:** As a user, I want a persistent navigation menu on the side of the screen that displays the main stages of the incident report ("Capture" and "Analysis") so that I always know my current stage and can easily navigate between completed stages.
        * **Acceptance Criteria:**
            1.  A main application layout or "shell" is created that includes a persistent left-hand navigation menu.
            2.  The menu clearly lists the two primary workflows: "1. Incident Capture" and "2. Analysis".
            3.  By default, the "Analysis" workflow in the menu is visually disabled (e.g., grayed out and not clickable).
            4.  Clicking "Incident Capture" launches the wizard for that workflow in the main content area.
            5.  A mechanism will be needed to "complete" the capture workflow, which will then enable the "Analysis" option in the menu. This does not need to be implemented in this story.

---

### **Epic 3: Guided Incident Capture Workflow**

* **Goal:** To implement the full business logic and specific UI screens for the frontline worker's incident capture process, leveraging the wizard framework built in Epic 2. The workflow must be highly intuitive, allowing a non-technical user to complete the process without prior training.

* **Stories:**
    * **Story 3.1: Implement Metadata Input Step**
        * **User Story:** As a frontline worker, I want to enter the basic details of an incident (my name, participant's name, date/time, location) on the first step of the wizard so that the report is correctly categorized.
        * **Acceptance Criteria:**
            1.  The first step of the "Incident Capture" wizard presents a form with input fields for "Reporter Name," "Participant Name," "Event Date/Time," and "Location."
            2.  Each input field is clearly labeled.
            3.  The "Event Date/Time" field provides a user-friendly date and time picker interface.
            4.  The values entered by the user in these fields are captured and stored in the application's state when they proceed to the next step.
            5.  This new wizard step, including the form components, is committed to version control.
    * **Story 3.2: Implement Multi-Section Narrative Input Step & Pre-fetch Clarifications**
        * **User Story:** As a frontline worker, I want a single screen with four separate text areas to capture my entire narrative for the "Before," "During," "End," and "Post-Event" phases of the incident so I can provide all context in one go.
        * **Acceptance Criteria:**
            1.  The second step of the "Incident Capture" wizard displays a single screen/view.
            2.  The screen contains four distinct and clearly labeled multi-line text areas, one for each of the following: "Before the Event," "During the Event," "End of the Event," and "Post-Event Support."
            3.  Each text area is suitably large to encourage detailed input from the user.
            4.  The text entered into each of the four fields is captured and stored separately in the application's state.
            5.  Upon the user clicking "Next" to leave this step, the application shall trigger a single, asynchronous request to retrieve the clarifying questions for all four narrative sections at once.
            6.  This new wizard step is committed to version control.
    * **Story 3.3: Implement "Before Event" Clarification Step**
        * **User Story:** As a frontline worker, I want to be presented with a list of clarifying questions specifically about the "Before the Event" narrative I provided, with the ability to provide optional answers.
        * **Acceptance Criteria:**
            1.  The third step of the "Incident Capture" wizard is dedicated to "Before the Event" clarifications.
            2.  The system displays the list of pre-fetched questions that are relevant to the "Before the Event" phase.
            3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
            4.  The user can navigate to the next step without entering text into any of the answer fields (i.e., answering is optional).
            5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
            6.  This new wizard step is committed to version control.
    * **Story 3.4: Implement "During Event" Clarification Step**
        * **User Story:** As a frontline worker, I want to move to a new step to answer clarifying questions specifically about the "During the Event" narrative.
        * **Acceptance Criteria:**
            1.  The fourth step of the "Incident Capture" wizard is dedicated to "During the Event" clarifications.
            2.  The system displays the list of pre-fetched questions that are relevant to the "During the Event" phase.
            3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
            4.  The user can navigate to the next step without entering text into any of the answer fields.
            5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
            6.  This new wizard step is committed to version control.
    * **Story 3.5: Implement "End of Event" Clarification Step**
        * **User Story:** As a frontline worker, I want to move to a new step to answer clarifying questions specifically about the "End of the Event" narrative.
        * **Acceptance Criteria:**
            1.  The fifth step of the "Incident Capture" wizard is dedicated to "End of the Event" clarifications.
            2.  The system displays the list of pre-fetched questions that are relevant to the "End of the Event" phase.
            3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
            4.  The user can navigate to the next step without entering text into any of the answer fields.
            5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
            6.  This new wizard step is committed to version control.
    * **Story 3.6: Implement "Post-Event Support" Clarification Step**
        * **User Story:** As a frontline worker, I want to move to a new step to answer clarifying questions specifically about the "Post-Event Support" narrative.
        * **Acceptance Criteria:**
            1.  The sixth step of the "Incident Capture" wizard is dedicated to "Post-Event Support" clarifications.
            2.  The system displays the list of pre-fetched questions that are relevant to the "Post-Event Support" phase.
            3.  Each question is displayed on the screen, paired with its own multi-line text input field for the answer.
            4.  The user can navigate to the next step without entering text into any of the answer fields.
            5.  Any answers provided are captured and stored in the application's state, associated with their respective questions.
            6.  This new wizard step is committed to version control.
    * **Story 3.7: Implement Dynamic "Add Question" Feature**
        * **User Story:** As a frontline worker, I want a simple button and text prompt on the clarification screens to suggest a new, useful question so I can help improve the reporting process.
        * **Acceptance Criteria:**
            1.  On each of the four clarification wizard steps (3.3, 3.4, 3.5, and 3.6), a button labeled "Suggest a New Question" is displayed.
            2.  Clicking this button reveals a text input field and a "Submit Suggestion" button.
            3.  A user can type a question into the input field and click "Submit Suggestion".
            4.  For the MVP, the submitted question text is logged to the browser's developer console (e.g., `console.log("New question suggested: ...")`). No backend action is required.
            5.  After submission, the input field is cleared and hidden, returning the UI to its previous state.
            6.  The new UI elements and their functionality are committed to version control.
    * **Story 3.8: Implement "Review and Complete" Step**
        * **User Story:** As a frontline worker, I want a final review screen that consolidates my original narrative with all the answers from the clarification steps so I can confirm the complete report before finalizing it.
        * **Acceptance Criteria:**
            1.  The final step of the "Incident Capture" wizard is a read-only review screen.
            2.  The screen clearly displays the original narrative and any answered clarification questions for each of the four phases ("Before," "During," "End," and "Post-Event").
            3.  The information is presented in a clear, easy-to-read format.
            4.  A "Complete" button is displayed on this step.
            5.  Clicking the "Complete" button updates the application's state to mark the "Incident Capture" workflow as finished.
            6.  Upon completion, the "Analysis" workflow in the left-hand navigation menu becomes enabled and clickable.
            7.  This new wizard step is committed to version control.

---

### **Epic 4: AI-Assisted Report Analysis Workflow**

* **Goal:** To implement the full business logic and UI screens for the Team Lead's analysis process, which includes reviewing the captured narrative, adding contributing factors, and classifying the incident, all within the core wizard framework.

* **Stories:**
    * **Story 4.1: Create "Review Full Narrative" & Trigger Analysis**
        * **User Story:** As a Team Lead, I want the first step of the analysis workflow to be a read-only view of the complete, enriched narrative from the capture stage so that I have all the context before I begin my analysis.
        * **Acceptance Criteria:**
            1.  The first step of the "Analysis" wizard displays the complete, consolidated narrative in a read-only format.
            2.  Upon the user clicking "Next" to leave this step, the application shall trigger a single, asynchronous request (using the live/mock switch) with the full narrative data to pre-fetch both the "Contributing Conditions" and the "Incident Type Classification" analysis.
            3.  This wizard step is committed to version control.
    * **Story 4.2: Review and Edit "Contributing Conditions"**
        * **User Story:** As a Team Lead, I want to review the AI-generated summary of contributing conditions and edit it as needed so that the final analysis is accurate and complete.
        * **Acceptance Criteria:**
            1.  The second step of the analysis wizard is dedicated to "Contributing Conditions".
            2.  A large text area on the screen is pre-populated with the "Immediate Contributing Conditions" text generated by the AI.
            3.  The user can freely edit, add to, or delete the text within the text area.
            4.  The final, edited text is saved to the application's state when the user proceeds to the next step.
            5.  This wizard step is committed to version control.
    * **Story 4.3: Curate "Incident Type Classification"**
        * **User Story:** As a Team Lead, I want to review a list of AI-suggested incident classifications, with the ability to add, remove, or edit them, so that the final report is accurately categorized.
        * **Acceptance Criteria:**
            1.  The third step of the analysis wizard is dedicated to "Incident Type Classification".
            2.  The step is pre-populated with a list of classification items based on the AI response.
            3.  Each item in the list clearly displays the "Incident Type" and a text input field containing the "Supporting Evidence".
            4.  The user can edit the text in the "Supporting Evidence" field for any classification.
            5.  Each classification item has a "Remove" button that deletes it from the list.
            6.  A button labeled "Add Incident Type" is present on the screen.
            7.  Clicking "Add Incident Type" creates a new, blank classification item with a dropdown menu containing all valid incident types (Behavioural, Environmental, etc.) and an empty text field for evidence.
            8.  The final, curated list of classifications is saved to the application's state when the user proceeds.
            9.  This new wizard step is committed to version control.
    * **Story 4.4: Implement Analysis "Review and Complete" Step**
        * **User Story:** As a Team Lead, I want a final screen to review the original narrative alongside my own curated analysis and formally mark the analysis stage as complete.
        * **Acceptance Criteria:**
            1.  The final step of the "Analysis" wizard is a read-only review screen.
            2.  The screen displays the complete, enriched narrative from the capture workflow.
            3.  The screen displays the final, edited "Contributing Conditions" text.
            4.  The screen displays the final, curated list of "Incident Type Classifications" and their supporting evidence, formatted clearly (e.g., as a table).
            5.  A "Complete Analysis" button is displayed.
            6.  Clicking the "Complete Analysis" button updates the application's state to mark this stage as finished.
            7.  This new wizard step is committed to version control.

---

### **Epic 5: Mocking & Demo Data Framework**

* **Goal:** To implement a configurable "Mock Mode," including the on-screen switch to toggle between live and mock backends, and the ability to select from multiple pre-defined data scenarios. This includes simulating realistic API delays and providing clear loading feedback.

* **Stories:**
    * **Story 5.1: Implement Mock/Live Mode Switch**
        * **User Story:** As a presenter, I want a clear on-screen switch to toggle the application between "Live Mode" (for real API calls) and "Mock Mode" (for using local data) so I can control the demo environment.
        * **Acceptance Criteria:**
            1.  A UI switch or toggle component is implemented in a persistent location of the application's UI (e.g., in a settings menu or header).
            2.  The switch clearly displays the currently active mode ("Live" or "Mock").
            3.  Toggling the switch updates a global state variable that holds the current mode.
            4.  The application defaults to "Mock Mode" when it first loads.
            5.  The new UI component and its associated state logic are committed to version control.
    * **Story 5.2: Create Mock Data Scenarios**
        * **User Story:** As a developer, I want to create the local data files (e.g., JSON) for at least three distinct, pre-scripted incident scenarios so that we have a reliable and varied data set for demonstrations.
        * **Acceptance Criteria:**
            1.  A new directory (e.g., `src/lib/mock-data`) is created to store the mock data files.
            2.  At least three separate JSON files are created, each representing a unique incident scenario.
            3.  Each scenario file contains a complete data set for a single incident, including mock content for: incident metadata, the four narrative sections, the lists of clarifying questions for each narrative section, and the pre-populated AI analysis (Contributing Conditions and Incident Type Classification).
            4.  The content of the scenarios is sufficiently varied to demonstrate different use cases.
            5.  The new mock data files are committed to version control.
    * **Story 5.3: Implement Mock Scenario Selector**
        * **User Story:** As a presenter, when in "Mock Mode," I want a simple UI element (e.g., a dropdown) to select which of the pre-defined incident scenarios I want to use for my demo.
        * **Acceptance Criteria:**
            1.  A UI component (e.g., a dropdown menu) is implemented in a persistent location of the application's UI.
            2.  This scenario selector component is only visible when the application's global state is set to "Mock Mode".
            3.  The selector is populated with the list of available mock scenarios created in the previous story.
            4.  Selecting a scenario from the list updates a global state variable to hold the identifier of the currently active mock scenario.
            5.  The application defaults to the first available mock scenario upon entering "Mock Mode".
            6.  The new UI component and its associated state logic are committed to version control.
    * **Story 5.4: Implement Mock Data Service**
        * **User Story:** As a developer, I want to create a mock data service that, when triggered in "Mock Mode," introduces an artificial 1.5-second delay and then returns the data from the selected mock scenario, perfectly simulating a real API call.
        * **Acceptance Criteria:**
            1.  A data-fetching service/function is created that encapsulates the logic for retrieving clarification questions and analysis data.
            2.  This service checks the application's global state to determine if it is in "Live Mode" or "Mock Mode".
            3.  When in "Mock Mode," the service reads the currently selected scenario data from the local JSON files.
            4.  When in "Mock Mode," the service waits for an artificial delay of 1.5 seconds before returning the data.
            5.  The service returns the mock data in the same structure that the live N8N API is expected to provide.
            6.  The new mock data service logic is committed to version control.
    * **Story 5.5: Implement Global Loading Indicator**
        * **User Story:** As a user, I want to see a clear loading indicator or spinner whenever the application is waiting for data (either from a live API call or a mock data service) so I know the system is working.
        * **Acceptance Criteria:**
            1.  A reusable loading indicator/spinner component is created.
            2.  A global state (e.g., `isLoading`) is established to track the data-fetching status of the application.
            3.  The data-fetching service sets the `isLoading` state to `true` immediately before initiating a data request (both mock and live).
            4.  The loading indicator is displayed prominently on the screen whenever the `isLoading` state is `true`.
            5.  The data-fetching service sets the `isLoading` state to `false` after the request is completed (either successfully or with an error).
            6.  The new loading indicator component and its associated state logic are committed to version control.

---

### **Epic 6: Presentation Layer & Demo Polish**

* **Goal:** To implement specialized, demo-optimized UI features to create a highly polished presentation. This includes a "pre-fill" button on input screens to auto-populate fields with data from the selected mock scenario, and other animated visual feedback (e.g., pulsating circles, typing animations) to enhance the demo experience.

* **Stories:**
    * **Story 6.1: Implement Title Labels as Pre-fill Triggers**
        * **User Story:** As a presenter, I want the text labels of pre-fillable form fields to act as clickable hotspots so that I can trigger the pre-fill action without needing a separate, visible button.
        * **Acceptance Criteria:**
            1.  The text label component associated with each designated form field is made into a clickable element.
            2.  This clickable behavior is only active when the application is in "Mock Mode".
            3.  When the mouse pointer hovers over a clickable label, the cursor changes to a "pointer" (hand icon).
            4.  The visual appearance of the label text itself does not change on hover (beyond the cursor change).
            5.  The click event on the label is successfully captured (the full action will be implemented in a later story).
            6.  The updated logic is committed to version control.
    * **Story 6.2: Create "Pulse" Click Animation**
        * **User Story:** As a presenter, I want a "pulsating circle" animation to trigger at the location of my click on a hotspot so that there is clear visual feedback for my action in the video recording.
        * **Acceptance Criteria:**
            1.  A new, reusable animation component is created.
            2.  When triggered, the component renders an animation of a circle that expands outwards from a central point and fades out as it grows.
            3.  The animation is smooth and lasts for a short, non-disruptive duration (e.g., ~0.5 seconds).
            4.  The component can be programmatically triggered to play at specific coordinates on the screen (i.e., the location of the click).
            5.  The new animation component is committed to version control and is viewable in a Storybook or a simple test page.
    * **Story 6.3: Create "Typing Effect" for Field Population**
        * **User Story:** As a developer, I want to create a function that populates a text field with a given string using a character-by-character "typing effect" so that data entry appears simulated and dynamic.
        * **Acceptance Criteria:**
            1.  A new, reusable function or React hook is created to manage the typing animation.
            2.  The function/hook accepts a string of text to be typed and a reference to the target form field.
            3.  When executed, it populates the target field one character at a time with a short, realistic delay between each character, simulating human typing.
            4.  The typing speed is configurable.
            5.  The new function/hook is committed to version control and is viewable in a Storybook or a simple test page.
    * **Story 6.4: Integrate Hotspots with Mock Data and Effects**
        * **User Story:** As a presenter, when I click a field's title label, I want the system to trigger the pulse animation and populate the corresponding field with the correct data from the selected mock scenario, using the typing effect.
        * **Acceptance Criteria:**
            1.  When a clickable title label is clicked in "Mock Mode," the "pulse" animation is triggered at the click's location.
            2.  Simultaneously, the system identifies the currently active mock scenario.
            3.  The system retrieves the correct data value for the field associated with the clicked label from the active mock scenario's data file.
            4.  The "typing effect" function is then called to populate the field with the retrieved data.
            5.  This entire sequence (click -> animation -> data fetch -> typing) works together seamlessly for all designated pre-fillable fields.
            6.  The final integrated logic is committed to version control.
