import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {narrationSpecs} from '../dist/audio-cast.mjs';
import {VOICE_CLIPS} from '../dist/audio-manifest.mjs';
import {narrate,stopNarration} from '../dist/narration.mjs';
import {prepareClipAudio} from '../scripts/audio-processing.mjs';

test('locked cast retains the exact voice recordings selected by the maintainer',()=>{
 const lock=JSON.parse(fs.readFileSync(new URL('../docs/VOICE-CAST-LOCK.json',import.meta.url),'utf8'));
 assert.deepEqual(Object.keys(lock.clips).sort(),Object.keys(VOICE_CLIPS).sort());
 for(const [id,approved]of Object.entries(lock.clips)){
  const clip=VOICE_CLIPS[id];
  for(const key of ['voice','url','sha256'])assert.equal(clip[key],approved[key],id+' '+key);
  assert.equal(clip.pitchSemitones??0,approved.pitchSemitones,id+' pitch');
 }
});

test('every fixed transcript has its own AI voice and a matching, intact MP3 asset',()=>{
 const specs=narrationSpecs();assert.equal(specs.length,7);assert.equal(new Set(specs.map(s=>s.voice)).size,7);
 for(const spec of specs){
  const clip=VOICE_CLIPS[spec.id];assert.ok(clip);
  for(const key of ['text','voice','model','instructions'])assert.equal(clip[key],spec[key]);
  assert.equal(clip.pitchSemitones??0,spec.pitchSemitones??0);
  assert.equal(clip.appliedPitchSemitones??0,spec.pitchSemitones??0);
  const bytes=fs.readFileSync(new URL('../dist/'+clip.url,import.meta.url));assert.ok(bytes.length>1000);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 }
});
test('offline pitch processing reuses finished clips and rejects a second conflicting shift',()=>{
 const source=Buffer.alloc(1200,1),shifted=Buffer.alloc(1400,2);let calls=0;
 const transform=(bytes,semitones)=>{calls++;assert.deepEqual(bytes,source);assert.equal(semitones,5);return shifted;};
 const spec={pitchSemitones:5};
 const first=prepareClipAudio({audio:source.toString('base64')},spec,transform);
 assert.deepEqual(first.bytes,shifted);assert.equal(first.appliedPitchSemitones,5);
 const saved={audio:first.bytes.toString('base64'),appliedPitchSemitones:5};
 assert.deepEqual(prepareClipAudio(saved,spec,transform).bytes,shifted);assert.equal(calls,1);
 assert.throws(()=>prepareClipAudio(saved,{pitchSemitones:7},transform),/unprocessed source/);
 assert.throws(()=>prepareClipAudio(saved,{},transform),/unprocessed source/);
 assert.deepEqual(prepareClipAudio({audio:source.toString('base64')},{},transform).bytes,source);
 assert.equal(calls,1);
});
test('playback reports real play events and cancels the previous clip',()=>{
 const players=[];const previous=globalThis.Audio;
 class Player{constructor(url){this.url=url;players.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){this.removed=true;}}
 globalThis.Audio=Player;
 try{
  const states=[];assert.equal(narrate(VOICE_CLIPS.B.text,{person:'B',onState:s=>states.push(s)}),true);
  assert.deepEqual(states,['loading']);players[0].onplaying();assert.equal(states.at(-1),'speaking');
  narrate(VOICE_CLIPS.C.text,{person:'C'});assert.equal(players[0].paused,true);assert.equal(players[0].removed,true);assert.equal(states.at(-1),'stopped');
  stopNarration();assert.equal(players[1].paused,true);
 }finally{stopNarration();globalThis.Audio=previous;}
});
test('changed words cannot silently play an old recording or use a browser robot voice',()=>{
 const states=[];assert.equal(narrate('Different case text',{person:'B',onState:s=>states.push(s)}),false);
 assert.deepEqual(states,['unavailable']);
});
test('all seven voices start slightly faster while preserving their pitch',()=>{
 const previous=globalThis.Audio;let played=0;
 class Player{
  play(){assert.equal(this.playbackRate,1.05);assert.equal(this.defaultPlaybackRate,1.05);assert.equal(this.preservesPitch,true);played++;return Promise.resolve();}
  pause(){}removeAttribute(){}
 }
 globalThis.Audio=Player;
 try{
  for(const [person,clip]of Object.entries(VOICE_CLIPS))assert.equal(narrate(clip.text,{person}),true);
  assert.equal(played,7);
 }finally{stopNarration();globalThis.Audio=previous;}
});
