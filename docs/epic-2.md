### Epic 2: Core Wizard & Navigation Framework

* **Goal:** To build a reusable, generic wizard component that includes a visual progress indicator at the top of the screen and standard navigation controls (Next, Back). This epic will also include a top-level screen to allow a user to select which workflow to start (e.g., "Incident Capture" or "Basic Analysis").

#### Stories:

* **Story 2.1: Create Reusable Wizard Component Shell**
    * **User Story:** As a developer, I want to create a generic wizard component that can accept a list of steps so that we have a reusable framework for all multi-step processes.
    * **Acceptance Criteria:**
        1.  A new component named `Wizard.tsx` is created in the `src/components/` directory.
        2.  The component accepts a `steps` prop, which is an array of objects, where each object represents a step and contains the content to be rendered.
        3.  The component correctly manages the state of the current step index, defaulting to the first step.
        4.  When rendered, the component displays the content for the currently active step.
        5.  The component is added to a temporary page or a Storybook story for basic visualization and testing.
        6.  The new component file is committed to version control.

* **Story 2.2: Implement Wizard Navigation Controls**
    * **User Story:** As a developer, I want to add "Next" and "Back" buttons to the wizard component shell so that a user can navigate between steps.
    * **Acceptance Criteria:**
        1.  The `Wizard` component renders "Next" and "Back" buttons.
        2.  Clicking the "Next" button advances the wizard to the subsequent step and displays its content.
        3.  Clicking the "Back" button returns the wizard to the previous step and displays its content.
        4.  The "Back" button is disabled or hidden when the user is on the first step.
        5.  On the final step of the wizard, the "Next" button is replaced by a "Finish" button.
        6.  The new "Finish" button on the last step does not need to have any functionality yet, beyond being visible.
        7.  All changes to the `Wizard` component are committed to version control.

* **Story 2.3: Implement Visual Progress Indicator**
    * **User Story:** As a developer, I want to add a visual progress bar to the top of the wizard component so that users can clearly see which step they are on, how far they have to go, and navigate back to previously completed steps.
    * **Acceptance Criteria:**
        1.  A progress indicator is displayed at the top of the `Wizard` component.
        2.  The indicator visually communicates the total number of steps and clearly highlights which step is currently active.
        3.  The `Wizard` component tracks which steps have been "visited". A step is considered visited after the user navigates away from it using the "Next" button.
        4.  The step markers in the progress indicator for all visited steps are clickable.
        5.  Clicking a visited step in the indicator navigates the user directly to that step.
        6.  Step markers for unvisited steps are visually distinct (e.g., grayed out) and are not clickable.
        7.  The active step in the indicator updates correctly when the user navigates with the "Next," "Back," or clickable progress indicator markers.
        8.  All changes to the `Wizard` component are committed to version control.

* **Story 2.4: Create Application Shell with Workflow Navigation**
    * **User Story:** As a user, I want a persistent navigation menu on the side of the screen that displays the main stages of the incident report ("Capture" and "Analysis") so that I always know my current stage and can easily navigate between completed stages.
    * **Acceptance Criteria:**
        1.  A main application layout or "shell" is created that includes a persistent left-hand navigation menu.
        2.  The menu clearly lists the two primary workflows: "1. Incident Capture" and "2. Analysis".
        3.  By default, the "Analysis" workflow in the menu is visually disabled (e.g., grayed out and not clickable).
        4.  Clicking "Incident Capture" launches the wizard for that workflow in the main content area.
        5.  A mechanism will be needed to "complete" the capture workflow, which will then enable the "Analysis" option in the menu. This does not need to be implemented in this story.
