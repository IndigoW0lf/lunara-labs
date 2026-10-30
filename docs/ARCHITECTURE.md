# Architecture

## React application boundary

`index.html` loads `src/main.tsx`. React owns all routes, navigation, the privacy dialog, catalog and About pages, and all three labs. Hash-route subscriptions preserve existing lab links; unknown routes fall back to the catalog. The catalog reads supported saved envelopes without writing them and displays Open, Continue, or Revisit labels. Route/step changes manage heading focus; the catalog anchor moves focus to its investigation heading.

`src/` contains executable source. `public/` contains styles, fonts, illustrations, narration and attribution only. Vite bundles the app into ignored `build/`. The old controller, string-template renderers and standalone prototype entry are removed. Build verification rejects executable source in public resources, raw source modules in output, missing entry assets, changed narration and missing font notices. Development uses Vite's local tooling connections; the production preview retains `connect-src 'none'` and bounded static serving.

## Rumor state and controls

`src/labs/rumor/RumorLab.tsx` renders introduction, message tracing, evidence questions, writing and field notes with React controls. `state.ts` defines the state/action union and pure transitions. Each user change computes the next state once, updates the current ref and React state, and synchronously saves the existing versioned storage envelope. Storage failure leaves the in-memory attempt available for export. Earlier attempts retain their activity version and answer history through the existing domain restoration helper.

Shared React components own step layout, phone/portrait presentation, and narration controls. Changing a step, message, or route cancels narration. Stable keyed controls preserve input focus; step changes focus the heading. The only HTML boundary is a fixed icon function; learner text is always rendered as text.

## Attention state and clock

`src/labs/attention/AttentionLab.tsx` renders the sandbox and all activity screens. `state.ts` defines typed round/state/action structures and pure transitions. `useAttention.ts` owns one interval and a monotonic performance-clock base. React updates never reset that base. Reloaded running rounds recover paused; visibility changes and route disposal pause and save before another route mounts. User changes save synchronously; ticks persist once per elapsed second. Storage failure leaves the in-memory attempt available for download.

`Passage.tsx` retains the original character indices and roving keyboard navigation. Its stable selection handler and memoized props prevent timer-only renders from rebuilding the letter controls. Notification presentation remains separate from timer status, so reading a message does not pause the clock. Existing domain helpers still determine whole-passage totals, checked-part accuracy, result versions and local-only delivery.

## Shared modules

`src/domain/data.mjs` retains content, source links, scoring, restoration and result serialization. `src/presentation/phone.mjs` retains fixed icon paths, portrait coordinates and authored notifications. `src/audio/` holds the canonical narration specification, manifest and playback cancellation. The domain and playback implementations are preserved across relocation; the cast imports content from its new path.

## Progress and results

Each lab has one browser-local attempt. Save operations serialize state into `localStorage`. Restoration preserves earlier attempt identity across supported interface versions. Interrupted running rounds recover paused so elapsed work is not silently continued after a reload.

Results contain lab/interface versions, completion, responses, and assessment scope. They have no learner account identifier. `delivery: local-only` describes a download, not a server acknowledgement. Free-text responses can still contain personal information supplied by a user.

The Attention scorer retains two views: a whole-passage count out of 85 and accuracy in the portion checked. An uncertain stopping point leaves checked-part accuracy unknown while retaining the whole-passage score.

## Narration

The cast specification and fixed transcript determine an asset signature. The manifest stores the corresponding MP3 path and SHA-256. The selected cast lock makes accidental replacement visible to tests. Optional offline pitch processing records both its requested and applied shift to avoid double processing.

No audio generation occurs during browser use. The developer-only generator can use the provider API; the browser only plays bundled clips.

## Future host adapter

The intended boundary is a small adapter that accepts launch context and returns a versioned result. Current local use must keep working when that adapter is absent. Develop against a local mock first.

A future real integration must validate launch ownership, lab/version, payload shape, source origin, and idempotent completion on the server. It must acknowledge success only after saving and preserve local work when delivery fails. No such integration or credential is present in this repository.

## Evidence Workbench

`src/labs/evidence/model.mjs` owns the independent 1.0.0 board envelope, stable card/target IDs, immutable placement/undo operations, restoration validation, source-graph checks, authored feedback and local-only results. `EvidenceLab.tsx` renders the case and explanations, while `useCardMovement.ts` feeds the same move operation from native drag, touch/pen capture with edge scrolling, and explicit destination menus. The source inspector presents an ordered textual trail. A separate guide route supplies adult facilitation and worked reasoning. `src/domain/catalog.mjs` extends the original catalog without changing original lesson/scoring/result modules.
