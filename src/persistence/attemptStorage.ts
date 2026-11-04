import { isRecord } from './validation';

export type SaveStatus = 'saved' | 'unsupported' | 'unreadable' | 'conflict' | 'unavailable';
export type AttemptDefinition<T> = {
  key: string;
  version: string;
  supportedVersions: readonly string[];
  restore: (raw: unknown) => T;
};
type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;

// Keep recovery and the write guard together: a fallback screen must never
// grant permission to replace an envelope this build cannot understand.
export function openAttempt<T>(definition: AttemptDefinition<T>, storage: StorageAccess) {
  let expected: string | null = null;
  let status: SaveStatus = 'saved';
  let parsed: unknown = null;
  try {
    expected = storage.getItem(definition.key);
    if (expected !== null) {
      parsed = JSON.parse(expected);
      if (!isRecord(parsed) || !isRecord(parsed.state) || typeof parsed.version !== 'string')
        status = 'unreadable';
      else if (!definition.supportedVersions.includes(parsed.version)) status = 'unsupported';
    }
  } catch {
    status = expected === null ? 'unavailable' : 'unreadable';
  }
  const original = expected;
  const initialState = definition.restore(status === 'saved' ? parsed : null);

  function check(): SaveStatus {
    // Once blocked, this tab stays blocked until reload. It cannot silently
    // resume writing if another tab restores the previous bytes (the ABA case).
    if (status !== 'saved') return status;
    try {
      if (storage.getItem(definition.key) !== expected) status = 'conflict';
    } catch {
      status = 'unavailable';
    }
    return status;
  }

  return {
    initialState,
    get status() {
      return status;
    },
    originalCopy: () => original,
    check,
    save(state: T): SaveStatus {
      if (check() !== 'saved') return status;
      try {
        const next = JSON.stringify({ version: definition.version, state });
        storage.setItem(definition.key, next);
        expected = next;
      } catch {
        status = 'unavailable';
      }
      return status;
    },
  };
}
