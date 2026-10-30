import {defineConfig} from 'vite';
export default defineConfig({
 publicDir:'public',
 build:{outDir:'build',emptyOutDir:true,modulePreload:{polyfill:false}},
 server:{host:'0.0.0.0',port:4173,strictPort:true}
});
