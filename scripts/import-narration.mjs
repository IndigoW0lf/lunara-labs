import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { narrationSpecs } from '../src/audio/audio-cast.mjs';
import { prepareClipAudio } from './audio-processing.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (process.stdin.isTTY) process.stdin.setRawMode(true);
console.log('Ready for one narration JSON line on stdin (input hidden).');
const input = JSON.parse(
  await new Promise((resolve, reject) => {
    let pending = Buffer.alloc(0);
    const receive = (chunk) => {
      pending = Buffer.concat([pending, chunk]);
      const end = pending.indexOf(10);
      if (end < 0) return;
      process.stdin.off('data', receive);
      process.stdin.pause();
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      resolve(pending.subarray(0, end).toString('utf8'));
    };
    process.stdin.on('data', receive);
    process.stdin.on('error', reject);
    process.stdin.resume();
  }),
);
const specs = narrationSpecs(),
  manifest = {};
await fs.mkdir(path.join(root, 'public/assets/audio'), { recursive: true });
for (const spec of specs) {
  const clip = input.find((item) => item.id === spec.id);
  if (!clip || ['model', 'voice', 'instructions', 'text'].some((k) => clip[k] !== spec[k]))
    throw new Error('Audio specification mismatch for ' + spec.id);
  const { bytes, ...processing } = prepareClipAudio(clip, spec);
  if (bytes.length < 1000) throw new Error('Missing audio for ' + spec.id);
  const hash = crypto.createHash('sha256').update(JSON.stringify(spec)).digest('hex').slice(0, 16);
  const relative = `assets/audio/${spec.id.toLowerCase()}-${hash}.mp3`;
  await fs.writeFile(path.join(root, 'public', relative), bytes);
  manifest[spec.id] = {
    ...spec,
    ...processing,
    url: relative,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
}
await fs.writeFile(
  path.join(root, 'src/audio/audio-manifest.mjs'),
  '// Fixed, AI-generated dialogue clips. Regenerate when text, direction, model or voice changes.\nexport const VOICE_CLIPS=' +
    JSON.stringify(manifest, null, 2) +
    ';\n',
);
console.log(`Imported ${specs.length} verified AI voice clips.`);
