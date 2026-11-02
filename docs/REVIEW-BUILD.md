# Three-lab review-build walkthrough

The November 2, 2026 pass moves the current React application into the existing owner-private review host and records a bounded desktop walkthrough. Hosting metadata stays separate from the public GitHub source; the static host serves Vite's generated `build/` output. The public repository can be inspected and run locally without a provider account or API key. Owner-private hosting is not an externally accessible reviewer link.

## Observed findings

- The React icon wrapper no longer matched the hero's direct-child SVG selector. The oversized icon pushed the phone caption out of its frame. Scope the existing dimensions to the icon descendant and check icon/caption bounds at desktop and narrow widths.
- The immersive layout's larger maximum width could remove its side gutters between the original desktop breakpoint and the new maximum. Keep explicit gutters in that range and test a 1380px viewport as well as narrow screens.
- The Evidence board asked for placements before the two claims were visible. Show the same authored claim text together above the record inbox; keep the original drop areas and scientific case unchanged.
- Source focus used nearest-edge scrolling, which could put only the heading at the bottom of the screen. Bring the source heading to the top of the view, with the explanation and return control following it. Newly opened reasoning feedback receives deliberate focus and scrolling after render; restored feedback does not steal focus automatically.
- Finished field notes offered restart/export but no editing route. Add Edit my explanation, preserve the typed responses, and invalidate completion when the explanation or oral-response choice is revised. Existing board moves/undo still invalidate checked feedback and completion. The browser regression now revisits the board through real UI controls rather than changing the stored stage to simulate it.
- Vite initially rejected the managed preview's host. Allow the specific managed development hostname; do not disable host validation globally. This is development configuration, not a production data-flow change.

## Walkthrough and verification scope

The managed desktop browser was used to inspect the home, initial Evidence board, keyboard/menu placement, B → A source trail and return focus, reasoning feedback, typed explanation, field notes, editing, and a resumed board. The current screenshots are unmodified browser captures with authored sample responses. The original narration, passages, measurements, source routes, content versions and scoring rules are retained.

The automated suite has 32 core checks and 36 browser cases across desktop and narrow widths. The new coverage checks hero containment and desktop gutters, claims before placement, source-return visibility, feedback focus, real editing navigation and print-media visibility/wrapping. Existing mouse/touch movement, storage recovery, scoring and audio checks remain. The exact promoted revision must pass the complete suite against development and production.

Print checks inspect print CSS in Chromium; they do not establish a physical-printer or exported-PDF pagination review. Narrow/touch checks are automated. Real-device use, screen-reader review, learner feedback and final digital content approval remain separate. No curriculum PDF, storefront material, runtime backend, analytics or voice asset is changed. No email is needed for this internal review milestone.
