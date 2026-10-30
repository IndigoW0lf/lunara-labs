export type NarrationPhase='loading'|'speaking'|'stopped'|'finished'|'unavailable';
export function narrate(text:string, options?:{person?:string;onState?:(phase:NarrationPhase)=>void}):boolean;
export function stopNarration():void;
export function prepareChime():boolean;
export function chime():boolean;
