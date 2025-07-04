### Epic 5: AI-Assisted Report Analysis Workflow

- **Goal:** To implement the full business logic and UI screens for the Team Lead's analysis process, which includes reviewing the captured narrative, adding contributing factors, and classifying the incident, all within the core wizard framework.

#### Process Improvements from Epic 4:
- **Progressive Enhancement**: Apply progressive data fetching after narrative review (Story 5.1)
- **Just-in-Time Story Creation**: Stories will be created as needed during implementation
- **Developer Experience**: Include test data and debugging tools from the start
- **API Contracts**: Define contracts early (see implementation guide)
- **Reusable Patterns**: Leverage Epic 4's successful patterns

#### Implementation Resources:
- See `docs/epic-5-implementation-guide.md` for technical patterns and implementation details
- See `docs/api/epic-5-analysis-api.md` for complete API contracts and N8N integration
- Reference `docs/retrospectives/epic-4-retrospective.md` for lessons learned
- Stories will be created just-in-time following BMAD workflow

#### Stories:

- **Story 5.1: Create "Review Full Narrative" & Trigger Analysis**

  - **User Story:** As a Team Lead, I want the first step of the analysis workflow to be a read-only view of the complete, enriched narrative from the capture stage so that I have all the context before I begin my analysis.
  - **Acceptance Criteria:**
    1.  The first step of the "Analysis" wizard displays the complete, consolidated narrative in a read-only format.
    2.  Upon the user clicking "Next" to leave this step, the application shall trigger progressive, asynchronous requests (using the live/mock switch) with the full narrative data to pre-fetch both the "Contributing Conditions" and the "Incident Type Classification" analysis.
    3.  The prefetch operations should not block the UI and should handle failures gracefully.
    4.  This wizard step is committed to version control.

- **Story 5.2: Review and Edit "Contributing Conditions"**

  - **User Story:** As a Team Lead, I want to review the AI-generated summary of contributing conditions and edit it as needed so that the final analysis is accurate and complete.
  - **Acceptance Criteria:**
    1.  The second step of the analysis wizard is dedicated to "Contributing Conditions".
    2.  A large text area on the screen is pre-populated with the "Immediate Contributing Conditions" text generated by the AI.
    3.  The user can freely edit, add to, or delete the text within the text area.
    4.  The final, edited text is saved to the application's state when the user proceeds to the next step.
    5.  This wizard step is committed to version control.

- **Story 5.3: Curate "Incident Type Classification"**

  - **User Story:** As a Team Lead, I want to review a list of AI-suggested incident classifications, with the ability to add, remove, or edit them, so that the final report is accurately categorized.
  - **Acceptance Criteria:**
    1.  The third step of the analysis wizard is dedicated to "Incident Type Classification".
    2.  The step is pre-populated with a list of classification items based on the AI response.
    3.  Each item in the list clearly displays the "Incident Type" and a text input field containing the "Supporting Evidence".
    4.  The user can edit the text in the "Supporting Evidence" field for any classification.
    5.  Each classification item has a "Remove" button that deletes it from the list.
    6.  A button labeled "Add Incident Type" is present on the screen.
    7.  Clicking "Add Incident Type" creates a new, blank classification item with a dropdown menu containing all valid incident types (Behavioural, Environmental, etc.) and an empty text field for evidence.
    8.  The final, curated list of classifications is saved to the application's state when the user proceeds.
    9.  This new wizard step is committed to version control.

- **Story 5.4: Implement Analysis "Review and Complete" Step**
  - **User Story:** As a Team Lead, I want a final screen to review the original narrative alongside my own curated analysis and formally mark the analysis stage as complete.
  - **Acceptance Criteria:**
    1.  The final step of the "Analysis" wizard is a read-only review screen.
    2.  The screen displays the complete, enriched narrative from the capture workflow.
    3.  The screen displays the final, edited "Contributing Conditions" text.
    4.  The screen displays the final, curated list of "Incident Type Classifications" and their supporting evidence, formatted clearly (e.g., as a table).
    5.  A "Complete Analysis" button is displayed.
    6.  Clicking the "Complete Analysis" button updates the application's state to mark this stage as finished.
    7.  This new wizard step is committed to version control.

- **Story 5.5: Branding and Content Refinement**
  - **User Story:** As a product stakeholder, I want to rebrand the application from "NDIS Incident Report" to "Support Signal" with proper branding, localised content, and refined user experience, so that the application has a professional identity and uses appropriate Australian English throughout.
  - **Key Tasks:**
    - Rebrand from "NDIS Incident Report" to "Support Signal" across all components
    - Add Support Signal logo to sidebar and header with light/dark mode support
    - Transform homepage into summary dashboard with metrics cards
    - Convert all American English to Australian English (analyzing→analysing, organize→organise, etc.)
    - Fix loading message capitalisation ("Loading Your Data..."→"Loading your data...")
    - Remove explicit AI references, replace with neutral terms (AI-powered→automated)
    - Update index.html, AppLayout.tsx, Home.tsx, and all user-facing text
    - Fix Epic 4 finish button to navigate to beginning of analysis workflow (Epic 5)
    - This graphics is so on the dashboard: /Users/davidcruwys/dev/clients/supportsignal/supportsignal.com.au/assets/infographic.jpeg
    - This logo is so on the sidebar: /Users/davidcruwys/dev/clients/supportsignal/supportsignal.com.au/assets/logo.jpeg
  - **Estimated Effort:** Medium complexity, 3-4 hours
  - **Dependencies:** Logo assets required
    - Locate the location public/logo.jpeg

