import fs from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
const browser=await launchBrowser();
const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
page.on('pageerror',e=>console.error(e));
await page.goto('http://127.0.0.1:5173/asset-lab.html?qa');
await page.waitForFunction(()=>window.__qa,{timeout:60000});
// A fixed canvas gives each deliverable the same uncluttered crop.
await page.addStyleTag({content:'.stage{width:1080px!important;height:800px!important;min-height:800px!important}.hero{display:block!important}.story{display:none!important}'});
const manifest=JSON.parse(await fs.readFile('prototype/public/assets/batch-01/manifest.json'));
for(const item of manifest.assets){
 await page.evaluate(id=>window.__qa.select(id),item.id);
 await page.waitForTimeout(700);
 const data=await page.evaluate(()=>window.__qa.capture());
 await fs.writeFile(`prototype/public/assets/batch-01/${item.preview}`,Buffer.from(data.split(',')[1],'base64'));
 console.log(`Rendered ${item.id}`);
}
const shot=page;
await shot.setViewportSize({width:1440,height:1080});
await shot.goto('http://127.0.0.1:5173/asset-lab.html?qa');await shot.waitForFunction(()=>window.__qa,{timeout:60000});await shot.waitForTimeout(700);
await fs.mkdir('docs/evidence/batch-01',{recursive:true});
await shot.screenshot({path:'docs/evidence/batch-01/asset-lab.png',fullPage:true});
await shot.evaluate(()=>window.__qa.enter());await shot.waitForTimeout(700);
await shot.screenshot({path:'docs/evidence/batch-01/playtest.png'});
await browser.close();
