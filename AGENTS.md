# Lunara Labs development

Read the README and PRIVACY.md before making changes. Use Node.js 22.12 or later. Run `npm run dev` for Vite development, `npm run build` for type checking and the production build, and `npm run check` before handing off changes. Run `npm ci` to install development tooling. Browser regression checks use `npm run test:browser` after `npx playwright install chromium`. React and React DOM are bundled runtime dependencies. Runtime source lives in `src/`; static styles/assets live in `public/`; `build/` is disposable output. All routes use React. The legacy controller and template renderers are removed. Keep executable source out of `public/` and verify the production boundary with `npm run build`. Attention cleanup must pause/save before another route mounts; rendering must not reset elapsed time or duplicate cues.

## Preserve the learning experience

- Write connected, friendly teaching prose. Explain an idea and give a useful example before asking the learner to apply it.
- Keep the exact library case messages, source routes, and matched search passages unless a content revision is requested.
- Whole-passage targets found and checked-part accuracy are separate. Unfinished rounds keep a target count. An unknown stopping point must never produce invented accuracy.
- Preserve saved attempts and their original version identity through migrations. Do not silently reset work.
- Completion records describe participation, not mastery or a diagnosis.

## Preserve the selected voices

The cast is selected and locked: Jo is Nova at +1 semitone, Ari is Coral at +3, and shared playback is 1.05x. `docs/VOICE-CAST-LOCK.json` records the exact approved assets. Only update the lock for an intentional narration revision. Use raw synthesis audio when changing pitch; do not shift a finished clip again.

Keep transcripts available and stop narration on navigation, step changes, and timed-round starts. Maintain one clear generated-voice disclosure on How the labs work; avoid repeated notices inside the activities.

## Keep development independent of personal data

- Use synthetic fixtures and invented content. Never add real learner/customer data or private service credentials.
- Keep the browser app free of remote data requests and tracking. Data-flow changes need an explicit design and corresponding documentation.
- The optional narration script uses fixed teaching dialogue only; it must not read learner responses.
- Keep future Quest identity and persistence separate from lesson content and scoring. Use a local mock when developing an adapter.

Keep source formatted with `npm run format`; run `npm run format:check` before handing off. TypeScript checks unused locals/parameters. Direct typed-state regression tests run with the development-only tsx loader. Browser storage is untrusted input: validate fields before rendering, preserve valid legacy content/version identity, and test malformed/partial attempts. Model completion prerequisites and cancellation cleanup explicitly instead of relying only on disabled controls.

Run checks appropriate to a change. Add meaningful tests for changed scoring, persistence, authorization boundaries, or audio processing. Check changed interactions in a browser. Keep unfinished reviews and integrations clearly marked as pending.
