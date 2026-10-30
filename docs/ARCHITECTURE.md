# Architecture

## Selected next architecture

The project is moving toward React + TypeScript + Vite through a staged refactor. The shared shell and tooling are implemented; individual lab screen/state conversion remains pending. The [migration plan](REACT-MIGRATION.md) separates future component/controller boundaries from the existing implementation and defines the evidence needed before cutover. Static hosting, browser-local progress, bundled assets, and the absence of runtime AI requests remain requirements.

## Current React shell

`index.html` loads `src/main.tsx`. React owns shared navigation, the privacy dialog, and an activity host. A layout effect mounts `dist/activity-controller.mjs` into that host and disposes audio, timers, and global subscriptions on unmount. The controller owns its descendants exclusively. This is a temporary bridge, not the completed lab conversion.

Vite bundles React locally and writes `build/`. `dist/` remains the public directory and retained prototype source; do not treat it as build output yet. Development uses Vite's local tooling connections. The production preview retains `connect-src 'none'`; no runtime service is required.

## Retained activity runtime

`dist/` is the complete static application. HTML loads local CSS and ES modules; images, fonts, and narration are local assets. The standalone prototype still has no build step or application API server. The new React shell uses the Vite build described above.

`activity-controller.mjs` owns hash routing, screen rendering, events, round clocks, browser saving, and export controls. `immersive.mjs` produces the illustrated phone/character interfaces. `data.mjs` holds versioned content, source links, scoring, restoration, and result serialization. `narration.mjs` plays the fixed audio manifest and cancels active playback when the experience changes.

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
