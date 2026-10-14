import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { canMove, walkable, surfaceHeight, tasks, interactionAt } from '../prototype/src/gameplay.mjs';
import { catalog, makeAsset, colliders, layout } from '../tools/assets/library.mjs';

test('eight distinct original asset IDs match the checked-in manifest',async()=>{
 const m=JSON.parse(await fs.readFile('prototype/public/assets/batch-01/manifest.json'));
 assert.equal(catalog.length,8);assert.equal(new Set(catalog.map(a=>a.id)).size,8);
 assert.equal(m.assets.length,9);
 for(const asset of catalog)assert(m.assets.some(a=>a.id===asset.id));
});
test('generated vertex coordinates are finite and each model has geometry',()=>{
 for(const asset of catalog){let count=0;makeAsset(asset.id).traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;count+=p.count;assert([...p.array].every(Number.isFinite),asset.id);});assert(count>0);}
});
test('shore and dock boundaries reject the ocean',()=>{
 assert(walkable(0,9));assert(walkable(0,21));assert(!walkable(3,20));assert(!walkable(0,22));assert(!walkable(50,0));
});
test('solid props and hut walls block movement, door remains open',()=>{
 assert(!canMove(3,5,colliders));assert(!canMove(-6.15,-3,colliders));assert(!canMove(7,-7,colliders));
 assert(canMove(-4,-1,colliders));assert(canMove(-4,-2.4,colliders));
});
test('hut floor, stairs and dock use appropriate standing heights',()=>{
 assert.equal(surfaceHeight(-4,-2),.685);assert.equal(surfaceHeight(-4,-.8),.36);assert.equal(surfaceHeight(0,19),.428);assert.equal(surfaceHeight(0,0),0);
 const desk=layout.find(i=>i.asset==='SM_EvidenceDesk_01');assert.equal(desk.y,.685);
});
test('mission requires all three unique tasks before extraction',()=>{
 const done=new Set();assert.equal(interactionAt(0,19,done),null);
 assert.equal(interactionAt(3,6.5,done,colliders)?.id,'manifest');done.add('manifest');assert.equal(interactionAt(3,6.5,done,colliders),null);
 done.add('ledger');assert.equal(interactionAt(0,19,done),null);done.add('signal');assert.equal(interactionAt(0,19,done)?.id,'extract');
});
test('ledger cannot be read through hut walls',()=>{
 assert.equal(interactionAt(-4,-5,new Set(),colliders),null);
 assert.equal(interactionAt(-4,-2.5,new Set(),colliders)?.id,'ledger');
});
test('every objective and extraction can be reached from spawn without crossing collision',()=>{
 // Breadth-first flood fill at 25 cm resolution. Goal interaction also checks
 // line of sight, so a point on the wrong side of a wall is not sufficient.
 const queue=[[0,36]],seen=new Set(['0,36']),reachable=new Set();
 let extraction=false;
 for(let i=0;i<queue.length;i++){
  const [gx,gz]=queue[i],x=gx*.25,z=gz*.25;
  const t=interactionAt(x,z,new Set(),colliders);if(t)reachable.add(t.id);
  if(interactionAt(x,z,new Set(tasks.map(t=>t.id)),colliders)?.id==='extract')extraction=true;
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=gx+dx,nz=gz+dz,key=`${nx},${nz}`;if(!seen.has(key)&&canMove(nx*.25,nz*.25,colliders)){seen.add(key);queue.push([nx,nz]);}}
 }
 assert.deepEqual([...reachable].sort(),tasks.map(t=>t.id).sort());assert(extraction);
});
