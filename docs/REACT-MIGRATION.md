# React migration record

Migration completed: October 30, 2026. All routes now use React + TypeScript + Vite. This records software conversion; separate learner, accessibility and release reviews remain pending.

## Completed milestones

| Milestone | Result |
| --- | --- |
| Plan and acceptance criteria | Documented before runtime changes. |
| Browser baseline | Six desktop/narrow cases passed on the original prototype. |
| React shell/tooling | Strict TypeScript for new source, reproducible install, Vite build, static preview and CI. |
| Rumor | React screens, typed transitions, preserved saved identity/history, safe text rendering, focus, narration and local export. |
| Attention | Typed round transitions, elapsed clock independent of rendering, visibility/route/reload recovery, keyboard passage controls, sandbox and unchanged scoring. |
| Catalog and About | React screens, restored progress labels without storage writes, original explanatory copy and disclosure, anchor/heading focus, and fallback routes. |
| Controller retirement | Removed old controller, template renderers and standalone entry. Prior revisions preserve the prototype history. |
| Source/output separation | Executable source in src/, resources in public/, generated output in ignored build/. |
| Production boundary | Build checks local entry files, approved audio and font notices, and rejects raw source modules in output. |

## Commit history

- `953192a`: migration plan.
- `0471d05`: baseline browser coverage.
- `0ec9c71` and `7f1bd4e`: React shell, tooling and portable preview.
- `3f38daf`: Rumor conversion.
- `68de3d0`: supplied prototype screenshot gallery.
- `b89db78`: Attention conversion.
- Final cutover: catalog/About conversion, controller retirement and source/resource relocation, verified by the repository CI before promotion to main.

Each implementation milestone was built and checked before promotion. The suite now has sixteen desktop/narrow browser cases, run against development and production, plus twenty domain/audio/preview checks. The production build validates assets and output boundaries. The existing narration generator also successfully reuses all seven approved clips from the new paths without an API key or network generation.

## Preservation requirements retained

The exact case texts, matched search passages, scoring/result helpers, selected voice recordings, illustration/font bytes and current storage keys remain. Supported older attempts retain their activity version, responses and history. Whole-passage counts out of 85 remain separate from checked-part accuracy; an unknown stopping point still leaves that accuracy unknown. Reloaded running rounds recover paused. Printing and result downloads stay local; no learner account, backend, tracker or runtime AI call was introduced.

The cast lock, Jo +1 semitone, Ari +3 semitones, shared 1.05x playback, visible transcripts and single About disclosure remain. Software/content license boundaries and font notices are retained; scope documentation follows the relocated files.

## Remaining reviews and development

- Manual visual, screen-reader and broader device checks; automated narrow-width tests do not replace these.
- Learner tryout and final digital content review.
- Evidence Workbench with accessible card movement, equivalent keyboard/touch controls, source connections, undo and saved board state.
- Public hosting/domain setup and real Quest persistence, as separately authorized release/integration work.

The managed cloud-browser preview was unavailable during the earlier migration; no separate manual review or private hosted deployment approval is inferred from CI. The original private Site remains on its prior version. No printed curriculum, buyer file or print release gate was changed.
