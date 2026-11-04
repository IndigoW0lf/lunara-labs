import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { duePings } from '../../domain/data.mjs';
import { useAttemptStorage } from '../../persistence/useAttemptStorage';
import { chime, stopNarration } from '../../audio/narration.mjs';
import { attentionReducer, attentionAttempt, type Action } from './state';
export function useAttention() {
  const persistence = useAttemptStorage(attentionAttempt);
  const [state, setState] = useState(persistence.initialState);
  const save = persistence.save;
  const current = useRef(state),
    epoch = useRef({ start: 0, base: 0 }),
    savedSecond = useRef(-1);
  const elapsed = useCallback(() => {
    const a = current.current.active;
    return a?.status === 'running'
      ? epoch.current.base + (performance.now() - epoch.current.start) / 1000
      : a?.elapsed || 0;
  }, []);
  const send = useCallback(
    (action: Action) => {
      if (action.type === 'start' || action.type === 'resume') {
        stopNarration();
        epoch.current = {
          start: performance.now(),
          base: action.type === 'start' ? 0 : current.current.active?.elapsed || 0,
        };
        savedSecond.current = -1;
      }
      const next = attentionReducer(current.current, action);
      if (next === current.current) return;
      current.current = next;
      setState(next);
      const second = Math.floor(next.active?.elapsed || 0);
      if (
        action.type !== 'tick' ||
        second !== savedSecond.current ||
        next.active?.status !== 'running'
      ) {
        savedSecond.current = second;
        save(next);
      }
    },
    [save],
  );
  useLayoutEffect(() => {
    const pause = (reason: string) => {
      if (current.current.active?.status === 'running')
        send({ type: 'pause', elapsed: elapsed(), reason });
    };
    const timer = setInterval(() => {
      const st = current.current,
        a = st.active;
      if (a?.status !== 'running') return;
      const time = elapsed(),
        due =
          a.condition === 'interrupted' && (st.untimed || time < 120)
            ? duePings(time, a.fired)
            : [];
      let played = 0;
      for (const _ of due) if (a.phoneSound && chime()) played++;
      send({ type: 'tick', elapsed: time, chimes: played });
    }, 200);
    const visibility = () => {
      if (document.hidden) pause('The browser tab was hidden.');
    };
    const pagehide = () => pause('The page was left or refreshed.');
    const route = () => {
      if (location.hash.replace(/^#\//, '').split('?')[0] !== 'attention')
        pause('You left the activity.');
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', pagehide);
    window.addEventListener('hashchange', route);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', pagehide);
      window.removeEventListener('hashchange', route);
      pause('You left the activity.');
      stopNarration();
    };
  }, [elapsed, send]);
  return { state, send, elapsed, persistence, storageAvailable: persistence.status === 'saved' };
}
