# Specification

## Summary
**Goal:** Add an embeddable iframe feature to the PokeANose Press Kit site, managed via the admin CMS and displayed on the press kit page.

**Planned changes:**
- Add a `iframeSrc` stable variable to the backend, include it in `getContent()`, and add an admin-only `updateIframeSrc(src: Text)` method
- Add an "Iframe URL" text input with a Save button to the Admin Dashboard CMS panel, backed by a `useUpdateIframeSrc` mutation hook
- Render a responsive 16:9 borderless `<iframe>` on the Press Kit page between the Video Section and the About the Game section, only when `iframeSrc` is non-empty

**User-visible outcome:** Admins can set an iframe URL from the admin dashboard, and visitors to the press kit page will see the embedded iframe displayed between the video and about sections.
