import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {VOICE_CLIPS} from '../src/audio/audio-manifest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
function files(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(directory,e.name)):[path.join(directory,e.name)]);}
for(const file of files(path.join(root,'public')))assert.ok(!/\.(?:[cm]?js|[cm]?ts|tsx|html|map)$/.test(file),'Public assets must not contain executable source: '+path.relative(root,file));
for(const file of files(path.join(root,'build')))assert.ok(!/\.(?:mjs|[cm]?ts|tsx|map)$/.test(file),'Production output must not expose source modules: '+path.relative(root,file));
const html=fs.readFileSync(path.join(root,'build/index.html'),'utf8');
for(const [,url]of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 assert.ok(!/^(?:https?:)?\/\//.test(url),'Entry assets must be bundled locally');
 assert.ok(fs.statSync(path.join(root,'build',url)).isFile(),'Entry asset missing: '+url);
}
for(const clip of Object.values(VOICE_CLIPS)){
 const bytes=fs.readFileSync(path.join(root,'build',clip.url));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256,'Built narration differs from approved asset');
}
assert.ok(fs.readFileSync(path.join(root,'build/assets/FONT-LICENSES.txt'),'utf8').includes('SIL OPEN FONT LICENSE'));
console.log('Production boundary: local entry assets, approved audio and font notices verified; no raw source modules.');
