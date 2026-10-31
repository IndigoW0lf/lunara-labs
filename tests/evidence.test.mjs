import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialBoard,
  moveRecord,
  undoMove,
  restoreBoard,
  records,
  sourceTrail,
  validateSources,
  reviewBoard,
  evidenceResult,
  EVIDENCE_VERSION,
} from '../src/labs/evidence/model.mjs';
test('evidence moves are immutable, reversible, bounded, and ignore unknown IDs', () => {
  const first = initialBoard(),
    next = moveRecord(first, 'B', 'recorded');
  assert.equal(first.placements.B, 'unplaced');
  assert.equal(next.placements.B, 'recorded');
  assert.deepEqual(undoMove(next).placements, first.placements);
  assert.equal(moveRecord(next, 'bogus', 'recorded'), next);
  assert.equal(moveRecord(next, 'A', 'bogus'), next);
  assert.equal(moveRecord(next, 'B', 'recorded'), next);
  let state = first;
  for (let i = 0; i < 50; i++) state = moveRecord(state, 'A', i % 2 ? 'aside' : 'recorded');
  assert.equal(state.history.length, 30);
});
test('source trails keep copied measurements together and reject broken graphs', () => {
  assert.deepEqual(sourceTrail('B'), ['B', 'A']);
  assert.deepEqual(sourceTrail('C'), ['C']);
  assert.throws(() => validateSources([{ id: 'A', parent: 'B' }]), /Missing/);
  assert.throws(
    () =>
      validateSources([
        { id: 'A', parent: 'B' },
        { id: 'B', parent: 'A' },
      ]),
    /cycle/,
  );
  assert.throws(() => validateSources([{ id: 'A' }, { id: 'A' }]), /Duplicate/);
  assert.equal(records[0].readings.sun - records[0].readings.shade, 8);
  assert.equal(records[2].readings.sun - records[2].readings.shade, 8);
});
test('restoration validates the board and keeps notes and undo without trusting extra IDs', () => {
  const state = {
    ...moveRecord(initialBoard(), 'C', 'recorded'),
    explanation: 'Synthetic explanation.',
  };
  const raw = { version: EVIDENCE_VERSION, state };
  assert.deepEqual(restoreBoard(raw), state);
  assert.deepEqual(
    restoreBoard({
      version: EVIDENCE_VERSION,
      state: { ...state, placements: { ...state.placements, extra: 'aside' } },
    }),
    initialBoard(),
  );
  assert.deepEqual(restoreBoard({ version: 'future', state }), initialBoard());
  const recovered = restoreBoard({ ...raw, state: { ...state, history: [{}, state.placements] } });
  assert.equal(recovered.history.length, 1);
});
test('authored feedback separates a repeated report, an irrelevant method, and overreach', () => {
  let state = initialBoard();
  for (const id of ['A', 'B', 'C']) state = moveRecord(state, id, 'recorded');
  state = moveRecord(state, 'D', 'aside');
  const result = reviewBoard(state);
  assert.match(result[1].feedback, /repeats A/);
  assert.match(result[3].feedback, /age alone is not/);
  assert.match(reviewBoard(moveRecord(state, 'A', 'everywhere'))[0].feedback, /cannot establish/);
  const exported = evidenceResult({ ...state, complete: true });
  assert.equal(exported.delivery, 'local-only');
  assert.equal(exported.labVersion, EVIDENCE_VERSION);
  assert.equal(exported.completion, 'completed');
  assert.deepEqual(exported.responses.sourcePaths.B, ['B', 'A']);
  assert.ok(!Object.hasOwn(exported, 'learnerId'));
});
