import {
  LAB_VERSION,
  restoreProgress,
  passages,
  scoreRound,
  duePings,
  PING_TIMES,
} from '../../domain/data.mjs';
import {
  isRecord,
  oneOf,
  text,
  nonNegative,
  integer,
  step,
  version,
} from '../../persistence/validation';
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
// Restored rounds get the same defaults as newly started rounds.
function initialRound(condition: Condition, phoneSound = false): Round {
  return {
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
    phoneSound,
    chimesPlayed: 0,
    openedNotifications: [],
    presentation: 'practice-phone',
    phonePanel: 'notes',
  };
}

function restoreRound(value: unknown, condition: Condition): Round | null {
  if (!isRecord(value)) return null;
  const limit = passages[condition].length - 1;
  const marker = value.marker ?? (isRecord(value.score) ? value.score.lastChecked : null);
  const effort = oneOf(value.effort, ['1', '2', '3', '4', '5'])
    ? Number(value.effort)
    : value.effort;
  const round: Round = {
    ...initialRound(condition),
    status: oneOf(value.status, ['running', 'paused', 'stopped']) ? value.status : 'paused',
    phase: value.phase === 'record' || value.status === 'stopped' ? 'record' : 'working',
    selected: Array.isArray(value.selected)
      ? [...new Set(value.selected.filter((index): index is number => integer(index, 0, limit)))]
      : [],
    elapsed: nonNegative(value.elapsed),
    fired: Array.isArray(value.fired)
      ? [...new Set(value.fired.filter((time): time is number => oneOf(time, PING_TIMES)))]
      : [],
    cueVisible: value.cueVisible === true,
    pauses: Math.floor(nonNegative(value.pauses)),
    marker: integer(marker, -1, limit) ? marker : null,
    uncertain: value.uncertain === true,
    effort: integer(effort, 1, 5) ? effort : '',
    lost: text(value.lost),
    notes: text(value.notes),
    phoneSound: value.phoneSound === true,
    chimesPlayed: Math.floor(nonNegative(value.chimesPlayed)),
    openedNotifications: Array.isArray(value.openedNotifications)
      ? value.openedNotifications.flatMap((item) =>
          isRecord(item) &&
          integer(item.cue, 1, 4) &&
          typeof item.at === 'number' &&
          Number.isFinite(item.at) &&
          item.at >= 0
            ? [{ cue: item.cue, at: item.at }]
            : [],
        )
      : [],
    presentation: text(value.presentation, 'practice-phone'),
    phonePanel: value.phonePanel === 'message' ? 'message' : 'notes',
    ...(typeof value.pauseReason === 'string' ? { pauseReason: value.pauseReason } : {}),
    recovered: value.recovered === true,
    alertIndex: integer(value.alertIndex, 0, 3) ? value.alertIndex : 0,
    dismissedNotifications: Math.floor(nonNegative(value.dismissedNotifications)),
  };
  // Scores are derived from validated marks; a stored score is not authoritative.
  if (Object.hasOwn(value, 'score'))
    round.score = round.uncertain
      ? null
      : scoreRound(passages[condition], round.selected, round.marker);
  return round;
}

export function restoreAttention(raw: unknown): AttentionState {
  const base = initialAttention();
  const saved: unknown = restoreProgress(raw, base);
  if (!isRecord(saved)) return base;
  const conditions = ['quiet', 'interrupted'] as const;
  const apps = ['home', 'notes', 'messages', 'photos', 'settings'] as const;
  const rounds: AttentionState['rounds'] = {};
  for (const condition of conditions) {
    const round = isRecord(saved.rounds) ? restoreRound(saved.rounds[condition], condition) : null;
    if (round) rounds[condition] = round;
  }
  const active =
    isRecord(saved.active) && oneOf(saved.active.condition, conditions)
      ? restoreRound(saved.active, saved.active.condition)
      : null;
  if (active?.status === 'running') {
    active.status = 'paused';
    active.recovered = true;
    active.pauses += 1;
  }
  const order =
    Array.isArray(saved.order) &&
    saved.order.length === 2 &&
    saved.order[0] !== saved.order[1] &&
    saved.order.every((item) => oneOf(item, conditions))
      ? (saved.order as Condition[])
      : null;
  let restoredStep = step(saved.step);
  // A partial/damaged attempt must leave a reachable way to continue.
  if (restoredStep >= 3 && (!rounds.quiet || !rounds.interrupted)) restoredStep = 2;
  if (restoredStep === 2 && !active && !order) restoredStep = 1;
  return {
    ...base,
    activityVersion: version(
      saved.activityVersion,
      isRecord(raw) ? version(raw.version, base.activityVersion) : base.activityVersion,
    ),
    step: restoredStep,
    prediction: text(saved.prediction),
    order,
    untimed: saved.untimed === true,
    rounds,
    active,
    reflection: text(saved.reflection),
    conclusion: integer(saved.conclusion, 0, 3) ? saved.conclusion : null,
    complete: saved.complete === true && !!rounds.quiet && !!rounds.interrupted,
    phoneSound: saved.phoneSound === true,
    coinResult: text(saved.coinResult),
    breakStart: nonNegative(saved.breakStart),
    breakShortened: saved.breakShortened === true,
    sandboxApp: oneOf(saved.sandboxApp, apps) ? saved.sandboxApp : 'home',
    sandboxVisits: Array.isArray(saved.sandboxVisits)
      ? [...new Set(saved.sandboxVisits.filter((app): app is string => oneOf(app, apps)))]
      : [],
    demoNotification: saved.demoNotification === true,
    demoNotificationCount: Math.floor(nonNegative(saved.demoNotificationCount)),
  };
}
export function attentionReducer(st: AttentionState, action: Action): AttentionState {
  const a = st.active;
  switch (action.type) {
    case 'select': {
      if (
        !a ||
        !integer(action.index, 0, passages[a.condition].length - 1) ||
        (action.marking ? a.phase !== 'record' : a.status !== 'running' || a.phase !== 'working')
      )
        return st;
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
        active: initialRound(condition, !!st.phoneSound),
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
