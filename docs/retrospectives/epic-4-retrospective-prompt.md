# Epic 4 Retrospective Analysis Prompt

## Context for AI Assistant

You are conducting a retrospective analysis on Epic 4: Guided Incident Capture Workflow from the NDIS Incident Report application. This epic implemented a multi-step wizard for frontline workers to capture incident data with AI-enhanced narrative consolidation.

## Retrospective Objective

Analyze the complete Epic 4 journey to identify:
1. **Process Improvements**: How to better plan and execute future epics
2. **Requirements Analysis**: How to create more accurate initial requirements
3. **Technical Insights**: Architectural and implementation lessons learned
4. **BMAD Method Refinement**: Improvements to the Breakthrough Method of Agile Development workflow

## Analysis Instructions

### Phase 1: Data Gathering

#### Git-Based Analysis
Execute these commands to understand the full scope:

```bash
# Find Epic 4 commits
git log --oneline --grep="Epic 4" --grep="Story 4" --all-match
git log --oneline --grep="feat.*Epic 4" --grep="feat.*Story 4"

# Get the full Epic 4 commit range
git log --oneline --since="[START_DATE]" --until="[END_DATE]" --grep="Epic\|Story"

# Compare codebase from Epic 4 start to completion
git diff [FIRST_EPIC_4_COMMIT] HEAD --stat
git diff [FIRST_EPIC_4_COMMIT] HEAD --name-status

# Analyze file changes over time
git log --name-status --oneline [FIRST_EPIC_4_COMMIT]..HEAD
```

#### Documentation Analysis
Review these key files:
- `docs/epic-4.md` - Epic overview and story definitions
- `docs/stories/4.*.story.md` - Individual story documentation
- `CLAUDE.md` - Project context and development workflow
- All commit messages from Epic 4 period

#### Codebase Evolution Analysis
Compare the "before" and "after" state:

```bash
# Checkout Epic 4 starting point
git checkout -b retrospective-start [FIRST_EPIC_4_COMMIT]
# Analyze initial structure, then return to current state
git checkout main
```

Analyze:
- Component architecture evolution
- File/folder structure changes
- Code complexity growth
- User experience flow development

### Phase 2: Key Retrospective Questions

#### Story Planning & Execution
1. **Story Granularity**: Were stories appropriately sized? Which were too large/small?
2. **Acceptance Criteria Accuracy**: How often did acceptance criteria change during implementation?
3. **Story Dependencies**: Which dependencies were missed in initial planning?
4. **Story Sequencing**: Analyze the 4.12/4.13 story swap - what caused this reordering?
5. **Scope Evolution**: What features/requirements emerged that weren't initially planned?

#### Technical Architecture
1. **Architectural Decisions**: What major technical patterns emerged vs. were planned?
2. **Component Design**: How did the wizard framework evolve? Was it flexible enough?
3. **State Management**: How effective was the Zustand store design for this workflow?
4. **API Integration**: How well did the mock/live mode approach work?
5. **Progressive Enhancement**: Was the progressive narrative consolidation approach effective?

#### Requirements & Planning
1. **Initial Requirements**: What was unclear in the original Epic 4 definition?
2. **User Journey Mapping**: Which user scenarios were missed initially?
3. **Technical Constraints**: What technical realities weren't factored into planning?
4. **Integration Complexity**: Where did component interactions create unexpected work?

#### BMAD Process Analysis
1. **Story Creation**: How effective was the "create story first, implement after approval" approach?
2. **Definition of Done**: Were DoD checklists comprehensive enough?
3. **Iterative Development**: How well did the 5-step BMAD cycle work?
4. **Documentation**: Was story documentation detailed enough for implementation?

#### Code Quality & Maintainability
1. **Technical Debt**: What shortcuts were taken that might need addressing?
2. **Testing**: How comprehensive was testing coverage? (Note: This project had limited testing)
3. **Code Reusability**: How well were components designed for reuse?
4. **Performance**: Were there any performance considerations missed?

### Phase 3: Retrospective Structure

Organize your analysis into these sections:

#### Executive Summary
- Epic 4 scope: original vs. final
- Key metrics: stories completed, timeline, code changes
- Overall success assessment

#### What Went Well (Successes)
- Effective processes and decisions
- Technical solutions that worked well
- Planning approaches that were accurate
- Successful adaptations to changing requirements

#### What Could Be Improved (Challenges)
- Planning gaps and assumption failures
- Technical decisions that created complexity
- Process inefficiencies
- Requirements that were unclear or incomplete

#### Specific Insights

##### Story Planning Improvements
- How to better scope stories
- How to identify dependencies earlier
- How to create more accurate acceptance criteria

##### Requirements Analysis Improvements
- How to structure initial epic requirements to reduce changes
- What questions to ask upfront to avoid scope creep
- How to better map user journeys initially

##### Technical Architecture Lessons
- Architectural patterns that emerged and should be standardized
- Component design principles for wizard frameworks
- State management approaches for complex workflows

##### BMAD Process Refinements
- Improvements to story templates
- Better Definition of Done checklists
- More effective planning techniques

#### Action Items & Recommendations

##### For Future Epics
1. **Planning Phase**: Specific improvements to epic and story planning
2. **Requirements**: Better initial requirements gathering techniques
3. **Architecture**: Technical patterns to establish upfront

##### For This Codebase
1. **Technical Debt**: Issues to address in future iterations
2. **Documentation**: Areas needing better documentation
3. **Refactoring**: Opportunities for code improvement

##### For BMAD Method
1. **Process Updates**: Specific workflow improvements
2. **Template Updates**: Enhanced story and epic templates
3. **Quality Gates**: Additional checkpoints for better outcomes

## Analysis Focus Areas

Pay special attention to these Epic 4 specific areas:

### Major Scope Changes
- Progressive narrative consolidation vs. original batch processing design
- Story sequence changes (4.12/4.13 swap and rationale)
- Additional components that emerged during implementation

### Technical Complexity Points
- Wizard framework flexibility and reusability
- State management for multi-step workflows with AI integration
- Error handling and retry mechanisms for API failures
- Progressive enhancement UX patterns

### User Experience Evolution
- How the final user journey compares to initially planned flow
- Which UI/UX patterns emerged during implementation
- How AI enhancement showcase evolved in the review step

### Integration Challenges
- Mock vs. live mode API switching effectiveness
- N8N integration complexity and lessons learned
- Component communication patterns that worked/didn't work

## Deliverable Structure

Create a comprehensive retrospective document with:
1. **Executive Summary** (1-2 pages)
2. **Detailed Analysis** by category (3-4 pages)
3. **Specific Recommendations** with actionable items (1-2 pages)
4. **Appendices** with supporting data/code examples

## Success Criteria for Retrospective

A successful retrospective should provide:
- Clear, actionable recommendations for future epic planning
- Specific technical patterns to adopt/avoid
- Improved BMAD process guidelines
- Better requirements gathering approaches
- Measurable improvements for next epic execution

---

**Note**: This retrospective should be conducted after Epic 4 is fully complete, ideally in a fresh context window to ensure objective analysis of the complete journey.