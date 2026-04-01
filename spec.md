# Specification

## Summary
**Goal:** Fix the Press Kit page so it is fully scrollable and the scrollbar is visible.

**Planned changes:**
- Remove or override any CSS (`overflow:hidden`, `overflow:clip`, or similar) on the `/press-kit` route's root container and any wrapping parent elements that suppresses vertical scrolling.
- Ensure the page body and root container allow vertical scroll on the `/press-kit` route without affecting the `/` or `/admin` routes.

**User-visible outcome:** Users can scroll through the entire Press Kit page and see a browser scrollbar, giving access to all sections including logo, video, about, game details, features, screenshots, download button, socials, and press email.
