import {useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {labs,messages,rumorQuestions,makeResult,LAB_VERSION} from '../../domain/data.mjs';
import {stopNarration} from '../../audio/narration.mjs';
import {LabLayout} from '../../components/LabLayout';
import {Icon,Phone,PhoneHeader,Portrait,VoiceWaves} from '../../components/Phone';
import {Narration} from '../../components/Narration';
import {copy} from './copy';
import {initialRumor,restoreRumor,rumorReducer,RUMOR_KEY,type RumorState,type RumorAction,type MessageId} from './state';

const lab=labs.rumor;
type Dispatch=(action:RumorAction)=>void;
function readAttempt(){try{return restoreRumor(JSON.parse(localStorage.getItem(RUMOR_KEY)||'null'));}catch{return initialRumor();}}
function Notice(){return <div className="source-notice"><span className="source-meta">A · Library notice · Thursday, 10 a.m.</span><blockquote>{messages[0].text}</blockquote><p className="small muted">{messages[0].note}</p></div>;}
function Button({id,children,onClick,secondary=false,disabled=false}:{id:string;children:ReactNode;onClick:()=>void;secondary?:boolean;disabled?:boolean}){return <button type="button" id={id} className={'button'+(secondary?' secondary':'')} onClick={onClick} disabled={disabled}>{children}</button>;}
function VoiceMessage({id,intro=false,children}:{id:MessageId;intro?:boolean;children?:ReactNode}){
 const m=messages.find(x=>x.id===id)||messages[1];
 const [speaking,setSpeaking]=useState(false);
 return <div className={'call-screen'+(speaking?' is-speaking':'')}>
  <div className="call-person" data-caller={id}><Portrait id={id} className="caller-person"/>{id!=='A'&&<VoiceWaves/>}</div>
  <h3>{m.sender}</h3><p className="call-subtitle">{intro?'A voice message for you':id==='A'?'Thursday · 10 a.m.':`Message ${id} · ${m.time}`}</p>
  <Narration person={id} text={m.text} label={id==='A'?'Read the notice aloud':'Listen to '+m.sender} initialStatus={intro?'You can listen or read the message below.':undefined} onSpeakingChange={setSpeaking}/>
  <div className="chat-bubble incoming">{m.text}</div>{children}
 </div>;
}
function Intro({go}:{go:(step:number)=>void}){return <>
 <h1>{lab.title}</h1><p>{lab.subtitle}</p>
 <section className="illustrated-world library-world intro-world" aria-label="The Alder Library courtyard and an illustrated caller"><div className="world-light"/><aside className="world-guide"><Portrait id="B" className="guide-person"/><div className="guide-speech"><p className="eyebrow">A message from Sam</p><p className="coach-copy">Sam has something to tell you about Saturday’s star viewing. Listen to his message or read it on the phone. Later, you’ll follow the conversation to see how the information changes.</p></div></aside><div className="world-device"><Phone label="Sam’s message on the practice phone"><PhoneHeader title="Alder Library" subtitle="A conversation to investigate"/><VoiceMessage id="B" intro/></Phone></div><div className="world-caption">Alder Library · follow what people say, then look back at where it came from</div></section>
 <div className={'sheet '+lab.color+' intro-grid'}><div><h2>How did the message end up saying something else?</h2>{copy.introStory}</div><figure className="lab-cover"><div className="cover-masthead">Lunara Labs</div><figcaption><span className="cover-kind">An interactive investigation</span><h3>{lab.title}</h3><p>{lab.coverLine}</p></figcaption><img src={lab.cover} alt={lab.coverAlt}/><div className="cover-footer">The Lunara Edit</div></figure></div>
 {copy.introAim}<h2>Here’s how we’ll work through it</h2><ol className="numbered-list"><li>Read the original notice, then follow the route to see who passed each message along.</li><li>Compare the messages and use the records to answer a few questions about what they show.</li><li>Write a useful message of your own, then keep a note of what you would want to check next.</li></ol><p className="companion-label">You can use this lab alongside {lab.companion}.</p><div className="button-row"><Button id="start" onClick={()=>go(1)}>Let’s investigate →</Button></div>
 </>;}
function Conversation({state,select}:{state:RumorState;select:(id:MessageId)=>void}){
 const m=messages.find(x=>x.id===state.selected)||messages[1],parent=messages.find(x=>x.id===m.parent);
 return <section className="illustrated-world library-world conversation-world" aria-label="Investigate the Alder Library conversation"><div className="world-light"/><div className="conversation-contacts"><h2>Who passed it along?</h2><p>Choose someone to open their message.</p>{messages.slice(1).map(x=><button key={x.id} type="button" className={'character-contact '+(m.id===x.id?'selected ':'')+(state.visited.includes(x.id as MessageId)?'explored':'')} data-node={x.id} aria-label={`Read message ${x.id}, ${x.sender}`} aria-pressed={m.id===x.id} onClick={()=>select(x.id as MessageId)}><Portrait id={x.id} className="contact-person"/><span>{x.sender}<small>Message {x.id}</small></span>{state.visited.includes(x.id as MessageId)&&<span className="contact-tick" aria-hidden="true">✓</span>}</button>)}<button type="button" className="notice-shortcut" data-node="A" onClick={()=>select('A')}><Icon name="notice"/> Read the library notice</button></div>
 <div className="conversation-device"><Phone label={m.sender+'’s message'} className="conversation-phone" bar={m.time.replace('Thursday · ','').replace(' a.m.','')}><PhoneHeader title="Saturday’s star viewing" subtitle="Alder Library conversation"/><VoiceMessage key={m.id} id={m.id as MessageId}>{parent?<button type="button" className="heard-from" data-node={parent.id} onClick={()=>select(parent.id as MessageId)}><Icon name="arrow"/> {m.sender} {parent.id==='A'?'read the library notice':'heard '+parent.sender+'’s message'} <span>{parent.id}</span></button>:<p className="chat-aside">The library notice is the starting record in this route.</p>}</VoiceMessage></Phone></div>
 <aside className="conversation-insight"><div className="pinned-note"><span className="paper-pin" aria-hidden="true"/><p className="eyebrow">Look at what changed</p><h3>{m.id==='A'?'The starting notice':m.sender+'’s version'}</h3><p>{m.note}</p>{parent&&<details className="earlier-message"><summary>Read the message {m.sender} received</summary><p className="small"><strong>{parent.sender} · {parent.id}</strong></p><p>{parent.text}</p></details>}</div></aside>
 </section>;
}
function Trace({state,dispatch,go}:{state:RumorState;dispatch:Dispatch;go:(step:number)=>void}){
 const frame=useRef(0);
 useLayoutEffect(()=>()=>cancelAnimationFrame(frame.current),[]);
 const select=(id:MessageId)=>{stopNarration();dispatch({type:'select',id});cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(`[data-node="${id}"]`)?.focus({preventScroll:true}));};
 const visited=state.visited.filter(id=>id!=='A').length;
 return <>{copy.traceIntro}<details className="original-notice"><summary><Icon name="notice"/> Open the original library notice · A</summary><Notice/></details><Conversation state={state} select={select}/><p className="quiet-note">You’ve opened {visited} of the 5 later messages. Visit each person, B–F, so you have the whole conversation to compare.</p>{copy.traceHelp}<textarea id="trace-note" placeholder="Describe a change you noticed as you followed the conversation." value={state.traceNote||''} onChange={e=>dispatch({type:'note',field:'traceNote',value:e.target.value})}/><div className="button-row"><Button id="trace-next" onClick={()=>go(2)} disabled={visited<5}>Check the evidence →</Button><Button id="trace-back" secondary onClick={()=>go(0)}>Back</Button></div></>;
}
function Evidence({state,dispatch,go}:{state:RumorState;dispatch:Dispatch;go:(step:number)=>void}){
 const firstFeedback=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{if(state.checked)firstFeedback.current?.scrollIntoView({block:'center'});},[state.checked]);
 return <>{copy.evidenceIntro}<details className="sheet"><summary>Read notice A again</summary><Notice/></details>{rumorQuestions.map((q,i)=><fieldset key={q.id} className="question"><legend>{i+1}. {q.question}</legend>{q.choices.map((choice,j)=><label key={choice} className="choice"><input type="radio" name={q.id} value={j} checked={state.answers[q.id]===j} onChange={()=>dispatch({type:'answer',id:q.id,value:j})}/>{choice}</label>)}{state.checked&&<div ref={i===0?firstFeedback:undefined} className={'feedback'+(state.answers[q.id]===q.answer?'':' revisit')}><strong>{state.answers[q.id]===q.answer?'Yes, that matches what these records show.':'Let’s look back at the relevant detail.'}</strong>{q.explanation}</div>}</fieldset>)}<div className="button-row">{state.checked?<Button id="evidence-next" onClick={()=>go(3)}>Write a useful message →</Button>:<Button id="check-reasoning" onClick={()=>dispatch({type:'check'})} disabled={!rumorQuestions.every(q=>Number.isInteger(state.answers[q.id]))}>Check my reasoning</Button>}<Button id="evidence-back" secondary onClick={()=>go(1)}>Back to the route</Button></div></>;
}
function Write({state,dispatch,go}:{state:RumorState;dispatch:Dispatch;go:(step:number)=>void}){return <>
 {copy.writeIntro}<Notice/>{copy.writeHelp}<textarea id="useful-message" placeholder="According to the library notice…" value={state.message} onChange={e=>dispatch({type:'note',field:'message',value:e.target.value})}/>{copy.writeExample}<label className="field-label" htmlFor="rumor-reflection">What would you check to find out whether the star-viewing session took place?</label><textarea id="rumor-reflection" placeholder="Describe one record or observation you would look for, and explain how it could help answer the question. You can discuss this aloud too." value={state.reflection} onChange={e=>dispatch({type:'note',field:'reflection',value:e.target.value})}/><div className="button-row"><Button id="rumor-finish" onClick={()=>dispatch({type:'complete'})}>Keep my field notes →</Button><Button id="write-back" secondary onClick={()=>go(2)}>Back</Button></div>
 </>;}
function FieldNotes({state,dispatch,storageAvailable}:{state:RumorState;dispatch:Dispatch;storageAvailable:boolean}){
 const [downloaded,setDownloaded]=useState(false);
 function download(){const blob=new Blob([JSON.stringify(makeResult('rumor',state),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='lunara-rumor-field-notes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);setDownloaded(true);}
 return <><div className="success-symbol" aria-hidden="true">✓</div><h1>Your field notes</h1><p>You’ve reached the end of {lab.title}, and the work you entered is gathered below. Have a look through it once more and think about what you would want to explain to someone who had not tried the activity. You can print these notes, download a copy to keep, or return to the matching curriculum to continue exploring.</p><div className="sheet sage"><h2>A message you can support</h2><div className="reflection-quote">{state.message||'No typed message recorded.'}</div><h3 style={{marginTop:22}}>What I would check next</h3><p className="reflection-quote">{state.reflection||'No typed reflection recorded.'}</p><p className="small">As you followed the messages, you could trace the five later senders back to one original notice. None of those senders supplied a firsthand building inspection. That distinction helps us explain what the notice announced while leaving other questions open until we have information that can answer them.</p></div><p className="companion-label">Continue with: {lab.companion} and the remaining two parts.</p><p className="completion-note">{storageAvailable?'Your work is saved in this browser, so you can come back to these notes later.':'Your work is available for this session, so download it before leaving if you want to keep it.'} It has not been sent to Quest.</p><p className="print-only">Lunara Labs · {lab.title}<br/>{lab.companion}</p><div className="button-row"><Button id="print" onClick={()=>window.print()}>Print my notes</Button><Button id="download" secondary onClick={download}>Download my results</Button><a className="button secondary" href="#/">Explore another lab</a></div>{downloaded&&<p role="status">Your field notes were downloaded.</p>}<div className="restart-row"><button className="text-button small" type="button" id="restart" onClick={()=>{if(confirm('Start this lab over? Download any notes you want to keep first. This replaces the saved work for this lab in this browser.'))dispatch({type:'restart'});}}>Start this lab over</button></div></>;
}
export function RumorLab(){
 const [state,setState]=useState(()=>{const restored=readAttempt();return restored.step===1?rumorReducer(restored,{type:'step',step:1}):restored;});
 const current=useRef(state),main=useRef<HTMLElement>(null);
 const [storageAvailable,setStorageAvailable]=useState(true);
 const dispatch:Dispatch=action=>{
  const next=rumorReducer(current.current,action);current.current=next;setState(next);
  try{localStorage.setItem(RUMOR_KEY,JSON.stringify({version:LAB_VERSION,state:next}));}catch{setStorageAvailable(false);}
 };
 const go=(step:number)=>{stopNarration();dispatch({type:'step',step});};
 useLayoutEffect(()=>{document.title=lab.title+' · Lunara Labs';const h=main.current?.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}return ()=>stopNarration();},[state.step]);
 return <main id="main" tabIndex={-1} ref={main}><LabLayout lab={lab} step={state.step} storageAvailable={storageAvailable} guidance={copy.guidance}>
 {!storageAvailable&&<p role="status">Browser saving is unavailable. Download your field notes before leaving.</p>}
 {state.step===0?<Intro go={go}/>:state.step===1?<Trace state={state} dispatch={dispatch} go={go}/>:state.step===2?<Evidence state={state} dispatch={dispatch} go={go}/>:state.step===3?<Write state={state} dispatch={dispatch} go={go}/>:<FieldNotes state={state} dispatch={dispatch} storageAvailable={storageAvailable}/>}
 </LabLayout></main>;
}
