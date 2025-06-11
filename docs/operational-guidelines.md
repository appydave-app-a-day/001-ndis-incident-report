## Operational Guidelines

This document outlines the core standards and strategies that must be followed during development to ensure code quality, consistency, and maintainability.

### Coding Standards

These standards are mandatory for all code to ensure quality and consistency.

- **Style Guide & Linter:** We will use **ESLint** for identifying and reporting on patterns in the code, and **Prettier** for automatic code formatting. A standard, widely-used configuration will be established.
- **Naming Conventions:**
  - **Variables & Functions:** `camelCase`
  - **Components & Classes/Types:** `PascalCase`
  - **Constants:** `UPPER_SNAKE_CASE`
  - **Files:** Component files will be `PascalCase.tsx`. All other TypeScript files will be `kebab-case.ts`.
- **File Structure:** All code must adhere strictly to the layout defined in the "Project Structure" section of this document.
- **Unit Test File Organization:** Unit test files will use the naming convention `*.test.tsx` and will be co-located with the source files they are testing.
- **Asynchronous Operations:** All asynchronous operations must use modern `async/await` syntax.
- **Type Safety:** TypeScript's `strict` mode must be enabled in the `tsconfig.json` file. The use of the `any` type is strongly discouraged and requires explicit justification.
- **Comments & Documentation:** Comments should explain the _why_, not the _what_. All exported functions and complex logic should have JSDoc/TSDoc-style comments.
- **Dependency Management:** We will use `npm` to manage dependencies. For stability, package versions should be pinned in the `package.json` file rather than using broad version ranges.

### Overall Testing Strategy

This strategy outlines the approach to testing for the application. While initial MVP development will rely on manual validation, this framework will guide the implementation of automated tests post-MVP.

- **Primary Tools:**
  - **Unit & Integration Testing:** **Vitest** - A modern, fast, and Jest-compatible testing framework that works seamlessly with Vite.
  - **End-to-End (E2E) Testing:** **Playwright** - A powerful framework for reliable, cross-browser end-to-end testing.
- **Unit Tests:**
  - **Scope:** Test individual components and functions in isolation.
  - **Location:** Test files (`*.test.tsx`) will be co-located with their corresponding source files.
  - **Mocking:** All external dependencies (like our API services) will be mocked using Vitest's built-in mocking capabilities.
- **Integration Tests:**
  - **Scope:** Test the interaction between several components within a single feature, such as the complete multi-step wizard flow, with API calls mocked at the service layer.
- **End-to-End (E2E) Tests (Post-MVP):**
  - **Scope:** Validate the two primary user flows from start to finish: The complete "Incident Capture" workflow and the complete "AI-Assisted Report Analysis" workflow.
  - **Note:** The implementation of automated E2E tests is deferred post-MVP.
- **Test Coverage:**
  - While there is no strict coverage percentage required for the MVP, the goal is to have tests that meaningfully cover critical application logic and user interactions once automated testing is implemented.
