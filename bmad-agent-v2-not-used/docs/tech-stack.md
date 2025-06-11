## 5. Create Technical Artifacts (Step-by-Step)

Now we'll begin creating the core architectural documents. We'll do this one document at a time, and I'll ask for your feedback on each before moving to the next.

The first document we'll create is the **Technology Stack Specification**.

### Technology Stack Specification (`docs/tech-stack.md`)

**Purpose:** This document formally lists all key technologies, including their specific versions (or how versions will be determined), and briefly describes their role in the project. This ensures clarity for the development team and aligns with the "Initial Architect Prompt" which emphasizes defining specific versions.

Here is the proposed content for `docs/tech-stack.md`:

---

# NDIS Incident Capture / Analysis Tool Technology Stack

## Technology Choices

| Category                   | Technology            | Version / Details                       | Description / Purpose                                                                               | Justification (Optional)                                                               |
| :------------------------- | :-------------------- | :-------------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Languages**              | TypeScript            | Latest stable (e.g., `5.x`)             | Primary language for frontend development.                                                          | Provides type safety and improved developer experience for React development.          |
| **Runtime**                | Node.js               | Latest LTS (e.g., `20.x.x` or `22.x.x`) | Local development environment for Vite, React tooling, and running utility scripts.                 | Standard for modern JavaScript development; ensures compatibility with tooling.        |
| **Frameworks**             | React                 | Latest stable (e.g., `18.x.x`)          | Frontend UI library for building the user interface.                                                | Specified in project requirements.                                                     |
| **UI Libraries**           | ShadCN/UI             | Latest via CLI                          | Component library for building the user interface with Tailwind CSS.                                | Specified in project requirements for rapid UI development.                            |
|                            | Tailwind CSS          | Latest stable (e.g., `3.x.x`)           | Utility-first CSS framework for styling.                                                            | Specified in project requirements; works well with ShadCN/UI.                          |
| **State Management**       | Zustand               | Latest stable (e.g., `4.x.x`)           | Frontend global state management for session data and UI state.                                     | Chosen for its simplicity, performance, and suitability for wizard-style applications. |
| **Scaffolding/Build Tool** | Vite                  | Latest stable (e.g., `5.x.x`)           | Project scaffolding, development server, and build tool.                                            | Chosen for fast development server and HMR, aligning with rapid MVP goals.             |
| **Backend Logic**          | n8n                   | Latest stable (e.g., `1.x.x`)           | Handles backend processes, data enrichment, clarification prompts, and basic analysis via webhooks. | Specified in project requirements. Application interacts via webhooks.                 |
| **Testing**                | Vitest / Jest         | Latest stable                           | Unit and integration testing framework for React components and logic.                              | Vitest integrates well with Vite; Jest is a mature alternative.                        |
|                            | React Testing Library | Latest stable                           | Testing utility for React components, encouraging good testing practices.                           | Industry standard for testing React components.                                        |
|                            | Playwright / Cypress  | Latest stable                           | End-to-end testing framework for user flow validation.                                              | Powerful tools for E2E testing; choice can depend on team preference.                  |

_Note: "Latest stable" versions will be confirmed and pinned at the commencement of the development phase._

## Change Log

| Change        | Date       | Version | Description                                    | Author      |
| :------------ | :--------- | :------ | :--------------------------------------------- | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Initial draft based on architectural decisions | 3-architect |
