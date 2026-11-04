import { useCallback, useLayoutEffect, useState } from 'react';
import { openAttempt, type AttemptDefinition } from './attemptStorage';

// Definitions are stable module-level values, one per lab. No writes on mount.
export function useAttemptStorage<T>(definition: AttemptDefinition<T>) {
  const [session] = useState(() =>
    openAttempt(definition, {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
    }),
  );
  const [status, setStatus] = useState(session.status);
  const save = useCallback((state: T) => setStatus(session.save(state)), [session]);
  useLayoutEffect(() => {
    const check = () => setStatus(session.check());
    const changed = (event: StorageEvent) => {
      if (event.key !== null && event.key !== definition.key) return;
      // sessionStorage events must not disable local attempt saving.
      try {
        if (event.storageArea === localStorage) check();
      } catch {
        check();
      }
    };
    window.addEventListener('storage', changed);
    window.addEventListener('focus', check);
    window.addEventListener('pageshow', check);
    check(); // Close the gap between the initial read and event subscription.
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('focus', check);
      window.removeEventListener('pageshow', check);
    };
  }, [definition.key, session]);
  return {
    initialState: session.initialState,
    version: definition.version,
    status,
    save,
    originalCopy: session.originalCopy,
  };
}
