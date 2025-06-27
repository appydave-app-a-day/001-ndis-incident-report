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
- **Tailwind CSS v4.1.8** - Major version with different class generation system than v3
- shadcn/ui components for consistent UI patterns
- Custom theme colors and spacing defined in `tailwind.config.js` and `index.css`
- **Important**: Uses CSS custom properties and `@layer components` for reliable styling

### Current Implementation Status
The project has completed Epic 1 (foundation), Epic 2 (wizard framework), Epic 3 Story 3.1 (wizard styling & visual polish), and Epic 4 (guided incident capture workflow). Epic 5 (AI-assisted report analysis workflow) is currently in progress. The application now features:

- **Professional App Shell** - Fixed sidebar navigation with clean typography and shadows
- **Enhanced Color Scheme** - Gray-based palette with blue accents for optimal contrast
- **Dark/Light Mode** - Complete theme switching with Settings modal
- **Modern UI Components** - Consistent styling across wizard, navigation, and content areas
- **Responsive Design** - Mobile-friendly layout with proper breakpoints
- **Complete Incident Capture Workflow** - Multi-step wizard for frontline workers
- **Partial Analysis Workflow** - Stories 5.1 & 5.2 implemented, 5.3 next to create

**Current Epic 5 Status:** Stories 5.1 ✅, 5.2 ✅, 5.3 next (Incident Type Classification), 5.4 & 5.5 planned in epic.

## BMAD Development Workflow

This project follows the **BMAD Method (Breakthrough Method of Agile (ai-driven) Development)** for structured AI-assisted development. When implementing stories, follow this 5-step iterative workflow:

### IMPORTANT: Story Creation vs Implementation
**When asked to "create a story":**
- ONLY create the story card documentation
- DO NOT implement the story code
- Present the story card to the user for review
- Wait for explicit approval before implementing

### 1. Write Story Card
- Create detailed story documentation in `docs/stories/{Epic}.{Story}.story.md`
- Use the story template with complete acceptance criteria and technical guidance
- Include specific implementation tasks and development context
- Story must be approved before proceeding to implementation
- **STOP HERE when asked to "create a story"**

### 2. Implement Story Card  
- **ONLY proceed with implementation when explicitly asked**
- Code implementation following the story's technical guidance and tasks
- Use existing project conventions and architectural patterns
- Implement all acceptance criteria and functional requirements
- Follow the project's coding standards and file structure

### 3. Complete Definition of Done (DOD) Checklist
- **CRITICAL**: Use the BMAD checklist process to mark story as complete
- Run the Story DOD Checklist (`bmad-agent/checklists/story-dod-checklist.md`) using the Checklist Run Task (`bmad-agent/tasks/checklist-run-task.md`)
- Go through all 57 checklist items systematically:
  - Requirements Met (functional requirements, acceptance criteria)
  - Coding Standards & Project Structure
  - Testing (unit tests, integration tests, manual verification)
  - Functionality & Verification
  - Story Administration
  - Dependencies, Build & Configuration
  - Documentation (if applicable)
- **Mark each item as [x] Done, [ ] Not Done, or [N/A] Not Applicable** in the story file
- Update story Definition of Done section with completed checklist
- Run linting and type checking: `npm run lint` and `npm run build`
- **NEVER mark a story as complete without completing the DOD checklist**

### 4. Write Commit Message
- Create descriptive commit message summarizing the story implementation
- Reference the story number and key changes made
- Include the standard Claude Code footer:
  ```
  🤖 Generated with [Claude Code](https://claude.ai/code)
  
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

### 5. Ask User About Commit
- Present the commit message to the user for approval
- Ask if they want to proceed with committing the changes
- Only commit when explicitly approved by the user
- After successful commit, proceed to create the next story

### Next Story Creation
- Identify the next logical story based on epic progression
- Create new story documentation following the same process
- Return to step 1 to begin the cycle again

### Key Guidelines
- **Never commit without explicit user approval**
- **Always create story documentation before implementing code**
- **Use the todo list to track progress within each story**
- **Follow the Definition of Done checklist rigorously**
- **Maintain clear separation between story planning and implementation phases**

## Tailwind CSS v4 Development Notes

### **Critical Information**
This project uses **Tailwind CSS v4.1.8**, which has significant differences from v3:

### **Class Generation Differences**
- **Issue**: Many standard color utility classes (`border-gray-200`, `bg-white`, `text-gray-900`) may not be generated automatically
- **Solution**: Use CSS custom properties with `hsl(var(--variable-name))` or add custom CSS in `@layer components`

### **Working Approach**
1. **For Components**: Use `@layer components` in `src/index.css` for reliable styling
2. **CSS Custom Properties**: Leverage existing variables like `--border`, `--background`, `--foreground`
3. **Utility Classes**: Stick to basic utilities that are reliably generated (`w-full`, `flex`, `grid`, etc.)

### **Example Pattern**
```css
/* In src/index.css */
@layer components {
  .custom-input {
    border: 2px solid hsl(var(--border));
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
```

### **Debugging Styling Issues**
1. Check if classes exist in `dist/assets/index-*.css` after build
2. Use browser dev tools to verify CSS custom properties are available
3. Consider adding explicit CSS rules for complex components

## Reference Design System

### **Source Location**
Reference implementation: `/Users/davidcruwys/videos/b54-single-app-ux-prompt/`

This reference system demonstrates proper styling patterns and serves as the design authority for UI components and layouts.

### **Key Reference Files**

#### **Global Styling**
- **`app/globals.css`** - Global CSS with proper CSS custom properties and @layer components
- **`tailwind.config.ts`** - Tailwind configuration with proper color schemes and utilities
- **`components.json`** - Component configuration

#### **Layout & Navigation**
- **`app/page.tsx`** - Main application layout with header, sidebar, and content areas
- **`components/sidebar.tsx`** - Professional sidebar with navigation buttons and settings
- **Header in page.tsx (lines 70-87)** - Proper header layout with ⌘K and Quick Search styling

#### **Core UI Components**
- **`components/ui/button.tsx`** - Button variants (ghost, outline, primary) with proper styling
- **`components/ui/card.tsx`** - Card components with shadow and border patterns
- **`components/ui/input.tsx`** - Input fields with focus states and proper borders
- **`components/ui/label.tsx`** - Label styling with proper typography

#### **Complex Components**
- **`components/form.tsx`** - Reference form implementation with proper spacing and layout
- **`components/wizard.tsx`** - Wizard component with navigation buttons
- **`components/command-palette.tsx`** - Command palette modal implementation
- **`components/settings-modal.tsx`** - Modal component patterns

### **When to Reference**
**Always check reference files when:**
- Implementing new UI components
- Fixing styling issues (especially with Tailwind v4)
- Creating layouts (header, sidebar, content areas)
- Working with buttons, forms, or navigation
- Setting up proper spacing and typography

### **Reference Patterns to Follow**
1. **Button Styling** - Use reference button.tsx for variant patterns
2. **Navigation** - Copy sidebar.tsx structure for consistent navigation
3. **Header Layout** - Follow page.tsx header (lines 70-87) for ⌘K and title positioning
4. **Form Layouts** - Use form.tsx spacing and card structure patterns
5. **CSS Approach** - Follow globals.css for @layer components and custom properties

### **Quick Reference Commands**
```bash
# View reference sidebar styling
Read /Users/davidcruwys/videos/b54-single-app-ux-prompt/components/sidebar.tsx

# Check reference button implementation  
Read /Users/davidcruwys/videos/b54-single-app-ux-prompt/components/ui/button.tsx

# See proper header layout
Read /Users/davidcruwys/videos/b54-single-app-ux-prompt/app/page.tsx

# Review global CSS patterns
Read /Users/davidcruwys/videos/b54-single-app-ux-prompt/app/globals.css
```