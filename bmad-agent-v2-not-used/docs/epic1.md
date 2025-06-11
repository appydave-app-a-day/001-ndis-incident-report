# Epic 1: Application Setup & Core Incident Capture Wizard

**Goal:** Establish the foundational React application, implement the wizard interface for Support Workers to capture initial incident details, and set up the n8n mocking mechanism.

## Story List

### Story 1.1: Setup React Application with ShadCN/Tailwind

- **User Story / Goal:** As a Developer, I want a new React project initialized with ShadCN and Tailwind CSS configured, so that I can start building UI components efficiently.
- **Detailed Requirements:**
  - Initialize a new React project (e.g., using Vite or Create React App).
  - Integrate Tailwind CSS into the project.
  - Set up ShadCN UI library, ensuring components can be added and themed according to the basic visual guidelines (if provided beyond defaults, otherwise use ShadCN defaults).
  - Establish basic project structure (folders for components, services, contexts, etc.).
- **Acceptance Criteria (ACs):**
  - AC1: A new React application runs successfully locally.
  - AC2: Tailwind CSS utility classes can be applied and render correctly.
  - AC3: A sample ShadCN component (e.g., Button, Input) can be imported, used, and displays with default styling.
  - AC4: Basic project directory structure for organizing code (e.g., `src/components`, `src/pages`, `src/services`, `src/contexts`) is in place.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Initialize React project using Vite or similar.
  - [ ] Install and configure Tailwind CSS.
  - [ ] Install and configure ShadCN UI library.
  - [ ] Define and create initial source folder structure.

---

### Story 1.2: Implement Incident Wizard Shell & Navigation

- **User Story / Goal:** As a Support Worker, I want a step-by-step wizard interface, so that I can be guided through the incident reporting process easily.
- **Detailed Requirements:**
  - Create a main wizard component that manages multiple steps.
  - Implement basic navigation controls (e.g., "Next," "Previous" buttons) using ShadCN components.
  - Display a simple progress indicator (e.g., "Step X of Y") to inform the user of their current position in the wizard.
  - Initial wizard steps will be placeholders for content to be added in subsequent stories.
  - The wizard should manage the overall flow and state of the incident reporting process for the current session.
- **Acceptance Criteria (ACs):**
  - AC1: The wizard component renders with clearly distinguishable areas for step content and navigation.
  - AC2: "Next" button advances the user to the subsequent step in the wizard.
  - AC3: "Previous" button returns the user to the preceding step (where applicable and not the first step).
  - AC4: A textual or simple visual step indicator accurately reflects the current position in the wizard flow (e.g., "Step 2 of 5").
  - AC5: The wizard shell can host different content components for each step.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Design state management approach for wizard (current step, data collected).
  - [ ] Create main wizard container component.
  - [ ] Implement "Next" and "Previous" navigation buttons and their logic.
  - [ ] Implement a simple progress/step indicator.
  - [ ] Define a structure for embedding different step components within the wizard.

---

### Story 1.3: Develop Initial Incident Detail Input Screens (Static Fields)

- **User Story / Goal:** As a Support Worker, I want to input basic incident details (e.g., reporter name, participant name, event date, time, location, and initial narrative descriptions) into the wizard, so that the core information about an incident is captured.
- **Detailed Requirements:**
  - Create UI components for capturing common, static incident details using ShadCN components (e.g., Input for text, DatePicker for dates, Textarea for narratives).
  - Input fields should include:
    - Reporter Name
    - Participant Name
    - Event Date & Time
    - Location
    - Narrative fields based on UX spec prompts (e.g., "What was occurring before the event?", "What was occurring during the event?", "How did the event end?", "What support was given in the two hours following the event?").
  - Structure these inputs into logical steps within the wizard.
  - For MVP, these are static fields; dynamic clarification prompts based on n8n interaction will be handled in Epic 2.
  - Data entered should be stored in the application's state for the current session.
- **Acceptance Criteria (ACs):**
  - AC1: User can input data into defined fields for reporter name, participant name, event date, time, location.
  - AC2: User can input text into the specified narrative/description fields.
  - AC3: Input fields use appropriate ShadCN components and are clearly labeled as per the UX design.
  - AC4: Data entered is retained in the application's state as the user navigates between wizard steps within the current session.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Identify all core static fields required for initial incident capture based on PRD and UX Spec (Step 1 & 2).
  - [ ] Build reusable input components or utilize ShadCN components directly for each field type.
  - [ ] Integrate input components into distinct wizard steps.
  - [ ] Implement state handling to store the input data within the wizard's scope.

---

### Story 1.4: Implement n8n Mock Handler Toggle & Basic Mocking Framework

- **User Story / Goal:** As a Developer, I want a mechanism to toggle between calling live n8n webhooks and using local mock handlers, so that I can develop and test the frontend independently of live n8n workflows.
- **Detailed Requirements:**
  - Implement a global setting or an easily accessible toggle (e.g., UI control in development builds, or an environment variable) to switch n8n call behavior between "live" and "mock" modes.
  - Create a basic JavaScript/TypeScript framework or module for defining mock n8n responses. This framework should allow developers to easily specify mock data for different anticipated n8n webhook endpoints (clarification, analysis).
  - Any service calls intended for n8n should be routed through a service layer that checks the toggle's state and directs the call to either the actual (placeholder for now) n8n webhook URL or the corresponding mock handler.
- **Acceptance Criteria (ACs):**
  - AC1: A clear mechanism (e.g., UI switch visible only in development mode, or environment variable `REACT_APP_N8N_MODE=mock/live`) exists to toggle between live and mock n8n modes.
  - AC2: When the application is in "mock" mode, calls to service functions intended for n8n interactions return predefined mock data without making external network requests.
  - AC3: When the application is in "live" mode, calls to service functions attempt to reach actual (placeholder or configured) n8n webhook URLs.
  - AC4: It is straightforward for a developer to add or modify mock responses for different n8n interaction types within the codebase.
- **Tasks (Optional Initial Breakdown):**
  - [ ] Design the toggle mechanism (e.g., React Context, Zustand store slice, or environment variable).
  - [ ] Create a dedicated service module for n8n API calls.
  - [ ] Implement logic within the service module to check the toggle and route calls to live (placeholder) URLs or mock functions.
  - [ ] Create an organized structure (e.g., a `mocks` folder with files per endpoint) for storing and defining mock n8n responses.
  - [ ] Implement one example mock handler for a hypothetical n8n clarification endpoint.

---

## Change Log

| Change        | Date       | Version | Description                      | Author            |
| :------------ | :--------- | :------ | :------------------------------- | :---------------- |
| Initial Draft | 2025-06-05 | 0.1     | First draft of epic              | 2-project-manager |
| MVP Scoping   | 2025-06-05 | 0.2     | Ensured alignment with MVP focus | 2-project-manager |
