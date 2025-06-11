# NDIS Incident Capture / Analysis Tool Project Structure

This document outlines the recommended directory and file structure for the NDIS Incident Capture / Analysis Tool frontend application.

```plaintext
ndis-incident-capture-tool/
├── .vscode/                    # VSCode specific settings (optional)
│   └── settings.json
├── docs/                       # Project documentation (PRD, Arch, this file, etc.)
│   ├── architecture.md
│   ├── tech-stack.md
│   └── ... (other .md files)
├── node_modules/               # Project dependencies (managed by npm/yarn, git-ignored)
├── public/                     # Static assets (e.g., favicon, images)
│   └── favicon.ico
├── src/                        # Application source code
│   ├── App.tsx                 # Main application component (root, routing if any)
│   ├── main.tsx                # Application entry point (renders App)
│   │
│   ├── assets/                 # Static assets like images, fonts (if not in public/)
│   │
│   ├── components/             # Shared/reusable UI components
│   │   ├── layout/             # Layout components (e.g., WizardLayout.tsx)
│   │   └── ui/                 # General-purpose UI components (e.g., custom ShadCN compositions)
│   │
│   ├── features/               # Feature-specific modules/components
│   │   ├── incident-capture/   # Components related to the incident capture wizard
│   │   │   ├── steps/          # Individual wizard step components (e.g., EventOverviewStep.tsx)
│   │   │   └── WizardShell.tsx # Main wizard container and navigation logic component
│   │   ├── incident-review/    # Components for the incident review screen
│   │   │   └── ReviewScreen.tsx
│   │   └── common/             # Components shared across features but not globally reusable
│   │
│   ├── hooks/                  # Custom React hooks (e.g., useN8NMode.ts)
│   │
│   ├── services/               # Business logic services, API integrations
│   │   ├── n8nService.ts       # Logic for N8NIntegrationService (n8n/mock calls)
│   │   └── exportService.ts    # Logic for ExportService (JSON/Markdown export)
│   │
│   ├── store/                  # Global state management (Zustand)
│   │   └── incidentStore.ts    # Zustand store definition and actions
│   │
│   ├── mocks/                  # Mock handlers for n8n integration
│   │   └── n8nMockHandlers.ts  # Mock implementations for n8n webhooks
│   │
│   ├── types/                  # TypeScript type definitions and interfaces
│   │   ├── incident.ts         # Core Incident data types (aligns with data-models.md)
│   │   └── n8n.ts              # Types for n8n request/response payloads
│   │
│   ├── lib/                    # General utility functions
│   │   └── utils.ts
│   │
│   └── styles/                 # Global styles, Tailwind base/customizations
│       └── global.css
│
├── .env                      # Local environment variables (git-ignored)
├── .env.example              # Example environment variables template
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore rules
├── index.html                # Main HTML entry point for Vite
├── package.json              # Project manifest, dependencies, and scripts
├── postcss.config.js         # PostCSS configuration (for Tailwind CSS)
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript compiler configuration
├── tsconfig.node.json        # TypeScript configuration for Node.js context (e.g. Vite config)
└── vite.config.ts            # Vite configuration
```

## Key Directory Descriptions

- **`docs/`**: Contains all project planning, architectural, and reference documentation.
- **`public/`**: Static assets that are directly served by the web server (or copied to the build output as-is). Vite uses this for `index.html`'s dependencies like favicons.
- **`src/`**: The heart of the application, containing all TypeScript/React source code.
  - **`App.tsx`**: The root component of the React application. It might include basic layout structure or routing if needed (though routing is minimal for this MVP).
  - **`main.tsx`**: The entry point of the application; it renders the `App` component into the DOM.
  - **`assets/`**: For static assets like images or fonts that are imported into components.
  - **`components/`**:
    - `layout/`: Reusable layout structures, e.g., a component that defines the overall wizard page structure.
    - `ui/`: Small, generic, reusable UI components. These might be custom wrappers around ShadCN/UI components or compositions of them.
  - **`features/`**: Organizes code by major application features. This promotes modularity.
    - `incident-capture/`: All components and logic specifically related to the incident capture wizard.
      - `steps/`: Contains individual React components for each step of the wizard (e.g., inputting event overview, narratives, displaying clarification Q&A).
      - `WizardShell.tsx`: The main component managing the wizard's flow, navigation, and step display, aligning with Story 1.2.
    - `incident-review/`: Components dedicated to displaying the collected incident data and n8n analysis on the review screen.
    - `common/`: UI components or hooks that are shared between multiple features but are not generic enough to be in `src/components/ui/` or `src/hooks/`.
  - **`hooks/`**: Custom React hooks that encapsulate reusable stateful logic or side effects (e.g., a hook to manage the n8n mock/live mode, or interact with `localStorage`).
  - **`services/`**: Contains modules responsible for specific business logic or external communications, decoupled from UI components.
    - `n8nService.ts`: Implements the logic for `N8NIntegrationService`, including making calls to actual n8n webhooks or invoking mock handlers based on the toggle.
    - `exportService.ts`: Implements the `ExportService` logic for formatting data into JSON/Markdown and copying it to the clipboard.
  - **`store/`**: Holds the global state management setup.
    - `incidentStore.ts`: Defines the Zustand store, including state variables (e.g., incident data object, n8n mode) and actions to modify them.
  - **`mocks/`**:
    - `n8nMockHandlers.ts`: Contains the mock functions that simulate responses from n8n webhooks for clarification and analysis, used by `n8nService.ts` when in mock mode.
  - **`types/`**: Centralized location for TypeScript type definitions and interfaces.
    - `incident.ts`: Defines the shape of the main incident data object, likely aligning with or extending the schema in `docs/data-models.md`.
    - `n8n.ts`: Type definitions for the request and response payloads of n8n webhooks.
  - **`lib/` or `utils/`**: General utility functions that can be used across the application (e.g., date formatting, string manipulation).
  - **`styles/`**: Global stylesheets or configurations for styling (e.g., Tailwind CSS base configurations, global CSS if absolutely necessary).
- **`.env`, `.env.example`**: For managing environment variables. `.env.example` serves as a template.
- **Configuration Files (`vite.config.ts`, `tailwind.config.js`, etc.)**: Standard configuration files for the respective tools.

## Notes

- This structure aims for a clear separation of concerns (UI, state, services, types) to enhance maintainability and testability.
- The `features/` directory approach is chosen to group related functionalities together, making it easier to understand and manage different parts of the application.
- Naming conventions for files and folders (e.g., `PascalCase` for components, `camelCase` or `kebab-case` for other files) should be consistently applied as defined in `docs/coding-standards.md`.

## Change Log

| Change        | Date       | Version | Description                                            | Author      |
| :------------ | :--------- | :------ | :----------------------------------------------------- | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Initial draft based on project type and best practices | 3-architect |
