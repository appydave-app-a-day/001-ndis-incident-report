Okay, understood. We'll leave the "Relevant Research" section blank or indicate that no specific external research is being formally attached to this brief for now.

I will now compile the complete Project Brief based on all our discussions. This will include:

1.  Project Name
2.  Introduction / Problem Statement
3.  Vision & Goals (Vision, Primary Goals, Success Metrics)
4.  Target Audience / Users
5.  Key Features / Scope (High-Level Ideas for MVP)
6.  Known Technical Constraints or Preferences
7.  Risks
8.  Relevant Research (Optional) - This will be noted as not included for now.
9.  PM Prompt (The handoff prompt for the Project Manager)

This will give you the full document in one go. Please allow me a few moments to structure it.
---

Here is the complete Project Brief for "NDIS Incident Capture / Analysis":

# Project Brief: NDIS Incident Capture / Analysis

## Introduction / Problem Statement

The NDIS Incident Capture / Analysis aims to provide a structured, compliant, and user-friendly system for capturing, clarifying, and analyzing incident reports involving NDIS participants. This project is needed to ensure timely and accurate reporting of incidents, facilitate the identification of contributing factors, and support continuous improvement in NDIS service delivery.

## Vision & Goals

-   **Vision:** An NDIS incident capture tool that helps the reporter record and then elicit additional information from the reporter about the incident, ensuring accurate details about what actually happened. Subsequently, an analysis workflow will identify contributing factors and classify the incident. This vision is ultimately about speeding up the incident capture process and identifying opportunities (e.g., staff training, system documentation improvements) to enhance service delivery, benefiting both the service provider and the client.
-   **Primary Goals (SMART for MVP):**
    -   Goal 1: To ensure comprehensive data capture for the MVP, the system will guide reporters through all required fields for common NDIS incident types, and by the end of the first 3 months post-launch, aim for a 90% completeness rate in essential narrative details (before, during, end, post-event support) supplemented by clarification prompts.
    -   Goal 2: Within the first 3 months post-MVP launch, enable users to successfully classify 90% of fully captured incidents using the system's NDIS category mapping and identify at least one potential contributing condition for 75% of these incidents.
-   **Success Metrics (Initial Ideas):**
    -   Average time to complete an incident report (from start to full initial submission).
    -   Percentage of reports meeting core NDIS compliance principles (e.g., inclusion of key narrative elements).
    -   Quality of captured data, assessed by its ability to identify client-specific improvement areas or highlight challenges related to staffing/situational contexts (e.g., potentially measured by "Number of actionable insights leading to documented process/training adjustments per quarter").

## Target Audience / Users

The primary users of the "NDIS Incident Capture / Analysis" system are:

-   **NDIS Support Workers:**
    -   **Responsibilities:** Directly involved with NDIS participants; responsible for frontline incident reporting. They will be the primary users for capturing the initial incident details from their point of view.
    -   **Needs:** A simple, quick, and intuitive interface for recording incident narratives and details; clear guidance and prompts; confidence in report completeness.
-   **Team Leaders / Case Managers / Service Managers (and similar roles):**
    -   **Responsibilities:** Oversee support workers and participant care, review incident reports, identify patterns, ensure appropriate follow-up, and manage escalations.
    -   **Needs:** Efficient review and clarification tools; basic analysis capabilities (contributing factors, classification); tracking and clear outputs.

## Key Features / Scope (High-Level Ideas for MVP)

The MVP will focus on delivering a streamlined workflow for incident reporting and preliminary analysis:

-   **Incident Report Collection Module:**
    -   Event Overview Capture (basic metadata).
    -   Guided Narrative Input (before, during, end, post-event support).
    -   Narrative Review.
    -   Automated Clarification Prompts (to enrich narrative sections).
    -   Updated Narrative Display (consolidated with clarifications).
-   **Narrative Analysis Module:**
    -   Contributing Conditions Identification.
    -   Incident Type Classification (with justifications, mapped to NDIS categories).
-   **Structured Report Output:**
    -   Compilation of clarified inputs and analysis into a formal narrative report.
    -   Well-organized output suitable for review or export.

## Known Technical Constraints or Preferences

-   **Core Technology Stack (MVP):**
    -   Frontend: Simple React application.
    -   UI Components/Styling: ShadCN and TailwindCSS.
    -   Deployment: To run locally as a quick MVP.
-   **Data Flow & Processing:**
    -   The application will interact with n8n endpoints at various steps.
    -   Data processing will primarily be handled through prompt chains via n8n to process inputs and return outputs.
    -   **n8n Webhook Implementation:** Calls to n8n webhooks should be implemented to support both actual live calls (potentially commented out initially) and fake mock handlers for local demonstration purposes.
-   **Export Functionality:**
    -   Export to JSON and Markdown formats only.
    -   Export mechanism: Copy to clipboard via a button press.
-   **Integrations:** No direct NDIS API integrations for the MVP.
-   **Budget:** No specific budgetary constraints noted; emphasis on rapid development.
-   **Timeline:** Project to be "done quickly," implying a short development cycle for the MVP.
-   **UI/UX Preferences:** Step-by-step wizard, one-at-a-time clarification questions, final narrative showing original + additions, read-only markdown for analysis outputs.
-   **Compliance:** System outputs/classifications to generally align with NDIS incident reporting principles, guided by prompt chains.
-   **Data Security & Privacy:**
    -   User has indicated this may not be a primary focus for the local MVP.
    -   **Recommendation/PM Clarification Point:** Given the sensitivity of NDIS data (even simulated), it's crucial to clarify the nature of data used in the MVP. If any realistic data is used, basic local data protection and clear user disclaimers are essential. The PM should confirm requirements and necessary safeguards.

## Risks

-   **Complexity of NDIS Rules vs. Prompt Chain Simplicity:** Risk that oversimplified prompt chains may not adequately address nuanced NDIS reporting requirements, potentially leading to non-compliant or insufficient outputs.
-   **Dependency on n8n Workflows:** Heavy reliance on n8n endpoints and prompt chains; any issues, complexities, or limitations in these workflows will directly impact application functionality and development.
-   **Scope Creep for "Quick MVP":** Potential for feature expansion beyond what's feasible for a rapid MVP, given the desired richness of data and "appropriate questions."
-   **User Adoption & Training:** Ensuring users understand and effectively use the prompt-driven system, especially with limited iterative user feedback during a rapid "AI programmer" development cycle.

## Relevant Research (Optional)

No specific external research documents are being formally attached to this brief at this stage.

## PM Prompt

### Project: NDIS Incident Capture / Analysis

**To the Project Manager:**

This Project Brief outlines the "NDIS Incident Capture / Analysis" tool, an MVP designed for rapid development to streamline the capture and initial analysis of NDIS incidents. The core concept revolves around a React-based local application guiding users (NDIS Support Workers, Team Leaders) through incident reporting via a wizard interface, using n8n-driven prompt chains for data enrichment and basic analysis (contributing factors, classification), and exporting to JSON/Markdown.

**Key Insights & Context:**

* **Core Problem:** Improve timeliness, accuracy, and analytical insight from NDIS incident reports.
* **User Focus:** Simplicity and guided input for Support Workers; review and basic analysis for Team Leaders/Managers.
* **MVP Driver:** Speed of development ("done quickly in an AI programmer") and local functionality are key.
* **Technical Core:** React (ShadCN/Tailwind) frontend, local deployment, with crucial logic and data processing handled by calls to n8n webhook endpoints.

**Areas Requiring Special Attention in PRD & Development:**

1.  **n8n Workflow Design & Mocking:**
    * The n8n prompt chains are central to data collection (clarification prompts) and analysis (contributing factors, classification). The PRD will need to detail the expected interaction points and data exchange for these.
    * Crucially, webhook calls to n8n must be implemented with a toggle/option for using **fake mock handlers** for standalone frontend demonstration and development, alongside the ability to call actual (commented out initially) webhooks.
2.  **Prompt Engineering for Clarification & Analysis:**
    * While "simple prompt chains" are intended, their effectiveness in eliciting comprehensive details and performing accurate basic analysis needs careful consideration. Define the scope and expected intelligence of these prompts for MVP.
3.  **Data Handling & Sensitivity (MVP Context):**
    * The client has indicated data security is not a primary concern for this local MVP. However, **this requires careful clarification.** Determine definitively if any real, anonymized, or purely fabricated data will be used. If any potentially sensitive data is touched, even locally, ensure basic safeguards and disclaimers are in place. This is a critical point to confirm before development.
4.  **Wizard Flow & UI for Guided Input:**
    * The step-by-step wizard and one-at-a-time clarification questions are key UI preferences. Ensure the PRD reflects this flow clearly for the developers.
5.  **Scope Management for "Quick" MVP:**
    * Maintain tight control over features to align with the rapid development goal. Focus on the core capture, clarification, basic analysis, and export features outlined.

**Guidance on PRD Detail Level:**

* **User Stories:** Provide clear user stories for Support Worker incident submission and Team Leader review/analysis flows.
* **n8n Interaction Points:** Detail the inputs/outputs for each n8n webhook call (even if mocked initially). Specify the purpose of each prompt chain.
* **Data Structures:** Define the structure for the JSON export.
* **MVP Feature Boundaries:** Clearly distinguish MVP features from potential future enhancements.

**User Preferences Summary:**

* Local React App (ShadCN/Tailwind).
* n8n for backend logic via webhooks (with mock handler option).
* JSON/Markdown export to clipboard.
* Emphasis on speed and simplicity for the MVP.
* Step-by-step wizard UI.

This brief should provide a solid foundation for you to develop a detailed PRD and kick off the MVP development.
