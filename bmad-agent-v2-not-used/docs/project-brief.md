# NDIS Incident Capture / Analysis Tool Product Requirements Document (PRD)

## Intro

This document outlines the requirements for the Minimum Viable Product (MVP) of the "NDIS Incident Capture / Analysis" tool. The system is designed as a local React-based application to streamline the capture and initial analysis of NDIS incidents. It will guide NDIS Support Workers and Team Leaders through incident reporting via a wizard interface, leverage n8n-driven prompt chains for data enrichment and basic analysis (e.g., contributing factors, classification), and allow for export of incident data to JSON/Markdown formats. The primary drivers for this MVP are speed of development and local functionality.

## Goals and Context

-   [cite_start]**Project Objectives:** [cite: 29]
    * Improve the timeliness and accuracy of NDIS incident reporting.
    * Provide a simple, guided process for Support Workers to submit incident details.
    * Enable Team Leaders/Managers to review submitted incidents and access basic automated analysis.
    * Facilitate quick development and deployment as a local application.
-   [cite_start]**Measurable Outcomes:** [cite: 30]
    * Reduction in time taken to complete an initial incident report.
    * Increased consistency in captured incident data.
    * Generation of basic analytical insights (e.g., classification, contributing factors) for a specified percentage of reported incidents.
    * Successful export of incident data into specified formats (JSON, Markdown).
-   **Success Criteria:**
    * Support Workers can successfully submit incident reports through the wizard interface without requiring extensive training.
    * The system correctly interacts with n8n endpoints (or their mocks) for data clarification and basic analysis.
    * Team Leaders can review submitted incidents (captured within the session for MVP) and the associated n8n-generated analysis.
    * Incident data can be reliably exported to JSON and Markdown formats to the clipboard.
    * The MVP is developed and operational within the targeted rapid timeframe.
-   **Key Performance Indicators (KPIs):**
    * Average time to complete an incident report via the wizard.
    * Number of clarification prompts utilized per report (tracking n8n interaction).
    * Successful export rate of reports.
    * User satisfaction score (if measured post-MVP deployment) from Support Workers and Team Leaders regarding ease of use.

## Scope and Requirements (MVP / Current Version)

### [cite_start]Functional Requirements (High-Level) [cite: 31]

-   **Incident Capture Wizard:**
    * A step-by-step guided interface for NDIS Support Workers to input incident details.
    * One-at-a-time presentation of questions and clarification prompts.
-   **n8n Integration for Data Enrichment & Analysis:**
    * The system will make calls to n8n webhook endpoints for:
        * **Clarification Prompts:** Requesting additional specific details from the user based on initial input.
        * **Basic Analysis:** Generating potential contributing factors and classifying the incident based on the information provided.
    * Ability to toggle between actual n8n webhook calls and mock handlers for standalone frontend development/demonstration. (Mock handlers will simulate n8n responses).
-   **Incident Review (Team Leader/Manager - MVP Context):**
    * Interface for Team Leaders/Managers to view submitted incident reports (from the current session) and the n8n-generated analysis.
-   **Data Export:**
    * Functionality to export incident data (including n8n-generated analysis) to the clipboard in JSON format.
    * Functionality to export incident data (including n8n-generated analysis) to the clipboard in Markdown format.
-   **Local Operation:**
    * The application will run locally on the user's machine.

### Non-Functional Requirements (NFRs)

-   **Performance:**
    * The UI should be responsive, with minimal lag during navigation through the wizard and data input.
    * n8n webhook calls (or mock responses) should resolve within a reasonable timeframe to not disrupt user flow (e.g., < 3-5 seconds for MVP).
-   **Scalability:**
    * Not a primary concern for MVP, as it's a local application.
-   **Reliability/Availability:**
    * The local application should be stable and reliably manage data entered during a session.
    * Graceful handling of failed n8n calls (e.g., if webhook is unavailable when not using mocks), with clear user feedback.
-   **Security:**
    * For MVP demonstration purposes, the system will use only placeholder or fabricated data. Real NDIS participant or incident data will not be used. As such, data sensitivity is not a concern for this MVP.
    * No server-side storage of incident data is planned; data exists locally within the app's session and upon export.
-   **Maintainability:**
    * Code should be well-organized to allow for future iterations.
    * Clear separation between UI components and logic for n8n interactions.
-   [cite_start]**Usability/Accessibility:** [cite: 32]
    * High emphasis on simplicity and ease of use for non-technical users (Support Workers).
    * Clear, unambiguous language in the wizard and prompts.
    * Basic accessibility considerations (e.g., keyboard navigation, sufficient color contrast) for the React components should be followed.
-   **Other Constraints:**
    * **Technology Stack:** React (ShadCN/Tailwind) for frontend, n8n for backend logic/prompt-chains.
    * **Development Speed:** MVP needs to be "done quickly."
    * **Local Deployment:** Application must function as a local standalone build.

### [cite_start]User Experience (UX) Requirements (High-Level) [cite: 33]

-   **Guided Wizard Flow:** Users (especially Support Workers) must be guided step-by-step through the incident reporting process.
-   **Simplicity & Clarity:** The interface should be intuitive, minimizing cognitive load. Instructions and prompts must be clear.
-   **Focused Input:** The "one-at-a-time clarification questions" approach should be implemented to keep users focused.
-   **MVP Scope Note:** For this MVP, the focus is on the core incident capture wizard, basic review of session-captured incidents, and export functionality. Advanced dashboard features, persistent "save and resume" for drafts across sessions, and comprehensive "Settings & Help" sections detailed in broader UX explorations are considered post-MVP to ensure rapid initial development.
-   A UI/UX specification document can be referenced at `docs/ui-ux-spec.md` for detailed wireframes and flows (user will provide details for export UI placement).

### Integration Requirements (High-Level)

-   **n8n Webhooks:**
    * The application will integrate with n8n via webhook calls.
    * Specific endpoints for:
        * Incident data submission for clarification.
        * Incident data submission for basic analysis (contributing factors, classification).
    * Data format for requests and responses (JSON) to be defined (see `docs/data-models.md`).
    * Mechanism to switch between live and mocked n8n endpoints.

### Testing Requirements (High-Level)

-   Unit tests for critical React components and utility functions.
-   Integration tests for the n8n webhook interactions (testing with mock handlers is essential).
-   End-to-end tests for the core user flows:
    * Support Worker submitting an incident through the wizard.
    * Team Leader reviewing an incident (from current session) and its analysis.
    * Data export functionality.
-   Manual testing to confirm usability and flow.
-   _(See `docs/testing-strategy.md` for details)_

## [cite_start]Epic Overview (MVP / Current Version) [cite: 34]

-   [cite_start]**Epic 1: Application Setup & Core Incident Capture Wizard** - Goal: Establish the foundational React application, implement the wizard interface for Support Workers to capture initial incident details, and set up the n8n mocking mechanism. [cite: 35]
-   [cite_start]**Epic 2: n8n Integration for Clarification & Basic Analysis** - Goal: Integrate calls to n8n webhooks (and their mocks) for dynamic clarification questions during incident capture and for performing basic automated analysis (contributing factors, classification) post-submission. [cite: 35]
-   [cite_start]**Epic 3: Incident Review & Export** - Goal: Develop the interface for Team Leaders to review submitted incidents (from the current session) with their associated analysis, and implement functionality to export incident data to JSON and Markdown formats. [cite: 35]

## Key Reference Documents

-   `docs/project-brief.md`
-   `docs/architecture.md`
-   `docs/epic1.md`, `docs/epic2.md`, `docs/epic3.md`
-   `docs/tech-stack.md`
-   `docs/api-reference.md` (Details for n8n webhook interactions)
-   `docs/data-models.md` (Includes JSON export structure)
-   `docs/testing-strategy.md`
-   `docs/ui-ux-spec.md` (User-provided UX specification, user to update with export UI details)

## Post-MVP / Future Enhancements

-   Direct database integration for centralized storage.
-   More advanced analytical capabilities.
-   User authentication and role-based access control.
-   Workflow management features (e.g., incident status tracking, assignments).
-   Reporting dashboards.
-   Integration with other NDIS management systems.
-   Comprehensive Dashboard: Including features like historical incident overview, trend indicators, and advanced filtering if a persistent data store is implemented.
-   Persistent Save and Resume Functionality: Allowing users to save incomplete incident reports locally and resume them in later sessions.
-   Dedicated Settings & Help Section: Including user preferences, in-app help guides, and feedback mechanisms.

## Change Log

| Change             | Date       | Version | Description                                      | Author            |
| :----------------- | :--------- | :------ | :----------------------------------------------- | :---------------- |
| Initial Draft      | 2025-06-05 | 0.1     | First draft based on Project Brief                 | 2-project-manager |
| Sensitivity Update | 2025-06-05 | 0.2     | Updated data sensitivity based on user feedback. | 2-project-manager |
| Scope Update       | 2025-06-05 | 0.3     | Clarified MVP scope for advanced UX features.    | 2-project-manager |

## [cite_start]Initial Architect Prompt [cite: 40]

Based on the project brief and requirements for the "NDIS Incident Capture / Analysis" tool, the following technical guidance should inform architectural decisions:

### Technical Infrastructure

-   **Starter Project/Template:** No specific starter template mandated beyond standard React project setup. Leverage Create React App or Vite for quick scaffolding if appropriate.
-   **Hosting/Cloud Provider:** Primarily local deployment for the MVP. No cloud hosting is required for the application itself. n8n could be self-hosted or cloud-based, but the React app interacts via webhooks and is agnostic to n8n's hosting.
-   **Frontend Platform:** **React** is required. **ShadCN/Tailwind CSS** are specified for UI components and styling.
-   **Backend Platform:** Logic and data processing are primarily handled by **n8n** via webhook endpoints. The React application itself will not have a traditional backend server beyond serving the static assets for local use.
-   **Database Requirements:** No database is required for the MVP. Data is handled locally within the React application's state and exported on demand.

### Technical Constraints

-   The application must run as a local instance.
-   **n8n Integration:** All backend-style logic (clarification prompts, data analysis) must be routed through n8n webhooks.
    * The system must support a **toggle or configuration** to switch between calling actual n8n webhooks and using **local mock handlers/functions** that simulate n8n responses. This is critical for standalone frontend development and demonstration.
-   Data export formats are **JSON and Markdown** to the clipboard.
-   UI must feature a **step-by-step wizard** and handle **one-at-a-time clarification questions**.

### Deployment Considerations

-   Deployment will be a local build of the React application (e.g., `npm run build` producing static files that can be opened via `index.html` or served by a simple local static server).
-   No CI/CD pipeline is required for MVP given local deployment.
-   Only a single "production" environment (the local user's machine) is targeted for MVP.

### [cite_start]Local Development & Testing Requirements [cite: 41, 42]

-   Developers must be able to run the React application locally.
-   **Mocking n8n:** The ability to develop and test the frontend UI and logic flows entirely without live n8n endpoints is essential. Mock handlers should be easy to define and manage.
-   Command-line utilities are not explicitly requested but ensure the standard React development toolkit (`npm start`, `npm test`, `npm build`) is sufficient.
-   Testing should cover UI interactions, n8n mock integrations, and export functionality.

### Other Technical Considerations

-   **Data Handling (MVP Context):** The application is for demonstration purposes only using fabricated data. Therefore, specific security measures for sensitive data are not required for this MVP. The architecture should ensure no unintended data persistence if any temporary user input resembles sensitive information.
-   **n8n Workflow Design:** While the detailed prompt engineering for n8n is outside the immediate scope of the React app's architecture, the interface points (webhook URLs, expected request/response schemas as defined in `docs/data-models.md` and `docs/api-reference.md`) must be clearly defined. Consider how the React app will pass context to n8n and receive structured data back.
-   **State Management:** Choose a pragmatic state management solution for React suitable for a wizard-style application (e.g., Context API, Zustand, or even local component state if complexity remains low for session-based data).
-   **Error Handling:** Implement robust error handling for n8n webhook calls (both live and mocked) and provide clear feedback to the user.

The architecture should prioritize simplicity and speed of development, aligning with the MVP's goals. Ensure clean separation between UI, state management, and service call (n8n webhook) logic.
