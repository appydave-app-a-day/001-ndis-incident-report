## API Reference

### External APIs Consumed

#### 1. Get Clarification Questions

- **Purpose:** To submit the user's initial, free-text narrative and retrieve a list of AI-generated follow-up questions for each section to enrich the report.
- **Triggered:** After Story 3.2.
- **Base URL(s):** `VITE_N8N_CLARIFICATION_WEBHOOK_URL`
- **Endpoint:** `POST /`

#### 2. Suggest a New Question

- **Purpose:** To allow a user to submit a new, potentially useful question to a datastore for future review and inclusion in the system.
- **Triggered:** During Story 3.7.
- **Base URL(s):** `VITE_N8N_SUGGESTION_WEBHOOK_URL`
- **Endpoint:** `POST /`

#### 3. Consolidate Narrative Sections

- **Purpose:** To take the user's original narrative and their answers to the clarification questions for all four phases, and return a single, well-written, consolidated paragraph for each phase.
- **Triggered:** After all clarification steps are complete (new Story 3.7).
- **Base URL(s):** `VITE_N8N_CONSOLIDATION_WEBHOOK_URL`
- **Endpoint:** `POST /`

#### 4. Get AI Analysis

- **Purpose:** To submit the complete incident narrative to an N8N workflow which then uses a Large Language Model to generate an initial analysis.
- **Triggered:** After Story 4.1.
- **Base URL(s):** `VITE_N8N_ANALYSIS_WEBHOOK_URL`
- **Endpoint:** `POST /`
