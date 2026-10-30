# Lunara Labs

**Illustrated, interactive learning labs about attention, evidence, and how information changes.**

Lunara Labs turns small investigations into something learners can explore: a phone with messages to trace, a task that notifications interrupt, and field notes that connect the experience to an explanation. It is a companion to The Lunara Edit curricula and also works on its own.

The app now starts through a **React + TypeScript + Vite shell**. The existing lab screens run through a temporary controller adapter while their individual conversion proceeds. It needs no account, database, or API key.

## Active development: React refactor

**The next development phase is a staged migration to React + TypeScript + Vite**, followed by the first new Evidence Workbench activity. The goal is to give the growing collection shared activity components, explicit state/result types, and a maintainable foundation for accessible card movement, animation, and video.

**Status — October 30, 2026:** browser baselines passed all six desktop/narrow cases in CI. React, TypeScript, Vite, the shared shell, and a production build are implemented. Rumor and Attention screen/state conversion remains pending; the shell currently hosts their existing controller through an explicit lifecycle adapter.

1. Establish repeatable browser checks for both existing labs, including timers, pause/reload recovery, narration, notes, and exports.
2. Introduce React, TypeScript, and Vite; migrate the shell and each lab incrementally while preserving saved attempts and current behavior.
3. Build Evidence Workbench with accessible card movement, source connections, undo, and local saving.
4. Add screenshots and a short project walkthrough so visitors can inspect the working experience.

See the [migration plan and completion checklist](docs/REACT-MIGRATION.md) for the proposed module boundaries and evidence required before switching the default app. The setup below runs the React shell; `npm run dev:legacy` still runs the standalone prototype for comparison.

![The illustrated Attention Trap activity](dist/assets/attention-lab-cover.png)

## Try it

Requirements: **Node.js 22 or later** and a modern browser.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4173**. Choose a lab, or use a direct route:

- [How Does a Rumor Grow?](http://127.0.0.1:4173/#/rumor)
- [The Attention Trap](http://127.0.0.1:4173/#/attention)

Use `npm run dev -- --port 4174` for a different development port. Run `npm run build` then `npm run preview` to check the production build. A static host can serve `build/`; no server-side application is required. `LABS_PORT` configures the production preview port.

## The first two labs

| Lab | What the learner does | What the software makes possible |
| --- | --- | --- |
| **How Does a Rumor Grow?** | Follow a library notice through five retellings, compare the wording, trace sources, and write a supported message. | Illustrated contacts, voice messages with transcripts, source navigation, explanation-based feedback, and saved field notes. |
| **The Attention Trap** | Predict a result, search matched passages in quiet and interrupted rounds, then compare their records. | A working simulated phone, timed notifications, optional chimes, pause/recovery, whole-passage counts, checked-part accuracy, and printable results. |

An unfinished search still receives a count out of all **85 targets**. Accuracy in the checked portion is reported separately and requires a known stopping point. The activity describes one person's attempt; it does not diagnose attention or establish a universal effect.

## Privacy and data flow

- The browser app has **no customer backend, login, analytics, or runtime AI requests**.
- Responses and progress stay in `localStorage` on that browser.
- Printing and JSON download happen locally; they do not upload a learner record.
- Character dialogue and notifications are invented teaching material. Tests use synthetic examples.
- Fonts, illustrations, and narration clips are bundled. Listening needs no provider credentials.
- An **optional, developer-only** narration script can send fixed teaching dialogue to OpenAI. It does not read browser responses or customer records.

Free-text answers can contain personal information if someone types it. Use invented responses for development and review, and do not commit real learner exports. See [PRIVACY.md](PRIVACY.md) for the review scope, limitations, and storage details.

## Develop and verify

```sh
npm test
npm run build
npm run check
npx playwright install chromium
npm run test:browser
```

`npm test` runs the domain, audio, and preview-server tests. `npm run check` also checks JavaScript syntax and scans for configured credential/private-reference patterns and browser data-request APIs. CI builds and checks the app, then runs browser flows against both the development server and the production preview on pushes and pull requests.

React and React DOM are the runtime dependencies, bundled locally by Vite. TypeScript, Vite, and Playwright are development dependencies, pinned by the lockfile. Browser checks cover desktop and narrow widths. Audio regeneration is optional; it requires a privately supplied OpenAI key, and new pitch processing requires FFmpeg with the Rubber Band filter. See [the development notes](docs/DEVELOPMENT.md).

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/main.tsx`, `src/app/App.tsx` | React entry, shared shell, privacy dialog, and temporary activity host. |
| `dist/activity-controller.mjs` | Existing routes, activity screens, saving, timers, and exports awaiting per-lab conversion; explicit mount/dispose lifecycle. |
| `dist/app.mjs` | Standalone prototype entry for comparison. |
| `build/` | Generated static production output; ignored by Git. |
| `dist/data.mjs` | Lesson content, source graph, passage scoring, progress migration, and result envelopes. |
| `dist/immersive.mjs` | Illustrated scenes, phone apps, characters, and notifications. |
| `dist/narration.mjs` | Cached audio playback, cancellation, and optional chimes. |
| `dist/audio-cast.mjs` | Canonical narration text, voices, and pitch settings. |
| `dist/assets/` | Local illustrations, fonts, and audio. |
| `scripts/` | Local preview, source checks, and optional narration tooling. |
| `tests/` | Synthetic fixtures and automated checks. |

The [architecture notes](docs/ARCHITECTURE.md) explain how the modules fit together. [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) describe the project rules for coding assistants.

## Current status

Implemented: React shell and production tooling, regression coverage, two complete standalone activities, illustrated phone interactions, a selected seven-voice cast, browser-local saving, printable notes, JSON exports, and version migration.

Still to verify: smaller-device and assistive-technology flows, learner usability, and final digital content review. The current app has one saved attempt per lab in each browser. Clearing site data removes that work; another person using the same browser can see it.

Lunara Quest assignments, server-side learner records, purchase entitlements, and public domain deployment are **not implemented here**. This repository has no Quest credentials or production database connection. The current local mode is a complete starting point for further development.

## Work ahead

The next stage is to grow Lunara Labs into a varied collection of tangible investigations drawn from the existing curriculum library. Each interaction should help a learner test an idea, see a consequence, and explain what happened. A lesson might become an evidence workbench, a robot route, a movable light-and-orbit model, or a video observation station.

**The following are proposed experiences, not features already implemented:**

| Proposed lab | Interaction and learning purpose |
| --- | --- |
| **Evidence Workbench** | Move evidence onto claims, trace source connections, and revise an explanation as new information arrives. |
| **Rook's Delivery Routes** | Arrange command blocks, animate a delivery robot through a map, and step back through a route to debug it. |
| **Moonlight Model** | Move a light, Earth, and Moon model; predict the view, then connect the simulation to a ball-and-lamp activity. |
| **Memory Scene Studio** | Observe a short original scene, reconstruct its details, then compare the reconstruction with the record. |
| **Inside a Thought** | Explore images, imagined sounds, words, and other ways of thinking through optional drawing, audio, and concept-map tools. |
| **Particle Playground** | Manipulate an animated particle model and build restricted molecule examples with draggable pieces. |
| **Video Observation Station** | Pause captioned clips, mark observations on a timeline, make a prediction, and revisit the relevant moment. |
| **Habitat Workshop** | Make choices in an illustrated branching environment and trace the consequences back to those choices. |
| **The Lunch Table** | Compare a personal choice with authored group opinions and practical constraints, then explain what influenced the decision. |
| **Nature Field Station** | Pair a physical observation activity with before/after records, comparison tools, and an original time-lapse. |

The [lab development plan](docs/LAB-DEVELOPMENT-PLAN.md) connects these candidates to learning goals, physical activities, and specific engineering challenges. It also outlines later mood/storytelling and adult everyday-decision labs.

Substantial work remains on accessible drag-and-drop with equivalent keyboard controls, animation/state synchronization, captioned video and timeline events, spatial models, authored branching rules, versioned local attempts, and automated browser tests. These provide concrete tasks for continued human-directed development with Claude Code; the plan does not imply endorsement or acceptance by an external program.

The [engineering roadmap](docs/ROADMAP.md) prioritizes the foundations and first complete new lab. All of this development can use invented content and synthetic attempts. Video is planned around bundled/local clips by default; third-party embeds would be an optional, separately reviewed data-flow change. Production customer data is not required.

## Assets and attribution

The illustrations and character narration are AI-assisted project assets. An in-app note explains the generated voices, and full transcripts remain available. The selected recordings are tracked in [the voice-cast lock](docs/VOICE-CAST-LOCK.json).

Bundled Andika and Faculty Glyphic fonts retain their [SIL Open Font License notices](dist/assets/FONT-LICENSES.txt). See [asset notes](docs/ASSETS.md) for provenance. The software is licensed under the **MIT License**; see [LICENSE](LICENSE). Lesson content, illustrations, narration recordings, and branding are excluded from that software grant and remain under separate terms. See [LICENSE-SCOPE.md](LICENSE-SCOPE.md) for the boundaries. The repository as a whole is therefore mixed-license.
