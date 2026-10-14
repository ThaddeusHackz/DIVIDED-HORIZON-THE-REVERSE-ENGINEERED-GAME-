import fs from 'node:fs/promises';
import { launchBrowser } from '../assets/browser.mjs';
const dir='prototype/public/assets/batch-02';
const manifest=JSON.parse(await fs.readFile(`${dir}/manifest.json`));
await fs.mkdir(`${dir}/previews`,{recursive:true});
const browser=await launchBrowser();
try{
 const page=await browser.newPage({viewport:{width:1080,height:800},deviceScaleFactor:1});
 page.on('pageerror',e=>{throw e;});
 await page.goto('http://127.0.0.1:5173/?qa');await page.waitForFunction(()=>window.__combatReady,{timeout:90000});
 await page.evaluate(()=>window.__combat.freeze());
 for(const asset of manifest.assets){
  const image=await page.evaluate(async id=>{await window.__combat.inspectAsset(id);return window.__combat.capture();},asset.id);
  await fs.writeFile(`${dir}/previews/${asset.id}.png`,Buffer.from(image.split(',')[1],'base64'));
  console.log(`Rendered actual GLB: ${asset.id}`);
 }
}finally{await browser.close();}
