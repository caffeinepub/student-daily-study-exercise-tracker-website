# Specification

## Summary
**Goal:** Provide an authenticated student workspace to track daily study and exercise, review history, and see simple progress insights.

**Planned changes:**
- Add Internet Identity authentication with sign-in/sign-out and a personalized post-login dashboard; scope all backend reads/writes to the authenticated principal.
- Implement backend persistence and CRUD for per-user daily logs keyed by date, containing multiple study entries and exercise entries with done/undone status and basic details.
- Build the dashboard UI with Study and Exercise sections to add, edit, delete, and toggle completion for today’s items with immediate UI updates.
- Add a history/calendar view to browse days with logs, view a selected day’s items, and copy unfinished items into today without creating duplicates on repeated copies.
- Add progress insights: weekly completed/total summaries for Study and Exercise and a streak counter based on consecutive days with at least one completed item.
- Apply a consistent, accessible visual theme across pages (avoiding blue/purple as the primary palette).
- Add generated static images under `frontend/public/assets/generated` and render at least one in a visible UI area (e.g., header or sign-in screen).

**User-visible outcome:** Students can sign in with Internet Identity, manage today’s study and exercise checklist, browse and reuse past incomplete items, and view weekly completion and streak stats within a consistently themed UI.
