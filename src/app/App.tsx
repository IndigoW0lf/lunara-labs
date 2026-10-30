import {useLayoutEffect, useRef, useSyncExternalStore} from 'react';
import {RumorLab} from '../labs/rumor/RumorLab';
import {mountLegacyActivities} from '../../dist/activity-controller.mjs';

// React owns the shell. The adapter owns only the contents of this isolated host
// until each lab is converted; React must not reconcile its descendants.
function ActivityHost(){
 const host=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  if(!host.current)return;
  return mountLegacyActivities(host.current,{externalRumor:true});
 },[]);
 return <main id="main" tabIndex={-1} ref={host}/>;
}

const subscribe=(onChange:()=>void)=>{window.addEventListener('hashchange',onChange);return ()=>window.removeEventListener('hashchange',onChange);};
const hashSnapshot=()=>window.location.hash;
export function App(){
 const hash=useSyncExternalStore(subscribe,hashSnapshot);
 const rumor=hash.replace(/^#\//,'').split('?')[0]==='rumor';
 const privacy=useRef<HTMLDialogElement>(null);
 const close=()=>privacy.current?.close();
 return <>
  <a className="skip" href="#main">Skip to the activity</a>
  <header className="site-header"><a className="wordmark" href="#/" aria-label="Lunara Labs home">Lunara <span>Labs</span></a><nav aria-label="Main navigation"><a href="#/">Explore the labs</a><a href="#/about">How it works</a><span className="private-label">Your private workspace</span></nav></header>
  {rumor?<RumorLab/>:<ActivityHost/>}
  <footer className="site-footer"><a href="https://www.lunaraedit.com" target="_blank" rel="noopener">The Lunara Edit ↗</a><p>Interactive companions to The Lunara Edit curricula.</p><button type="button" id="privacy-button" className="text-button" onClick={()=>privacy.current?.showModal()}>Where your work is saved</button></footer>
  <div id="toast" role="status" aria-live="polite"/>
  <dialog id="privacy" ref={privacy}><button onClick={close} type="button" className="close-dialog" aria-label="Close">×</button><p className="eyebrow">Your field notes</p><h2>Your work stays in this browser.</h2><p>As you work through a lab, this browser remembers your place and the answers you enter. You can return to them here later, but they will not automatically appear on another device or in Quest. Someone else using this same browser can also see the saved attempt.</p><p>If you want a copy to keep, print your field notes or download the results before starting over for another learner. Starting over replaces the saved attempt, and clearing this site’s browser data also removes it.</p><button onClick={close} type="button" className="button close-privacy">Got it</button></dialog>
 </>;
}
