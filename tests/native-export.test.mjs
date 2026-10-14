import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { toUnreal, normalToUnreal, exportNative, encodeWorld } from '../tools/unreal/export_native.mjs';

test('native coordinates use centimetres, +X forward, +Y right, +Z up',()=>{
 assert.deepEqual(toUnreal([1,2,-3]),[300,100,200]);
 assert.deepEqual(normalToUnreal([0,1,0]),[-0,0,1]);
});
test('native world export preserves triangles and emits valid matching mission data',async()=>{
 const {receipt,data}=await exportNative();
 assert.equal(receipt.triangles,92138);assert(receipt.sections>0&&receipt.sections<=128);
 assert.equal(data.objectives.length,3);assert.deepEqual(data.objectives.map(o=>o.id),['manifest','ledger','signal']);
 for(const box of data.collision){assert(box.extent.every(x=>Number.isFinite(x)&&x>0));assert(box.center.every(Number.isFinite));}
 for(const goal of data.objectives){assert(goal.position.every(Number.isFinite));assert(goal.rangeCm>=50&&goal.rangeCm<=1000);}
 const raw=await fs.readFile('prototype/public/assets/batch-01/L_PuertoChico_Prototype.glb');
 const again=encodeWorld(raw);const saved=await fs.readFile('native/DividedHorizon/Content/PrototypeData/world.dhmesh');assert(saved.equals(again.bytes));
});
test('native converter rejects non-GLB input',()=>{
 assert.throws(()=>encodeWorld(Buffer.alloc(64)));
});
