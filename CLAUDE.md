# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build, Run, and Development
- `npm run dev` - Start the development server (Vite)
- `npm run build` - Build the production bundle (TypeScript check + Vite build)
- `npm run preview` - Preview the production build locally

### Code Quality
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Automatically fix ESLint issues where possible
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

## High-Level Architecture

### Application Type
This is a front-end-only React SPA (Single Page Application) built with Vite and TypeScript. It's designed as a demonstration MVP for NDIS incident reporting with no backend or database.

### Core Architectural Components

1. **Wizard Framework** - The application revolves around a reusable wizard component that manages multi-step workflows:
   - Located in `src/components/wizard/`
   - Uses Zustand for state management (`useWizardStore.ts`)
   - Provides navigation controls, progress indicators, and step management

2. **Two Main Workflows**:
   - **Incident Capture** (`/capture`) - Multi-step wizard for frontline workers to report incidents
   - **Incident Analysis** (`/analysis`) - Secondary workflow for team leads to analyze reports

3. **Routing Structure**:
   - Uses React Router with nested routes
   - Main app layout (`AppLayout`) provides persistent navigation
   - Workflow components are rendered within the layout

4. **State Management**:
   - Zustand is used for global state management
   - Will manage Mock/Live mode toggle, selected scenarios, and workflow states

5. **API Integration Design**:
   - Service layer pattern in `src/lib/services/`
   - Supports both Live Mode (real N8N API calls) and Mock Mode (local JSON data)
   - Mock data scenarios stored in `src/lib/mock-data/`

### Key Design Patterns

- **Component-Based Architecture** - Reusable UI components in `src/components/ui/`
- **Feature-Based Organization** - Each workflow lives in `src/features/`
- **Absolute Imports** - Uses `@/` alias for `src/` directory
- **TypeScript Strict Mode** - Enforces type safety throughout

### UI Framework
- Uses Tailwind CSS with custom design tokens
- shadcn/ui components for consistent UI patterns
- Custom theme colors and spacing defined in `tailwind.config.js` and `index.css`

### Current Implementation Status
The project has completed Epic 1 (foundation), Epic 2 (wizard framework), and Epic 3 Story 3.1 (wizard styling & visual polish). The application now features a professional design system with:

- **Professional App Shell** - Fixed sidebar navigation with clean typography and shadows
- **Enhanced Color Scheme** - Gray-based palette with blue accents for optimal contrast
- **Dark/Light Mode** - Complete theme switching with Settings modal
- **Modern UI Components** - Consistent styling across wizard, navigation, and content areas
- **Responsive Design** - Mobile-friendly layout with proper breakpoints

The wizard framework is fully functional with professional styling. Ready to begin Epic 4 (guided incident capture workflow) implementation.