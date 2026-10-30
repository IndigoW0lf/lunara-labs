import {useRef, useSyncExternalStore} from 'react';
import {EvidenceLab} from '../labs/evidence/EvidenceLab';
import {EvidenceGuide} from '../labs/evidence/Guide';
import {AttentionLab} from '../labs/attention/AttentionLab';
import {RumorLab} from '../labs/rumor/RumorLab';
import {Catalog} from './pages/Catalog';
import {About} from './pages/About';

const subscribe=(onChange:()=>void)=>{window.addEventListener('hashchange',onChange);return ()=>window.removeEventListener('hashchange',onChange);};
const hashSnapshot=()=>window.location.hash;
export function App(){
 const hash=useSyncExternalStore(subscribe,hashSnapshot);
 const route=hash.replace(/^#\//,'').split('?')[0];
 const privacy=useRef<HTMLDialogElement>(null);
 const close=()=>privacy.current?.close();
 return <>
  <a className="skip" href="#main">Skip to the activity</a>
  <header className="site-header"><a className="wordmark" href="#/" aria-label="Lunara Labs home">Lunara <span>Labs</span></a><nav aria-label="Main navigation"><a href="#/">Explore the labs</a><a href="#/about">How it works</a><span className="private-label">Your private workspace</span></nav></header>
  {route==='evidence'?<EvidenceLab/>:route==='evidence-guide'?<EvidenceGuide/>:route==='rumor'?<RumorLab/>:route==='attention'?<AttentionLab/>:route==='about'?<About/>:<Catalog hash={hash}/>}
  <footer className="site-footer"><a href="https://www.lunaraedit.com" target="_blank" rel="noopener">The Lunara Edit ↗</a><p>Interactive companions to The Lunara Edit curricula.</p><button type="button" id="privacy-button" className="text-button" onClick={()=>privacy.current?.showModal()}>Where your work is saved</button></footer>
  <dialog id="privacy" ref={privacy}><button onClick={close} type="button" className="close-dialog" aria-label="Close">×</button><p className="eyebrow">Your field notes</p><h2>Your work stays in this browser.</h2><p>As you work through a lab, this browser remembers your place and the answers you enter. You can return to them here later, but they will not automatically appear on another device or in Quest. Someone else using this same browser can also see the saved attempt.</p><p>If you want a copy to keep, print your field notes or download the results before starting over for another learner. Starting over replaces the saved attempt, and clearing this site’s browser data also removes it.</p><button onClick={close} type="button" className="button close-privacy">Got it</button></dialog>
 </>;
}
