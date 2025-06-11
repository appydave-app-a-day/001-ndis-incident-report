## Environment Variables

This document outlines the environment variables required to run the application. These variables are used to configure the endpoints for the external N8N workflows.

A `.env` file should be created in the root of the project for local development, following the format of the example below.

### `.env.example`

```
# The full webhook URL for the N8N workflow that provides clarification questions.
VITE_N8N_CLARIFICATION_WEBHOOK_URL=""

# The full webhook URL for the N8N workflow that receives new question suggestions.
VITE_N8N_SUGGESTION_WEBHOOK_URL=""

# The full webhook URL for the N8N workflow that consolidates the narrative and clarification answers.
VITE_N8N_CONSOLIDATION_WEBHOOK_URL=""

# The full webhook URL for the N8N workflow that provides the final analysis.
VITE_N8N_ANALYSIS_WEBHOOK_URL=""
```
