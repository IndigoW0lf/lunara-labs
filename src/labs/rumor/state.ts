import { LAB_VERSION, restoreProgress, rumorQuestions } from '../../domain/data.mjs';
import { isRecord, oneOf, text, step, version, integer } from '../../persistence/validation';
export const RUMOR_KEY = 'lunara-labs:1:rumor';
export type MessageId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type RumorState = {
  activityVersion: string;
  step: number;
  visited: MessageId[];
  selected: MessageId;
  answers: Record<string, number>;
  checked: boolean;
  message: string;
  reflection: string;
  traceNote?: string;
  complete: boolean;
  answerHistory?: Record<string, number>[];
};
export type RumorAction =
  | { type: 'step'; step: number }
  | { type: 'select'; id: MessageId }
  | { type: 'answer'; id: string; value: number }
  | { type: 'check' }
  | { type: 'note'; field: 'message' | 'reflection' | 'traceNote'; value: string }
  | { type: 'complete' }
  | { type: 'restart' };
export function initialRumor(): RumorState {
  return {
    activityVersion: LAB_VERSION,
    step: 0,
    visited: [],
    selected: 'B',
    answers: {},
    checked: false,
    message: '',
    reflection: '',
    complete: false,
  };
}
export function restoreRumor(raw: unknown): RumorState {
  const base = initialRumor();
  const saved: unknown = restoreProgress(raw, base);
  if (!isRecord(saved)) return base;
  const ids = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
  const answers = (value: unknown): Record<string, number> => {
    if (!isRecord(value)) return {};
    return Object.fromEntries(
      rumorQuestions.flatMap((question) => {
        const answer = value[question.id];
        return integer(answer, 0, question.choices.length - 1) ? [[question.id, answer]] : [];
      }),
    );
  };
  return {
    ...base,
    activityVersion: version(
      saved.activityVersion,
      isRecord(raw) ? version(raw.version, base.activityVersion) : base.activityVersion,
    ),
    step: step(saved.step),
    visited: Array.isArray(saved.visited)
      ? [...new Set(saved.visited.filter((id): id is MessageId => oneOf(id, ids)))]
      : [],
    selected: oneOf(saved.selected, ids) ? saved.selected : base.selected,
    answers: answers(saved.answers),
    checked: saved.checked === true,
    message: text(saved.message),
    reflection: text(saved.reflection),
    traceNote: text(saved.traceNote),
    complete: saved.complete === true,
    ...(Array.isArray(saved.answerHistory)
      ? { answerHistory: saved.answerHistory.filter(isRecord).map(answers) }
      : {}),
  };
}
export function rumorReducer(state: RumorState, action: RumorAction): RumorState {
  switch (action.type) {
    case 'step': {
      const step = Math.max(0, Math.min(4, action.step));
      return {
        ...state,
        step,
        visited:
          step === 1 && state.selected !== 'A' && !state.visited.includes(state.selected)
            ? [...state.visited, state.selected]
            : state.visited,
      };
    }
    case 'select':
      return {
        ...state,
        selected: action.id,
        visited: state.visited.includes(action.id) ? state.visited : [...state.visited, action.id],
      };
    case 'answer':
      return { ...state, answers: { ...state.answers, [action.id]: action.value }, checked: false };
    case 'check':
      return {
        ...state,
        checked: true,
        answerHistory: [...(state.answerHistory || []), { ...state.answers }],
      };
    case 'note':
      return { ...state, [action.field]: action.value };
    case 'complete':
      return { ...state, complete: true, step: 4 };
    case 'restart':
      return initialRumor();
  }
}
