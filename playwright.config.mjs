import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser', fullyParallel:true, retries:0,
 use:{baseURL:process.env.LABS_TEST_URL||'http://127.0.0.1:4173',trace:'retain-on-failure'},
 projects:[{name:'desktop',use:{viewport:{width:1280,height:900}}},{name:'narrow',use:{viewport:{width:390,height:844}}}],
 webServer:{command:process.env.LABS_TEST_SERVER||'npm run dev',url:process.env.LABS_TEST_URL||'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
 reporter:process.env.CI?'github':'list'
});
