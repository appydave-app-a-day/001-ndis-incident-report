# NDIS Incident Capture / Analysis Tool Environment Variables

## 1. Configuration Loading Mechanism

This project uses Vite, which handles environment variables as follows:

- Environment variables are loaded from `.env` files in the project root. Standard files include:
  - `.env`: Loaded in all cases.
  - `.env.local`: Loaded in all cases, ignored by git. Used for local overrides.
  - `.env.[mode]`: Loaded only for the specified mode (e.g., `.env.development`, `.env.production`).
  - `.env.[mode].local`: Loaded only for the specified mode, ignored by git.
- Only variables prefixed with `VITE_` are exposed to the client-side code and can be accessed via `import.meta.env.VITE_VARIABLE_NAME`.
- The PRD requires a toggle for n8n live/mock mode, which will be primarily controlled by `VITE_N8N_MODE`.

## 2. Required and Optional Variables

The following environment variables are used by the application:

| Variable Name                | Description                                                | Example / Default Value (in code if not set)   | Required?                                 | Sensitive?                                                   |
| :--------------------------- | :--------------------------------------------------------- | :--------------------------------------------- | :---------------------------------------- | :----------------------------------------------------------- |
| `VITE_N8N_MODE`              | Determines n8n interaction mode. Can be `live` or `mock`.  | `mock` (Recommended default for initial setup) | Yes                                       | No                                                           |
| `VITE_N8N_CLARIFICATION_URL` | Full URL for the live n8n clarification webhook endpoint.  | `http://localhost:5678/webhook/clarification`  | Yes (if `VITE_N8N_MODE` is set to `live`) | No (if local n8n) / Potentially Yes (if public with secrets) |
| `VITE_N8N_ANALYSIS_URL`      | Full URL for the live n8n basic analysis webhook endpoint. | `http://localhost:5678/webhook/analysis`       | Yes (if `VITE_N8N_MODE` is set to `live`) | No (if local n8n) / Potentially Yes (if public with secrets) |
| `VITE_APPLICATION_VERSION`   | Current version of the application. Used in data exports.  | Value from `package.json` (e.g., `0.1.0`)      | No (Can default in code if not set)       | No                                                           |

**Notes on "Required?" column:**

- `VITE_N8N_CLARIFICATION_URL` and `VITE_N8N_ANALYSIS_URL` are only functionally required if `VITE_N8N_MODE` is set to `'live'`. The application can still run in `'mock'` mode without them.

**Notes on "Sensitive?" column:**

- For the MVP, n8n webhook URLs are typically for local or development n8n instances and may not be sensitive. If these URLs point to production n8n instances or contain authentication tokens directly within the URL (not recommended), they would be considered sensitive.

## 3. Usage

- To use these variables, create a `.env` or `.env.local` file in the project root:
  ```env
  VITE_N8N_MODE=mock
  # VITE_N8N_CLARIFICATION_URL=http://your-n8n-instance/webhook/clarification
  # VITE_N8N_ANALYSIS_URL=http://your-n8n-instance/webhook/analysis
  VITE_APPLICATION_VERSION=0.1.0
  ```
- The application code (e.g., in `src/services/n8nService.ts`) will read these variables like `import.meta.env.VITE_N8N_MODE`.

## 4. Secrets Management

- For the MVP, sensitive data handling is minimal as the application uses fabricated data and primarily runs locally.
- Any sensitive values (like production n8n webhook URLs if they were to include tokens) should **never** be committed to the main repository. They should be managed in local `.env` files that are git-ignored, or through secure environment variable management if/when the application moves beyond local MVP deployment.
- An `.env.example` file should be maintained in the repository with placeholder or non-sensitive default values to guide developers in setting up their local environments.

## 5. `.env.example`

An `.env.example` file should be created and maintained in the root of the project repository. It should list all available environment variables with placeholders or safe default values.

Example content for `.env.example`:

```env
# NDIS Incident Capture / Analysis Tool Environment Variables

# Set to 'live' to connect to actual n8n webhooks, or 'mock' to use local mock handlers.
VITE_N8N_MODE=mock

# URL for the n8n clarification webhook (only used if VITE_N8N_MODE is 'live')
# VITE_N8N_CLARIFICATION_URL=http://localhost:5678/your-clarification-webhook-path

# URL for the n8n analysis webhook (only used if VITE_N8N_MODE is 'live')
# VITE_N8N_ANALYSIS_URL=http://localhost:5678/your-analysis-webhook-path

# Application version (e.g., for populating versionInfo in exports)
# This can often be sourced from package.json during the build process instead.
VITE_APPLICATION_VERSION=0.1.0
```

## 6. Change Log

| Change        | Date       | Version | Description                                 | Author      |
| :------------ | :--------- | :------ | :------------------------------------------ | :---------- |
| Initial draft | 2025-06-05 | 0.1     | Initial draft based on project requirements | 3-architect |
