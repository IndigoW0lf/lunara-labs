import {VOICE_CLIPS} from './audio-manifest.mjs';
const NARRATION_RATE=1.05;
let active=null,request=0,watchdog=null,audioContext=null;
export function stopNarration(){
 request++;clearTimeout(watchdog);
 const previous=active;active=null;
 if(previous){previous.audio.onplaying=null;previous.audio.onended=null;previous.audio.onerror=null;previous.audio.pause();previous.audio.removeAttribute('src');previous.onState('stopped');}
}
export function narrate(text,{person='guide',onState=()=>{}}={}){
 stopNarration();const clip=VOICE_CLIPS[person];
 if(!clip||clip.text!==text||typeof Audio==='undefined'){onState('unavailable');return false;}
 const token=++request;
 try{
  const audio=new Audio(clip.url);audio.preload='auto';audio.defaultPlaybackRate=NARRATION_RATE;audio.playbackRate=NARRATION_RATE;audio.preservesPitch=true;active={audio,onState};onState('loading');
  const finish=status=>{if(token!==request)return;clearTimeout(watchdog);audio.onplaying=null;audio.onended=null;audio.onerror=null;active=null;onState(status);};
  audio.onplaying=()=>{if(token!==request)return;clearTimeout(watchdog);onState('speaking');};
  audio.onended=()=>finish('finished');audio.onerror=()=>finish('unavailable');
  watchdog=setTimeout(()=>{if(token===request){audio.pause();finish('unavailable');}},15000);
  audio.play().catch(()=>finish('unavailable'));return true;
 }catch{active=null;clearTimeout(watchdog);onState('unavailable');return false;}
}
export function prepareChime(){try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return false;if(!audioContext)audioContext=new Context();if(audioContext.state==='suspended')audioContext.resume();return true;}catch{return false;}}
export function chime(){if(!prepareChime()||audioContext.state!=='running')return false;try{const start=audioContext.currentTime;for(const [offset,hz]of [[0,660],[.12,880]]){const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,start+offset);g.gain.linearRampToValueAtTime(.035,start+offset+.018);g.gain.exponentialRampToValueAtTime(.001,start+offset+.32);o.connect(g);g.connect(audioContext.destination);o.start(start+offset);o.stop(start+offset+.34);}return true;}catch{return false;}}
