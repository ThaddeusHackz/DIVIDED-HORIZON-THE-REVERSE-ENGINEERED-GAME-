import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { launchBrowser } from '../tools/assets/browser.mjs';
const browser=await launchBrowser();
const page=await browser.newPage({viewport:{width:1100,height:760},deviceScaleFactor:1});
const errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
const pass=name=>{checks.push({name,passed:true});console.log(`PASS: ${name}`);};
const wait=fn=>page.waitForFunction(fn,null,{timeout:45000});
// Explicit helper uses normal keyboard events; test positioning is separately disclosed.
async function keyUntil(code,condition){await page.keyboard.down(code);await wait(condition);await page.keyboard.up(code);if(await page.evaluate(()=>window.__combat.core.get(11)===0)){const t=await page.evaluate(()=>window.__combat.core.get(16));await page.waitForFunction(before=>window.__combat.core.get(16)>before,t,{timeout:45000});}}
try{
 await page.goto('http://127.0.0.1:5173/?qa&quality=low');await wait(()=>window.__combatReady);
 assert(await page.locator('#begin').isVisible());assert(await page.locator('#continue').isDisabled());pass('briefing loads, no checkpoint initially');
 await page.locator('#begin').click();await wait(()=>window.__combat.state().phase===0&&document.querySelector('#hud').hidden===false);
 await page.evaluate(()=>window.__combat.aim(0,0));pass('begin operation displays live combat HUD');
 const z=await page.evaluate(()=>window.__combat.state().z);await page.keyboard.down('KeyW');await page.waitForFunction(z=>window.__combat.state().z<z-.2,z,{timeout:45000});await page.keyboard.up('KeyW');pass('W moves the player through shared C simulation');
 await page.evaluate(()=>{window.__combat.teleport(0,19);window.__combat.enemy(0,0,14,Math.PI);window.__combat.aim(0,0);});
 await keyUntil('KeyF',()=>window.__combat.core.get(7)===11);
 assert.equal(await page.evaluate(()=>window.__combat.core.enemy(0,3)),40);pass('F input fires pistol and raycast headshot damages sentry');
 await keyUntil('KeyR',()=>window.__combat.core.get(9)>0);await wait(()=>window.__combat.core.get(9)===0);assert.equal(await page.evaluate(()=>window.__combat.core.get(7)),12);pass('HUD reload timer completes and ammunition transfers');
 // Release pointer capture so a real HTML pause button can be clicked in headless Chromium.
 await page.evaluate(()=>{if(document.pointerLockElement)document.exitPointerLock();});await page.locator('#pause-button').click();await wait(()=>window.__combat.core.get(11)===1);
 const pausedTime=await page.evaluate(()=>window.__combat.core.get(16));await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.__combat.core.get(16)),pausedTime);pass('pause overlay freezes simulation');
 await page.locator('#resume').click();await wait(()=>window.__combat.core.get(11)===0);
 // Avoid combat randomness in UI-only objective checks. Core mission/playthrough tests
 // exercise normal movement and combat without these hooks.
 await page.evaluate(()=>{window.__combat.restart();window.__combat.teleport(3,7);window.__combat.aim(0,-.1);});
 await keyUntil('KeyE',()=>window.__combat.core.get(12)===1);assert.equal(await page.evaluate(()=>window.__combat.core.get(10)),1);pass('manifest interaction unlocks rifle and writes checkpoint');
 assert(await page.evaluate(()=>!!localStorage.getItem('divided-horizon-combat-checkpoint-v2')));
 await page.evaluate(()=>window.__combat.back());await page.locator('#continue').click();await wait(()=>window.__combat.core.get(12)===1&&document.querySelector('#hud').hidden===false);pass('continue restores the saved checkpoint');
 await page.evaluate(()=>{window.__combat.teleport(-4,-2.5);window.__combat.aim(0,-.2);});await keyUntil('KeyE',()=>window.__combat.core.get(12)===3);
 await page.evaluate(()=>{window.__combat.teleport(7,-4.8);window.__combat.aim(0,-.1);});await keyUntil('KeyE',()=>window.__combat.core.get(12)===7);pass('ledger and signal interactions update objective state');
 await page.evaluate(()=>{window.__combat.teleport(0,19);window.__combat.aim(0,0);});await keyUntil('KeyE',()=>window.__combat.core.get(11)===3);
 assert.equal(await page.locator('#pause-title').innerText(),'Evidence secured.');pass('extraction displays completed-mission debrief');
 await page.locator('#restart').click();await wait(()=>window.__combat.core.get(11)===0&&window.__combat.core.get(12)===0);pass('restart returns to a fresh playable operation');
 await page.evaluate(()=>window.__combat.back());await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));pass('briefing has no horizontal overflow at phone width');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);pass('no page errors or failed asset requests');
 const report={passed:true,environment:'Linux headless Chromium, quality=low; not a Windows renderer/launch test',scope:'Real UI/key events. Test-only positioning used for isolated UI checks; the separate full simulation playthrough uses no cheats.',checks,errors,failed};
 await fs.writeFile('docs/evidence/combat-slice/browser-controls.json',JSON.stringify(report,null,2)+'\n');
}finally{await browser.close();}
