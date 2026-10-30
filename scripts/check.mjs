import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
for(const directory of ['dist','scripts','tests']){
 for(const file of fs.readdirSync(directory)){
  if(file.endsWith('.mjs'))execFileSync(process.execPath,['--check',path.join(directory,file)],{stdio:'inherit'});
 }
}
console.log('JavaScript syntax checks passed.');
execFileSync(process.execPath,['scripts/check-privacy.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['--test',...fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f)],{stdio:'inherit'});
