import type {CSSProperties,ReactNode} from 'react';
import {CHARACTER_CELLS,glyph} from '../../dist/immersive.mjs';
// Only the fixed, repository-authored SVG paths enter this HTML boundary.
export function Icon({name}:{name:string}){return <span dangerouslySetInnerHTML={{__html:glyph(name)}}/>;}
export function Portrait({id,className=''}:{id:string;className?:string}){
 if(id==='A')return <span className={'paper-avatar '+className} aria-hidden="true"><Icon name="notice"/></span>;
 const [x,y]=CHARACTER_CELLS[id as keyof typeof CHARACTER_CELLS]||CHARACTER_CELLS.guide;
 return <span className={'painted-person '+className} style={{'--person-x':`${x*50}%`,'--person-y':`${y*100}%`} as CSSProperties} aria-hidden="true"/>;
}
export function Phone({children,label,className='',bar='9:41'}:{children:ReactNode;label:string;className?:string;bar?:string}){
 return <div className={'practice-phone '+className} role="region" aria-label={label}><div className="phone-island" aria-hidden="true"/><div className="phone-status" aria-hidden="true"><span>{bar}</span><span className="status-symbols">▂▄▆ <span className="battery-icon"/></span></div>{children}<div className="phone-home-indicator" aria-hidden="true"/></div>;
}
export function PhoneHeader({title,subtitle}:{title:string;subtitle:string}){return <div className="phone-app-heading"><div><strong>{title}</strong><span>{subtitle}</span></div></div>;}
export function VoiceWaves(){return <span className="voice-waves" aria-hidden="true"><i/><i/><i/><i/><i/></span>;}
