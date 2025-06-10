Of course. Here is the content for the next file.

***

**File 8 of 22**
**Path:** `docs/data-models.md`

---
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
---

Please let me know when you are ready for the next file.