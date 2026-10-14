import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createCore,BUTTON as B } from '../prototype/src/core-bridge.mjs';
const binary=await fs.readFile('prototype/public/slice-core.wasm');
const fresh=()=>createCore(binary);
function tick(c,frames=1,buttons=0,yaw=c.get(3),pitch=c.get(4)){for(let i=0;i<frames;i++){c.input(0,0,yaw,pitch,buttons);c.tick(1/60);}return c.state();}
function press(c,button,yaw=c.get(3),pitch=c.get(4)){tick(c,1,0,yaw,pitch);return tick(c,1,button,yaw,pitch);}
test('shared core starts at jetty with brief-matched W01 magazine and normal health',async()=>{const c=await fresh();assert.equal(c.get(7),12);assert.equal(c.get(5),100);assert.equal(c.get(2),19);assert.equal(c.get(19),6);});
test('semi-auto pistol fires on press, not hold, and timed reload transfers reserve',async()=>{const c=await fresh();tick(c,30,B.FIRE);assert.equal(c.get(7),11);tick(c,1,0);press(c,B.RELOAD);assert(c.get(9)>1);tick(c,90);assert.equal(c.get(7),12);assert.equal(c.get(8),59);});
test('raycast headshots damage/defeat a real sentry and produce hit feedback',async()=>{const c=await fresh();c.api.dh_debug_enemy(0,0,14,Math.PI);press(c,B.FIRE);assert.equal(c.enemy(0,3),40);assert(c.get(21)>0);tick(c,14);press(c,B.FIRE);assert.equal(c.enemy(0,4),4);assert.equal(c.get(13),1);});
test('hut wall occludes bullets and prevents damage through the back wall',async()=>{const c=await fresh();c.api.dh_debug_position(-4,-6);c.api.dh_debug_enemy(0,-4,-2.5,0);press(c,B.FIRE,Math.PI,0);assert.equal(c.enemy(0,3),100);});
test('sentries return fire after being hit and emit tracer events',async()=>{const c=await fresh();c.api.dh_debug_enemy(0,0,14,Math.PI);press(c,B.FIRE,0,-.15);tick(c,400);assert(c.get(5)<100);assert(c.events().some(e=>e[0]===3));});
test('pause freezes timers, enemies and ammunition',async()=>{const c=await fresh();const before=c.state();c.api.dh_pause();tick(c,180,B.FIRE);assert.equal(c.get(16),before.time);assert.equal(c.get(7),12);assert.equal(c.get(11),1);c.api.dh_pause();assert.equal(c.get(11),0);});
test('medkits heal without exceeding health cap and are consumed',async()=>{const c=await fresh();c.api.dh_debug_health(80);press(c,B.HEAL);assert.equal(c.get(5),100);assert.equal(c.get(18),1);press(c,B.HEAL);assert.equal(c.get(18),1);});
test('mission unlocks rifle, saves checkpoints and only completes at the jetty',async()=>{const c=await fresh();assert.equal(c.get(12),0);for(const[x,z]of[[3,7],[-4,-2.5],[7,-4.8]]){c.api.dh_debug_position(x,z);press(c,B.INTERACT,0,-.1);}assert.equal(c.get(12),7);assert.equal(c.get(10),1);assert.equal(c.get(11),0);const saved=c.save();const d=await fresh();assert(d.load(saved));assert.equal(d.get(12),7);d.api.dh_debug_position(0,19);press(d,B.INTERACT);assert.equal(d.get(11),3);});
test('corrupt saves and incorrect lengths are rejected without applying their state',async()=>{const c=await fresh();const saved=c.save();const bad=saved.slice();bad[bad.length-1]^=17;assert(!c.load(bad));assert.equal(c.get(5),100);assert(!c.load(saved.subarray(0,12)));});
test('player movement respects shore boundaries and collidable cover',async()=>{const c=await fresh();for(let i=0;i<90;i++){c.input(1,0,0,0,0);c.tick(1/60);}assert(c.get(0)<1.12);assert(c.get(0)>.1);});
