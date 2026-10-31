import { LAB_VERSION } from '../../domain/data.mjs';
export const EVIDENCE_VERSION = '1.0.0';
export const EVIDENCE_KEY = 'lunara-labs:1:evidence';
export const evidenceLab = {
  id: 'evidence-workbench',
  slug: 'evidence',
  title: 'Evidence Workbench',
  subtitle: 'What can these courtyard records help us say?',
  area: 'Evidence & reasoning',
  cover: 'assets/alder-library.png',
  coverAlt: 'A watercolor courtyard with trees, paving, and places in sun and shade.',
  coverLine: 'Arrange the records, follow their sources, and explain what they show.',
  color: 'blue',
  description:
    'Arrange four courtyard records beside two claims, trace where the information came from, and build an explanation that stays close to the evidence.',
  companion: 'The Evidence Trail — How Do You Know? · courtyard case, learner pages 27–28',
  steps: ['Start here', 'Arrange the records', 'Explain what they show', 'Your field notes'],
};
export const targets = [
  {
    id: 'unplaced',
    title: 'Records to consider',
    description: 'Read each record, then choose where it belongs. You can change its place later.',
  },
  {
    id: 'recorded',
    title: 'The claim about these records',
    description:
      '“The shaded part of this courtyard had a lower recorded air temperature than the sunny part at noon on both days when measurements were taken.”',
  },
  {
    id: 'everywhere',
    title: 'A broader claim to check',
    description: '“Shade lowers air temperature in every courtyard at every time.”',
  },
  {
    id: 'aside',
    title: 'Doesn’t answer this temperature question',
    description: 'Keep records here if they do not tell us about courtyard air temperature.',
  },
];
export const records = [
  {
    id: 'A',
    title: 'Maintenance observation log',
    parent: null,
    date: 'October 1, 2026 · noon',
    text: 'Shaded location 74°F; sunny location 82°F. The worker used two checked temperature sensors at the same height, each in a ventilated radiation shield. Both temperatures were recorded at the same time. The log gives the locations, time, and readings.',
    readings: { shade: 74, sun: 82 },
  },
  {
    id: 'B',
    title: 'Neighborhood newsletter',
    parent: 'A',
    date: 'October 3, 2026',
    text: '“The shaded spot was cooler at noon.” Reprints the October 1 maintenance readings and identifies Source A. It supplies no new measurements.',
    readings: null,
  },
  {
    id: 'C',
    title: 'Learner-club observation log',
    parent: null,
    date: 'October 2, 2026 · noon',
    text: 'Shaded location 76°F; sunny location 84°F. The club took new measurements with its own checked temperature sensors in radiation shields. It used the same height and locations as the worker. Both temperatures were recorded at the same time.',
    readings: { shade: 76, sun: 84 },
  },
  {
    id: 'D',
    title: 'Older greenhouse report',
    parent: null,
    date: '2014',
    text: 'A 2014 report measures how seedlings grew in a greenhouse. It includes no courtyard air-temperature readings.',
    readings: null,
  },
];
/** @typedef {'A'|'B'|'C'|'D'} CardId */
/** @typedef {'unplaced'|'recorded'|'everywhere'|'aside'} TargetId */
/** @typedef {Record<CardId,TargetId>} Placements */
/** @typedef {{step:number,placements:Placements,history:Placements[],checked:boolean,initialThought:string,explanation:string,nextCheck:string,discussed:boolean,complete:boolean}} BoardState */
const ids = records.map((r) => r.id),
  targetIds = targets.map((t) => t.id);
export function validateSources(items = records) {
  const byId = new Map(items.map((item) => [item.id, item]));
  if (byId.size !== items.length) throw new Error('Duplicate record ID');
  for (const item of items) {
    let current = item;
    const seen = new Set();
    while (current) {
      if (seen.has(current.id)) throw new Error('Source cycle');
      seen.add(current.id);
      if (current.parent && !byId.has(current.parent)) throw new Error('Missing source');
      current = current.parent ? byId.get(current.parent) : null;
    }
  }
  return true;
}
export function sourceTrail(id, items = records) {
  validateSources(items);
  const byId = new Map(items.map((item) => [item.id, item]));
  if (!byId.has(id)) throw new Error('Unknown record');
  const trail = [];
  let current = byId.get(id);
  while (current) {
    trail.push(current.id);
    current = current.parent ? byId.get(current.parent) : null;
  }
  return trail;
}
/** @returns {BoardState} */
export function initialBoard() {
  return {
    step: 0,
    placements: { A: 'unplaced', B: 'unplaced', C: 'unplaced', D: 'unplaced' },
    history: [],
    checked: false,
    initialThought: '',
    explanation: '',
    nextCheck: '',
    discussed: false,
    complete: false,
  };
}
/** @param {unknown} raw */
export function validPlacements(raw) {
  return (
    !!raw &&
    typeof raw === 'object' &&
    !Array.isArray(raw) &&
    Object.keys(raw).length === ids.length &&
    ids.every((id) => Object.hasOwn(raw, id) && targetIds.includes(raw[id]))
  );
}
/** @param {BoardState} state @param {string} id @param {string} target @returns {BoardState} */
export function moveRecord(state, id, target) {
  if (!ids.includes(id) || !targetIds.includes(target) || state.placements[id] === target)
    return state;
  return {
    ...state,
    placements: { ...state.placements, [id]: target },
    history: [...state.history.slice(-29), { ...state.placements }],
    checked: false,
    complete: false,
  };
}
/** @param {BoardState} state @returns {BoardState} */
export function undoMove(state) {
  if (!state.history.length) return state;
  return {
    ...state,
    placements: { ...state.history.at(-1) },
    history: state.history.slice(0, -1),
    checked: false,
    complete: false,
  };
}
/** @param {unknown} raw @returns {BoardState} */
export function restoreBoard(raw) {
  const base = initialBoard();
  if (!raw || typeof raw !== 'object' || raw['version'] !== EVIDENCE_VERSION) return base;
  const saved = raw['state'];
  if (!saved || !validPlacements(saved.placements)) return base;
  const restored = {
    ...base,
    placements: { ...saved.placements },
    history: Array.isArray(saved.history)
      ? saved.history
          .filter(validPlacements)
          .slice(-30)
          .map((p) => ({ ...p }))
      : [],
    step: Number.isInteger(saved.step) ? Math.max(0, Math.min(3, saved.step)) : 0,
    checked: saved.checked === true,
    initialThought: typeof saved.initialThought === 'string' ? saved.initialThought : '',
    explanation: typeof saved.explanation === 'string' ? saved.explanation : '',
    nextCheck: typeof saved.nextCheck === 'string' ? saved.nextCheck : '',
    discussed: saved.discussed === true,
    complete: saved.complete === true,
  };
  const placed = records.every((record) => restored.placements[record.id] !== 'unplaced');
  restored.checked = placed && restored.checked;
  restored.complete = restored.complete && canFinishBoard(restored);
  if (restored.step >= 2 && !restored.checked) restored.step = 1;
  if (restored.step === 3 && !restored.complete) restored.step = 2;
  return restored;
}
/** @param {BoardState} state */
export function canFinishBoard(state) {
  return (
    state.checked &&
    records.every((record) => state.placements[record.id] !== 'unplaced') &&
    (state.discussed || (!!state.explanation.trim() && !!state.nextCheck.trim()))
  );
}
/** @param {BoardState} state @returns {BoardState} */
export function finishBoard(state) {
  return canFinishBoard(state) ? { ...state, step: 3, complete: true } : state;
}
/** @param {BoardState} state */
export function reviewBoard(state) {
  return records.map((record) => {
    const place = state.placements[record.id];
    let feedback = '';
    if (place === 'unplaced')
      feedback = 'Choose a place for this record before comparing your reasoning.';
    else if (record.id === 'D')
      feedback =
        place === 'aside'
          ? 'D measures seedling growth in a greenhouse, so setting it aside fits this courtyard air-temperature question. Its age alone is not the reason.'
          : 'D measures seedling growth, not courtyard air temperature. Look at what was measured before deciding which claim it can help answer.';
    else if (place === 'everywhere')
      feedback =
        'These records concern one courtyard at noon on two dates. They cannot establish what happens in every courtyard at every time, or that shade alone caused the differences.';
    else if (place === 'aside')
      feedback =
        'This record contains or repeats courtyard air-temperature readings. Look again at the claim about the two recorded days.';
    else if (record.id === 'B')
      feedback =
        'B repeats A’s readings and identifies A. It can lead you back to that record, but A and B do not give you two separately collected sets of measurements.';
    else
      feedback = `${record.id} records its own measurements. The shaded reading was ${record.readings.sun - record.readings.shade}°F lower that day. This supports the claim about the recorded readings, while other times and places remain untested here.`;
    return { id: record.id, place, feedback };
  });
}
/** @param {BoardState} state */
export function evidenceResult(state) {
  return {
    schemaVersion: 1,
    labId: evidenceLab.id,
    labVersion: EVIDENCE_VERSION,
    interfaceVersion: LAB_VERSION,
    completion: state.complete ? 'completed' : 'in-progress',
    responses: {
      placements: { ...state.placements },
      sourcePaths: Object.fromEntries(records.map((r) => [r.id, sourceTrail(r.id)])),
      initialThought: state.initialThought,
      explanation: state.explanation,
      nextCheck: state.nextCheck,
      discussed: state.discussed,
      feedbackOpened: state.checked,
    },
    delivery: 'local-only',
    assessment: 'Educational participation and recorded reasoning; no automatic mastery judgment.',
  };
}
validateSources();
