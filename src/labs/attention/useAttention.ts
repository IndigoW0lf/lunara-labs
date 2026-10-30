import {useCallback,useLayoutEffect,useRef,useState} from 'react';
import {LAB_VERSION,duePings} from '../../../dist/data.mjs';
import {chime,stopNarration} from '../../../dist/narration.mjs';
import {attentionReducer,initialAttention,restoreAttention,ATTENTION_KEY,type Action} from './state';
function read(){try{return restoreAttention(JSON.parse(localStorage.getItem(ATTENTION_KEY)||'null'));}catch{return initialAttention();}}
export function useAttention(){
 const [state,setState]=useState(read),[storageAvailable,setStorageAvailable]=useState(true);
 const current=useRef(state),epoch=useRef({start:0,base:0}),savedSecond=useRef(-1);
 const elapsed=useCallback(()=>{const a=current.current.active;return a?.status==='running'?epoch.current.base+(performance.now()-epoch.current.start)/1000:a?.elapsed||0;},[]);
 const send=useCallback((action:Action)=>{
  if(action.type==='start'||action.type==='resume'){stopNarration();epoch.current={start:performance.now(),base:action.type==='start'?0:current.current.active?.elapsed||0};savedSecond.current=-1;}
  const next=attentionReducer(current.current,action);if(next===current.current)return;
  current.current=next;setState(next);
  const second=Math.floor(next.active?.elapsed||0);
  if(action.type!=='tick'||second!==savedSecond.current||next.active?.status!=='running'){
   savedSecond.current=second;
   try{localStorage.setItem(ATTENTION_KEY,JSON.stringify({version:LAB_VERSION,state:next}));}catch{setStorageAvailable(false);}
  }
 },[]);
 useLayoutEffect(()=>{
  const pause=(reason:string)=>{if(current.current.active?.status==='running')send({type:'pause',elapsed:elapsed(),reason});};
  const timer=setInterval(()=>{
   const st=current.current,a=st.active;if(a?.status!=='running')return;
   const time=elapsed(),due=a.condition==='interrupted'&&(st.untimed||time<120)?duePings(time,a.fired):[];
   let played=0;for(const _ of due)if(a.phoneSound&&chime())played++;
   send({type:'tick',elapsed:time,chimes:played});
  },200);
  const visibility=()=>{if(document.hidden)pause('The browser tab was hidden.');};
  const pagehide=()=>pause('The page was left or refreshed.');
  document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',pagehide);
  return ()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pagehide);pause('You left the activity.');stopNarration();};
 },[elapsed,send]);
 return {state,send,elapsed,storageAvailable};
}
