import {LAB_VERSION,restoreProgress} from '../../../dist/data.mjs';
export const RUMOR_KEY='lunara-labs:1:rumor';
export type MessageId='A'|'B'|'C'|'D'|'E'|'F';
export type RumorState={activityVersion:string;step:number;visited:MessageId[];selected:MessageId;answers:Record<string,number>;checked:boolean;message:string;reflection:string;traceNote?:string;complete:boolean;answerHistory?:Record<string,number>[]};
export type RumorAction={type:'step';step:number}|{type:'select';id:MessageId}|{type:'answer';id:string;value:number}|{type:'check'}|{type:'note';field:'message'|'reflection'|'traceNote';value:string}|{type:'complete'}|{type:'restart'};
export function initialRumor():RumorState{return {activityVersion:LAB_VERSION,step:0,visited:[],selected:'B',answers:{},checked:false,message:'',reflection:'',complete:false};}
export function restoreRumor(raw:unknown):RumorState{return restoreProgress(raw,initialRumor());}
export function rumorReducer(state:RumorState,action:RumorAction):RumorState{
 switch(action.type){
  case 'step': {const step=Math.max(0,Math.min(4,action.step));return {...state,step,visited:step===1&&state.selected!=='A'&&!state.visited.includes(state.selected)?[...state.visited,state.selected]:state.visited};}
  case 'select':return {...state,selected:action.id,visited:state.visited.includes(action.id)?state.visited:[...state.visited,action.id]};
  case 'answer':return {...state,answers:{...state.answers,[action.id]:action.value},checked:false};
  case 'check':return {...state,checked:true,answerHistory:[...(state.answerHistory||[]),{...state.answers}]};
  case 'note':return {...state,[action.field]:action.value};
  case 'complete':return {...state,complete:true,step:4};
  case 'restart':return initialRumor();
 }
}
