import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createPreviewServer} from '../scripts/serve.mjs';

test('local preview serves the app but has no data API or outside-root file access',async()=>{
 const temporary=await mkdtemp(path.join(tmpdir(),'labs-preview-'));
 const root=path.join(temporary,'public');
 const {mkdir}=await import('node:fs/promises');await mkdir(root);
 await writeFile(path.join(root,'index.html'),'<h1>Local fixture</h1>');
 await writeFile(path.join(temporary,'outside.txt'),'Outside fixture');
 await symlink(path.join(temporary,'outside.txt'),path.join(root,'escape.txt'));
 const server=createPreviewServer(root);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const page=await fetch(base+'/');assert.equal(page.status,200);assert.equal(await page.text(),'<h1>Local fixture</h1>');
  assert.ok(page.headers.get('content-security-policy').includes("connect-src 'none'"));
  const head=await fetch(base+'/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  assert.equal((await fetch(base+'/api/results',{method:'POST',body:'Synthetic test'})).status,405);
  assert.equal((await fetch(base+'/%2e%2e%2foutside.txt')).status,404);
  assert.equal((await fetch(base+'/escape.txt')).status,404);
  assert.equal((await fetch(base+'/%ZZ')).status,400);
 }finally{await new Promise(resolve=>server.close(resolve));await rm(temporary,{recursive:true,force:true});}
});
