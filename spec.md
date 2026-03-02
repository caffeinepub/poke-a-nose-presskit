# Specification

## Summary
**Goal:** Fix three broken features in the PokeANose Press Kit app: the admin Internet Identity login "Unverified origin" error, missing text content on the press kit page, and the non-functional password gate dialog.

**Planned changes:**
- Fix the `/admin` Internet Identity login by correcting the `derivationOrigin` and II provider URL (`https://identity.ic0.app`) so the login flow completes without an "Unverified origin" error in the deployed environment
- Fix the press kit page text content (about text, features list, game details, social links) by ensuring the anonymous actor is properly initialized for public reads and that React Query hooks correctly fetch and pass text data to child components
- Fix the `PasswordGateModal` by ensuring the anonymous actor is correctly used when calling `verifyPassword`, that session storage is updated on success, and that the modal dismisses properly or shows an error on failure

**User-visible outcome:** Admin users can log in via Internet Identity without errors; press kit visitors see all CMS text content alongside images; and the password gate correctly blocks and grants access based on the entered password.
