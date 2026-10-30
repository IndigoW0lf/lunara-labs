import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
function checkDirectory(directory){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())checkDirectory(file);
  else if(file.endsWith('.mjs'))execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
 }
}
for(const directory of ['src','scripts','tests'])checkDirectory(directory);
console.log('JavaScript syntax checks passed.');
execFileSync(process.execPath,['scripts/check-privacy.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['--test',...fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f)],{stdio:'inherit'});
