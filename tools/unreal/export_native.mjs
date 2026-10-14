import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { tasks } from '../../prototype/src/gameplay.mjs';

export const toUnreal=([x,y,z])=>[-z*100,x*100,y*100];
export const normalToUnreal=([x,y,z])=>[-z,x,y];
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');

function readGLB(bytes){
 assert.equal(bytes.readUInt32LE(0),0x46546c67,'Not a GLB');assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);
 const jsonLength=bytes.readUInt32LE(12);assert.equal(bytes.readUInt32LE(16),0x4e4f534a);
 const gltf=JSON.parse(bytes.subarray(20,20+jsonLength).toString());
 const binOffset=20+jsonLength;assert.equal(bytes.readUInt32LE(binOffset+4),0x004e4942);
 const bin=bytes.subarray(binOffset+8);assert.equal(bin.length,bytes.readUInt32LE(binOffset));
 assert.equal(gltf.buffers.length,1);assert(!gltf.buffers[0].uri);
 // This path consumes our baked, validated exports, not arbitrary remote glTF.
 for(const node of gltf.nodes)assert(!node.matrix&&!node.translation&&!node.rotation&&!node.scale,'Expected baked identity transforms');
 function accessor(index){
  const a=gltf.accessors[index],view=gltf.bufferViews[a.bufferView];assert(!a.sparse);assert(!a.normalized);assert.equal(view.buffer,0);
  const widths={SCALAR:1,VEC3:3,VEC4:4},width=widths[a.type];assert(width);
  const types={5126:['readFloatLE',4],5125:['readUInt32LE',4],5123:['readUInt16LE',2]};const type=types[a.componentType];assert(type);
  const start=(view.byteOffset||0)+(a.byteOffset||0),stride=view.byteStride||width*type[1];
  assert(start+(a.count-1)*stride+width*type[1]<=bin.length);
  return Array.from({length:a.count},(_,i)=>Array.from({length:width},(_,j)=>bin[type[0]](start+i*stride+j*type[1])));
 }
 return {gltf,accessor};
}

export function encodeWorld(glb){
 const {gltf,accessor}=readGLB(glb),chunks=[];let triangles=0,vertices=0;
 const primitives=gltf.nodes.filter(n=>n.mesh!==undefined).flatMap(n=>gltf.meshes[n.mesh].primitives);
 const header=Buffer.alloc(12);header.write('DHMS');header.writeUInt32LE(1,4);header.writeUInt32LE(primitives.length,8);chunks.push(header);
 for(const p of primitives){
  assert(p.mode===undefined||p.mode===4);const pos=accessor(p.attributes.POSITION),normal=accessor(p.attributes.NORMAL);
  const colors=p.attributes.COLOR_0!==undefined?accessor(p.attributes.COLOR_0):null;
  const idx=p.indices===undefined?pos.map((_,i)=>i):accessor(p.indices).map(v=>v[0]);
  assert.equal(pos.length,normal.length);assert.equal(idx.length%3,0);
  const material=gltf.materials[p.material]?.pbrMetallicRoughness||{},factor=material.baseColorFactor||[1,1,1,1];
  const roughness=material.roughnessFactor??1,metallic=material.metallicFactor??1;
  const section=Buffer.alloc(16+pos.length*40+idx.length*4);section.writeUInt32LE(pos.length,0);section.writeUInt32LE(idx.length,4);section.writeFloatLE(roughness,8);section.writeFloatLE(metallic,12);
  let offset=16;
  for(let i=0;i<pos.length;i++){
   const color=factor.map((v,k)=>v*(colors?.[i]?.[k]??1));
   const values=[...toUnreal(pos[i]),...normalToUnreal(normal[i]),...color];
   assert(values.every(Number.isFinite));for(const v of values){section.writeFloatLE(v,offset);offset+=4;}
  }
  // Reflection changes handedness: preserve source indices for UE's clockwise front faces.
  // The prototype vertex-color material is additionally two-sided.
  for(const i of idx){assert(i>=0&&i<pos.length);section.writeUInt32LE(i,offset);offset+=4;}
  chunks.push(section);triangles+=idx.length/3;vertices+=pos.length;
 }
 return {bytes:Buffer.concat(chunks),sections:primitives.length,triangles,vertices};
}

export async function exportNative(){
 const sourceDir=path.join(root,'prototype/public/assets/batch-01'),out=path.join(root,'native/DividedHorizon/Content/PrototypeData');await fs.mkdir(out,{recursive:true});
 const manifest=JSON.parse(await fs.readFile(path.join(sourceDir,'manifest.json')));const world=manifest.assets.find(a=>a.category==='World');
 const glb=await fs.readFile(path.join(sourceDir,world.file));assert.equal(crypto.createHash('sha256').update(glb).digest('hex'),world.sha256,'Source GLB checksum mismatch');
 const converted=encodeWorld(glb);assert.equal(converted.triangles,world.triangles);
 await fs.writeFile(path.join(out,'world.dhmesh'),converted.bytes);
 const layout=JSON.parse(await fs.readFile(path.join(sourceDir,'world-layout.json'))).layout;
 const heights={SM_CustomsHut_01:3.4,SM_EvidenceDesk_01:1.55,SM_SignalMast_01:9.5,SM_CargoCrate_01:1.31,SM_FuelDrum_01:1.03,SM_Checkpoint_01:1.35};
 const boxes=[];
 function addBox(name,x1,x2,z1,z2,bottom,top){boxes.push({name,center:toUnreal([(x1+x2)/2,(bottom+top)/2,(z1+z2)/2]),extent:[(z2-z1)*50,(x2-x1)*50,(top-bottom)*50]});}
 addBox('Ground',-18,18,-18,10,-.2,0);
 addBox('HutFloor',-6.2,-1.8,-4.8,-1.2,.48,.685);
 for(let i=0;i<3;i++){const c=-.95-i*.135,d=(3-i)*.27;addBox(`HutStep${i}`,-4.625,-3.375,c-d/2,c+d/2,0,.17*(i+1));}
 addBox('DockFloor',-1.3,1.3,10,22,.28,.428);
 for(const item of layout)for(const [x1,x2,z1,z2] of item.solid||[])addBox(item.asset,x1,x2,z1,z2,item.asset==='SM_CustomsHut_01'?.685:0,heights[item.asset]);
 // Fix the original browser rear-wall simplification in the native collision layout.
 const rear=boxes.find(b=>b.name==='SM_CustomsHut_01');rear.center=toUnreal([-4,2.04,-4.75]);rear.extent=[10,224,135.5];
 const positions={manifest:[3,1.45,5.85],ledger:[-4,1.65,-3.7],signal:[7,1.05,-5.7]};
 const data={schema:1,coordinateSystem:'UE centimetres: X=-glTF_Z, Y=glTF_X, Z=glTF_Y',sourceGLBSha256:world.sha256,
  spawn:{position:toUnreal([0,1.0,9]),yaw:0},
  objectives:tasks.map((t,index)=>({index,id:t.id,label:t.label,message:t.message,position:toUnreal(positions[t.id]),rangeCm:300})),
  extraction:{position:toUnreal([0,1.15,19]),rangeCm:250},collision:boxes};
 await fs.writeFile(path.join(out,'mission.json'),JSON.stringify(data,null,2)+'\n');
 const receipt={format:'DHMS v1; baked procedural prototype, not Nanite/static-mesh production art',sourceGLBSha256:world.sha256,outputSha256:crypto.createHash('sha256').update(converted.bytes).digest('hex'),bytes:converted.bytes.length,sections:converted.sections,triangles:converted.triangles,vertices:converted.vertices};
 await fs.mkdir(path.join(root,'docs/evidence/native-foundation'),{recursive:true});
 await fs.writeFile(path.join(root,'docs/evidence/native-foundation/export.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log(`Native world: ${receipt.sections} sections, ${receipt.triangles} triangles, ${receipt.bytes} bytes.\n${out}`);
 return {receipt,data};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await exportNative();
