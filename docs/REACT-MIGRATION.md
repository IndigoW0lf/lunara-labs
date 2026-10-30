# React migration plan

Decision recorded: October 30, 2026.

**Status:** approved direction; scope and acceptance criteria documented. Browser regression tests and runtime migration are pending. The working app remains vanilla JavaScript with no npm dependencies.

## Why this change

The current prototype has two working activities. `dist/app.mjs` combines routing, screen rendering, event handlers, clocks, browser saving, and exports. The planned collection adds movable evidence, animation, media timelines, and branching interactions. React components can share interface patterns across those labs; TypeScript can make authored definitions, activity state, and result boundaries explicit. Vite will provide the development/build pipeline while keeping the deployed app static.

The tradeoff is a dependency graph and build step that the prototype does not currently require. The refactor must earn that added complexity through clearer ownership of state and reusable interactions. It does not by itself establish accessibility, improve learning outcomes, or require a backend.

## Delivery sequence

| Milestone | Current status | Completion evidence |
| --- | --- | --- |
| Scope and migration decision | Documented | README, roadmap, and this plan agree on the target and current implementation. |
| Existing behavior baseline | Pending | Repeatable browser flows cover both labs at desktop and narrow widths using synthetic attempts and controlled timing. |
| React/TypeScript/Vite tooling | Pending | Reproducible install with lockfile, type checking, production build, preview, updated CI and contributor commands. |
| Shared shell and Rumor migration | Pending | Existing hash routes, transcripts, narration cancellation, source navigation, notes, print/export, and reload behavior pass regression checks. |
| Attention migration | Pending | Both conditions, timed/untimed modes, cue schedule, pause/recovery, stopping markers, scoring, and exports pass controlled-clock checks. |
| Default-app cutover | Pending | Production build passes equivalent browser flows; saved attempt fixtures restore; documentation and serving/security configuration match the built app. |
| Evidence Workbench | Pending | A complete new activity supports card movement, keyboard/touch alternatives, source connections, undo, reasoning feedback, and saved board state. |
| Reviewer walkthrough | Pending | Screenshots and a short walkthrough show the actual working version, with planned features labeled separately. |

## Proposed module boundaries

These paths are a target, not directories already implemented.

- `src/app/`: application shell, lab catalog, hash-route handling, shared navigation, and top-level error handling.
- `src/labs/rumor/` and `src/labs/attention/`: lab-specific screens, typed state transitions, and controllers.
- `src/components/`: shared narration controls, activity navigation, reflection inputs, and field-note layouts extracted from real use.
- `src/domain/`: framework-independent content schemas, scoring, progress restoration, and result serialization.
- `src/platform/`: browser storage, audio, downloads, print, and clock adapters.
- `public/assets/`: bundled illustrations, fonts, and locked narration, retaining their notices and hashes.
- `tests/`: existing domain/audio checks plus browser regression flows and synthetic legacy-attempt fixtures.

Decide the final layout when introducing the build. The current `dist/` directory is checked-in source; it must not accidentally become disposable build output before its source and assets have been relocated and verified.

Keep scoring and result functions independent of React. Use explicit state transitions for timed rounds and cleanup for timers, event subscriptions, and narration. Rendering must not restart a round, duplicate notifications, or replay audio. Avoid creating a generic activity framework before the migrated labs and first workbench show which pieces should be shared.

## Preservation requirements

- Keep the exact teaching messages, matched search passages, explanation text, artwork, and selected voices unless a separate content change is requested.
- Preserve the seven approved audio files, Jo +1 semitone, Ari +3 semitones, shared 1.05x playback, transcripts, and the single About disclosure. Retain the voice lock and integrity tests.
- Preserve existing hash links and supported saved-attempt formats. Read synthetic fixtures from earlier versions without silently resetting answers or replacing original attempt identity.
- Recover interrupted running rounds paused. Preserve elapsed time, conditions, notifications, stopping points, and recorded participation.
- Keep whole-passage counts out of 85 separate from checked-part accuracy. Unknown stopping points must leave that accuracy unknown.
- Keep browser saving, JSON downloads, and printing local. Preserve useful recovery behavior when storage is unavailable.
- Maintain keyboard focus, accessible labels/status updates, reduced-motion behavior, touch controls, and equivalent access to every new movement interaction.
- Keep bundled assets and the browser app free of analytics, external fonts, runtime AI calls, and customer-service connections. New npm tooling is for development/building; it must not introduce browser data flows.
- Preserve software/content license boundaries and required font notices.

## Verification and cutover

Before changing runtime code, add browser baselines for a Rumor attempt and both Attention rounds. Exercise pause, reload, notification return, uncertain stopping, field notes, and exports with synthetic data. Control the clock so checks do not depend on waiting through real rounds. Record accessibility findings separately from automated checks; passing automation is not a screen-reader review or learner trial.

During each migration slice, run the existing domain/audio checks, the relevant browser flows, type checking, and the production build once those commands exist. Check the built output as well as the development server. Review static asset paths, the preview server boundary, content security policy, and privacy guard so the new layout does not weaken existing protections or give a false assurance by scanning only obsolete files.

Switch the default app only after both labs meet the preservation requirements. Update README setup steps, architecture notes, AGENTS.md, CLAUDE.md, scripts, and CI in the same tooling/cutover changes as applicable. A previous Git revision remains available for rollback. Do not describe this migration as shipped until the default runnable app uses the new stack and its evidence is recorded.

Public hosting/domain connection, real Quest persistence, learner trials, and final digital content review remain separate milestones. No printed curriculum or buyer file changes are part of this refactor.
