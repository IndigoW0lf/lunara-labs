# Development roadmap

These are genuine next steps for the existing prototype. They can be developed with invented content and synthetic local attempts.

## 1. Complete the responsive and accessibility pass

Exercise both complete activities on narrow screens, landscape layouts, keyboard-only input, and a screen reader. Check task focus after notifications, passage navigation, accessible timer/status updates, reduced motion, and touch target sizes. Record reproducible findings and fix them without altering the learning sources or selected audio.

## 2. Add repeatable browser flow checks

Automate a Rumor attempt and both Attention rounds, including pause/reload, returning from a notification, uncertain stopping points, notes, and export. Use deterministic clock controls and synthetic responses. Cover at least a desktop and narrow viewport.

## 3. Separate the activity controller from screen rendering

Break the large `app.mjs` into smaller lab/state/view modules while preserving existing attempt versions, scoring behavior, routes, and visible teaching language. Existing domain tests and browser-flow evidence should still pass after the refactor.

## 4. Support multiple local attempts

Design an attempt library using local opaque IDs and optional non-identifying labels. Let a user start a new attempt without overwriting earlier work. Include migration, deletion, storage-failure, and export behavior. Real learner identities or server data are not required.

## 5. Build a reusable lab definition and validation layer

Make stable IDs, content versions, required fields, narration references, source graphs, and result schemas explicit. Add clear validation failures for incomplete or inconsistent authored content, with a preview using invented examples.

## 6. Improve field-note output

Review print pagination, headings, table descriptions, and long response wrapping. Add a local import preview for versioned results with clear validation and no automatic upload. Test partial and legacy attempts.

## 7. Prototype the host boundary locally

Build a mock launch/result adapter with version validation, idempotent completion, explicit acknowledgements, failure/retry states, and preserved local work. Keep authentication and real Quest/database connections out of this prototype.

## 8. Prepare a release from evidence

Conduct a learner tryout, resolve observed reading/interaction issues, complete the digital content review, and verify stable standalone links. Domain setup, customer access policy, and real Quest persistence are separate release decisions.
