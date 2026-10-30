import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

async function resultDownload(page){
 const pending=page.waitForEvent('download');
 await page.locator('#download').click();
 const download=await pending;
 return JSON.parse(await readFile(await download.path(),'utf8'));
}
async function saved(page,slug){return page.evaluate(s=>JSON.parse(localStorage.getItem('lunara-labs:1:'+s)),slug);}

test('Rumor: trace, reason, save, reload and download field notes',async({page})=>{
 await page.goto('/#/rumor');
 await page.locator('#start').click();
 for(const id of ['B','C','D','E','F'])await page.locator(`[data-node="${id}"]`).click();
 await page.locator('#trace-note').fill('Synthetic observation: a possibility became certain.');
 await page.locator('#trace-next').click();
 for(const [name,value] of Object.entries({origins:1,inspection:2,plan:0,intent:2}))await page.locator(`input[name="${name}"][value="${value}"]`).check();
 await page.locator('#check-reasoning').click();
 await expect(page.locator('.feedback')).toHaveCount(4);
 await page.locator('#evidence-next').click();
 await page.locator('#useful-message').fill('Synthetic note: Saturday, courtyard, 7 p.m., according to the notice.');
 await page.locator('#rumor-reflection').fill('Synthetic next check: an event record.');
 await page.reload();
 await expect(page.locator('#useful-message')).toHaveValue(/Synthetic note/);
 await page.locator('#rumor-finish').click();
 await expect(page.getByRole('heading',{name:'Your field notes',exact:true})).toBeVisible();
 const result=await resultDownload(page);
 expect(JSON.stringify(result)).toContain('Synthetic next check');
 expect((await saved(page,'rumor')).state.complete).toBe(true);
});

test('Attention: quiet and interrupted rounds, pause recovery, cues and uncertain scores',async({page})=>{
 await page.clock.install();
 await page.goto('/#/attention');
 await page.locator('#start').click();
 await page.locator('input[name="prediction"][value="interrupted"]').check();
 await page.locator('input[name="order"][value="quiet"]').check();
 await page.locator('#prepare').click();
 await page.locator('#begin-round').click();
 await page.locator('[data-char="0"]').click();
 await page.clock.runFor(5000);
 await page.locator('#pause-round').click();
 await page.reload();
 await expect(page.locator('#pause-round')).toHaveText('Resume round');
 await page.locator('#pause-round').click();
 await page.clock.runFor(1000);
 await page.locator('#finish-round').click();
 await page.locator('#unclear-stop').check();
 await page.locator('input[name="effort"][value="2"]').check();
 await page.locator('input[name="lost"][value="No"]').check();
 await page.locator('#round-note').fill('Synthetic quiet-round note.');
 await page.locator('#save-round').click();
 await page.clock.runFor(60000);
 await page.locator('#begin-round').click();
 await page.clock.runFor(21000);
 await page.locator('#open-notification').click();
 await expect(page.locator('#phone-message-panel')).toBeVisible();
 await page.locator('#return-to-search').click();
 await page.clock.runFor(75000);
 expect((await saved(page,'attention')).state.active.fired).toEqual([20,45,70,95]);
 await page.clock.runFor(25000);
 await expect(page.locator('#checked-all')).toBeVisible();
 await page.locator('#checked-all').check();
 await page.locator('input[name="effort"][value="3"]').check();
 await page.locator('input[name="lost"][value="Yes"]').check();
 await page.locator('#save-round').click();
 await expect(page.locator('.target-summary')).toContainText('of 85');
 await expect(page.locator('.result-table')).toContainText('Not enough information');
 await page.locator('#attention-reflection').fill('Synthetic comparison of two attempts.');
 await page.locator('input[name="conclusion"][value="2"]').check();
 await page.locator('#attention-finish').click();
 const result=await resultDownload(page);
 expect(JSON.stringify(result)).toContain('Synthetic comparison');
 const attempt=(await saved(page,'attention')).state;
 expect(attempt.rounds.quiet.uncertain).toBe(true);
 expect(attempt.rounds.interrupted.fired).toEqual([20,45,70,95]);
 expect(attempt.complete).toBe(true);
});

test('Narration controls stop on navigation and disclosure stays on About',async({page})=>{
 await page.goto('/#/rumor');await page.locator('#start').click();
 await page.locator('[data-listen]').first().click();
 await expect(page.locator('[data-listen]').first()).toHaveAttribute('aria-pressed','true');
 await page.getByRole('link',{name:'How it works',exact:true}).click();
 await expect(page.getByRole('heading',{name:'About the voices'})).toBeVisible();
 await expect(page.locator('main')).toContainText('AI-generated');
 await page.getByRole('button',{name:'Where your work is saved'}).click();
 await expect(page.locator('#privacy')).toBeVisible();
 await page.getByRole('button',{name:'Got it',exact:true}).click();
 await expect(page.locator('#privacy')).not.toBeVisible();
});


test('Rumor: legacy work keeps its version, plain text, focus and restart semantics',async({page})=>{
 const message='Synthetic <img src=x onerror=alert(1)> message';
 await page.addInitScript(({message})=>{
  localStorage.setItem('lunara-labs:1:rumor',JSON.stringify({version:'0.1.0',state:{step:3,selected:'F',visited:['B','C','D','E','F'],answers:{origins:1},checked:true,answerHistory:[{origins:1}],message,reflection:'Synthetic legacy reflection.',complete:false}}));
 },{message});
 await page.goto('/#/rumor');
 await expect(page.locator('#useful-message')).toHaveValue(message);
 await expect(page.locator('h1')).toBeFocused();
 await page.locator('#rumor-finish').click();
 await expect(page.locator('.reflection-quote').first()).toHaveText(message);
 await expect(page.locator('.reflection-quote img')).toHaveCount(0);
 const result=await resultDownload(page);
 expect(result.labVersion).toBe('0.1.0');
 expect(result.responses.answerHistory).toEqual([{origins:1}]);
 expect(result.responses.message).toBe(message);
 await page.getByRole('link',{name:'Explore another lab',exact:true}).click();
 await expect(page.locator('.lab-card.sage')).toContainText('Revisit the lab');
 await page.locator('.lab-card.sage a.button').click();
 await expect(page.getByRole('heading',{name:'Your field notes',exact:true})).toBeVisible();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restart').click();
 await expect(page.locator('#start')).toBeVisible();
 const raw=await saved(page,'rumor');
 expect(raw.state.message).toBe('');expect(raw.state.activityVersion).toBe('0.3.0');
});

test('Rumor: blocked saving keeps typed notes available for local export',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('lunara-labs:1:rumor',JSON.stringify({version:'0.2.0',state:{step:3,message:'Synthetic old note.',reflection:'',complete:false}}));
  Storage.prototype.setItem=function(){throw new DOMException('Synthetic unavailable storage','QuotaExceededError');};
 });
 await page.goto('/#/rumor');
 await page.locator('#useful-message').fill('Synthetic unsaved note.');
 await expect(page.getByRole('status')).toContainText('Browser saving is unavailable');
 await page.locator('#rumor-finish').click();
 const result=await resultDownload(page);
 expect(result.responses.message).toBe('Synthetic unsaved note.');expect(result.labVersion).toBe('0.2.0');
 expect((await saved(page,'rumor')).state.message).toBe('Synthetic old note.');
});
