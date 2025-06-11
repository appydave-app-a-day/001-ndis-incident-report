# NDIS Incident Capture / Analysis Tool Coding Standards and Patterns

## 1. Architectural / Design Patterns Adopted

The following high-level architectural and design patterns have been chosen for this project. For detailed justifications, refer to `docs/architecture.md`.

- **Client-Side Single Page Application (SPA) with Externalized Logic (n8n):** The application runs entirely in the browser, with backend-style processing delegated to n8n webhooks.
- **Wizard-Based User Interface:** A step-by-step guided interface is used for incident capture.
- **Toggleable Mocking Framework:** Allows switching between live n8n calls and local mock handlers for n8n interactions.
- **Global State Management with Zustand:** Zustand is used for managing shared application state efficiently.
- **Component-Based UI with React & ShadCN/UI:** The UI is built using React functional components, leveraging ShadCN/UI for structure and styling with Tailwind CSS.

## 2. Coding Standards

### 2.1. Primary Language & Runtime

- **Primary Language:** TypeScript (Latest stable version, e.g., `5.x` as per `docs/tech-stack.md`).
- **Primary Runtime (Development):** Node.js (Latest LTS version, e.g., `20.x.x` or `22.x.x` as per `docs/tech-stack.md`).

### 2.2. Style Guide & Linter

- **ESLint:** To be configured for TypeScript. Recommended: `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`, and a suitable React-specific plugin (e.g., `plugin:react/recommended` with new JSX transform).
- **Prettier:** To be used for automatic code formatting, integrated with ESLint (`eslint-config-prettier` to disable conflicting ESLint rules).
- **Configuration:**
  - Linters and formatters should be configured to run on save in the IDE.
  - Consider adding pre-commit hooks (e.g., using Husky and lint-staged) to enforce standards before code is committed.

### 2.3. Naming Conventions

- **Variables & Functions:** `camelCase` (e.g., `incidentData`, `handleInputChange`).
- **React Components (TSX files):** `PascalCase` (e.g., `IncidentWizard.tsx`, `ReviewScreen.tsx`).
- **Interfaces & Types:** `PascalCase` (e.g., `IncidentReport`, `ClarificationQuestion`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_NARRATIVE_LENGTH`, `N8N_ANALYSIS_ENDPOINT`).
- **Files:**
  - React Components: `PascalCase.tsx` (e.g., `EventOverviewStep.tsx`).
  - Other TypeScript files (services, utils, store, types, mocks): `camelCase.ts` or `kebab-case.ts` (e.g., `n8nService.ts`, `incidentStore.ts`, `validation-utils.ts`). Prefer `camelCase.ts` for consistency if no strong preference for `kebab-case`.
- **Folders:** `kebab-case` or `camelCase` (e.g., `incident-capture`, `ui-components`). Match the style used in `docs/project-structure.md`.

### 2.4. File Structure

- Adhere strictly to the layout defined in `docs/project-structure.md`.

### 2.5. Asynchronous Operations

- Utilize `async/await` for all asynchronous operations (e.g., fetching data from n8n, interacting with browser APIs like clipboard).
- Ensure proper error handling for `async` functions using `try/catch` blocks.

### 2.6. Type Safety

- Leverage TypeScript's static typing to the fullest extent.
- Enable `strict` mode in `tsconfig.json` for robust type checking.
- Define clear and explicit types/interfaces for props, state, function signatures, and data structures in `src/types/` or colocated where appropriate (see `docs/project-structure.md`).
- Avoid using `any` where possible. Use `unknown` for safer type handling if the type is truly unknown, followed by type guards or assertions.

### 2.7. Comments & Documentation

- Write JSDoc-style comments for all exported functions, classes, types, and complex logic blocks, explaining their purpose, parameters, and return values.
- Use inline comments to clarify non-obvious or complex segments of code.
- Each major component and service module should have a brief explanatory comment at the top of the file describing its role.
- Strive for self-documenting code where possible through clear naming and simple logic.

### 2.8. Dependency Management

- Use `npm` (or `yarn` if preferred, to be decided at project kickoff) for managing project dependencies.
- Minimize the number of external dependencies. Before adding a new dependency:
  - Evaluate if the functionality can be reasonably achieved with existing tools or custom code.
  - Check the library's maintenance status, popularity, and known vulnerabilities.
- Keep dependencies up-to-date and periodically run `npm audit` (or equivalent) to identify and address security vulnerabilities.

## 3. Error Handling Strategy

### 3.1. General Approach

- Use `try/catch` blocks for operations that can fail, especially asynchronous operations and external service calls (e.g., n8n webhooks, clipboard API).
- For MVP, standard `Error` objects are generally sufficient. If specific, categorizable error types become necessary, custom error classes extending `Error` can be introduced.
- Propagate errors meaningfully or handle them at the appropriate level. Avoid swallowing errors silently.

### 3.2. Logging (MVP Context - Browser Console)

- **Library/Method:** Utilize the browser's built-in `console` object:
  - `console.log()`: For general informational messages during development.
  - `console.warn()`: For potential issues or non-critical errors.
  - `console.error()`: For actual errors that occur.
- **Format:** Plain text messages are sufficient for local development.
- **Levels:** Clearly distinguish messages using the appropriate `console` method.
- **Context:** Error messages should include context to help with debugging (e.g., "Error in `n8nService.fetchAnalysis`: Failed to parse response for incident ID ${incidentId}").

### 3.3. Specific Handling Patterns

- **n8n Webhook Calls (Live & Mocked):**
  - Wrap all fetch/API calls to n8n endpoints within `try/catch` blocks in `n8nService.ts`.
  - Handle network errors (e.g., n8n service unavailable) gracefully. Display a user-friendly message in the UI (e.g., "Failed to connect to n8n. Please check your connection or try mock mode.").
  - Check HTTP response statuses. If n8n returns an error status (e.g., 4xx, 5xx), parse the error response if available and provide appropriate feedback to the user or log detailed error information.
  - Mock handlers in `n8nMockHandlers.ts` should also be capable of simulating error responses from n8n to allow testing of error handling paths in the UI.
- **Input Validation:**
  - Implement basic client-side validation for critical input fields (e.g., required fields, date formats) using HTML5 attributes and/or JavaScript checks within components before updating the state or submitting data.
  - Provide clear validation messages to the user near the respective input fields.
  - For MVP, focus on essential validations to ensure data integrity for core flows.
- **Clipboard Operations:**
  - Wrap clipboard API calls (`navigator.clipboard.writeText`) in `try/catch` blocks.
  - Inform the user of success or failure (e.g., via toast notifications: "Copied to clipboard!" or "Failed to copy to clipboard.").

## 4. Security Best Practices (MVP Context)

Given the MVP's local nature and use of fabricated data, security is not a primary concern requiring extensive measures. However, basic good practices should be followed:

- **Input Validation:** Perform basic client-side input validation as described in the Error Handling section. This helps prevent malformed data from causing unexpected application behavior, rather than for strict security against attacks in this MVP context.
- **Secrets Management (n8n Webhook URLs):**
  - Avoid hardcoding n8n webhook URLs or any sensitive configuration directly in the source code.
  - These should be managed via environment variables as outlined in `docs/environment-vars.md` (to be created). The `.env` file used for local development should be included in `.gitignore`.
- **Dependency Security:**
  - Regularly update dependencies to their latest stable versions.
  - Periodically run `npm audit` (or yarn equivalent) to identify and mitigate known vulnerabilities in third-party packages.
- **No Server-Side Code:** The React application itself is purely client-side. Security concerns related to server-side vulnerabilities (e.g., SQL injection, SSRF) are not directly applicable to the React app's codebase.
- **Data Handling:** Ensure no unintended data persistence occurs beyond the session state and clipboard export, especially if any test data inadvertently resembles sensitive information.

## 5. Change Log

| Change        | Date       | Version | Description                                               | Author      |
| :------------ | :--------- | :------ | :-------------------------------------------------------- | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Initial draft based on project requirements and templates | 3-architect |
