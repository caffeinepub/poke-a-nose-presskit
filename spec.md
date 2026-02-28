# Specification

## Summary
**Goal:** Reduce the landing page game logo size and add an admin-editable YouTube link field to the CMS, wiring it through to the press kit video section.

**Planned changes:**
- Reduce the game logo (`gamelogo.png`) max-width on desktop to the 480px–560px range on the landing page (`/`), while keeping it responsive with `max-width: 100%` and auto height on smaller screens; preserve the dark mode inversion filter
- Add a stable `youtubeLink` variable to `backend/main.mo` initialized to `'https://youtu.be/5in-hIASH08'`, include it in `getContent()`, and add an admin-only `updateYoutubeLink(link: Text)` method
- Add a `useUpdateYoutubeLink` mutation to `frontend/src/hooks/useQueries.ts`
- Add a "YouTube Link" text input field with a Save button to the Admin Dashboard (`/admin`) CMS section, pre-populated from `getContent()`, calling `updateYoutubeLink()` on save and refetching content afterward with success/error feedback
- Update the `VideoSection` component on `/press-kit` to use `youtubeLink` from the content query instead of a hardcoded URL, with a graceful fallback if the value is empty

**User-visible outcome:** The landing page logo appears noticeably smaller on desktop. Admins can edit the YouTube video link via the CMS dashboard, and the press kit video section immediately reflects the updated link.
