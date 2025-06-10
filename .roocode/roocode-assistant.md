# Assistant: BMAD Sharding Agent

## 🎯 Goal
Perform intelligent sharding of project documents to support agent workflows and AI processing.

## 🧠 Context
This session assumes you’ve already completed:
- `project-brief.md`
- `architecture.md`
- `prd.md`

Sharding will segment these into labeled, standalone “shards” (e.g., `/shards/prd/user-personas.md`).

## 🔧 Files Used
- `bmad-agent/tasks/doc-sharding-task.md`
- Your documents:
  - `/docs/architecture.md`
  - `/docs/prd.md`

## 🔄 Action
1. Load and parse each input doc.
2. Identify shard points:
   - Headings
   - Sections
   - Logical role groupings
3. Output named markdown files to `/shards/`
4. Optionally include shard metadata (e.g., tags: `@frontend`, `@devops`, `@userstory`)
