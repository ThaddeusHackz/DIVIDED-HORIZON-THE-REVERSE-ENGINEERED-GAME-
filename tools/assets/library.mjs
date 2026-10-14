import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Original procedural prototype geometry. Metres, right-handed, Y-up, ground pivots.
const colors = { wood:0x796044, woodLight:0xa68b61, woodDark:0x4d4234, steel:0x455c59, iron:0x303d3c, rust:0x8b5134, cream:0xe1cf9c, ochre:0xe0a343, teal:0x357b76, leaf:0x41664a, leafLight:0x657e48, paper:0xd5c6a0, red:0xa7573e };
const matCache = new Map();
function mat(key, metal = 0) {
  const id = `${key}-${metal}`;
  if (!matCache.has(id)) {
    const m = new T.MeshStandardMaterial({ color:colors[key] ?? key, roughness:metal ? .57 : .88, metalness:metal, side:key.startsWith?.('leaf') ? T.DoubleSide : T.FrontSide });
    m.name = `M_DH_${key}`; matCache.set(id,m);
  }
  return matCache.get(id);
}
function mesh(g,geo,key,p=[0,0,0],r=[0,0,0],metal=0) {
  const m = new T.Mesh(geo,mat(key,metal)); m.name=`${g.name}_${key}_${g.children.length}`;
  m.position.set(...p); m.rotation.set(...r); m.castShadow=true; m.receiveShadow=true; g.add(m); return m;
}
function box(g,s,p,key='wood',r=[0,0,0],round=0) { return mesh(g,round ? new RoundedBoxGeometry(...s,1,round) : new T.BoxGeometry(...s),key,p,r); }
function cyl(g,rt,rb,h,p,key='iron',r=[0,0,0],segments=16) { return mesh(g,new T.CylinderGeometry(rt,rb,h,segments),key,p,r,key==='iron'?.5:0); }
function beam(g,a,b,w,key='steel') {
  const av=new T.Vector3(...a), bv=new T.Vector3(...b), d=bv.clone().sub(av);
  const m=box(g,[w,d.length(),w],av.add(bv).multiplyScalar(.5).toArray(),key);
  m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()); return m;
}
function group(name) { const g=new T.Group();g.name=name;return g; }
function ring(g,r,t,p,key='rust',rotation=[Math.PI/2,0,0]) {return mesh(g,new T.TorusGeometry(r,t,6,28),key,p,rotation,.35);}
function bolt(g,p) {cyl(g,.022,.022,.025,p,'iron',[Math.PI/2,0,0],6);}

export const catalog=[
 {id:'SM_CustomsHut_01',title:'Customs hut',category:'Architecture',tag:'01 / ARCH',description:'Raised timber customs station. Open doorway, slatted shutters, a patched corrugated roof and ochre authority markings.',story:'The flag still flies. The inspector has not been paid.',scope:'Exterior + accessible interior; no door rig or glass.'},
 {id:'SM_Dock_01',title:'Timber jetty',category:'Infrastructure',tag:'02 / INFRA',description:'Six-metre repeating dock bay with individually laid boards, cross-braced piles, rope coils and mooring bollards.',story:'The only way in that leaves no footprints.',scope:'Static module; piles extend below the ground pivot.'},
 {id:'SM_SignalMast_01',title:'Signal mast',category:'Infrastructure',tag:'03 / INFRA',description:'Nine-metre lattice mast with a ladder, service platform, directional dish and a weathered signal cabinet.',story:'A landmark above the palms. A way to break the silence.',scope:'Static silhouette study; not climbable in the prototype.'},
 {id:'SM_CargoCrate_01',title:'Contraband crate',category:'Props',tag:'04 / PROP',description:'Slatted cargo box with diagonal reinforcement, metal straps, bolt heads and a customs inspection label.',story:'Declared as machine parts. Opened twice.',scope:'Closed static prop; no loot animation.'},
 {id:'SM_FuelDrum_01',title:'Harbor fuel drum',category:'Props',tag:'05 / PROP',description:'Ribbed steel drum with rolled rims, rust patches, a recessed top and capped filling port.',story:'Fuel for the boats that never appear on the manifest.',scope:'Static prop; no destruction or fire simulation.'},
 {id:'SM_Checkpoint_01',title:'Customs barricade',category:'Props',tag:'06 / PROP',description:'Heavy footed checkpoint with diagonal ochre slats and steel mounting hardware.',story:'Someone decided the beach needed a border.',scope:'Static roadblock; box collision in the browser prototype.'},
 {id:'SM_CoastalPalm_01',title:'Coastal palm',category:'Foliage',tag:'07 / FLORA',description:'Curved segmented trunk, sculpted fronds with individual leaflets, coconuts and a exposed root cluster.',story:'Salt, wind, and the long wait for rain.',scope:'Geometric prototype foliage; no wind rig, textures or LOD chain.'},
 {id:'SM_EvidenceDesk_01',title:'Inspector’s desk',category:'Story prop',tag:'08 / STORY',description:'Timber writing desk, open ledger, unpaid notices, ink bottle and a green-shaded task lamp.',story:'The paperwork outlived the people who wrote it.',scope:'Static assembly; the ledger is interactable in the browser scene.'}
];
export function makeAsset(id) {
 const g=group(id);
 if(id==='SM_CargoCrate_01') {
  box(g,[1.45,1.15,1.15],[0,.66,0],'woodDark',undefined,.025);
  for(let i=0;i<6;i++) {
   const x=-.615+i*.246;
   box(g,[.235,.095,1.2],[x,1.28,0],i%2?'wood':'woodLight');
   for(const z of [-.605,.605])box(g,[.235,1.12,.055],[x,.68,z],i%2?'woodLight':'wood');
  }
  for(const x of [-.74,.74])for(let i=0;i<5;i++)box(g,[.045,.21,1.19],[x,.23+i*.23,0],i%2?'wood':'woodLight');
  for(const x of [-.5,.5]) {box(g,[.065,1.28,1.28],[x,.66,0],'iron'); for(const z of [-.65,.65])for(const y of [.22,1.12])bolt(g,[x,y,z]);}
  beam(g,[-.65,.15,.653],[.65,1.2,.653],.085,'woodLight');
  box(g,[.3,.19,.009],[.18,.87,.657],'paper');
  for(let i=0;i<4;i++)box(g,[.17-i*.018,.01,.006],[.18,.92-i*.033,.665],'iron');
  for(const x of [-.5,.5])box(g,[.16,.1,1.2],[x,.05,0],'woodDark');
 } else if(id==='SM_FuelDrum_01') {
  cyl(g,.36,.36,.92,[0,.5,0],'teal',undefined,32);
  cyl(g,.348,.35,.035,[0,.98,0],'iron',undefined,32);
  for(const y of [.06,.29,.72,.98])ring(g,.361,.019,[0,y,0]);
  cyl(g,.055,.055,.026,[.17,1.01,.08],'rust',undefined,12);
  box(g,[.21,.17,.016],[0,.52,.354],'cream');
  box(g,[.1,.1,.02],[0,.53,.37],'ochre',[0,0,Math.PI/4]);
  for(let i=0;i<17;i++) {const a=i*2.399;const m=box(g,[.015+(i%3)*.01,.04+(i%4)*.022,.012],[Math.sin(a)*.36,.16+(i%7)*.105,Math.cos(a)*.36],'rust');m.rotation.y=a;}
 } else if(id==='SM_Checkpoint_01') {
  for(const x of [-1.2,1.2]) {
   box(g,[.28,.16,1.12],[x,.08,0],'iron',undefined,.035);
   beam(g,[x,.14,-.4],[x,1.27,0],.12,'woodDark');beam(g,[x,.14,.4],[x,1.27,0],.12,'woodDark');
  }
  for(const y of [.64,1.13]) {box(g,[3,.24,.12],[0,y,0],'cream',undefined,.012);for(let i=-6;i<=6;i++)box(g,[.1,.26,.016],[i*.21,y,.07],'ochre',[0,0,-.45]);}
  for(const x of [-1.2,1.2])for(const y of [.64,1.13])bolt(g,[x,y,.089]);
 } else if(id==='SM_Dock_01') {
  for(const x of [-1.15,1.15])for(const z of [-2.65,2.65]) {
   cyl(g,.115,.15,2.7,[x,-.55,z],'woodDark',undefined,12);
   cyl(g,.15,.15,.07,[x,.83,z],'woodLight',undefined,12);
   for(let i=0;i<4;i++)ring(g,.132,.014,[x,.5+i*.043,z],'cream');
  }
  for(const x of [-1,1])box(g,[.19,.28,6],[x,.17,0],'woodDark');
  for(let i=0;i<30;i++) {const z=-2.9+i*.2;box(g,[2.6,.115,.188],[0,.37,z],i%3?'wood':'woodLight'); for(const x of [-1,1])bolt(g,[x,.433,z]);}
  for(const z of [-2.65,2.65]) {beam(g,[-1.1,-1.4,z],[1.1,.2,z],.14,'wood');beam(g,[1.1,-1.4,z],[-1.1,.2,z],.14,'wood');}
  for(const x of [-.95,.95]) {cyl(g,.065,.11,.33,[x,.59,1.8],'iron');box(g,[.35,.07,.08],[x,.74,1.8],'iron');}
  for(let i=0;i<5;i++)ring(g,.2+i*.022,.013,[.5,.45,-1.6],'cream');
 } else if(id==='SM_CustomsHut_01') {
  for(const x of [-2,2])for(const z of [-1.6,1.6])box(g,[.23,.6,.23],[x,.3,z],'woodDark');
  for(let i=0;i<23;i++)box(g,[.18,.13,3.6],[-2.09+i*.19,.62,0],i%3?'wood':'woodLight');
  for(const x of [-2.15,2.15])for(const z of [-1.75,1.75])box(g,[.16,2.9,.16],[x,2.08,z],'woodDark');
  for(let i=0;i<13;i++) {
   const y=.8+i*.2;box(g,[4.3,.185,.07],[0,y,-1.77],i%3?'teal':'steel');
   // Front has a generous 1.2 m doorway; right wall has open louvered windows.
   box(g,[1.52,.185,.07],[-1.39,y,1.77],i%3?'teal':'steel');box(g,[1.52,.185,.07],[1.39,y,1.77],i%3?'teal':'steel');
   box(g,[.07,.185,3.5],[-2.16,y,0],i%3?'teal':'steel');
   if(i<5||i>10)box(g,[.07,.185,3.5],[2.16,y,0],i%3?'teal':'steel');
  }
  for(const x of [-.67,.67])box(g,[.12,2.65,.14],[x,1.97,1.82],'cream');
  box(g,[1.44,.17,.16],[0,3.2,1.82],'cream');
  for(let i=0;i<6;i++)box(g,[.11,.08,2.65],[2.18,1.86+i*.17,0],'woodLight',[0,0,.3]);
  // Two individual corrugated roof slopes. Ribs follow the fall of the roof.
  for(const side of [-1,1]) {
   box(g,[2.65,.06,4.15],[side*1.22,3.71,0],'steel',[0,0,-side*.25]);
   for(let j=0;j<28;j++)box(g,[2.65,.025,.037],[side*1.22,3.752,-2+j*.148],j%9?'steel':'rust',[0,0,-side*.25]);
  }
  cyl(g,.065,.065,4.2,[0,4.045,0],'iron',[Math.PI/2,0,0]);
  box(g,[.72,.017,.85],[-1,3.85,.6],'rust',[0,0,.25]);
  for(let i=0;i<3;i++)box(g,[1.25,.17,(3-i)*.27],[0,.085+i*.17,2.05+i*-.135],'woodLight');
  box(g,[1.8,.38,.1],[0,3.48,1.96],'ochre');
  for(let i=0;i<7;i++)box(g,[.1,.13,.013],[-.57+i*.19,3.49,2.019],'cream');
  beam(g,[-2.24,2.9,1.75],[-2.24,4.7,1.75],.055,'iron');
  box(g,[.75,.44,.015],[-1.86,4.38,1.75],'ochre');
  box(g,[.035,.44,.023],[-1.91,4.38,1.763],'cream');
 } else if(id==='SM_SignalMast_01') {
  for(const x of [-.65,.65])for(const z of [-.65,.65]) {
   box(g,[.6,.2,.6],[x,.1,z],'cream',undefined,.04);beam(g,[x,.2,z],[x*.34,8.4,z*.34],.075);
  }
  for(let level=0;level<7;level++) {
   const y=.4+level*1.1,w=.65-y*.05,w2=.65-(y+1.1)*.05;
   for(const side of [-1,1]) {
    beam(g,[-w,y,side*w],[w2,y+1.1,side*w2],.035);beam(g,[w,y,side*w],[-w2,y+1.1,side*w2],.035);
    beam(g,[side*w,y,-w],[side*w2,y+1.1,w2],.035);beam(g,[side*w,y,w],[side*w2,y+1.1,-w2],.035);
   }
  }
  for(const x of [-.2,.2])beam(g,[x,.3,.74],[x,7.9,.74],.035,'iron');
  for(let i=0;i<26;i++)beam(g,[-.21,.45+i*.29,.74],[.21,.45+i*.29,.74],.025,'iron');
  box(g,[1.8,.1,1.7],[0,7.6,0],'iron');
  for(const z of [-.8,.8]) {beam(g,[-.85,8.25,z],[.85,8.25,z],.035);for(const x of [-.85,.85])beam(g,[x,7.65,z],[x,8.25,z],.035);}
  cyl(g,.027,.027,1.6,[0,8.65,0],'cream');
  const dish=mesh(g,new T.SphereGeometry(.56,24,12,0,Math.PI*2,0,.85),'cream',[.55,6.9,0]);dish.rotation.z=-Math.PI/2;dish.material=mat('cream').clone();dish.material.side=T.DoubleSide;
  beam(g,[.8,6.9,0],[1.25,6.9,0],.03,'iron');cyl(g,.06,.06,.13,[1.25,6.9,0],'iron',[0,0,Math.PI/2]);
  box(g,[.54,.7,.26],[0,.9,.72],'teal',undefined,.025);box(g,[.22,.11,.01],[0,1,.86],'ochre');
  for(let i=0;i<5;i++)box(g,[.25,.015,.015],[0,.7+i*.045,.86],'iron');
 } else if(id==='SM_CoastalPalm_01') {
  const point=y=>[.025*y*y,y,Math.sin(y*.6)*.16];
  for(let i=0;i<28;i++) {const a=point(i*.2),b=point((i+1)*.2);const r=.19-i*.0035;const av=new T.Vector3(...a),bv=new T.Vector3(...b);const m=cyl(g,r*.91,r,.22,av.clone().add(bv).multiplyScalar(.5).toArray(),i%3?'wood':'woodLight',undefined,10);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());}
  for(let i=0;i<8;i++) {const a=i*Math.PI/4;beam(g,[Math.cos(a)*.43,.015,Math.sin(a)*.43],[0,.55,0],.11,'woodDark');}
  const top=new T.Vector3(...point(5.55));
  for(let i=0;i<11;i++) {
   const angle=i*2.399,dir=new T.Vector3(Math.cos(angle),0,Math.sin(angle)),side=new T.Vector3(-dir.z,0,dir.x),len=2.3+(i%3)*.29;
   const pts=[];for(let j=0;j<=12;j++){let t=j/12;pts.push(top.clone().addScaledVector(dir,t*len).add(new T.Vector3(0,Math.sin(t*Math.PI)*.65-t*t*.95,0)));}
   for(let j=0;j<12;j++)beam(g,pts[j].toArray(),pts[j+1].toArray(),.026,'leafLight');
   for(let j=1;j<12;j++)for(const s of [-1,1]) {
    const t=j/12,w=Math.sin(t*Math.PI)*.54;
    const a=pts[j],b=a.clone().addScaledVector(side,s*w).addScaledVector(dir,.4).add(new T.Vector3(0,-.23,0)),c=pts[j+1];
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([...a.toArray(),...b.toArray(),...c.toArray()],3));geo.computeVertexNormals();mesh(g,geo,j%3?'leaf':'leafLight');
   }
  }
  for(let i=0;i<5;i++)mesh(g,new T.SphereGeometry(.13,10,8),'woodDark',top.clone().add(new T.Vector3(Math.cos(i*1.25)*.21,-.12,Math.sin(i*1.25)*.21)).toArray());
 } else if(id==='SM_EvidenceDesk_01') {
  box(g,[1.75,.085,.86],[0,.84,0],'woodLight',undefined,.02);
  for(const x of [-.73,.73])for(const z of [-.31,.31])box(g,[.085,.81,.085],[x,.405,z],'woodDark');
  box(g,[1.52,.22,.68],[0,.68,0],'wood');box(g,[.62,.18,.025],[-.38,.68,.355],'woodLight');box(g,[.62,.18,.025],[.38,.68,.355],'woodLight');
  for(const x of [-.38,.38])box(g,[.12,.025,.04],[x,.7,.39],'iron');
  box(g,[.58,.025,.39],[-.21,.903,.09],'woodDark',[0,.15,0]);
  for(const x of [-.35,-.08]) {box(g,[.25,.022,.35],[x,.926,.09],'paper',[0,.15,0]);for(let j=0;j<7;j++)box(g,[.16,.002,.008],[x,.94,-.04+j*.039],'woodDark',[0,.15,0]);}
  for(let i=0;i<4;i++)box(g,[.24,.005,.31],[.35,.89+i*.008,.17],'paper',[0,-.2+i*.1,0]);
  cyl(g,.12,.14,.035,[.62,.9,-.22],'iron');beam(g,[.62,.93,-.22],[.62,1.3,-.22],.025,'iron');
  cyl(g,.07,.2,.15,[.57,1.32,-.22],'teal',undefined,24);cyl(g,.035,.04,.09,[-.65,.93,-.22],'iron');
 }
 g.userData={assetId:id,prototype:true,units:'metres',provenance:'Original AI-assisted procedural mesh; no third-party art; 2026-10-14'};
 return g;
}

export const layout = [
 {asset:'SM_CustomsHut_01',x:-4,z:-3,rotation:0,solid:[[-6.24,-2.76,-4.85,-4.65],[-6.24,-6.05,-4.8,-1.2],[-1.95,-1.76,-4.8,-1.2],[-6.2,-4.61,-1.32,-1.1],[-3.39,-1.8,-1.32,-1.1]]},
 {asset:'SM_EvidenceDesk_01',x:-4,y:.685,z:-3.7,rotation:0,solid:[[-4.95,-3.05,-4.2,-3.2]]},
 {asset:'SM_SignalMast_01',x:7,z:-7,rotation:0,solid:[[6,8,-8,-6]]},
 {asset:'SM_Dock_01',x:0,z:13,rotation:0},
 {asset:'SM_Dock_01',x:0,z:19,rotation:0},
 {asset:'SM_CargoCrate_01',x:3,z:5,rotation:.12,solid:[[2.1,3.9,4.2,5.8]]},
 {asset:'SM_CargoCrate_01',x:4.8,z:4.8,rotation:-.1,solid:[[3.9,5.7,4,5.6]]},
 {asset:'SM_CargoCrate_01',x:-7,z:1,rotation:.4,solid:[[-8,-6,0,2]]},
 {asset:'SM_FuelDrum_01',x:-2,z:7,rotation:0,solid:[[-2.45,-1.55,6.55,7.45]]},
 {asset:'SM_FuelDrum_01',x:-2.9,z:7.3,rotation:.7,solid:[[-3.35,-2.45,6.85,7.75]]},
 {asset:'SM_FuelDrum_01',x:-7,z:2.5,rotation:1},
 {asset:'SM_Checkpoint_01',x:3.5,z:-1,rotation:.12,solid:[[1.9,5.1,-1.65,-.35]]},
 {asset:'SM_Checkpoint_01',x:10,z:-1,rotation:-.12,solid:[[8.4,11.6,-1.65,-.35]]},
 ...[[-11,-7],[-10,6],[10,6],[14,-10],[-15,-14],[15,0],[-13,1],[4,-14],[13,11],[-14,12],[-2,-15]].map(([x,z],i)=>({asset:'SM_CoastalPalm_01',x,z,rotation:i*1.2}))
];
export const colliders = layout.flatMap(x=>x.solid||[]);
export function makeWorld() {
 const g=group('L_PuertoChico_Prototype');
 // Low relief island platform: deliberately small test cell, not the full world.
 const ground=new T.PlaneGeometry(100,100,72,72);ground.rotateX(-Math.PI/2);
 const pos=ground.attributes.position;const cols=[];
 for(let i=0;i<pos.count;i++) {
  const x=pos.getX(i),z=pos.getZ(i),r=Math.hypot(x,z),edge=Math.max(0,r-19);
  let y=-.03-edge*.18+Math.sin(x*.24)*Math.cos(z*.26)*Math.min(1,edge*.12);
  if(z>10)y-=Math.min(2,(z-10)*.25);
  pos.setY(i,y);
  const c=new T.Color(z>4||r>21 ? 0xb3a079 : 0x7e8560);c.multiplyScalar(.95+Math.sin(x*.7+z*.39)*.04);cols.push(c.r,c.g,c.b);
 }
 ground.setAttribute('color',new T.Float32BufferAttribute(cols,3));ground.computeVertexNormals();
 const gm=new T.MeshStandardMaterial({vertexColors:true,roughness:1});gm.name='M_Island_Prototype';const land=new T.Mesh(ground,gm);land.name='SM_Shore';land.receiveShadow=true;g.add(land);
 for(const item of layout) {const obj=makeAsset(item.asset);obj.position.set(item.x,item.y||0,item.z);obj.rotation.y=item.rotation;g.add(obj);}
 // Path stones, seaward retaining rocks and distant silhouette islets.
 for(let i=0;i<38;i++) {
  const a=i*2.399,r=20+(i%4)*2;const x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(z>9&&Math.abs(x)<3)continue;
  const m=mesh(g,new T.DodecahedronGeometry(1,1),i%2?0x686f5f:0x8b8e76,[x,-.55,z],[i*.2,i*.8,0]);m.scale.set(1.1+i%3,.6+(i%4)*.2,.85+(i%5)*.2);
 }
 for(let i=0;i<13;i++){const m=box(g,[1.2,.035,.6],[Math.sin(i*.4)*.3,.025,8-i*.72],0xa59672,[0,i*.13,0],.08);m.receiveShadow=true;}
 g.userData={prototype:true,area:'Puerto Chico / Isla Sombra',size:'Small 40 m outpost cell; surrounding non-playable shore',units:'metres'};
 return g;
}
