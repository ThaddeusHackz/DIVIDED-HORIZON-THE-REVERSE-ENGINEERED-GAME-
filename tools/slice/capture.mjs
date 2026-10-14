import fs from 'node:fs/promises';
import { launchBrowser } from '../assets/browser.mjs';
const browser=await launchBrowser(),page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>console.error('PAGE ERROR',e));
await page.goto('http://127.0.0.1:5173/?qa');await page.waitForFunction(()=>window.__combatReady,{timeout:90000});await page.waitForTimeout(600);
await page.screenshot({path:'docs/evidence/combat-slice/briefing-browser.png'});
await page.locator('#begin').click();await page.waitForTimeout(600);await page.evaluate(()=>window.__combat.aim(0,0));await page.waitForTimeout(250);console.log(await page.evaluate(()=>window.__combat.state()));await page.evaluate(()=>window.__combat.freeze());await page.screenshot({path:'docs/evidence/combat-slice/gameplay-browser.png',timeout:90000});
await browser.close();
