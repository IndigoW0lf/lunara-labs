# Development roadmap

These are genuine next steps for the existing prototype. They can be developed with invented content and synthetic local attempts.

The broader [lab development plan](LAB-DEVELOPMENT-PLAN.md) describes the proposed investigations, physical learning connections, interaction patterns, and engineering challenges. Its candidate labs are planned work; Rumor Grow, Attention Trap, and the first Evidence Workbench courtyard case are implemented today.

## React migration complete

All routes now use React + TypeScript + Vite. The [migration record](REACT-MIGRATION.md) documents meaningful commits, preserved behavior, browser coverage and source/output boundaries. Existing catalog and activity behavior is implemented; manual accessibility/learner reviews remain separate.

## Next implementation milestones

The November 4 storage milestone consolidates the three independent write paths, protects unsupported/unreadable envelopes, adds observed-change conflict handling and immediate local backups. The [recovery contract](SAVED-PROGRESS.md) distinguishes that protection from transactional concurrency and backup import, which remain planned.

| Priority | Scoped change | Acceptance evidence |
| --- | --- | --- |
| Next | Attempt library and explicit backup restoration | Use local opaque attempt IDs, preserve existing single-attempt keys during migration, and add preview/validation before import. Starting, deleting and restoring an attempt must not replace unrelated work. Choose transactional IndexedDB storage or an explicit serialization mechanism before claiming simultaneous-write safety. |
| Next new lab | Rook’s first delivery map | Read the exact current curriculum source and agree a bounded map/command vocabulary. Keep the route model pure and deterministic; reject blocked/out-of-map moves. Supply keyboard/menu ordering before pointer polish, step/pause/reset, reduced-motion equivalence, reload recovery and fixture-based tests. |
| Review track | Real-device, assistive-technology and learner feedback | Record device/input, reproduction steps and observed results. Resolve focus/reading issues without treating Chromium automation as a screen-reader or learner trial. |
| Maintenance | Focused screen extraction and hooks lint | Extract only independently meaningful behavior, preserve lab-specific rules, and add compatible lint without overriding peer dependency ranges. Existing voice, scoring, legacy state and timer checks remain release requirements. |
| Following labs | Moonlight Model, then observation media | Validate scientific relationships against the source lesson; keep simulation separate from animation. Bundle original clips with captions/transcripts and define seeking/replay/recovery before adding timeline notes. |

Deliver each meaningful feature or behavior change with its tests and documentation in one coherent commit. Keep purely mechanical formatting separate when needed; do not create cosmetic commits to inflate history.

## Suggested delivery order

1. Complete the existing labs' usability/accessibility checks and establish repeatable browser-flow tests.
2. Maintain the completed React foundation and regression checks while refining any observed usability findings.
3. Refine the implemented **Evidence Workbench** courtyard slice from review: card movement, source connections, undo/saved board state, authored feedback, and field notes are present; additional cases remain planned.
4. Add **Rook's Delivery Routes** and **Moonlight Model** to exercise command sequencing and spatial animation. Extract shared interaction/state components from real implementation needs.
5. Add the media layer through **Memory Scene Studio** and **Video Observation Station**, with local assets, captions, pause/seek behavior, and timeline observations.
6. Extend into particle models, branching habitats/group decisions, field observations, and later adult scenarios as source lessons and learner feedback support them.

For each lab, agree the source lesson and learning goal, build a complete small experience, test its access/data boundaries, then refine from actual use. Release/access and real Quest persistence remain separate decisions. The engineering tracks below support that sequence rather than implying every platform feature must be built before a new lab can start.

## 1. Complete the responsive and accessibility pass

Automated desktop/narrow Chromium flows already cover all three activities, keyboard/menu placement, timer recovery and saving failures. The next review is manual: exercise all three activities on real devices, landscape layouts, keyboard-only input, and a screen reader. Check task focus after notifications, passage navigation, accessible timer/status updates, reduced motion, and touch target sizes. Record reproducible findings and fix them without altering the learning sources or selected audio.

## 2. Add repeatable browser flow checks

Implemented: repeatable Rumor, Attention and Evidence flows against development and production, with desktop/narrow viewports, synthetic responses, deterministic clocks, notes and exports. Extend this suite with each new behavior; do not list the existing automation as unstarted work. New persistence checks cover unknown versions, unreadable backups, independent tab work and guarded clock/route writes.

## 3. Separate the activity controller from screen rendering

Completed: React screens and typed lab controllers replace the old activity controller, as recorded in the [migration record](REACT-MIGRATION.md). Preserve existing attempt versions, scoring behavior, routes, and visible teaching language. Existing domain tests and browser-flow evidence must still pass after the refactor.

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
