# Lunara Labs

**Illustrated, interactive learning labs about attention, evidence, and how information changes.**

Lunara Labs turns small investigations into something learners can explore: a phone with messages to trace, a task that notifications interrupt, and field notes that connect the experience to an explanation. It is a companion to The Lunara Edit curricula and also works on its own.

The current prototype is a buildless web app written in vanilla JavaScript. It runs locally with **no account, database, API key, or package installation**.

![The illustrated Attention Trap activity](dist/assets/attention-lab-cover.png)

## Try it

Requirements: **Node.js 22 or later** and a modern browser.

```sh
npm run dev
```

Open **http://127.0.0.1:4173**. Choose a lab, or use a direct route:

- [How Does a Rumor Grow?](http://127.0.0.1:4173/#/rumor)
- [The Attention Trap](http://127.0.0.1:4173/#/attention)

To use another local port, set `LABS_PORT` before running the command. Any static web server can also serve `dist/`.

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
npm run check
```

`npm test` runs the domain, audio, and preview-server tests. `npm run check` also checks JavaScript syntax and scans for configured credential/private-reference patterns and browser data-request APIs. CI runs the complete check on pushes and pull requests.

There are no runtime or npm package dependencies. Audio regeneration is optional; it requires a privately supplied OpenAI key, and new pitch processing requires FFmpeg with the Rubber Band filter. See [the development notes](docs/DEVELOPMENT.md).

## Project structure

| Path | Responsibility |
| --- | --- |
| `dist/app.mjs` | Routing, activity screens, browser saving, timers, and export controls. |
| `dist/data.mjs` | Lesson content, source graph, passage scoring, progress migration, and result envelopes. |
| `dist/immersive.mjs` | Illustrated scenes, phone apps, characters, and notifications. |
| `dist/narration.mjs` | Cached audio playback, cancellation, and optional chimes. |
| `dist/audio-cast.mjs` | Canonical narration text, voices, and pitch settings. |
| `dist/assets/` | Local illustrations, fonts, and audio. |
| `scripts/` | Local preview, source checks, and optional narration tooling. |
| `tests/` | Synthetic fixtures and automated checks. |

The [architecture notes](docs/ARCHITECTURE.md) explain how the modules fit together. [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) describe the project rules for coding assistants.

## Current status

Implemented: two complete standalone activities, illustrated phone interactions, a selected seven-voice cast, browser-local saving, printable notes, JSON exports, and version migration.

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

Bundled Andika and Faculty Glyphic fonts retain their [SIL Open Font License notices](dist/assets/FONT-LICENSES.txt). See [asset notes](docs/ASSETS.md) for provenance. No separate open-source license has been selected for the original application and curriculum assets.
