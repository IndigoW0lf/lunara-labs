# Data flow and repository review

Review date: **2026-10-29**. This is an engineering review of the initial standalone source handoff, not a certification or a statement of eligibility for any external program.

## Included in the review

Browser source, developer scripts, test fixtures, documentation, active illustrations, audio tags, and the files selected for the new repository. The handoff starts from a selected file snapshot; the earlier private development history is not imported.

The review found no embedded real learner/customer records, personal email addresses, filled credentials, production database configuration, or private project links in the selected handoff. Private planning notes, account-specific hosting configuration, source-document identifiers, and unused earlier artwork/audio takes were excluded. Public third-party font attribution is retained.

The automated guard detects a limited set of patterns. It is a regression check alongside manual inspection, not proof that arbitrary future data is safe to publish. GitHub account, contributor, and commit metadata are separate from application data and can identify the repository owner.

## Running the app

| Data or action | Destination |
| --- | --- |
| Answers, predictions, timing, marks, and reflections | This browser's `localStorage`. |
| Save or resume an activity | This browser; no application server. |
| Print field notes | The user's browser/print destination. |
| Download results | A local JSON download selected by the user. |
| Play narration or load an illustration/font | Bundled static files from the same host. |
| Follow the footer's business-site link | That external site, only when the user chooses the link. |

The shipped browser JavaScript contains no analytics SDK, remote data API client, account flow, database connection, or AI service request. Ordinary static hosting still involves requests to its host; that host can have its own access logs and policies. The included development server does not log request bodies and accepts only static `GET`/`HEAD` requests.

## Browser-local does not mean non-personal

Free-text fields accept a learner's own words. Those words may contain personal information, even though the app never asks for a name or account. A person sharing the same browser can see its saved attempt. Downloaded notes can contain the same responses.

For development, demonstrations, coding-assistant sessions, and review submissions:

- Use invented responses and synthetic fixtures.
- Do not add real learner exports, family records, screenshots of personal answers, or production data.
- Keep secrets in ignored local environment configuration; never paste them into source or prompts.
- Keep database and identity integrations mocked until separately designed and reviewed.

## Optional developer narration tool

`scripts/generate-narration.mjs` is separate from the running app. It reads the fixed narration specifications and can call OpenAI's speech endpoint when an audio asset needs regeneration. That endpoint receives the teaching text, selected voice, model, and delivery instructions. It does not receive browser storage or result downloads.

No API key is included. Running and testing the existing app does not require that tool or any provider account. Changing it to accept personal or customer material would change this review's data-flow assumptions.

## Future integrations

Quest persistence, analytics, authentication, payments, and cross-origin result delivery are not enabled. A future implementation will need its own data-flow, authorization, failure-recovery, and retention review. The current browser-local implementation should remain runnable without production credentials.
