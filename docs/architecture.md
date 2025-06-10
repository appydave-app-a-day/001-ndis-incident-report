# NDIS Incident Documentation Assistant Architecture Document

## Introduction / Preamble
[cite_start]This document outlines the overall project architecture, including backend systems, shared services, and non-UI specific concerns[cite: 1089]. [cite_start]Its primary goal is to serve as the guiding architectural blueprint for AI-driven development, ensuring consistency and adherence to chosen patterns and technologies[cite: 1090].

## Technical Summary
This document outlines the architecture for a front-end-only Single Page Application (SPA) built using React and TypeScript. The application is designed as a demonstration MVP that leverages a wizard-style interface to guide users through incident reporting and analysis workflows. The architecture is lightweight, with no backend or database, and relies on a component-based structure, a simple global state management solution, and clearly defined contracts for external API calls to N8N workflows. The project will be organized in a monorepo and will utilize modern, standard libraries for UI, routing, and form management to ensure a high-quality and maintainable codebase.

## High-Level Overview
The main architectural style is a client-side rendered Single Page Application (SPA) built with Vite and React. [cite_start]The project will be contained within a Monorepo structure, simplifying dependency management and setup for this self-contained MVP[cite: 1094]. The primary user interaction is a linear, multi-step wizard that guides users through the two main workflows: "Incident Capture" and "Incident Analysis".

## Architectural / Design Patterns Adopted
* **Wizard Component:** A reusable, generic wizard component will be the core of the user experience, managing step progression, navigation, and content display.
* **Global State Management:** A centralized store (using Zustand) will manage application-wide state, such as the Mock/Live mode toggle, the currently selected mock scenario, and loading status.
* **Service Layer:** API interactions will be encapsulated within a dedicated service layer (`lib/services/`), separating data-fetching logic from the UI components.

## Component View
The system is comprised of several major logical components:
* **App Shell:** The main application layout containing the persistent side navigation and the content area where the workflows are rendered.
* **Wizard Framework:** The reusable `Wizard.tsx` component, including its navigation controls and progress indicator.
* **Workflow Features:** Each major workflow (e.g., `incident-capture`, `incident-analysis`) is a self-contained feature composed of multiple step components that are rendered inside the wizard.

## Project Structure
This structure is designed for a client-side rendered React application using Vite, emphasizing modularity and clear separation of concerns.

```plaintext
/
├── .github/
│   └── workflows/              # CI/CD workflows (if any)
├── docs/                       # Project documentation (PRD, Architecture, etc.)
├── public/                     # Static assets (images, fonts, etc.)
└── src/                        # Application source code
    ├── components/             # Shared, reusable UI components
    │   ├── ui/                 # Base components from shadcn/ui (e.g., Button, Input)
    │   └── layout/             # Layout components (e.g., Wizard, AppShell)
    ├── features/               # Contains code for specific application workflows
    │   ├── incident-capture/   # All components/logic for Epic 3
    │   └── incident-analysis/  # All components/logic for Epic 4
    ├── hooks/                  # Custom reusable React hooks
    ├── lib/                    # Utility functions and services
    │   ├── mock-data/          # Contains the JSON files for mock scenarios
    │   └── services/           # Contains the mock data service
    ├── routes/                 # Contains the page components for React Router
    ├── store/                  # Global state management using Zustand
    └── App.tsx                 # Main application component
```

### Key Directory Descriptions

* **`src/components/`**: This will contain globally shared, reusable React components.
    * **`ui/`**: For the base components provided by shadcn/ui.
    * **`layout/`**: For larger components that structure the application's layout, like the main application shell and the wizard framework.
* **`src/features/`**: A core directory where each major workflow (Epic) will have its own folder, containing all the UI components and logic specific to that feature. This keeps our features well-encapsulated.
* **`src/hooks/`**: For any custom, reusable React hooks that can be shared across different features.
* **`src/lib/`**: For non-component code, such as utility functions and data services. This is where our mock data and the service that provides it will live.
* **`src/routes/`**: This will hold the main page components that are mapped to specific routes in React Router.
* **`src/store/`**: This is where our Zustand state management store will be defined, managing all global application state.

## API Reference

### External APIs Consumed

#### 1. Get Clarification Questions
* **Purpose:** To submit the user's initial, free-text narrative and retrieve a list of AI-generated follow-up questions for each section to enrich the report.
* **Triggered:** After Story 3.2.
* **Base URL(s):** `VITE_N8N_CLARIFICATION_WEBHOOK_URL`
* **Endpoint:** `POST /`

#### 2. Suggest a New Question
* **Purpose:** To allow a user to submit a new, potentially useful question to a datastore for future review and inclusion in the system.
* **Triggered:** During Story 3.7.
* **Base URL(s):** `VITE_N8N_SUGGESTION_WEBHOOK_URL`
* **Endpoint:** `POST /`

#### 3. Consolidate Narrative Sections
* **Purpose:** To take the user's original narrative and their answers to the clarification questions for all four phases, and return a single, well-written, consolidated paragraph for each phase.
* **Triggered:** After all clarification steps are complete (new Story 3.7).
* **Base URL(s):** `VITE_N8N_CONSOLIDATION_WEBHOOK_URL`
* **Endpoint:** `POST /`

#### 4. Get AI Analysis
* **Purpose:** To submit the complete incident narrative to an N8N workflow which then uses a Large Language Model to generate an initial analysis.
* **Triggered:** After Story 4.1.
* **Base URL(s):** `VITE_N8N_ANALYSIS_WEBHOOK_URL`
* **Endpoint:** `POST /`

## Data Models

### Core Application Entities / Domain Objects

#### IncidentReport
* **Description:** This interface represents the complete state of a single incident report within the application, from initial capture through final analysis. It is the primary data structure that will be managed in our global state.
* **Schema / Interface Definition:**

    ```typescript
    // Represents a single answered question
    interface Clarification {
      question: string;
      answer: string;
    }

    // Represents the state of each major workflow
    type WorkflowStatus = 'pending' | 'in-progress' | 'complete';

    export interface IncidentReport {
      // Data from the metadata input step
      metadata: {
        reporter_name: string;
        participant_name: string;
        event_datetime: string; // ISO 8601 format
        location: string;
      };

      // Data from the narrative input and consolidation steps
      narrative: {
        before_event: string;
        before_event_extra: string;
        during_event: string;
        during_event_extra: string;
        end_of_event: string;
        end_of_event_extra: string;
        post_event_support: string;
        post_event_support_extra: string;
      };

      // Data from the clarification steps
      clarifications: {
        before_event: Clarification[];
        during_event: Clarification[];
        end_of_event: Clarification[];
        post_event_support: Clarification[];
      };

      // Data from the analysis steps
      analysis: {
        contributing_conditions: string; // Markdown formatted
        incident_types: {
          type: string;
          evidence: string;
        }[];
      };

      // Internal state to track workflow progress
      status: {
        capture: WorkflowStatus;
        analysis: WorkflowStatus;
      };
    }
    ```

## Definitive Tech Stack Selections

| Category | Technology | Version / Details | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Framework & Build Tool** | Vite | Latest | High-performance build tool and development server for a modern frontend experience. |
| **Languages** | TypeScript | Latest | Superset of JavaScript that adds static typing for improved code quality and maintainability. |
| **UI Toolkit** | shadcn/ui | Latest | A collection of beautifully designed, accessible, and reusable components built on Tailwind CSS. |
| **State Management** | Zustand | Latest | A small, fast, and simple global state management solution for React. |
| **Routing** | React Router | Latest | The standard library for handling client-side navigation and routing in React applications. |
| **Form Management** | React Hook Form | Latest | A performant and easy-to-use library for managing form state, validation, and submissions. |

## Coding Standards

These standards are mandatory for all code to ensure quality and consistency.

* **Style Guide & Linter:** We will use **ESLint** for identifying and reporting on patterns in the code, and **Prettier** for automatic code formatting. A standard, widely-used configuration will be established.
* **Naming Conventions:**
    * **Variables & Functions:** `camelCase`
    * **Components & Classes/Types:** `PascalCase`
    * **Constants:** `UPPER_SNAKE_CASE`
    * **Files:** Component files will be `PascalCase.tsx`. All other TypeScript files will be `kebab-case.ts`.
* **File Structure:** All code must adhere strictly to the layout defined in the "Project Structure" section of this document.
* **Unit Test File Organization:** Unit test files will use the naming convention `*.test.tsx` and will be co-located with the source files they are testing.
* **Asynchronous Operations:** All asynchronous operations must use modern `async/await` syntax.
* **Type Safety:** TypeScript's `strict` mode must be enabled in the `tsconfig.json` file. The use of the `any` type is strongly discouraged and requires explicit justification.
* **Comments & Documentation:** Comments should explain the *why*, not the *what*. All exported functions and complex logic should have JSDoc/TSDoc-style comments.
* **Dependency Management:** We will use `npm` to manage dependencies. For stability, package versions should be pinned in the `package.json` file rather than using broad version ranges.

## Overall Testing Strategy

This strategy outlines the approach to testing for the application. While initial MVP development will rely on manual validation, this framework will guide the implementation of automated tests post-MVP.

* **Primary Tools:**
    * **Unit & Integration Testing:** **Vitest** - A modern, fast, and Jest-compatible testing framework that works seamlessly with Vite.
    * **End-to-End (E2E) Testing:** **Playwright** - A powerful framework for reliable, cross-browser end-to-end testing.
* **Unit Tests:**
    * **Scope:** Test individual components and functions in isolation.
    * **Location:** Test files (`*.test.tsx`) will be co-located with their corresponding source files.
    * **Mocking:** All external dependencies (like our API services) will be mocked using Vitest's built-in mocking capabilities.
* **Integration Tests:**
    * **Scope:** Test the interaction between several components within a single feature, such as the complete multi-step wizard flow, with API calls mocked at the service layer.
* **End-to-End (E2E) Tests (Post-MVP):**
    * **Scope:** Validate the two primary user flows from start to finish: The complete "Incident Capture" workflow and the complete "AI-Assisted Report Analysis" workflow.
    * **Note:** The implementation of automated E2E tests is deferred post-MVP.
* **Test Coverage:**
    * While there is no strict coverage percentage required for the MVP, the goal is to have tests that meaningfully cover critical application logic and user interactions once automated testing is implemented.