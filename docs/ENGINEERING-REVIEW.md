# Engineering review after the first Evidence Workbench case

This pass reviewed the three lab controllers, saved-attempt boundaries, evidence movement lifecycle, shared shell, audio cancellation, static preview boundary, and verification tooling. It is a bounded software review, not a claim of an exhaustive security audit or completion of learner/accessibility review.

## Findings and corrections

| Priority | Reproducible trigger and consequence | Correction and reason |
| --- | --- | --- |
| High | A supported Rumor save with `visited: null`, or an Attention round missing `selected`, reaches rendering and throws on `.includes()`. A TypeScript return annotation had treated unchecked JSON as a valid state. | Validate known fields at the lab boundary, repair invalid fields individually, and keep valid notes and the original attempt version. Catalog status uses the same restoration path. JSON parsing and static typing do not validate persisted data. |
| Medium | A completed Evidence board reopened for revision retained `complete: true` after placement changes or undo. A saved step could also skip the board prerequisites. | Moves/undo revoke completion and checked feedback. One pure prerequisite predicate is shared by the finish action and button; restoration returns inconsistent progress to a reachable stage. Completion still records participation, not mastery. |
| Medium | The drag hook handled pointer-up/cancel but not lost capture, Escape, window blur, hidden tabs or leaving the board while the lab stayed mounted. Its animation loop could survive an interrupted gesture. | Capture and auto-scroll have an explicit owner and release path, with cleanup when the board deactivates or unmounts. Interrupted gestures never commit placement. A failed capture falls back to the existing destination menus. |
| Low | The privacy dialog had a visible heading without a programmatic dialog name. | Associate the dialog with its heading and assert the accessible name in browser checks. |
| Maintainability | Compressed JSX, reducers and tests concealed branches and cleanup in long lines. No formatter enforced consistency, and typed reducers had no direct unit tests. | Keep the mechanical formatting commit separate from behavior changes. Pin Prettier, check formatting in CI, enable unused-symbol checks, and use a development-only tsx loader to exercise typed state directly. |

## Decisions that matter

- Preserve the original lab version on legacy attempts. Normalization is not permission to reset a learner's valid response or replace its identity with the current interface version.
- For legacy Attention records, preserve a valid stopping point held in `score.lastChecked`, numeric effort stored as a string, and all four one-based notification IDs. Recalculate derived scores from validated marks; uncertain stopping points still have no checked-part accuracy.
- Test negative paths, not only successful clicks: malformed fields, invalid reducer inputs, completion invalidation and interrupted gestures. The keyboard placement flow now uses actual key presses rather than relying entirely on `selectOption`.
- Avoid incidental architecture changes. Four evidence records do not justify a global state library, a generic workflow engine, or per-card memoization. Existing pure domain rules and browser-local storage remain appropriate for this slice.
- Do not force an incompatible toolchain. The evaluated TypeScript ESLint package declared support below this repository's TypeScript version; it was not added and no peer-dependency override was used. Formatting/type checks are enforced; a compatible hooks-aware lint setup remains a follow-up rather than a claimed check.
- No narration regeneration, source lesson revision, new runtime dependency, remote data flow, or hosted deployment is part of this review.

## Verification and remaining scope

32 core tests include typed-state recovery, legacy preservation, reducer phase/index guards, completion invalidation and the existing scoring/audio/static-preview checks. 34 Chromium browser cases cover desktop and narrow widths against development and production, including malformed-storage recovery/export, real keyboard placement, mouse/touch movement, capture loss, Escape, blur, board deactivation and dialog naming. All use synthetic responses. Promotion requires the exact final commit to pass CI.

Manual screen-reader/real-device review, learner feedback and final digital content review are still pending. Remaining engineering candidates include write protection for unsupported future storage schemas, multi-tab conflict handling, smaller screen components where they acquire independent behavior, and a compatible hooks-aware lint configuration. They are not represented as completed fixes or as observed defects in current supported attempts.
