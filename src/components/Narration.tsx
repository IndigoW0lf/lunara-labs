import {useEffect,useState} from 'react';
import {narrate,stopNarration,type NarrationPhase} from '../audio/narration.mjs';
import {Icon} from './Phone';
export function Narration({person,text,label,initialStatus='The message is written here too.',onSpeakingChange}:{person:string;text:string;label:string;initialStatus?:string;onSpeakingChange?:(speaking:boolean)=>void}){
 const [phase,setPhase]=useState<NarrationPhase|null>(null);
 useEffect(()=>()=>stopNarration(),[person,text]);
 const playing=phase==='speaking'||phase==='loading';
 const status=phase==='unavailable'?'This voice message couldn’t play. You can try again or read the complete message here.':phase==='loading'?'Getting the voice ready…':phase==='speaking'?`${person==='A'?'Library notice':label.replace('Listen to ','')} is speaking.`:phase? 'You can listen again or read the message here.':initialStatus;
 return <><button type="button" className="listen-button" data-listen={'message-'+person} aria-label={playing?'Stop reading':label} aria-pressed={playing} onClick={()=>{if(playing)stopNarration();else narrate(text,{person,onState:phase=>{setPhase(phase);onSpeakingChange?.(phase==='speaking');}});}}><Icon name={playing?'stop':'play'}/><span>{playing?'Stop reading':label}</span></button><p className="audio-status" data-audio-status="" role="status">{status}</p></>;
}
