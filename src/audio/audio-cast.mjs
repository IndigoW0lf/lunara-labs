import { messages } from '../domain/data.mjs';

// Same synthesis model as Quest, with a distinct voice and delivery brief for each character.
export const VOICE_MODEL = 'gpt-4o-mini-tts';
export const ATTENTION_INTRO =
  'Here’s a phone you can explore. Open Notes first, then try a notification and see where it takes you. When you come back, notice what helps you find your place again.';
export const VOICE_CAST = {
  A: {
    name: 'Library notice',
    voice: 'sage',
    direction:
      'Read a short community notice clearly and calmly, with practical, matter-of-fact warmth.',
  },
  B: {
    name: 'Sam',
    voice: 'alloy',
    direction:
      'Portray a youthful school-age character chatting with a friend. Use a light, naturally higher register with very little chest resonance, bright curiosity, and relaxed everyday phrasing. Keep the voice natural and believable, without baby talk, squeaking, or a theatrical narrator delivery.',
  },
  C: {
    name: 'Jo',
    voice: 'nova',
    pitchSemitones: 1,
    direction:
      'Portray a youthful school-age character thinking aloud to a friend. Use a light, naturally higher register with very little chest resonance and an easy, curious conversational rhythm. Leave a small questioning lift on maybe. Keep the uncertainty gentle; avoid an adult presenter delivery, baby talk, squeaking, or an ominous tone.',
  },
  D: {
    name: 'Ren',
    voice: 'echo',
    direction:
      'Speak with lively surprise, as a friend passing along news. Keep it natural, without shouting or villainy.',
  },
  E: {
    name: 'Lee',
    voice: 'fable',
    direction:
      'Speak earnestly and a little uncertainly to a friend. Keep might be closed tentative, not definitive.',
  },
  F: {
    name: 'Ari',
    voice: 'coral',
    pitchSemitones: 3,
    direction:
      'Voice Ari as a 13-year-old girl telling another kid some news in casual American English. Use a noticeably high, light head voice with small vocal weight, bright youthful resonance, and clear, quick everyday phrasing. Keep the confidence casual and matter-of-fact. Sound like a young teen speaking to a friend; avoid the low, rich chest register and polished cadence of an adult narrator. Do not add laughter, baby talk, exaggerated squeaking, or melodrama.',
  },
  guide: {
    name: 'Your guide',
    voice: 'marin',
    direction:
      'A warm, curious learning companion giving a learner time to explore. Clear, unhurried and personable, never sing-song.',
  },
};
export function narrationSpecs() {
  return Object.entries(VOICE_CAST).map(([id, cast]) => ({
    id,
    name: cast.name,
    model: VOICE_MODEL,
    voice: cast.voice,
    instructions: 'Read the exact words in clear natural English. ' + cast.direction,
    text: id === 'guide' ? ATTENTION_INTRO : messages.find((m) => m.id === id).text,
    ...(cast.pitchSemitones ? { pitchSemitones: cast.pitchSemitones } : {}),
  }));
}
