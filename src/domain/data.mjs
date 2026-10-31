export const LAB_VERSION = '0.3.0';
export function restoreProgress(raw, fallback) {
  if (
    !raw ||
    !['0.1.0', '0.2.0', LAB_VERSION].includes(raw.version) ||
    !raw.state ||
    typeof raw.state !== 'object' ||
    Array.isArray(raw.state)
  )
    return fallback;
  return { ...fallback, ...raw.state, activityVersion: raw.state.activityVersion || raw.version };
}
export const labs = {
  rumor: {
    id: 'rumor-grow',
    slug: 'rumor',
    title: 'How Does a Rumor Grow?',
    subtitle: 'Let’s follow a message and look at how its meaning changes along the way.',
    area: 'Information & media',
    cover: 'assets/rumor-lab-cover.png',
    coverAlt:
      'Three learners pass a story along as speech bubbles grow from a small roof repair into an exaggerated imagined disaster.',
    coverLine: 'Follow a message as it changes from one person to the next.',
    color: 'sage',
    description:
      'A library notice makes its way through several people, and some details change as they pass it along. You’ll compare their messages, trace where the information came from, and decide what you could tell someone using what you actually found.',
    companion: 'How Does a Rumor Grow? · Part 1, printed pages 04–10',
    steps: [
      'Start here',
      'Trace the messages',
      'Check the evidence',
      'Write your message',
      'Your field notes',
    ],
  },
  attention: {
    id: 'attention-trap',
    slug: 'attention',
    title: 'The Attention Trap',
    subtitle: 'Explore what happens when a task is interrupted.',
    area: 'Mind & attention',
    cover: 'assets/attention-lab-cover.png',
    coverAlt:
      'A learner looks at a phone held with its screen facing her while her pencil pauses above unfinished work.',
    coverLine: 'Explore what happens when a notification pulls you away from a task.',
    color: 'peach',
    description:
      'You’ll try a short letter search twice, with a few planned interruptions in one round. After recording what happened, you’ll look at your time, effort, and accuracy together and consider what this one comparison can tell you.',
    companion: 'The Attention Trap · learner pages 05–07',
    steps: [
      'Start here',
      'Make a prediction',
      'Try both rounds',
      'Compare your results',
      'Your field notes',
    ],
  },
};
export const messages = [
  {
    id: 'A',
    sender: 'Library notice',
    time: 'Thursday · 10 a.m.',
    parent: null,
    text: 'Saturday’s star-viewing session at Alder Library will move from the roof terrace to the courtyard while a new handrail is fitted. It will still begin at 7 p.m. Indoor rooms will be open as usual.',
    note: 'The notice tells us what the library announced at 10 a.m. Keep that in mind as you read the later messages: a plan for an event is different from a record of what happened afterward, or an inspection of the whole building.',
  },
  {
    id: 'B',
    sender: 'Sam',
    time: '10:10 a.m.',
    parent: 'A',
    text: 'Saturday’s star viewing won’t be on the library roof. They are fitting a new handrail.',
    note: 'Sam keeps the explanation about a new handrail, while leaving out the courtyard, the start time, and the information about indoor rooms. Those missing details could matter to someone planning a visit, even though the details Sam does include agree with the notice. As you compare the messages, consider what a reader would need to know for their particular purpose.',
  },
  {
    id: 'C',
    sender: 'Jo',
    time: '10:20 a.m.',
    parent: 'B',
    text: 'The library roof is shut for repairs on Saturday. Maybe something broke.',
    note: 'Jo adds “Maybe something broke,” which offers a possible explanation that the notice did not give. The word “maybe” shows that this part is uncertain. We can identify the addition by comparing the messages, but the words do not tell us why Jo included it.',
  },
  {
    id: 'D',
    sender: 'Ren',
    time: '10:35 a.m.',
    parent: 'C',
    text: 'Something broke on the roof, so Saturday’s star viewing is canceled.',
    note: 'Compare “Maybe something broke” with “Something broke on the roof.” Ren’s version sounds certain about what was only a possibility in Jo’s message, and it also says the event is canceled. The handoff supplies no new observation or record that would support either change, so more confident wording has not brought us more evidence.',
  },
  {
    id: 'E',
    sender: 'Lee',
    time: '10:40 a.m.',
    parent: 'C',
    text: 'The library roof needs repairs. I heard the library might be closed Saturday.',
    note: 'Lee suggests that the library might be closed, which is a larger claim than saying a roof-terrace event has moved. Look back at notice A and think about how someone planning to use an indoor room could understand Lee’s message differently from the original announcement.',
  },
  {
    id: 'F',
    sender: 'Ari',
    time: '10:55 a.m.',
    parent: 'E',
    text: 'Alder Library is closed Saturday. People keep saying the building has a problem.',
    note: 'In Lee’s message, the library “might be closed.” Ari now says it “is closed” and mentions that people keep saying there is a problem. Hearing a claim repeated can give us more messages to read, but here the route still supplies no new building observation gathered by those later senders.',
  },
];
export const rumorQuestions = [
  {
    id: 'origins',
    question:
      'Look back through the route followed by messages B–F. How many original library notices do their messages lead back to?',
    choices: ['Five separate notice sources', 'One notice source', 'No notice source'],
    answer: 1,
    explanation:
      'Follow the arrows back from each sender and you arrive at notice A. There are five later people passing information along, but their messages share that starting notice. To count another separately gathered report, we would need to know what another source checked for itself.',
  },
  {
    id: 'inspection',
    question:
      'Has anyone in messages B–F supplied a firsthand building inspection: a record of checking the building for themselves? How many are given?',
    choices: [
      'One, because there is a library notice',
      'Five, because five people sent messages',
      'None are supplied',
    ],
    answer: 2,
    explanation:
      'Notice A describes the library’s plan for the event, and B–F pass along versions of that information. None of them gives a record of inspecting the building. We would need a relevant inspection or observation to answer a question about its condition, so that part remains open.',
  },
  {
    id: 'plan',
    question: 'Which of these can we find out by reading notice A?',
    choices: [
      'The announced plan at 10 a.m.',
      'That the whole building had no problems',
      'That the event later happened exactly as planned',
    ],
    answer: 0,
    explanation:
      'Reading A tells us that the library announced a courtyard location, a 7 p.m. start, and indoor rooms open as usual. Those are details about the plan at the time of the notice. To find out what happened later, or whether every part of the building was in good condition, we would need records that address those questions.',
  },
  {
    id: 'intent',
    question:
      'When a message changes, we might wonder why. Do the words in these messages tell us whether a sender meant to mislead anyone?',
    choices: [
      'Yes: every changed message was deliberate',
      'Yes: everyone must have forgotten',
      'No: the records do not tell us what each sender knew or intended',
    ],
    answer: 2,
    explanation:
      'We can point to words that were added, left out, or changed. To explain why a sender made that change, we would need information about what the person knew or intended. The wording alone does not tell us whether they forgot something, misunderstood it, or chose to change it deliberately.',
  },
];
export const passages = {
  quiet: [
    'Ella and Liam walked to the edge of a green meadow.',
    'They hoped to see bees resting near the wild roses.',
    'Each friend carried a pencil and a sheet of paper.',
    'They watched a beetle creep over a smooth stone.',
    'Liam drew the creek, and Ella sketched three reeds.',
    'The breeze moved the leaves beside a wooden gate.',
    'They heard a bird and turned to see where it sat.',
    'After a rest, they helped clear the narrow trail.',
    'They left the meadow as the evening light faded.',
    'Each kept a page of notes to read again at home.',
  ].join('\n'),
  interrupted: [
    'Emma and Noah walked to the edge of a green garden.',
    'They hoped to see bees resting near the pale roses.',
    'Each friend carried a pencil and a sheet of paper.',
    'They watched a beetle creep over a smooth shell.',
    'Noah drew the fence, and Emma sketched three stems.',
    'The breeze moved the leaves beside a wooden shed.',
    'They heard a bird and turned to see where it hid.',
    'After a rest, they helped clear the narrow paths.',
    'They left the garden as the evening light faded.',
    'Each kept a page of notes to read again at home.',
  ].join('\n'),
};
export const PING_TIMES = [20, 45, 70, 95];
export function countTargets(text) {
  return [...text].filter((c) => /e/i.test(c)).length;
}
export function scoreRound(text, selections, lastChecked) {
  const stop = Math.max(
    -1,
    Math.min(text.length - 1, Number.isInteger(lastChecked) ? lastChecked : -1),
  );
  const marked = new Set(selections.filter((i) => Number.isInteger(i) && i >= 0 && i <= stop));
  let correct = 0,
    missed = 0,
    other = 0;
  for (let i = 0; i <= stop; i++) {
    if (/e/i.test(text[i])) {
      if (marked.has(i)) correct++;
      else missed++;
    } else if (marked.has(i) && /[a-z]/i.test(text[i])) other++;
  }
  return { correct, missed, other, lastChecked: stop, totalTargets: countTargets(text) };
}
export function summarizeRound(text, round = {}) {
  const selections = Array.isArray(round.selected) ? round.selected : [];
  const whole = scoreRound(text, selections, text.length - 1);
  const marker = round.marker ?? round.score?.lastChecked;
  const checked =
    !round.uncertain && Number.isInteger(marker) && marker >= 0
      ? scoreRound(text, selections, marker)
      : null;
  const denominator = checked ? checked.correct + checked.missed + checked.other : 0;
  return {
    found: whole.correct,
    totalTargets: whole.totalTargets,
    notCircled: whole.missed,
    other: whole.other,
    foundPercent: whole.totalTargets ? Math.round((100 * whole.correct) / whole.totalTargets) : 0,
    checked,
    accuracyPercent: denominator ? Math.round((100 * checked.correct) / denominator) : null,
  };
}
export function duePings(elapsed, fired = []) {
  return PING_TIMES.filter((s) => elapsed >= s && !fired.includes(s));
}
export function makeResult(slug, state) {
  return {
    schemaVersion: 1,
    labId: labs[slug].id,
    labVersion: state.activityVersion || LAB_VERSION,
    interfaceVersion: LAB_VERSION,
    completion: state.complete ? 'completed' : 'in-progress',
    responses:
      slug === 'rumor'
        ? {
            visitedMessages: state.visited,
            traceNote: state.traceNote || '',
            answers: state.answers,
            answerHistory: state.answerHistory || [],
            message: state.message || '',
            reflection: state.reflection || '',
          }
        : {
            prediction: state.prediction,
            order: state.order,
            conditions: {
              untimed: !!state.untimed,
              breakShortened: !!state.breakShortened,
              phoneSound: !!state.phoneSound,
            },
            exploration: {
              apps: state.sandboxVisits || [],
              notificationsTried: state.demoNotificationCount || 0,
            },
            rounds: state.rounds,
            comparisonScores: Object.fromEntries(
              Object.entries(state.rounds || {}).map(([condition, round]) => [
                condition,
                summarizeRound(passages[condition], round),
              ]),
            ),
            reflection: state.reflection || '',
            conclusion: state.conclusion,
          },
    delivery: 'local-only',
    assessment: 'educational activity; no diagnostic or population inference',
  };
}
