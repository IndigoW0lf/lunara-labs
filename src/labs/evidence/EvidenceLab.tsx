import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { LabLayout } from '../../components/LabLayout';
import {
  evidenceLab,
  records,
  targets,
  sourceTrail,
  initialBoard,
  restoreBoard,
  moveRecord,
  undoMove,
  reviewBoard,
  evidenceResult,
  EVIDENCE_KEY,
  EVIDENCE_VERSION,
  type BoardState,
  type CardId,
  type TargetId,
} from './model.mjs';
import { useCardMovement } from './useCardMovement';
import './evidence.css';
function Button({
  id,
  children,
  onClick,
  disabled = false,
  secondary = false,
}: {
  id: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      id={id}
      className={'button' + (secondary ? ' secondary' : '')}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function read() {
  try {
    return restoreBoard(JSON.parse(localStorage.getItem(EVIDENCE_KEY) || 'null'));
  } catch {
    return initialBoard();
  }
}
export function EvidenceLab() {
  const [state, setState] = useState(read),
    current = useRef(state),
    main = useRef<HTMLElement>(null),
    pendingFocus = useRef<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true),
    [announcement, setAnnouncement] = useState(''),
    [trace, setTrace] = useState<string | null>(null),
    [downloaded, setDownloaded] = useState(false);
  const update = useCallback((next: BoardState) => {
    current.current = next;
    setState(next);
    try {
      localStorage.setItem(
        EVIDENCE_KEY,
        JSON.stringify({ version: EVIDENCE_VERSION, state: next }),
      );
    } catch {
      setStorageAvailable(false);
    }
  }, []);
  const move = useCallback(
    (id: string, target: string) => {
      const next = moveRecord(current.current, id, target);
      if (next === current.current) return;
      pendingFocus.current = id;
      update(next);
      setAnnouncement(`Record ${id} moved to ${targets.find((t) => t.id === target)?.title}.`);
    },
    [update],
  );
  const movement = useCardMovement(move);
  const go = (step: number) => {
    setTrace(null);
    update({ ...current.current, step });
  };
  useLayoutEffect(() => {
    document.title = evidenceLab.title + ' · Lunara Labs';
    const h = main.current?.querySelector('h1');
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [state.step]);
  useLayoutEffect(() => {
    if (pendingFocus.current) {
      const control = main.current?.querySelector<HTMLSelectElement>(
        `[data-card-select="${pendingFocus.current}"]`,
      );
      control?.focus({ preventScroll: true });
      control?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      pendingFocus.current = null;
    }
  }, [state]);
  useLayoutEffect(() => {
    if (trace) {
      const h = main.current?.querySelector<HTMLElement>('#source-trail-heading');
      h?.focus({ preventScroll: true });
      h?.scrollIntoView({ block: 'nearest' });
    }
  }, [trace]);
  const allPlaced = records.every((r) => state.placements[r.id as CardId] !== 'unplaced');
  const note = (field: 'initialThought' | 'explanation' | 'nextCheck', value: string) =>
    update({ ...current.current, [field]: value });
  const download = () => {
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(evidenceResult(current.current), null, 2)], {
          type: 'application/json',
        }),
      ),
      a = document.createElement('a');
    a.href = url;
    a.download = 'lunara-evidence-field-notes.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setDownloaded(true);
  };
  const card = (record: (typeof records)[number]) => (
    <article
      key={record.id}
      className={'evidence-card' + (movement.dragging === record.id ? ' is-dragging' : '')}
      data-evidence-card={record.id}
    >
      <div className="evidence-card-heading">
        <span className="evidence-letter">{record.id}</span>
        <h3>{record.title}</h3>
      </div>
      <p className="source-meta">{record.date}</p>
      <p>{record.text}</p>
      <div className="evidence-card-tools">
        <button
          type="button"
          className="text-button evidence-grip"
          data-drag-card={record.id}
          {...movement.handle(record.id)}
        >
          ↕ Move record {record.id}
        </button>
        <button type="button" className="text-button" onClick={() => setTrace(record.id)}>
          Follow source {record.id}
        </button>
      </div>
      <label className="field-label" htmlFor={'place-' + record.id}>
        Place record {record.id}
      </label>
      <select
        id={'place-' + record.id}
        data-card-select={record.id}
        value={state.placements[record.id as CardId]}
        onChange={(e) => move(record.id, e.target.value)}
      >
        {targets.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
    </article>
  );
  const zone = (id: TargetId) => {
    const target = targets.find((t) => t.id === id)!;
    const cards = records.filter((r) => state.placements[r.id as CardId] === id);
    return (
      <section
        key={id}
        className={
          'evidence-zone ' +
          (id === 'unplaced' ? 'evidence-inbox ' : '') +
          (movement.over === id ? 'drag-over' : '')
        }
        {...movement.zone(id)}
        aria-labelledby={'zone-' + id}
      >
        <h2 id={'zone-' + id}>{target.title}</h2>
        <p>{target.description}</p>
        <div className="evidence-card-grid">{cards.map(card)}</div>
        {!cards.length && (
          <p className="evidence-empty">
            {id === 'unplaced'
              ? 'All four records have a place on your board.'
              : 'Move a record here by dragging its handle or choosing this place in its menu.'}
          </p>
        )}
      </section>
    );
  };
  return (
    <main id="main" tabIndex={-1} ref={main}>
      <LabLayout
        lab={evidenceLab}
        step={state.step}
        storageAvailable={storageAvailable}
        guidance={
          <>
            <p>
              You can read the records aloud or scribe the learner’s explanation. Let them try a
              first arrangement before opening feedback, then ask which detail supports each choice.
            </p>
            <a href="#/evidence-guide">
              Open the separate Parent &amp; Teaching Guide (includes answers)
            </a>
          </>
        }
      >
        {!storageAvailable && (
          <p role="status" className="warning">
            Browser saving is unavailable. Your board still works in this session; download your
            field notes before leaving.
          </p>
        )}
        {state.step === 0 ? (
          <>
            <h1>What can these courtyard records help us say?</h1>
            <img
              className="evidence-scene"
              src="assets/alder-library.png"
              alt="A watercolor courtyard with trees and paved spaces in sun and shade."
            />
            <p>
              Suppose you read that a shaded spot was cooler than a sunny one. Before passing that
              along, you might want to know where the temperatures came from, when they were
              recorded, and whether another report collected anything new.
            </p>
            <p>
              A <strong>claim</strong> is something someone says we could examine. A{' '}
              <strong>source</strong> is where information comes from. A record becomes useful{' '}
              <strong>evidence</strong> when we can inspect it to help answer the particular
              question we are asking. A timetable, for example, can tell us what was scheduled;
              finding a second message quoting it does not show that someone watched the event
              happen.
            </p>
            <p>
              You’ll arrange four records beside two claims. One claim stays with what was recorded
              in this courtyard. The other reaches beyond those dates and places. Read the records,
              follow their sources, and decide how much they can help us say. You can move a card
              again or undo a move whenever you want to look again.
            </p>
            <label className="field-label" htmlFor="initial-thought">
              Before opening the records, what would you want to know?
            </label>
            <p className="field-help">
              A few words are enough. You can also discuss this aloud and leave the box empty.
            </p>
            <textarea
              id="initial-thought"
              value={state.initialThought}
              onChange={(e) => note('initialThought', e.target.value)}
            />
            <p className="companion-label">{evidenceLab.companion}.</p>
            <div className="button-row">
              <Button id="open-workbench" onClick={() => go(1)}>
                Open the records →
              </Button>
            </div>
          </>
        ) : state.step === 1 ? (
          <>
            <h1>Arrange the records beside the claims.</h1>
            <p>
              Read each card, then use its menu to choose a place, or drag its move handle onto an
              area below. A record may support the claim about these two days, help you trace an
              earlier report, or answer a different question. Choose where you think it belongs,
              then explain the relationship when you compare the feedback.
            </p>
            <p className="field-help">
              The menus work with a keyboard or a tap. Touch dragging uses the move handle so you
              can still scroll by touching the rest of a card. “Follow source” opens the trail back
              through a report. A radiation shield keeps direct sunlight from heating the sensor
              itself while allowing air to move through it; the logs describe this method so you can
              inspect what the readings represent.
            </p>
            <div className="button-row evidence-toolbar">
              <Button
                id="undo-evidence"
                secondary
                disabled={!state.history.length}
                onClick={() => {
                  update(undoMove(current.current));
                  setAnnouncement('Last board move undone.');
                }}
              >
                Undo last move
              </Button>
              <Button id="workbench-intro" secondary onClick={() => go(0)}>
                Back to the question
              </Button>
            </div>
            <p className="evidence-announcement" role="status" aria-live="polite">
              {announcement}
            </p>
            {zone('unplaced')}
            <div className="evidence-board">
              {(['recorded', 'everywhere', 'aside'] as TargetId[]).map(zone)}
            </div>
            {trace && (
              <aside className="sheet blue evidence-trail">
                <h2 id="source-trail-heading" tabIndex={-1}>
                  Source trail for record {trace}
                </h2>
                <p>
                  Follow where this record’s information came from. A new mention does not
                  necessarily mean new measurements.
                </p>
                <ol>
                  {sourceTrail(trace).map((id) => {
                    const r = records.find((x) => x.id === id)!;
                    return (
                      <li key={id}>
                        <strong>
                          {id} · {r.title}
                        </strong>
                        <p>
                          {r.parent
                            ? `This report identifies ${r.parent} as the source of its measurements.`
                            : r.readings
                              ? 'This record describes measurements its authors collected.'
                              : 'This record describes seedling growth, not courtyard air temperature.'}
                        </p>
                      </li>
                    );
                  })}
                </ol>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    main.current
                      ?.querySelector<HTMLSelectElement>(`[data-card-select="${trace}"]`)
                      ?.focus();
                    setTrace(null);
                  }}
                >
                  Return to record {trace}
                </button>
              </aside>
            )}
            <div className="button-row">
              <Button
                id="review-evidence"
                disabled={!allPlaced}
                onClick={() => update({ ...current.current, checked: true })}
              >
                Compare my reasoning
              </Button>
            </div>
            {!allPlaced && (
              <p className="field-help">
                Give each of the four records a place before opening the feedback.
              </p>
            )}
            {state.checked && (
              <section className="sheet sage evidence-feedback" aria-labelledby="feedback-heading">
                <h2 id="feedback-heading">Look back at the records.</h2>
                {reviewBoard(state).map((item) => (
                  <div className="feedback" key={item.id}>
                    <strong>Record {item.id}</strong>
                    {item.feedback}
                  </div>
                ))}
                <p>
                  Two sets of measurements can help us describe these two recorded days, while both
                  still share the limits of one courtyard at noon. You can change your board and
                  compare again before writing your explanation.
                </p>
                <Button id="explain-evidence" onClick={() => go(2)}>
                  Explain what the records show →
                </Button>
              </section>
            )}
          </>
        ) : state.step === 2 ? (
          <>
            <h1>Build an explanation from your board.</h1>
            <p>
              Return to the source letters and the readings as you explain what the records let you
              say. Your conclusion can stay with the observed temperatures while leaving questions
              about other places, times, or causes open.
            </p>
            <div className="sheet blue">
              <h2>Your current arrangement</h2>
              <ul>
                {records.map((r) => (
                  <li key={r.id}>
                    <strong>
                      {r.id} · {r.title}:
                    </strong>{' '}
                    {targets.find((t) => t.id === state.placements[r.id as CardId])?.title}
                  </li>
                ))}
              </ul>
            </div>
            <label className="field-label" htmlFor="evidence-explanation">
              What do the records show, and which sources help you say that?
            </label>
            <p className="field-help">
              Use the letters and a reading or comparison. Explain whether a repeated report adds a
              new set of measurements. A few connected sentences are enough.
            </p>
            <textarea
              id="evidence-explanation"
              value={state.explanation}
              onChange={(e) => note('explanation', e.target.value)}
            />
            <label className="field-label" htmlFor="evidence-next-check">
              What extra measurements would help you check other places or times?
            </label>
            <p className="field-help">
              Name what you would compare and explain how it would help. You are planning a next
              check; you do not need to find a real courtyard or collect data to finish this case.
            </p>
            <textarea
              id="evidence-next-check"
              value={state.nextCheck}
              onChange={(e) => note('nextCheck', e.target.value)}
            />
            <label className="check-row">
              <input
                id="evidence-discussed"
                type="checkbox"
                checked={state.discussed}
                onChange={(e) => update({ ...current.current, discussed: e.target.checked })}
              />
              <span>
                I explained my conclusion and next check aloud instead of typing both answers.
              </span>
            </label>
            <div className="button-row">
              <Button
                id="evidence-finish"
                disabled={
                  !state.discussed && (!state.explanation.trim() || !state.nextCheck.trim())
                }
                onClick={() => update({ ...current.current, step: 3, complete: true })}
              >
                Keep my field notes →
              </Button>
              <Button id="return-to-board" secondary onClick={() => go(1)}>
                Return to the board
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1>Your evidence field notes</h1>
            <p>
              Your arrangement and explanation are gathered here so you can return to the records or
              talk someone through your reasoning. These notes record your participation; they are
              not an automatic judgment of mastery.
            </p>
            <div className="sheet blue">
              <h2>My evidence ledger</h2>
              <ul>
                {records.map((r) => (
                  <li key={r.id}>
                    <strong>
                      {r.id} · {r.title}:
                    </strong>{' '}
                    {targets.find((t) => t.id === state.placements[r.id as CardId])?.title}. Source
                    trail: {sourceTrail(r.id).join(' → ')}.
                  </li>
                ))}
              </ul>
            </div>
            <h2>Before I opened the records</h2>
            <p className="reflection-quote">
              {state.initialThought || 'No typed initial thought recorded.'}
            </p>
            <h2>What I can explain from the records</h2>
            <p className="reflection-quote">
              {state.explanation || 'No typed explanation recorded.'}
            </p>
            <h2>What I would check next</h2>
            <p className="reflection-quote">{state.nextCheck || 'No typed next check recorded.'}</p>
            {state.discussed && <p>I explained my conclusion and next check aloud.</p>}
            <p>
              To try the same process away from the screen, copy the four record letters and claim
              headings onto scraps of paper. Arrange them on a table and explain why the newsletter
              and original log share a measurement source.
            </p>
            <p className="completion-note">
              {storageAvailable
                ? 'Your work is saved in this browser.'
                : 'Keep a download before leaving this session.'}{' '}
              It has not been sent to Quest.
            </p>
            <div className="button-row">
              <Button id="print-evidence" onClick={() => window.print()}>
                Print my notes
              </Button>
              <Button id="download-evidence" secondary onClick={download}>
                Download my results
              </Button>
              <a className="button secondary" href="#/">
                Explore another lab
              </a>
            </div>
            {downloaded && <p role="status">Your field notes were downloaded.</p>}
            <div className="restart-row">
              <button
                className="text-button"
                id="restart-evidence"
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      'Start this workbench over? Download any notes you want to keep first. This replaces this browser’s saved board and explanation.',
                    )
                  ) {
                    update(initialBoard());
                    setAnnouncement('');
                    setDownloaded(false);
                  }
                }}
              >
                Start this workbench over
              </button>
            </div>
          </>
        )}
      </LabLayout>
    </main>
  );
}
