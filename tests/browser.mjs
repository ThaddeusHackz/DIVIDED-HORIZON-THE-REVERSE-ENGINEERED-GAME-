import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { launchBrowser } from '../tools/assets/browser.mjs';

const browser=await launchBrowser();
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1});
const errors=[],failedRequests=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failedRequests.push(`${r.status()} ${r.url()}`);});
const check=(name)=>{checks.push({name,passed:true});console.log(`PASS: ${name}`);};
try{
 await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:5173/asset-lab.html?qa');
 await page.waitForFunction(()=>window.__qa,{timeout:60000});
 assert.equal(await page.locator('.asset-card').count(),8);check('all eight models listed');
 await page.locator('[data-filter="Foliage"]').click();assert.equal(await page.locator('.asset-card').count(),1);
 await page.locator('.asset-card').click();await page.waitForFunction(()=>window.__viewerReady==='SM_CoastalPalm_01');
 assert.match(await page.locator('#download').getAttribute('href'),/SM_CoastalPalm_01.glb/);check('category filtering and GLB selection');
 await page.locator('#rotate').click();assert.equal(await page.locator('#rotate').getAttribute('aria-pressed'),'true');
 await page.locator('#rotate').click();await page.locator('#light').click();assert.equal(await page.locator('#light span').innerText(),'Dusk');await page.locator('#light').click();check('rotation and dawn/dusk controls');
 const downloadPromise=page.waitForEvent('download');await page.locator('#capture').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'SM_CoastalPalm_01.png');check('actual canvas PNG download');
 await page.locator('#play-top').click();await page.waitForFunction(()=>window.__qa.state().play);check('enter playable world');
 const z0=await page.evaluate(()=>window.__qa.state().position[2]);
 await page.keyboard.down('KeyW');await page.waitForTimeout(900);await page.keyboard.up('KeyW');
 assert((await page.evaluate(()=>window.__qa.state().position[2]))<z0-.1);check('keyboard movement changes player position');
 await page.keyboard.press('Escape');assert(await page.locator('#pause-panel').isVisible());
 const pausedPos=await page.evaluate(()=>window.__qa.state().position);
 await page.keyboard.down('KeyW');await page.waitForTimeout(250);await page.keyboard.up('KeyW');assert.deepEqual(await page.evaluate(()=>window.__qa.state().position),pausedPos);
 await page.locator('#resume').click();check('pause freezes movement and resume works');
 // Positioning is test-only; interaction uses the real keyboard event handler.
 // Reachability through collision is separately tested by the grid flood-fill.
 for(const [id,x,z] of [['manifest',3,6.5],['ledger',-4,-2.5],['signal',7,-5.3]]){
  await page.evaluate(([x,z])=>window.__qa.teleport(x,z),[x,z]);await page.waitForTimeout(120);await page.keyboard.press('KeyE');
  assert((await page.evaluate(()=>window.__qa.state().completed)).includes(id));check(`E interaction: ${id}`);
 }
 await page.evaluate(()=>window.__qa.teleport(0,19));await page.keyboard.press('KeyE');
 assert.equal(await page.locator('#pause-title').innerText(),'Evidence secured.');check('assignment completion at jetty');
 await page.locator('#restart').click();assert.deepEqual(await page.evaluate(()=>window.__qa.state().completed),[]);check('restart clears all mission progress');
 await page.locator('#leave').click();assert.equal(await page.evaluate(()=>window.__qa.state().play),false);check('exit restores asset viewer');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check('mobile gallery fits viewport without horizontal overflow');
 await page.screenshot({path:'docs/evidence/batch-01/mobile-gallery.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(failedRequests,[]);check('no JavaScript errors or failed HTTP assets');
 await fs.writeFile('docs/evidence/batch-01/browser-tests.json',JSON.stringify({passed:true,environment:'Headless Chromium / Linux / software rendering. Not a Windows or GPU performance test.',checks,errors,failedRequests},null,2)+'\n');
}finally{await browser.close();}
