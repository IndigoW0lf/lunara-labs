# Development

## Local workflow

Use Node.js 22.12 or later (the Vite minimum on Node 22) and `npm ci`. `npm run dev` starts Vite; `npm run build` type-checks the React source and writes static output to `build/`. `npm run preview` serves only that output through the bounded static preview server, with no request-body/results endpoint and a restrictive content security policy. `LABS_PORT` selects the production preview port. Vite uses `--port` for development.

Browser progress persists between edits. Use synthetic attempts while developing. Export any synthetic notes you need before restarting a lab. Do not commit browser profiles, real response exports, or environment files.

## Source and production layout

All routes render with React. `src/app/` owns the catalog, About and shell; `src/labs/` owns typed activity state and screens. `src/domain/` contains the framework-independent lesson/result helpers, `src/audio/` the cast/manifest/playback modules, and `src/presentation/` the fixed phone data/icons. Static resources live in `public/`. The old controller, template renderers, and standalone entry have been removed; prior Git revisions preserve their history.

Run `npm run build`, `npm run check`, and `npm run test:browser`. Install Chromium once with `npx playwright install chromium`. The build verifies local entry assets, approved audio, font notices, and the absence of raw source modules in production. CI runs sixteen browser cases against Vite and the production preview. To test output locally, build, stop Vite, then use `LABS_TEST_SERVER='npm run preview' npm run test:browser`. Test with invented attempts; never commit browser profiles or real learner exports.

## Optional audio work

No generation is necessary to run the app. The current selected files are already bundled and locked. The model is `gpt-4o-mini-tts`; the cast and exact dialogue live in `src/audio/audio-cast.mjs`.

If an intentional narration revision needs new clips, supply `OPENAI_API_KEY` privately in the process environment and run `npm run audio:generate`. The script does not automatically load an environment file. Node's `--env-file` option can load an ignored local file when preferred. Never commit a populated key.

New pitch processing needs FFmpeg with the `rubberband` filter. The importer uses constant tempo, quality pitch processing, and shifted formants. Cached finished clips retain their applied-pitch marker; a conflicting processed input is rejected rather than shifted twice.

Retained raw sources for deliberate pitch adjustments:

- Jo: `public/assets/audio/c-5676e1164d885c8f.mp3`.
- Ari: `public/assets/audio/f-081e6d63ac26424b.mp3`.

The generator sends only the fixed teaching dialogue and its synthesis settings to the speech provider. Browser responses and customer records are not inputs. Update the cast lock only when deliberately accepting a narration revision; do not overwrite it just to make a failed check pass.

## Verification limits

The repository includes tests of content invariants, scoring, migration, result envelopes, audio integrity, pitch-processing reuse, and the preview boundary. Full small-device/assistive-technology use, a learner usability trial, and final digital content review remain pending. A passing test suite does not establish educational effectiveness or a production release.
