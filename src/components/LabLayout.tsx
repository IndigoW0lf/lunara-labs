import type {ReactNode} from 'react';
type LabInfo={title:string;area:string;steps:string[]};
export function LabLayout({lab,step,storageAvailable,guidance,children}:{lab:LabInfo;step:number;storageAvailable:boolean;guidance:ReactNode;children:ReactNode}){
 return <div className="lab-layout immersive-layout">
  <aside className="lab-sidebar"><a className="back-link" href="#/">← All labs</a><h2>{lab.title}</h2>
   <ol className="steps">{lab.steps.map((name,i)=><li key={name} className={i===step?'current':i<step?'past':''} aria-current={i===step?'step':undefined}><span className="step-number">{i<step?'✓':i+1}</span><span>{name}</span></li>)}</ol>
   <p className="sidebar-note">{storageAvailable?'Your place is saved in this browser, so you can come back to the activity later.':'Browser saving is unavailable.'}</p>
  </aside>
  <section className="lab-main"><p className="eyebrow">{lab.area} · Interactive companion</p>{children}<details className="adult-details"><summary>Companion pages &amp; guidance for adults</summary>{guidance}</details></section>
 </div>;
}
