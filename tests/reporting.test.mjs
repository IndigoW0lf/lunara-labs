import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeRound, makeResult, restoreProgress, passages } from '../src/domain/data.mjs';

test('an unfinished search still has a whole-passage score, separate from checked-part accuracy', () => {
  const result = summarizeRound('eEeabE', { selected: [0, 2, 3, 5], marker: 3 });
  assert.equal(result.found, 3);
  assert.equal(result.totalTargets, 4);
  assert.equal(result.foundPercent, 75);
  assert.equal(result.notCircled, 1);
  assert.equal(result.other, 1);
  assert.equal(result.checked.correct, 2);
  assert.equal(result.checked.missed, 1);
  assert.equal(result.accuracyPercent, 50);
});
test('an unknown stopping point keeps the targets found and leaves checked-part accuracy unknown', () => {
  const result = summarizeRound('eEae', { selected: [0, 1], marker: 3, uncertain: true });
  assert.equal(result.found, 2);
  assert.equal(result.notCircled, 1);
  assert.equal(result.foundPercent, 67);
  assert.equal(result.checked, null);
  assert.equal(result.accuracyPercent, null);
});
test('whole-passage totals ignore duplicate and invalid selections', () => {
  const result = summarizeRound('eEa', { selected: [] });
  const bounded = summarizeRound('eEa', { selected: [0, 0, 1, -1, 20, 1.5], uncertain: true });
  assert.equal(bounded.found, 2);
  assert.equal(bounded.notCircled, 0);
  assert.equal(bounded.other, 0);
  assert.equal(result.found, 0);
});
test('the new report preserves earlier attempt identity and exports scores for an uncertain unfinished round', () => {
  const old = {
    version: '0.2.0',
    state: {
      activityVersion: '0.2.0',
      step: 4,
      complete: true,
      rounds: { quiet: { selected: [0], uncertain: true, elapsed: 120 } },
    },
  };
  const restored = restoreProgress(old, { step: 0 });
  assert.equal(restored.activityVersion, '0.2.0');
  assert.deepEqual(restored.rounds, old.state.rounds);
  const result = makeResult('attention', restored);
  assert.equal(result.labVersion, '0.2.0');
  assert.equal(
    result.responses.comparisonScores.quiet.found,
    passages.quiet[0].toLowerCase() === 'e' ? 1 : 0,
  );
  assert.equal(result.responses.comparisonScores.quiet.totalTargets, 85);
  assert.equal(result.responses.comparisonScores.quiet.checked, null);
});
