# Lunara Labs: future investigations and development plan

## Direction

Lunara Labs will turn more of the existing lesson library into experiences learners can manipulate, observe, and return to. The setting should help explain the subject: evidence belongs on an investigation desk, commands control a robot on a map, and light can be moved around a model while the learner watches what changes.

Choose an interaction because it makes an idea easier to investigate. Moving a card should expose a relationship; changing a control should produce an understandable consequence. Each lab should give the learner something useful to say or try afterward, including a connection to a physical activity when that suits the lesson.

**Current implementation:** Evidence Workbench’s courtyard case, How Does a Rumor Grow? and The Attention Trap, with illustrated phone interactions, fixed narration, browser-local progress, scoring, and field notes.

**Evidence Workbench now has an implemented courtyard case**, described in [its scope record](EVIDENCE-WORKBENCH.md). The other candidate investigations remain proposed development. Working titles, activity details, and mappings to source lessons need a content pass before implementation. This plan describes authentic work still to do; it does not claim the new labs are built, validated, or approved by an external program.

## Learning loop

1. Begin with a recognizable question or situation.
2. Invite a prediction, initial choice, or first observation.
3. Let the learner manipulate something that matters to the question.
4. Make the resulting change visible and give them a way to inspect it.
5. Ask for an explanation that uses their observations.
6. Connect the idea to a physical activity, everyday situation, or matching curriculum task.

Instructions should explain unfamiliar terms before asking the learner to use them. Feedback should help them look again at the evidence, mechanism, or result. Subjective experiences and personal preferences need room for different answers.

## Candidate investigations

| Working experience / source area | What the learner would do | Physical or curriculum connection | Main engineering work |
| --- | --- | --- | --- |
| **Evidence Workbench — The Evidence Trail** | Place evidence beside a claim, follow where each item came from, separate repeated reports from new observations, and revise a supported explanation. | Lay out printed evidence slips and explain the same relationships at a table. | Accessible card sorting, graph relationships, reversible board state, authored feedback, and a useful evidence-ledger export. |
| **Rook's Delivery Routes — delivery-bot lessons** | Build a command sequence, run the robot, inspect each step, and repair a route that reaches the wrong place. | Act out commands on a floor grid or with a small physical map and marker. | Command parsing, deterministic simulation, step/pause/reset controls, collision rules, path visualization, and equivalent keyboard/touch editing. |
| **Moonlight Model — Following the Moon** | Move a light and orbital model, predict a view, then compare the model's illumination and the view from the observer's position. | Recreate a selected setup with a lamp and ball, then record what agrees or needs another look. | Coordinate transforms, validated lighting/view geometry, synchronized diagrams, accessible controls, and reduced-motion alternatives. |
| **Memory Scene Studio — Can You Trust Your Memory?** | Watch an original short scene, reconstruct selected details or object positions, then compare that reconstruction with the original record. | Rebuild an arrangement with household objects and discuss which details were remembered or filled in. | Controlled stimulus exposure, reconstruction tools, recall/recognition boundaries, deterministic reveal states, and comparison output. |
| **Inside a Thought — What Does Your Mind Feel Like?** | Try optional prompts involving imagery, imagined sound, words, or knowing; describe or map the experience using a chosen response method. | Continue a drawing, description, or conversation in the matching study. | Multimodal response tools, optional audio and drawing, descriptive local records, and feedback that never treats one subjective experience as the correct answer. |
| **Particle Playground — chemistry/state-of-matter lessons** | Manipulate a simplified particle model, inspect what changes, or assemble examples from a restricted set of atom/bond pieces. | Model relationships with counters, beads, or connectors and compare the physical model with the screen. | Rule-based model constraints, animation, collision/selection behavior, labeled non-canvas alternatives, and scientifically reviewed simplifications. |
| **Video Observation Station — reusable media/evidence experience** | Pause a clip, mark an observation at a moment, distinguish it from an interpretation, make a prediction, and revisit the relevant record. | Observe an original demonstration or physical activity and create a short written observation log. | Caption/transcript support, timeline annotations, cue events, seek/replay behavior, responsive media controls, and local result serialization. |
| **Habitat Workshop — The Wild Robot study companion** | Assemble an illustrated habitat or choose responses to changing conditions, then trace an outcome back through the choices that contributed to it. | Build or sort a physical habitat model and discuss the needs represented in it. | Authored branching state, visible cause-and-effect chains, resource/rule models, multiple defensible solutions, and branch-aware explanations. |
| **The Lunch Table — group influence and decision-making lessons** | Make an initial choice, encounter authored peer opinions and practical constraints, then explain which information affected the decision. | Use the corresponding discussion and reflection tasks to distinguish preference, social influence, and circumstances. | Branching dialogue, transparent scenario variables, comparisons between initial/final reasoning, and feedback that does not grade a food preference as wrong. |
| **Nature Field Station — seasonal observation lessons** | Compare before/after notes, organize a sequence, inspect an original time-lapse, and identify what changed under a chosen condition. | Observe a real natural object or outdoor process and return with sketches or manually entered notes. | Time-series records, comparison views, offline-friendly state, media checkpoints, and records that do not require location data or photo uploads. |
| **Mood and Story Studio — Why Do We Like to Be Scared?** | Change the lighting, sound, or presentation of the same gentle illustrated scene and describe how expectations or interpretation change. | Compare story choices and discuss why a scene may feel different to different people. | Synchronized audiovisual variants, opt-in sound, intensity/pause controls, reduced-motion paths, and comparison of authored scene states. |
| **Everyday Decisions — later adult / A Mind of Her Own direction** | Arrange an authored day or decision board, work through interruptions and competing needs, and try a different arrangement with a clear explanation. | Adapt one small idea to an everyday situation through an optional local reflection. | Accessible resource/priority boards, branching constraints, undo/replay, non-identifying examples, and age-appropriate content using shared components. |

The source area identifies a possible curriculum connection, not permission to treat an existing printable review as approval of the digital version. Confirm the exact current lesson, scope, wording, and scientific relationships before adapting each activity.

## Reusable interaction work

### Card movement and construction

Develop one reliable model for selecting, moving, placing, and returning items. Pointer dragging, touch input, and keyboard actions must operate on the same state. Offer explicit move/place controls so a learner can complete an activity without performing a precise drag gesture. Preserve stable item IDs, focus, undo, and understandable placement feedback.

Apply it first to evidence cards, then adapt it to robot commands, molecule pieces, and decision boards. These uses have different validation rules; share the movement behavior while keeping each lab's learning rules explicit.

### Animation and simulation

Separate the underlying model from its animation. A robot route, particle chamber, or light model needs inspectable state and testable rules before it needs a polished transition. Provide pause, reset, step-through, and reduced-motion behavior where relevant. Descriptions and controls should make the important relationship available without relying solely on motion, color, or a canvas.

### Video and time-based observations

Build a media layer with poster frames, captions, transcripts, keyboard controls, pause/seek/replay, and observations attached to meaningful moments. Define what happens when a learner skips backward, repeats a cue, pauses the activity, reloads, or changes playback position. A repeated cue should not silently duplicate an observation or advance a lesson twice.

Default to bundled or local original clips, with no media account required. An optional hosted embed would need explicit click-to-load behavior and a separate data-flow review; third-party players must not be introduced as automatic background requests. No such embed exists in the current app.

### Branching cases and feedback

Represent branches as authored data with stable IDs, prerequisites, consequences, and feedback. Show the learner how an outcome relates to the available information. Keep feedback specific to the selected path and avoid inferring a person's motives or psychological traits from one choice.

### A portable lab definition

Introduce stable lab/content versions, capability declarations, source references, response schemas, and local result contracts. Validate missing media, invalid routes, inconsistent evidence links, and incomplete authored branches before a lab ships. Extract shared components as the first new labs demonstrate the need; retain lab-specific rules where they help explain the lesson.

## Concrete development tasks for Claude Code

These tasks give a reviewer a view of the proposed engineering work and how it will be evaluated. They are examples of human-directed implementation assignments, not completed features.

| Scoped task | Completion evidence |
| --- | --- |
| Implement evidence-card movement with pointer, touch, and keyboard input. | A synthetic case can be completed using each input method; focus/announcements are understandable, moves can be reversed, and reload restores the board. |
| Add an evidence graph and source validator. | Missing parents, cycles, and inconsistent source IDs produce clear authoring errors; the visual and text views describe the same relationships. |
| Build a robot sequence runner with step/pause/reset. | Deterministic route fixtures reach expected positions; invalid moves are explained; replay and pause do not change the command result. |
| Implement a movable lighting model with an accessible equivalent. | Reviewed reference configurations give the expected diagram/model state; controls and text descriptions remain usable with reduced motion and keyboard input. |
| Add captioned local video and timeline notes. | Captions/transcripts work; notes stay attached to valid moments; seeking/replay/reload preserve a coherent state; the browser makes no third-party request. |
| Build a controlled observation/reconstruction activity. | The reveal/exposure sequence is repeatable, reconstruction state survives recovery, and comparison output identifies the original record without diagnosing ability. |
| Refactor the activity controller into maintainable modules. | Existing scoring, audio locks, routes, attempt migrations, and browser-flow checks still pass; new labs have clear model/view boundaries. |
| Add multiple local attempts and versioned import/export. | Synthetic legacy and partial records migrate without resetting; invalid imports are explained; new attempts do not overwrite earlier work unexpectedly. |
| Add deterministic browser tests across viewports and input methods. | Both existing labs and the first new lab complete under repeatable clocks, with pause/recovery, notification return, focus, and export checks. |
| Prototype a host adapter using a local mock. | Launch/result schemas are checked, completion is idempotent, success requires acknowledgement, and a failed delivery leaves local work intact. No production credential or learner identity is used. |

## Delivery waves

**Wave 1: establish a strong third lab.** Complete the existing usability checks, then build Evidence Workbench as a full small experience. Include the card interaction, source model, explanation, saving, and field-note output. Use that implementation to establish the first reusable interaction primitives.

**Wave 2: test the toolkit against different kinds of reasoning.** Build Rook's Delivery Routes and Moonlight Model. These introduce sequences, debugging, movement, and spatial relationships. Share UI/state behavior where it fits while keeping the models clear and independently tested.

**Wave 3: add observation media.** Develop Memory Scene Studio and Video Observation Station with original/local clips and complete caption/transcript support. Add timeline and reconstruction behavior after the common recovery and testing patterns are established.

**Wave 4: broaden the collection.** Extend into chemistry models, habitats, group decisions, nature observations, mood/storytelling, and later adult scenarios. Select the next source lesson based on readiness, learning value, and feedback from actual use.

## Definition of a finished lab

- A learner can understand the question, make a meaningful choice or manipulation, inspect what happens, and explain it using a record from the activity.
- The directions, terms, feedback, and curriculum connection receive a content check against the current source lesson.
- Essential interactions have keyboard, touch, reduced-motion, caption/transcript, or other appropriate alternatives.
- Pause, reload, undo/replay where offered, local saving, version migration, and output behave predictably.
- Automated checks cover the lab's important rules and failure cases; actual interaction and learner checks are reported separately.
- The experience runs with synthetic content and local records. It does not need customer accounts, a live family database, telemetry, or personal information.
- Implemented behavior, remaining verification, and future integrations are described accurately in the repository.

Real Quest persistence, public access decisions, and any new external data exchange remain separate integration work. The local standalone mode should remain useful throughout the expansion.
