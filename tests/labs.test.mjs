import test from 'node:test';
import assert from 'node:assert/strict';
import {passages,countTargets,scoreRound,duePings,messages,makeResult,restoreProgress,LAB_VERSION} from '../dist/data.mjs';
import {PHONE_ALERTS,CHARACTER_CELLS,conversationScene} from '../dist/immersive.mjs';
test('both source passages keep their matched target count, word count, and length',()=>{
 for(const text of Object.values(passages)){assert.equal(countTargets(text),85);assert.equal(text.split(/\s+/).length,98);assert.equal(text.replace(/\n/g,'').length,494);}
});
test('scores only the inspected portion, excludes selections after the stop marker, and counts wrong letters',()=>{
 assert.deepEqual(scoreRound('eEeabE',[0,2,3,5],3),{correct:2,missed:1,other:1,lastChecked:3,totalTargets:4});
 assert.equal(scoreRound('eEeabE',[],2).missed,3);
 assert.equal(scoreRound('eEeabE',[0,0,1],1).correct,2);
});
test('uninspected or empty work has no false missed-target score',()=>{
 assert.equal(scoreRound(passages.quiet,[],-1).missed,0);
 assert.equal(scoreRound('',[],0).missed,0);
});
test('scheduled cues occur at the specified boundaries and are not counted twice',()=>{
 assert.deepEqual(duePings(19.9),[]);assert.deepEqual(duePings(20),[20]);assert.deepEqual(duePings(70,[20,45]),[70]);assert.deepEqual(duePings(100,[20,45,70,95]),[]);
});
test('every retelling traces to the one original notice without a cycle',()=>{
 for(const m of messages.slice(1)){const seen=new Set();let current=m;while(current.parent){assert.ok(!seen.has(current.id));seen.add(current.id);current=messages.find(x=>x.id===current.parent);assert.ok(current);}assert.equal(current.id,'A');}
});
test('export distinguishes local completion and lab version from a Quest record',()=>{
 const r=makeResult('rumor',{complete:true,visited:['B'],answers:{origins:1},message:'Test',reflection:''});assert.equal(r.delivery,'local-only');assert.equal(r.completion,'completed');assert.ok(r.labVersion);assert.ok(!Object.hasOwn(r,'learnerId'));
});
test('the illustrated interface preserves work saved by the earlier version',()=>{
 const old={version:'0.1.0',state:{step:3,message:'A learner’s own message',reflection:'Keep this',visited:['B','C'],rounds:{quiet:{score:{correct:8},elapsed:31}}}};
 const result=restoreProgress(old,{step:0,activityVersion:LAB_VERSION,phoneSound:false});
 assert.equal(result.step,3);assert.equal(result.message,old.state.message);assert.deepEqual(result.rounds,old.state.rounds);assert.equal(result.activityVersion,'0.1.0');assert.equal(result.phoneSound,false);
 assert.deepEqual(restoreProgress({version:'unknown',state:{step:9}},{step:0}),{step:0});
});
test('new phone conditions and exploration are preserved separately from legacy attempt identity',()=>{
 const r=makeResult('attention',{activityVersion:'0.1.0',complete:true,phoneSound:true,demoNotificationCount:2,sandboxVisits:['notes','messages'],rounds:{interrupted:{openedNotifications:[{cue:1,at:21.2}],chimesPlayed:1}}});
 assert.equal(r.labVersion,'0.1.0');assert.equal(r.interfaceVersion,LAB_VERSION);assert.equal(r.responses.conditions.phoneSound,true);assert.equal(r.responses.exploration.notificationsTried,2);assert.equal(r.responses.rounds.interrupted.chimesPlayed,1);
});
test('phone alerts and illustrated callers resolve to the retained case characters',()=>{
 assert.equal(PHONE_ALERTS.length,4);
 for(const alert of PHONE_ALERTS){assert.ok(messages.some(m=>m.id===alert.person));assert.ok(CHARACTER_CELLS[alert.person]);}
 const scene=conversationScene({selected:'D',visited:['B','C','D']});assert.ok(scene.includes(messages.find(m=>m.id==='D').text));assert.ok(scene.includes('Ren heard Jo'));
});
