## Project Structure

This structure is designed for a client-side rendered React application using Vite, emphasizing modularity and clear separation of concerns.

```plaintext
/
├── .github/
│   └── workflows/              # CI/CD workflows (if any)
├── docs/                       # Project documentation (PRD, Architecture, etc.)
├── public/                     # Static assets (images, fonts, etc.)
└── src/                        # Application source code
    ├── components/             # Shared, reusable UI components
    │   ├── ui/                 # Base components from shadcn/ui (e.g., Button, Input)
    │   └── layout/             # Layout components (e.g., Wizard, AppShell)
    ├── features/               # Contains code for specific application workflows
    │   ├── incident-capture/   # All components/logic for Epic 3
    │   └── incident-analysis/  # All components/logic for Epic 4
    ├── hooks/                  # Custom reusable React hooks
    ├── lib/                    # Utility functions and services
    │   ├── mock-data/          # Contains the JSON files for mock scenarios
    │   └── services/           # Contains the mock data service
    ├── routes/                 # Contains the page components for React Router
    ├── store/                  # Global state management using Zustand
    └── App.tsx                 # Main application component
```

### Key Directory Descriptions

* **`src/components/`**: This will contain globally shared, reusable React components.
    * **`ui/`**: For the base components provided by shadcn/ui.
    * **`layout/`**: For larger components that structure the application's layout, like the main application shell and the wizard framework.
* **`src/features/`**: A core directory where each major workflow (Epic) will have its own folder, containing all the UI components and logic specific to that feature. This keeps our features well-encapsulated.
* **`src/hooks/`**: For any custom, reusable React hooks that can be shared across different features.
* **`src/lib/`**: For non-component code, such as utility functions and data services. This is where our mock data and the service that provides it will live.
* **`src/routes/`**: This will hold the main page components that are mapped to specific routes in React Router.
* **`src/store/`**: This is where our Zustand state management store will be defined, managing all global application state.
