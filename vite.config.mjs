import {defineConfig} from 'vite';
export default defineConfig({
 // Temporary: retain the standalone prototype and its exact assets during migration.
 publicDir:'dist',
 build:{outDir:'build',emptyOutDir:true,modulePreload:{polyfill:false}},
 server:{host:'0.0.0.0',port:4173,strictPort:true}
});
