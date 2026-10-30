import {execFileSync} from 'node:child_process';

export function shiftPitch(bytes,semitones){
 const ratio=2**(semitones/12);
 return execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i','pipe:0','-af',`rubberband=tempo=1:pitch=${ratio}:formant=shifted:pitchq=quality`,'-f','mp3','-codec:a','libmp3lame','-b:a','128k','pipe:1'],{input:bytes,maxBuffer:20*1024*1024});
}

export function prepareClipAudio(clip,spec,transform=shiftPitch){
 const target=spec.pitchSemitones??0,applied=clip.appliedPitchSemitones??0;
 if(!Number.isFinite(target)||Math.abs(target)>12||!Number.isFinite(applied))throw new Error('Invalid narration pitch setting.');
 if(applied!==0&&applied!==target)throw new Error('Pitch setting changed: import an unprocessed source recording.');
 let bytes=Buffer.from(clip.audio,'base64');
 if(bytes.length<1000)throw new Error('Missing narration audio.');
 if(target!==applied)bytes=transform(bytes,target);
 return {bytes,...(target?{appliedPitchSemitones:target}:{})};
}
