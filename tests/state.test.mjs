import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreRumor } from '../src/labs/rumor/state.ts';
import {
  initialAttention,
  restoreAttention,
  attentionReducer,
} from '../src/labs/attention/state.ts';
import { LAB_VERSION, passages, summarizeRound } from '../src/domain/data.mjs';

const envelope = (state, version = LAB_VERSION) => ({ version, state });

test('Rumor recovers damaged fields without losing valid notes or accepting arbitrary fields', () => {
  const restored = restoreRumor(
    envelope({
      step: 1,
      visited: null,
      selected: {},
      answers: [],
      message: 'Synthetic retained note',
      reflection: 22,
      complete: 'false',
      unexpected: 'omit',
    }),
  );
  assert.deepEqual(restored.visited, []);
  assert.equal(restored.selected, 'B');
  assert.deepEqual(restored.answers, {});
  assert.equal(restored.message, 'Synthetic retained note');
  assert.equal(restored.reflection, '');
  assert.equal(restored.complete, false);
  assert.equal(Object.hasOwn(restored, 'unexpected'), false);
});

test('Rumor keeps valid legacy answers, original version and history while filtering invalid choices', () => {
  const restored = restoreRumor(
    envelope(
      {
        step: 3,
        selected: 'F',
        visited: ['B', 'B', 'F', 'unknown'],
        message: 'Synthetic older note',
        answers: { origins: 1, inspection: 99, extra: 0 },
        answerHistory: [{ origins: 1 }, null],
      },
      '0.1.0',
    ),
  );
  assert.equal(restored.activityVersion, '0.1.0');
  assert.equal(restored.step, 3);
  assert.deepEqual(restored.visited, ['B', 'F']);
  assert.deepEqual(restored.answers, { origins: 1 });
  assert.deepEqual(restored.answerHistory, [{ origins: 1 }]);
});

test('Attention recovers missing round fields and returns damaged navigation to a reachable stage', () => {
  const restored = restoreAttention(
    envelope({
      step: 4,
      order: 'quiet',
      rounds: null,
      active: {
        condition: 'quiet',
        status: 'paused',
        selected: [0, 0, -1, 9999, '1'],
        fired: [20, 20, 1],
        elapsed: -4,
        alertIndex: 100,
      },
      reflection: 'Synthetic retained reflection',
      complete: true,
    }),
  );
  assert.equal(restored.step, 2);
  assert.equal(restored.complete, false);
  assert.equal(restored.reflection, 'Synthetic retained reflection');
  assert.deepEqual(restored.active.selected, [0]);
  assert.deepEqual(restored.active.fired, [20]);
  assert.deepEqual(restored.active.openedNotifications, []);
  assert.equal(restored.active.elapsed, 0);
  assert.equal(restored.active.alertIndex, 0);
  const noActive = restoreAttention(envelope({ step: 4, order: ['quiet', 'quiet'], rounds: [] }));
  assert.equal(noActive.step, 1);
  assert.equal(noActive.order, null);
});

test('Attention retains legacy stopping points, source version, valid marks and all four notification IDs', () => {
  const restored = restoreAttention(
    envelope(
      {
        step: 2,
        order: ['quiet', 'interrupted'],
        rounds: {
          quiet: {
            selected: [0, 1],
            score: { lastChecked: 4, correct: 999 },
            effort: '2',
            notes: 'Synthetic old round',
            elapsed: 120,
          },
        },
        active: {
          condition: 'interrupted',
          status: 'running',
          elapsed: 100,
          fired: [20, 45, 70, 95],
          openedNotifications: [{ cue: 4, at: 96 }],
        },
        reflection: 'Synthetic note',
      },
      '0.1.0',
    ),
  );
  assert.equal(restored.activityVersion, '0.1.0');
  assert.equal(restored.rounds.quiet.marker, 4);
  assert.equal(restored.rounds.quiet.effort, 2);
  assert.equal(restored.rounds.quiet.notes, 'Synthetic old round');
  assert.notEqual(restored.rounds.quiet.score.correct, 999);
  assert.deepEqual(restored.active.openedNotifications, [{ cue: 4, at: 96 }]);
  assert.equal(restored.active.status, 'paused');
  const resumed = attentionReducer(restored, { type: 'resume' });
  const ticked = attentionReducer(resumed, { type: 'tick', elapsed: 101, chimes: 0 });
  assert.deepEqual(ticked.active.fired, [20, 45, 70, 95]);
});

test('Attention keeps uncertain stopping points unscored after restoring legacy work', () => {
  const state = restoreAttention(
    envelope({ rounds: { quiet: { selected: [0], uncertain: true, score: { lastChecked: 10 } } } }),
  );
  const summary = summarizeRound(passages.quiet, state.rounds.quiet);
  assert.equal(summary.checked, null);
  assert.equal(summary.accuracyPercent, null);
  assert.equal(state.rounds.quiet.score, null);
});

test('Attention rejects invalid or wrong-phase selection actions at the state boundary', () => {
  const configured = { ...initialAttention(), order: ['quiet', 'interrupted'] };
  const running = attentionReducer(configured, { type: 'start', now: 0 });
  assert.equal(attentionReducer(running, { type: 'select', index: -1, marking: false }), running);
  assert.equal(attentionReducer(running, { type: 'select', index: 1, marking: true }), running);
  const paused = attentionReducer(running, {
    type: 'pause',
    elapsed: 10,
    reason: 'Synthetic pause',
  });
  assert.equal(attentionReducer(paused, { type: 'select', index: 1, marking: false }), paused);
  const stopped = attentionReducer(running, { type: 'stop', elapsed: 10 });
  const marked = attentionReducer(stopped, { type: 'select', index: 1, marking: true });
  assert.equal(marked.active.marker, 1);
  assert.equal(stopped.active.marker, null);
});
