# Specification

## Summary
**Goal:** Fix the duplicate header rendering so the Header component appears exactly once per page view.

**Planned changes:**
- Audit all layout components, route wrappers, and `App.tsx` to identify where the Header component is being rendered more than once
- Remove the duplicate Header instance so it renders exactly once on `/` and `/press-kit`, while remaining hidden on `/admin`

**User-visible outcome:** The site header (with the Press Kit navigation link and dark/light mode toggle) appears only once on every page.
