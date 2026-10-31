import {
  LAB_VERSION,
  restoreProgress,
  passages,
  scoreRound,
  duePings,
} from '../../domain/data.mjs';
export const ATTENTION_KEY = 'lunara-labs:1:attention';
export type Condition = 'quiet' | 'interrupted';
export type Round = {
  condition: Condition;
  status: 'running' | 'paused' | 'stopped';
  phase: 'working' | 'record';
  selected: number[];
  elapsed: number;
  fired: number[];
  cueVisible: boolean;
  pauses: number;
  marker: number | null;
  uncertain: boolean;
  effort: number | '';
  lost: string;
  notes: string;
  phoneSound: boolean;
  chimesPlayed: number;
  openedNotifications: { cue: number; at: number }[];
  presentation: string;
  phonePanel: 'notes' | 'message';
  pauseReason?: string;
  recovered?: boolean;
  alertIndex?: number;
  dismissedNotifications?: number;
  score?: ReturnType<typeof scoreRound> | null;
};
export type AttentionState = {
  activityVersion: string;
  step: number;
  prediction: string;
  order: Condition[] | null;
  untimed: boolean;
  rounds: Partial<Record<Condition, Round>>;
  active: Round | null;
  reflection: string;
  conclusion: number | null;
  complete: boolean;
  phoneSound?: boolean;
  coinResult?: string;
  breakStart?: number;
  breakShortened?: boolean;
  sandboxApp?: string;
  sandboxVisits?: string[];
  demoNotification?: boolean;
  demoNotificationCount?: number;
};
export type Action =
  | { type: 'select'; index: number; marking: boolean }
  | {
      type: 'configure';
      patch: Partial<Omit<AttentionState, 'active' | 'rounds' | 'activityVersion'>>;
    }
  | { type: 'round'; patch: Partial<Round> }
  | { type: 'start'; now: number }
  | { type: 'tick'; elapsed: number; chimes: number }
  | { type: 'pause'; elapsed: number; reason: string }
  | { type: 'resume' }
  | { type: 'stop'; elapsed: number }
  | { type: 'saveRound'; now: number }
  | { type: 'restart' };
export function initialAttention(): AttentionState {
  return {
    activityVersion: LAB_VERSION,
    step: 0,
    prediction: '',
    order: null,
    untimed: false,
    rounds: {},
    active: null,
    reflection: '',
    conclusion: null,
    complete: false,
  };
}
export function restoreAttention(raw: unknown): AttentionState {
  const st: AttentionState = restoreProgress(raw, initialAttention());
  if (st.active?.status === 'running')
    st.active = {
      ...st.active,
      status: 'paused',
      recovered: true,
      pauses: (st.active.pauses || 0) + 1,
    };
  return st;
}
export function attentionReducer(st: AttentionState, action: Action): AttentionState {
  const a = st.active;
  switch (action.type) {
    case 'select': {
      if (!a || (!action.marking && a.status !== 'running')) return st;
      return {
        ...st,
        active: {
          ...a,
          ...(action.marking
            ? { marker: action.index, uncertain: false }
            : {
                selected: a.selected.includes(action.index)
                  ? a.selected.filter((i) => i !== action.index)
                  : [...a.selected, action.index],
              }),
        },
      };
    }
    case 'configure':
      return { ...st, ...action.patch };
    case 'round':
      return a ? { ...st, active: { ...a, ...action.patch } } : st;
    case 'start': {
      const condition = st.order?.find((c) => !st.rounds[c]);
      if (!condition) return st;
      return {
        ...st,
        breakShortened:
          Object.keys(st.rounds).length === 1
            ? action.now - (st.breakStart || 0) < 60000
            : st.breakShortened,
        active: {
          condition,
          status: 'running',
          phase: 'working',
          selected: [],
          elapsed: 0,
          fired: [],
          cueVisible: false,
          pauses: 0,
          marker: null,
          uncertain: false,
          effort: '',
          lost: '',
          notes: '',
          phoneSound: !!st.phoneSound,
          chimesPlayed: 0,
          openedNotifications: [],
          presentation: 'practice-phone',
          phonePanel: 'notes',
        },
      };
    }
    case 'tick': {
      if (!a || a.status !== 'running') return st;
      if (!st.untimed && action.elapsed >= 120)
        return {
          ...st,
          active: { ...a, elapsed: 120, status: 'stopped', phase: 'record', cueVisible: false },
        };
      const due = a.condition === 'interrupted' ? duePings(action.elapsed, a.fired) : [];
      return {
        ...st,
        active: {
          ...a,
          elapsed: action.elapsed,
          ...(due.length
            ? {
                fired: [...a.fired, ...due],
                cueVisible: true,
                alertIndex: (a.fired.length + due.length - 1) % 4,
                chimesPlayed: (a.chimesPlayed || 0) + action.chimes,
              }
            : {}),
        },
      };
    }
    case 'pause':
      return a?.status === 'running'
        ? {
            ...st,
            active: {
              ...a,
              elapsed: Math.min(st.untimed ? Infinity : 120, action.elapsed),
              status: 'paused',
              pauses: (a.pauses || 0) + 1,
              pauseReason: action.reason,
            },
          }
        : st;
    case 'resume':
      return a?.status === 'paused' ? { ...st, active: { ...a, status: 'running' } } : st;
    case 'stop':
      return a
        ? {
            ...st,
            active: {
              ...a,
              elapsed: Math.min(st.untimed ? Infinity : 120, action.elapsed),
              status: 'stopped',
              phase: 'record',
              cueVisible: false,
            },
          }
        : st;
    case 'saveRound': {
      if (!a) return st;
      const rounds = {
        ...st.rounds,
        [a.condition]: {
          ...a,
          score: a.uncertain ? null : scoreRound(passages[a.condition], a.selected, a.marker),
        },
      };
      return {
        ...st,
        rounds,
        active: null,
        ...(Object.keys(rounds).length === 2
          ? { step: 3 }
          : { breakStart: action.now, breakShortened: false }),
      };
    }
    case 'restart':
      return initialAttention();
  }
}
