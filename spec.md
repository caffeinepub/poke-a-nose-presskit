# Specification

## Summary
**Goal:** Fix the password gate to block access on the landing page, remove the "Trailer" header from the video section, and reorder the press kit sections.

**Planned changes:**
- Move the PasswordGateModal so it appears on the landing page (`/`) instead of the press kit page (`/press-kit`); the press kit content must not be visible while the modal is open
- If a user navigates directly to `/press-kit` without the sessionStorage verification flag, redirect them to `/` where the password gate is shown
- Remove the "Trailer" heading/label text from the video section on the press kit page
- Reorder press kit sections to: Game logo → YouTube video → About → Game Details → Features → Screenshots → Download all screenshots button → Socials → Press email

**User-visible outcome:** The password prompt now appears on the landing page before any press kit content is accessible; the video section no longer shows a "Trailer" header; and the press kit sections appear in the new specified order.
