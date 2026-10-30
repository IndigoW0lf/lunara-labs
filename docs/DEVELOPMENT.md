# Development

## Local workflow

Use Node.js 22 or later. Run `npm run dev`, open the printed loopback URL, and run `npm run check` before committing. The preview serves only `dist/`; it has no request-body or results endpoint. `LABS_PORT` selects a port and `LABS_HOST` changes the bind address when deliberately needed.

Browser progress persists between edits. Use synthetic attempts while developing. Export any synthetic notes you need before restarting a lab. Do not commit browser profiles, real response exports, or environment files.

## React refactor workflow

React + TypeScript + Vite is the selected next stack. See [REACT-MIGRATION.md](REACT-MIGRATION.md) for milestones and acceptance checks. The current checkout still uses the dependency-free preview described above; do not assume `npm install`, a Vite build, TypeScript checking, or automated browser tests exist yet.

Introduce new commands, dependency lockfiles, build output rules, CI checks, and contributor instructions together when the tooling lands. Keep the existing domain/audio tests usable during migration. Use invented attempts and isolated browser storage for regression fixtures; never commit browser profiles or real learner responses.

## Optional audio work

No generation is necessary to run the app. The current selected files are already bundled and locked. The model is `gpt-4o-mini-tts`; the cast and exact dialogue live in `dist/audio-cast.mjs`.

If an intentional narration revision needs new clips, supply `OPENAI_API_KEY` privately in the process environment and run `npm run audio:generate`. The script does not automatically load an environment file. Node's `--env-file` option can load an ignored local file when preferred. Never commit a populated key.

New pitch processing needs FFmpeg with the `rubberband` filter. The importer uses constant tempo, quality pitch processing, and shifted formants. Cached finished clips retain their applied-pitch marker; a conflicting processed input is rejected rather than shifted twice.

Retained raw sources for deliberate pitch adjustments:

- Jo: `dist/assets/audio/c-5676e1164d885c8f.mp3`.
- Ari: `dist/assets/audio/f-081e6d63ac26424b.mp3`.

The generator sends only the fixed teaching dialogue and its synthesis settings to the speech provider. Browser responses and customer records are not inputs. Update the cast lock only when deliberately accepting a narration revision; do not overwrite it just to make a failed check pass.

## Verification limits

The repository includes tests of content invariants, scoring, migration, result envelopes, audio integrity, pitch-processing reuse, and the preview boundary. Full small-device/assistive-technology use, a learner usability trial, and final digital content review remain pending. A passing test suite does not establish educational effectiveness or a production release.
