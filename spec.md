# Specification

## Summary
**Goal:** Fix the admin authentication pipeline so that authenticated Internet Identity principals are correctly wired through the frontend actor and properly verified in the backend authorization check.

**Planned changes:**
- Update `useActor.ts` to always re-create the ICP actor with the authenticated identity after Internet Identity login, invalidating any cached anonymous-identity actor
- Ensure all CMS mutation calls in `useQueries.ts` use the authenticated actor instance
- Fix the `isAdmin()` function in `backend/main.mo` to correctly unwrap the `?Principal` option type before comparing to `msg.caller`
- Verify all admin-only update methods (`updateAbout`, `updateFeatures`, `updateGameDetails`, `updateInstagram`, `updateDeveloperWebsite`, `updatePressEmail`, `updateBodyTextColor`, `enablePasswordProtection`, `disablePasswordProtection`) use the corrected authorization check

**User-visible outcome:** After logging in via Internet Identity on `/admin`, all CMS update actions succeed for the registered admin principal and are correctly rejected for non-admin principals.
