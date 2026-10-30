# Evidence Workbench: first investigation

## Source and scope

The first slice adapts the courtyard case from The Evidence Trail — How Do You Know?, learner pages 27–28 and Parent & Teaching Guide page 10, r18 review edition. The actual pages were inspected before authoring. This digital activity is a separate adaptation; it neither replaces the printable nor establishes approval of its review edition. It adds no real research findings or learner records.

The source gives A: maintenance readings 74°F/82°F on October 1, 2026 at noon; B: an October 3 newsletter reprinting A without new measurements; C: separate learner-club readings 76°F/84°F on October 2 at noon; D: a 2014 greenhouse seedling-growth report without courtyard air-temperature readings. A/C describe separate checked sensors in radiation shields, at matching heights/locations, with paired temperatures taken at the same time. The source does not explain the sensor checks. The shaded reading is 8°F lower on each recorded day.

## Learning design

Audience/readiness: a learner who can read the short records or discuss them with someone reading aloud, connect a statement to the supplied details, and explain a next check. Writing can be scribed or replaced by an explicit oral-response option. This is an editorial readiness description, not a validated age rating.

The goal is to connect a specific claim to relevant records, follow repeated information back to its source, and keep a conclusion within the times/setting actually described. No device accounts, outside source search, physical measurement experiment, or extra supplies are required. Optional scraps of paper provide a table-based transfer activity. No activity duration or tested learner outcome is claimed.

Sequence: orient with claim/source/evidence definitions and an initial thought; arrange all four records; inspect their source paths; compare authored feedback; revise the board if useful; explain a conclusion and a next check; print/download local field notes. Pause after the first arrangement if useful; the board and undo history persist. The separate in-app Parent & Teaching Guide gives practical preparation, pacing, source disclosure, all worked placements, open-response criteria, hints and an optional physical connection.

Worked reasoning: A/C belong beside the narrow claim about these two days. B can accompany that claim as a repeated report, with the visible B → A trail showing why it is not an additional independent measurement set. D answers a different question; age alone is not the reason to set it aside. None of the records establishes that shade lowers temperature in every courtyard at every time or that shade alone caused all observed differences. Open explanations should cite source letters, the readings/difference, the repeated source and a meaningful broader check; wording can vary. The learner sees feedback only after making an arrangement. Open explanations receive no automatic mastery score.

## Engineering slice

- Pure versioned board model: validated IDs/placements, bounded persisted undo history, immutable moves, source graph validation, authored feedback, local-only result envelope.
- One placement operation powers mouse/touch/pen pointer dragging, and explicit destination menus. Touch handles capture the pointer and scroll near viewport edges; the rest of a card remains available for normal scrolling. Cancelled/invalid drops do not move records.
- Stable record IDs restore focus after a move. Status messages announce placements and undo. Source inspection uses an ordered text trail and returns focus to the chosen record's controls. Color and movement are not required to complete the task.
- The workbench has its own version 1.0.0 storage envelope and does not change existing lab storage/scoring. Browser storage failures leave session work available for export. User text renders as text, not HTML. No provider/backend request or new narration is introduced.
- Reuse the approved Labs Faculty Glyphic/Andika styling and existing watercolor courtyard asset. These are source records on a workbench, not new generated research illustrations. Existing character voices and original lab assets remain locked.

## Verification and limits

Unit checks cover immutable/reversible moves, invalid/no-op inputs, history limits, source cycles/missing parents/duplicates, measured differences, restoration, explanatory feedback and local results. Browser flows cover menus/focus, mouse drag, touch drag with edge scrolling, undo, source trails, reload, feedback invalidation, completion/download, restart, catalog status, separate guide and blocked-storage oral export. All flows use synthetic responses at desktop/narrow widths, against development and production before promotion.

Automated Chromium touch input is not a physical-device or screen-reader trial. Manual visual/assistive-technology review, real learner feedback and final digital content review remain separate. The first slice covers this one case; additional cases, multi-claim/multiple-placement relationships, imports and multiple local attempts remain future work. Existing print/PDF/upscale/release gates and the private hosted Site are unchanged. No email is needed for this internal software milestone.
