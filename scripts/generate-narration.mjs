import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {narrationSpecs} from '../dist/audio-cast.mjs';
import {VOICE_CLIPS} from '../dist/audio-manifest.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const clips=[];
for(const spec of narrationSpecs()){
 const existing=VOICE_CLIPS[spec.id];
 if(existing&&['model','voice','instructions','text'].every(k=>existing[k]===spec[k])&&(existing.pitchSemitones??0)===(spec.pitchSemitones??0)&&(existing.appliedPitchSemitones??0)===(spec.pitchSemitones??0)){
  try{const bytes=await fs.readFile(path.join(root,'dist',existing.url));if(crypto.createHash('sha256').update(bytes).digest('hex')===existing.sha256){clips.push({...existing,audio:bytes.toString('base64')});console.log(spec.id+': using cached '+spec.voice+' clip');continue;}}catch{}
 }
 const key=process.env.OPENAI_API_KEY;
 if(!key)throw new Error('Set OPENAI_API_KEY securely to generate changed audio. Existing bundled clips need no key.');
 const response=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:spec.model,voice:spec.voice,input:spec.text,instructions:spec.instructions,response_format:'mp3'}),signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw new Error('Speech generation failed for '+spec.id+' (HTTP '+response.status+').');
 const bytes=Buffer.from(await response.arrayBuffer());
 if(bytes.length<1000)throw new Error('Empty audio for '+spec.id);
 clips.push({...spec,audio:bytes.toString('base64')});console.log(spec.id+': generated '+spec.voice+' clip');
}
const child=spawn(process.execPath,[path.join(root,'scripts/import-narration.mjs')],{cwd:root,stdio:['pipe','inherit','inherit']});
child.stdin.end(JSON.stringify(clips)+'\n');
const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
if(code!==0)process.exitCode=1;
