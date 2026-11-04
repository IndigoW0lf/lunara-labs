import test from 'node:test';
import assert from 'node:assert/strict';
import { openAttempt } from '../src/persistence/attemptStorage.ts';
import { rumorAttempt } from '../src/labs/rumor/state.ts';
import { attentionAttempt } from '../src/labs/attention/state.ts';
import { evidenceAttempt, initialBoard } from '../src/labs/evidence/model.mjs';

function memory(raw = null) {
  const values = new Map(raw === null ? [] : [['attempt', raw]]);
  const writes = [];
  return {
    values,
    writes,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
      writes.push(value);
    },
  };
}
const definition = { ...rumorAttempt, key: 'attempt' };

for (const lab of [rumorAttempt, attentionAttempt, evidenceAttempt]) {
  test(`${lab.key}: unknown versions stay byte-for-byte intact through edits and restart`, () => {
    const raw = ' { "version": "99.0.0", "state": { "note": "Synthetic future work" } } ';
    const storage = memory(raw);
    const session = openAttempt({ ...lab, key: 'attempt' }, storage);
    assert.equal(session.status, 'unsupported');
    assert.deepEqual(session.initialState, lab.restore(null));
    assert.equal(session.save({ ...session.initialState, step: 1 }), 'unsupported');
    assert.equal(session.save(lab.restore(null)), 'unsupported');
    assert.equal(storage.getItem('attempt'), raw);
    assert.equal(session.originalCopy(), raw);
    assert.equal(storage.writes.length, 0);
  });
}

test('legacy recovery and repeated own writes preserve version identity without a mount write', () => {
  const storage = memory(
    JSON.stringify({ version: '0.1.0', state: { message: 'Synthetic old note' } }),
  );
  const session = openAttempt(definition, storage);
  assert.equal(storage.writes.length, 0);
  assert.equal(session.initialState.activityVersion, '0.1.0');
  const next = { ...session.initialState, message: 'Synthetic revised note' };
  assert.equal(session.save(next), 'saved');
  assert.equal(session.save({ ...next, reflection: 'Synthetic second edit' }), 'saved');
  assert.equal(JSON.parse(storage.getItem('attempt')).state.activityVersion, '0.1.0');
  assert.equal(storage.writes.length, 2);
});

test('malformed or unrecognized envelopes are recoverable copies, not permission to overwrite', () => {
  for (const raw of ['{bad JSON', 'null', '[]', '{}', '{"version":"0.3.0","state":[]}']) {
    const storage = memory(raw);
    const session = openAttempt(definition, storage);
    assert.equal(session.status, 'unreadable');
    assert.equal(session.save(session.initialState), 'unreadable');
    assert.equal(session.originalCopy(), raw);
    assert.equal(storage.getItem('attempt'), raw);
  }
});

test('the pre-write comparison catches a change even before a storage event arrives', () => {
  const storage = memory();
  const first = openAttempt(definition, storage);
  const second = openAttempt(definition, storage);
  first.save({ ...first.initialState, message: 'Synthetic winning save' });
  const retained = storage.getItem('attempt');
  assert.equal(
    second.save({ ...second.initialState, message: 'Synthetic stale edit' }),
    'conflict',
  );
  assert.equal(storage.getItem('attempt'), retained);
  assert.equal(storage.writes.length, 1);
});

test('removal blocks stale saves and a detected conflict remains blocked if bytes return', () => {
  const original = JSON.stringify({ version: '0.3.0', state: {} });
  const storage = memory(original);
  const session = openAttempt(definition, storage);
  storage.values.delete('attempt');
  assert.equal(session.check(), 'conflict');
  storage.values.set('attempt', original);
  assert.equal(session.save(session.initialState), 'conflict');
  assert.equal(storage.writes.length, 0);
});

test('unrelated lab saves do not stop this attempt from saving', () => {
  const storage = memory();
  const session = openAttempt(definition, storage);
  storage.values.set('different-lab', 'Synthetic unrelated value');
  assert.equal(session.check(), 'saved');
  assert.equal(session.save(session.initialState), 'saved');
});

test('read, write and later storage failures keep state usable without destructive retries', () => {
  const blockedRead = openAttempt(definition, {
    getItem: () => {
      throw new Error('Synthetic blocked storage');
    },
    setItem: () => assert.fail('must not write after failed read'),
  });
  assert.equal(blockedRead.status, 'unavailable');
  assert.equal(blockedRead.initialState.message, '');
  assert.equal(blockedRead.save(blockedRead.initialState), 'unavailable');

  const storage = memory();
  const failedWrite = openAttempt(definition, {
    ...storage,
    setItem: () => {
      throw new Error('Synthetic quota failure');
    },
  });
  assert.equal(failedWrite.save(failedWrite.initialState), 'unavailable');
  assert.equal(storage.getItem('attempt'), null);

  let failed = false;
  const laterFailure = openAttempt(definition, {
    getItem: () => {
      if (failed) throw new Error('Synthetic later failure');
      return null;
    },
    setItem: storage.setItem,
  });
  failed = true;
  assert.equal(laterFailure.check(), 'unavailable');
});

test('Evidence keeps its distinct version contract and supported board restoration', () => {
  const raw = JSON.stringify({
    version: '1.0.0',
    state: { ...initialBoard(), initialThought: 'Synthetic question' },
  });
  const storage = memory(raw);
  const session = openAttempt({ ...evidenceAttempt, key: 'attempt' }, storage);
  assert.equal(session.status, 'saved');
  assert.equal(session.initialState.initialThought, 'Synthetic question');
  session.save(session.initialState);
  assert.equal(JSON.parse(storage.getItem('attempt')).version, '1.0.0');
});
