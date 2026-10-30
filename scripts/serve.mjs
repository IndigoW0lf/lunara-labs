import {createServer} from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const defaultRoot=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.mp3':'audio/mpeg','.json':'application/json; charset=utf-8'};

// Local static preview only. There are no application APIs or request-body handlers.
export function createPreviewServer(root=defaultRoot){
 const base=path.resolve(root);
 return createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'");
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end('Method not allowed');return;}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Bad request');return;}
  try{
   const rootPath=await realpath(base);
   let target=path.resolve(base,'.'+pathname);
   if(target!==base&&!target.startsWith(base+path.sep))throw new Error('Outside preview root');
   if((await stat(target)).isDirectory())target=path.join(target,'index.html');
   target=await realpath(target);
   if(!target.startsWith(rootPath+path.sep))throw new Error('Outside preview root');
   const bytes=await readFile(target);
   res.writeHead(200,{'Content-Type':types[path.extname(target)]??'application/octet-stream','Content-Length':bytes.length});
   res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404);res.end('Not found');}
 });
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.LABS_PORT??process.env.PORT??4173);
 if(!Number.isInteger(port)||port<0||port>65535)throw new Error('Use a valid LABS_PORT.');
 const host=process.env.LABS_HOST??'127.0.0.1';
 const server=createPreviewServer();
 server.listen(port,host,()=>console.log(`Lunara Labs: http://${host}:${server.address().port}`));
}
