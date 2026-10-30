import {memo,useRef,useState,type KeyboardEvent} from 'react';
export const Passage=memo(function Passage({text,selected,marker,paused=false,marking=false,onSelect}:{text:string;selected:number[];marker:number|null;paused?:boolean;marking?:boolean;onSelect:(index:number)=>void}){
 const [focused,setFocused]=useState(0),host=useRef<HTMLDivElement>(null);
 const indices=[...text].flatMap((c,i)=>c===' '||c==='\n'?[]:[i]);
 const key=(e:KeyboardEvent<HTMLButtonElement>,index:number)=>{
  if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();
  const position=indices.indexOf(index);let next=position;
  if(e.key==='ArrowRight')next++;if(e.key==='ArrowLeft')next--;if(e.key==='ArrowDown')next+=40;if(e.key==='ArrowUp')next-=40;if(e.key==='Home')next=0;if(e.key==='End')next=indices.length-1;
  const target=indices[Math.min(indices.length-1,Math.max(0,next))];setFocused(target);host.current?.querySelector<HTMLButtonElement>(`[data-char="${target}"]`)?.focus();
 };
 let offset=0;
 return <div ref={host} className={'passage'+(paused?' paused':'')} role="group" aria-label={marking?'Select the last character you checked':'Letter-search passage'}>{text.split('\n').map((line,row)=>{const start=offset;offset+=line.length+1;return <span className="passage-line" key={row}>{[...line].map((c,n)=>{const i=start+n;return c===' '?<span key={i}> </span>:<button key={i} type="button" className={'character '+(selected.includes(i)?'marked ':'')+(marker===i?'stop-marker':'')} data-char={i} tabIndex={focused===i?0:-1} aria-label={`${c}, position ${i+1}`} aria-pressed={marking?marker===i:selected.includes(i)} onKeyDown={e=>key(e,i)} onClick={()=>{if(!marking&&paused)return;setFocused(i);onSelect(i);}}>{c}</button>;})}</span>;})}</div>;
});
