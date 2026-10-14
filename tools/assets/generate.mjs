import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { catalog, makeAsset, makeWorld, layout } from './library.mjs';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
function batchMeshes(source) {
 source.updateMatrixWorld(true);
 const buckets=new Map();
 source.traverse(o=>{
  if(!o.isMesh)return;
  const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);
  // Normalize attributes for batching. These assets intentionally have no texture maps.
  geo.deleteAttribute('uv');
  const key=`${o.material.uuid}-${!!geo.attributes.color}`;
  if(!buckets.has(key))buckets.set(key,{material:o.material,geos:[]});
  buckets.get(key).geos.push(geo.index?geo.toNonIndexed():geo);
 });
 const result=new T.Group();result.name=source.name;result.userData=source.userData;
 for(const {material,geos} of buckets.values()) {
  const m=new T.Mesh(mergeGeometries(geos),material);m.name=`${source.name}_${material.name}`;result.add(m);
 }
 return result;
}

// GLTFExporter needs FileReader even for texture-free binary exports on Node.
globalThis.FileReader=class {
 readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.();});}
 readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result=`data:${blob.type};base64,${Buffer.from(v).toString('base64')}`;this.onloadend?.();});}
};
const root=path.resolve('prototype/public/assets/batch-01');await fs.mkdir(root,{recursive:true});
const exporter=new GLTFExporter();
const manifest={schema:1,batch:'01',title:'Puerto Chico — The customs station',date:'2026-10-14',status:'PROTOTYPE — not production approved',units:'metres',upAxis:'Y',generator:'tools/assets/library.mjs; Three.js 0.180.0',provenance:'Original AI-assisted procedural geometry. No Tripo generation, scanned assets, or third-party art. No textures, rigging, LODs or UE5 quality gate claims.',assets:[]};
for(const item of [...catalog,{id:'L_PuertoChico_Prototype',title:'Puerto Chico test cell',category:'World',description:'An assembled coastal customs outpost using all eight kit pieces.',scope:'Small exploration scene; not the full Isla Sombra world.'}]) {
 const object=batchMeshes(item.category==='World'?makeWorld():makeAsset(item.id));object.updateMatrixWorld(true);
 const data=Buffer.from(await exporter.parseAsync(object,{binary:true,onlyVisible:true}));
 await fs.writeFile(path.join(root,`${item.id}.glb`),data);
 let triangles=0,meshes=0;object.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});
 const b=new T.Box3().setFromObject(object),size=b.getSize(new T.Vector3());
 manifest.assets.push({...item,file:`${item.id}.glb`,preview:`previews/${item.id}.png`,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),triangles,meshes,boundsMeters:size.toArray().map(v=>+v.toFixed(3)),pivot:'Ground origin; dock piles intentionally extend below pivot',materials:'Geometry-colored metallic-roughness PBR; untextured prototype',license:'Original project content; no external art license required; AI-assisted provenance disclosed'});
 console.log(`${item.id}: ${triangles} triangles; ${(data.length/1024).toFixed(0)} KiB`);
}
await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(root,'world-layout.json'),JSON.stringify({units:'metres',upAxis:'Y',layout},null,2)+'\n');
