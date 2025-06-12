### Epic 7: Presentation Layer & Demo Polish

- **Goal:** To implement specialized, demo-optimized UI features to create a highly polished presentation. This includes a "pre-fill" button on input screens to auto-populate fields with data from the selected mock scenario, and other animated visual feedback (e.g., pulsating circles, typing animations) to enhance the demo experience.

#### Stories:

- **Story 7.1: Implement Title Labels as Pre-fill Triggers**

  - **User Story:** As a presenter, I want the text labels of pre-fillable form fields to act as clickable hotspots so that I can trigger the pre-fill action without needing a separate, visible button.
  - **Acceptance Criteria:**
    1.  The text label component associated with each designated form field is made into a clickable element.
    2.  This clickable behavior is only active when the application is in "Mock Mode".
    3.  When the mouse pointer hovers over a clickable label, the cursor changes to a "pointer" (hand icon).
    4.  The visual appearance of the label text itself does not change on hover (beyond the cursor change).
    5.  The click event on the label is successfully captured (the full action will be implemented in a later story).
    6.  The updated logic is committed to version control.

- **Story 7.2: Create "Pulse" Click Animation**

  - **User Story:** As a presenter, I want a "pulsating circle" animation to trigger at the location of my click on a hotspot so that there is clear visual feedback for my action in the video recording.
  - **Acceptance Criteria:**
    1.  A new, reusable animation component is created.
    2.  When triggered, the component renders an animation of a circle that expands outwards from a central point and fades out as it grows.
    3.  The animation is smooth and lasts for a short, non-disruptive duration (e.g., ~0.5 seconds).
    4.  The component can be programmatically triggered to play at specific coordinates on the screen (i.e., the location of the click).
    5.  The new animation component is committed to version control and is viewable in a Storybook or a simple test page.

- **Story 7.3: Create "Typing Effect" for Field Population**

  - **User Story:** As a developer, I want to create a function that populates a text field with a given string using a character-by-character "typing effect" so that data entry appears simulated and dynamic.
  - **Acceptance Criteria:**
    1.  A new, reusable function or React hook is created to manage the typing animation.
    2.  The function/hook accepts a string of text to be typed and a reference to the target form field.
    3.  When executed, it populates the target field one character at a time with a short, realistic delay between each character, simulating human typing.
    4.  The typing speed is configurable.
    5.  The new function/hook is committed to version control and is viewable in a Storybook or a simple test page.

- **Story 7.4: Integrate Hotspots with Mock Data and Effects**
  - **User Story:** As a presenter, when I click a field's title label, I want the system to trigger the pulse animation and populate the corresponding field with the correct data from the selected mock scenario, using the typing effect.
  - **Acceptance Criteria:**
    1.  When a clickable title label is clicked in "Mock Mode," the "pulse" animation is triggered at the click's location.
    2.  Simultaneously, the system identifies the currently active mock scenario.
    3.  The system retrieves the correct data value for the field associated with the clicked label from the active mock scenario's data file.
    4.  The "typing effect" function is then called to populate the field with the retrieved data.
    5.  This entire sequence (click -> animation -> data fetch -> typing) works together seamlessly for all designated pre-fillable fields.
    6.  The final integrated logic is committed to version control.
