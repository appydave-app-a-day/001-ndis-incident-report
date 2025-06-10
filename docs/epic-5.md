### Epic 5: Mocking & Demo Data Framework

* **Goal:** To implement a configurable "Mock Mode," including the on-screen switch to toggle between live and mock backends, and the ability to select from multiple pre-defined data scenarios. This includes simulating realistic API delays and providing clear loading feedback.

#### Stories:

* **Story 5.1: Implement Mock/Live Mode Switch**
    * **User Story:** As a presenter, I want a clear on-screen switch to toggle the application between "Live Mode" (for real API calls) and "Mock Mode" (for using local data) so I can control the demo environment.
    * **Acceptance Criteria:**
        1.  A UI switch or toggle component is implemented in a persistent location of the application's UI (e.g., in a settings menu or header).
        2.  The switch clearly displays the currently active mode ("Live" or "Mock").
        3.  Toggling the switch updates a global state variable that holds the current mode.
        4.  The application defaults to "Mock Mode" when it first loads.
        5.  The new UI component and its associated state logic are committed to version control.

* **Story 5.2: Create Mock Data Scenarios**
    * **User Story:** As a developer, I want to create the local data files (e.g., JSON) for at least three distinct, pre-scripted incident scenarios so that we have a reliable and varied data set for demonstrations.
    * **Acceptance Criteria:**
        1.  A new directory (e.g., `src/lib/mock-data`) is created to store the mock data files.
        2.  At least three separate JSON files are created, each representing a unique incident scenario.
        3.  Each scenario file contains a complete data set for a single incident, including mock content for: incident metadata, the four narrative sections, the lists of clarifying questions for each narrative section, and the pre-populated AI analysis (Contributing Conditions and Incident Type Classification).
        4.  The content of the scenarios is sufficiently varied to demonstrate different use cases.
        5.  The new mock data files are committed to version control.

* **Story 5.3: Implement Mock Scenario Selector**
    * **User Story:** As a presenter, when in "Mock Mode," I want a simple UI element (e.g., a dropdown) to select which of the pre-defined incident scenarios I want to use for my demo.
    * **Acceptance Criteria:**
        1.  A UI component (e.g., a dropdown menu) is implemented in a persistent location of the application's UI.
        2.  This scenario selector component is only visible when the application's global state is set to "Mock Mode".
        3.  The selector is populated with the list of available mock scenarios created in the previous story.
        4.  Selecting a scenario from the list updates a global state variable to hold the identifier of the currently active mock scenario.
        5.  The application defaults to the first available mock scenario upon entering "Mock Mode".
        6.  The new UI component and its associated state logic are committed to version control.

* **Story 5.4: Implement Mock Data Service**
    * **User Story:** As a developer, I want to create a mock data service that, when triggered in "Mock Mode," introduces an artificial 1.5-second delay and then returns the data from the selected mock scenario, perfectly simulating a real API call.
    * **Acceptance Criteria:**
        1.  A data-fetching service/function is created that encapsulates the logic for retrieving clarification questions and analysis data.
        2.  This service checks the application's global state to determine if it is in "Live Mode" or "Mock Mode".
        3.  When in "Mock Mode," the service reads the currently selected scenario data from the local JSON files.
        4.  When in "Mock Mode," the service waits for an artificial delay of 1.5 seconds before returning the data.
        5.  The service returns the mock data in the same structure that the live N8N API is expected to provide.
        6.  The new mock data service logic is committed to version control.

* **Story 5.5: Implement Global Loading Indicator**
    * **User Story:** As a user, I want to see a clear loading indicator or spinner whenever the application is waiting for data (either from a live API call or a mock data service) so I know the system is working.
    * **Acceptance Criteria:**
        1.  A reusable loading indicator/spinner component is created.
        2.  A global state (e.g., `isLoading`) is established to track the data-fetching status of the application.
        3.  The data-fetching service sets the `isLoading` state to `true` immediately before initiating a data request (both mock and live).
        4.  The loading indicator is displayed prominently on the screen whenever the `isLoading` state is `true`.
        5.  The data-fetching service sets the `isLoading` state to `false` after the request is completed (either successfully or with an error).
        6.  The new loading indicator component and its associated state logic are committed to version control.
