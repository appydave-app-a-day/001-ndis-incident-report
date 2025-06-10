## Component View & Design Patterns

### Architectural / Design Patterns Adopted
* **Wizard Component:** A reusable, generic wizard component will be the core of the user experience, managing step progression, navigation, and content display.
* **Global State Management:** A centralized store (using Zustand) will manage application-wide state, such as the Mock/Live mode toggle, the currently selected mock scenario, and loading status.
* **Service Layer:** API interactions will be encapsulated within a dedicated service layer (`lib/services/`), separating data-fetching logic from the UI components.

### Component View
The system is comprised of several major logical components:
* **App Shell:** The main application layout containing the persistent side navigation and the content area where the workflows are rendered.
* **Wizard Framework:** The reusable `Wizard.tsx` component, including its navigation controls and progress indicator.
* **Workflow Features:** Each major workflow (e.g., `incident-capture`, `incident-analysis`) is a self-contained feature composed of multiple step components that are rendered inside the wizard.
