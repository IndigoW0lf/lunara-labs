import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const raw=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('lunara-labs:1:evidence')));
async function open(page){await page.goto('/#/evidence');await page.locator('#open-workbench').click();}
async function place(page,id,target){await page.getByLabel('Place record '+id,{exact:true}).selectOption(target);await expect(page.locator(`[data-evidence-target="${target}"] [data-evidence-card="${id}"]`)).toBeVisible();}
test('evidence: keyboard/menu arrangement, sources, feedback, reload, ledger and restart',async({page})=>{
 await page.goto('/');await page.locator('.lab-card.blue a.button').click();
 await page.locator('#initial-thought').fill('Synthetic: who recorded each reading?');await page.locator('#open-workbench').click();
 await place(page,'B','recorded');await expect(page.getByLabel('Place record B',{exact:true})).toBeFocused();
 await page.locator('#undo-evidence').click();expect((await raw(page)).state.placements.B).toBe('unplaced');
 await place(page,'A','recorded');await place(page,'B','recorded');await place(page,'C','recorded');await place(page,'D','aside');
 await page.getByRole('button',{name:'Follow source B',exact:true}).click();await expect(page.locator('.evidence-trail')).toContainText('identifies A');await expect(page.locator('#source-trail-heading')).toBeFocused();
 await page.reload();expect((await raw(page)).state.history.length).toBe(4);
 await page.locator('#review-evidence').click();await expect(page.locator('.evidence-feedback')).toContainText('B repeats A');
 await page.locator('#explain-evidence').click();await page.locator('#evidence-explanation').fill('Synthetic: A and C each show an 8°F difference. B repeats A.');await page.locator('#evidence-next-check').fill('Synthetic: compare other times and courtyards.');await page.locator('#evidence-finish').click();
 const pending=page.waitForEvent('download');await page.locator('#download-evidence').click();const download=await pending;const result=JSON.parse(await readFile(await download.path(),'utf8'));
 expect(result.delivery).toBe('local-only');expect(result.labVersion).toBe('1.0.0');expect(result.responses.sourcePaths.B).toEqual(['B','A']);expect(result.responses.explanation).toContain('Synthetic');
 await page.getByRole('link',{name:'Explore another lab',exact:true}).click();await expect(page.locator('.lab-card.blue')).toContainText('Revisit the lab');await page.locator('.lab-card.blue a.button').click();
 page.once('dialog',dialog=>dialog.accept());await page.locator('#restart-evidence').click();await expect(page.locator('#open-workbench')).toBeVisible();expect((await raw(page)).state.complete).toBe(false);
});
test('evidence: native drag and undo use the same persisted placements',async({page})=>{
 await open(page);
 await page.locator('[data-drag-card="A"]').dragTo(page.locator('[data-evidence-target="recorded"]'),{targetPosition:{x:35,y:35}});
 await expect.poll(async()=>(await raw(page)).state.placements.A).toBe('recorded');
 await page.locator('#undo-evidence').click();expect((await raw(page)).state.placements.A).toBe('unplaced');
});
test('evidence: broad-claim feedback is revisable and adult guidance is separate',async({page})=>{
 await open(page);for(const id of ['A','B','C','D'])await place(page,id,'everywhere');
 await page.locator('#review-evidence').click();await expect(page.locator('.evidence-feedback')).toContainText('cannot establish');
 await place(page,'D','aside');await expect(page.locator('.evidence-feedback')).toHaveCount(0);
 await page.goto('/#/evidence-guide');await expect(page.getByRole('heading',{name:'Worked placements and reasoning'})).toBeVisible();await expect(page.locator('main')).toContainText('not reports of real research');
 await page.getByRole('link',{name:'Back to the workbench',exact:true}).click();expect((await raw(page)).state.placements.D).toBe('aside');
});
test('evidence: blocked storage keeps an oral explanation available for export',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('lunara-labs:1:evidence',JSON.stringify({version:'1.0.0',state:{step:2,placements:{A:'recorded',B:'recorded',C:'recorded',D:'aside'},history:[],checked:true}}));Storage.prototype.setItem=function(){throw new DOMException('Synthetic failure','QuotaExceededError');};});
 await page.goto('/#/evidence');await page.locator('#evidence-discussed').check();await expect(page.getByRole('status')).toContainText('saving is unavailable');await page.locator('#evidence-finish').click();
 const pending=page.waitForEvent('download');await page.locator('#download-evidence').click();const result=JSON.parse(await readFile(await (await pending).path(),'utf8'));expect(result.responses.discussed).toBe(true);expect(result.completion).toBe('completed');
});
