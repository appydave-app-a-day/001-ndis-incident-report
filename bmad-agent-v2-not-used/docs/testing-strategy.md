Okay, the Environment Variables Documentation is approved.

Next, we'll define the **Testing Strategy Documentation** (`docs/testing-strategy.md`).

### Testing Strategy Documentation (`docs/testing-strategy.md`)

**Purpose:** This document outlines the overall approach to testing for the NDIS Incident Capture / Analysis Tool. It describes the different levels of testing, tools to be used, and the goals of our testing efforts to ensure a quality MVP. This aligns with the "Testing Requirements (High-Level)" section of the PRD.

Here is the proposed content for `docs/testing-strategy.md`:

---

# NDIS Incident Capture / Analysis Tool Testing Strategy

## 1. Overall Philosophy & Goals

The testing strategy for the NDIS Incident Capture / Analysis Tool MVP focuses on ensuring the reliability of core functionalities, providing rapid feedback during development, and building confidence in the local application build. Given the emphasis on "speed of development", the strategy prioritizes automated tests for critical paths and well-defined manual testing for usability.

**Key Goals:**
* Ensure all functional requirements outlined in the PRD are met.
* Verify the correct operation of the incident capture wizard, including step navigation and data collection.
* Confirm the n8n integration (both mock and live modes, with a strong emphasis on mock testing) for clarification and analysis works as expected.
* Validate that data export to JSON and Markdown to the clipboard functions correctly.
* Prevent regressions in core features through automated testing.
* Ensure a high degree of usability for non-technical users.

## 2. Testing Levels

### 2.1. Unit Tests

* **Scope:** Test individual functions, React components in isolation (props, rendering, event handlers), utility functions, state management logic within the Zustand store (actions, selectors), and service functions (e.g., data transformation in `ExportService`, logic in `N8NIntegrationService`).
* **Tools:**
    * Test Runner/Framework: Vitest (integrates well with Vite) or Jest.
    * Component Testing: React Testing Library.
* **Mocking/Stubbing:** Use Vitest/Jest's mocking capabilities to isolate units under test. For example, mock service dependencies in components, or mock browser APIs if necessary.
* **Location:** Typically colocated with the source files (e.g., `MyComponent.test.tsx` alongside `MyComponent.tsx`) or in a `__tests__` subdirectory.
* **Expectations:**
    * Cover critical logic, conditional paths, and edge cases within each unit.
    * Tests should be fast and run frequently during development.
    * As per PRD: "Unit tests for critical React components and utility functions."

### 2.2. Integration Tests

* **Scope:** Verify the interaction between different parts of the application, such as:
    * A component interacting with the Zustand store.
    * A component correctly calling a service function and handling its response.
    * The `N8NIntegrationService` correctly routing calls to the `MockHandlerModule` when in "mock" mode, and verifying the shape of data passed and received.
    * Wizard flow logic: ensuring steps transition correctly based on user actions and state changes.
* **Tools:** Vitest (or Jest) and React Testing Library.
* **Location:** Can be within feature folders or a dedicated `src/tests/integration` directory.
* **Expectations:**
    * Focus on the contracts and interactions between integrated units.
    * Crucially, "Integration tests for the n8n webhook interactions (testing with mock handlers is essential)."

### 2.3. End-to-End (E2E) / Acceptance Tests

* **Scope:** Test complete user flows through the application's UI, simulating real user scenarios from start to finish.
    * Core Flow 1: Support Worker successfully submitting an incident report through the entire wizard, including dynamic clarification prompts (using mocked n8n responses) and final analysis display.
    * Core Flow 2: Team Leader reviewing a submitted incident (from the current session) and its associated n8n-generated analysis.
    * Core Flow 3: Successful export of incident data to JSON to the clipboard.
    * Core Flow 4: Successful export of incident data to Markdown to the clipboard.
* **Tools:** Playwright or Cypress.
* **Environment:** Run against a local development build of the application (`npm run build` then serve, or directly against the dev server for faster feedback if configured).
* **Location:** A separate top-level directory (e.g., `e2e/` or `tests/e2e/`).
* **Expectations:**
    * Validate that key user journeys work as intended.
    * These tests are generally slower and will be run less frequently than unit/integration tests (e.g., before considering a build "complete" for demonstration).

### 2.4. Manual / Exploratory Testing

* **Scope:**
    * Usability testing to ensure the application is intuitive and easy to use for Support Workers and Team Leaders, especially the wizard flow and clarity of language.
    * Verify the "one-at-a-time clarification questions" approach for user focus.
    * Exploratory testing to discover edge cases or unexpected behaviors not covered by automated tests.
    * Visual testing for UI consistency and adherence to basic accessibility considerations (e.g., keyboard navigation, color contrast).
    * Testing graceful handling of failed n8n calls (when in live mode, if n8n service is down) with clear user feedback.
* **Process:** Conducted ad-hoc by developers or designated testers based on user stories, PRD requirements, and UI/UX specifications. Feedback should be logged and prioritized. As per PRD: "Manual testing to confirm usability and flow."

## 3. Specialized Testing Types (MVP Context)

* **Performance Testing:** Not a primary focus for the MVP as it's a local application. UI responsiveness will be monitored during development and manual testing. n8n webhook calls (or mock responses) should resolve within a reasonable timeframe (e.g., < 3-5 seconds for MVP).
* **Security Testing:** For MVP demonstration purposes with fabricated data, extensive security testing is not required. Basic dependency vulnerability checks (e.g., `npm audit`) should be performed.
* **Accessibility Testing:** Basic accessibility considerations (e.g., keyboard navigation, sufficient color contrast, semantic HTML) should be followed during development and checked during manual testing, as per PRD. No dedicated accessibility audit is planned for MVP.

## 4. Test Data Management

* For the MVP, test data will primarily consist of fabricated incident scenarios.
* Mock data for n8n responses (both successful and error cases) will be defined within the `MockHandlerModule` (`src/mocks/n8nMockHandlers.ts`).
* Input data for E2E tests will be simple and defined within the test scripts themselves.
* No complex test data generation or database seeding is required due to the local, session-based nature of the application data.

## 5. CI/CD Integration

* No CI/CD pipeline is required for the MVP, given its local deployment model.
* Automated tests (unit, integration) will be run locally by developers:
    * On file changes during active development (via Vite/Vitest watch mode).
    * Before pushing code to the repository.
    * Optionally, as a pre-commit hook.
* E2E tests will be run locally as needed, especially before creating a distributable build.

## 6. Change Log

| Change        | Date       | Version | Description                                      | Author      |
| :------------ | :--------- | :------ | :----------------------------------------------- | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Initial draft based on PRD requirements          | 3-architect |

---

Please review this Testing Strategy. Does it adequately cover the testing needs for the MVP, aligning with the PRD and our previous discussions?

Once approved, we will have completed the initial set of core architectural documents. We can then move on to identifying any missing technical stories or enhancing existing epic/story details if needed, before finally validating the architecture against the checklist.