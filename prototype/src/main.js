import './style.css';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { tasks, canMove, surfaceHeight, interactionAt } from './gameplay.mjs';

const $=s=>document.querySelector(s);
const base='/assets/batch-01/';
const manifest=await fetch(`${base}manifest.json`).then(r=>{if(!r.ok)throw new Error('Missing asset manifest');return r.json();});
const worldLayout=await fetch(`${base}world-layout.json`).then(r=>r.json());
const colliders=worldLayout.layout.flatMap(i=>i.solid||[]);
const worldId='L_PuertoChico_Prototype';
let selected=worldId,play=false,paused=false,night=false,spinning=false,loadToken=0;
const completed=new Set(),keys=new Set();let yaw=0,pitch=0,toastTimer,drag=null;
const player=new T.Vector3(0,1.7,9);
const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
$('#viewport').append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#cad0c1');scene.fog=new T.Fog('#cad0c1',60,170);
const camera=new T.PerspectiveCamera(42,1,.05,240);const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.07;controls.maxPolarAngle=Math.PI*.49;
const hemi=new T.HemisphereLight(0xe5efdf,0x6a6551,2.9);scene.add(hemi);
const sun=new T.DirectionalLight(0xffe0ad,4.2);sun.position.set(-18,32,16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.normalBias=.04;sun.shadow.bias=-.0003;scene.add(sun);
const fill=new T.DirectionalLight(0xd4e6df,1.1);fill.position.set(12,8,-15);scene.add(fill);
const floor=new T.Mesh(new T.PlaneGeometry(2000,2000),new T.MeshStandardMaterial({color:0xd1d6c6,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.015;floor.receiveShadow=true;scene.add(floor);
const ocean=new T.Mesh(new T.PlaneGeometry(650,650,80,80),new T.MeshStandardMaterial({color:0x387e78,roughness:.36,metalness:.32}));ocean.rotation.x=-Math.PI/2;ocean.position.y=-.72;ocean.name='PreviewOcean';scene.add(ocean);
// Long offshore lines provide a restrained, non-photoreal water treatment.
const waves=new T.Group();for(let i=0;i<30;i++){const w=new T.Mesh(new T.PlaneGeometry(9+(i%4)*8,.04),new T.MeshBasicMaterial({color:0xabc7b3,transparent:true,opacity:.18}));w.rotation.x=-Math.PI/2;w.position.set(Math.sin(i*2.4)*60,-.69,24+i*3);waves.add(w);}scene.add(waves);
const loader=new GLTFLoader(),cache=new Map();let model;
async function load(id){
 if(!cache.has(id))cache.set(id,loader.loadAsync(`${base}${id}.glb`).then(g=>{g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g.scene;}));
 return cache.get(id);
}
function resize(){const v=$('#viewport');const w=v.clientWidth,h=v.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe($('#viewport'));window.addEventListener('resize',resize);
function frameModel(){
 const isWorld=selected===worldId;camera.fov=42;camera.updateProjectionMatrix();
 if(isWorld){controls.target.set(0,1.2,1);camera.position.set(30,25,39);controls.minDistance=12;controls.maxDistance=95;}
 else {const bounds=new T.Box3().setFromObject(model),s=bounds.getSize(new T.Vector3()),c=bounds.getCenter(new T.Vector3());const size=Math.max(s.x,s.y,s.z);controls.target.copy(c);camera.position.copy(c).add(new T.Vector3(1.3,.8,1.65).multiplyScalar(size*.96));controls.minDistance=size*.55;controls.maxDistance=size*5;}
 controls.update();
}
async function select(id){
 const token=++loadToken;$('#loading').hidden=false;
 try{
  const next=await load(id);if(token!==loadToken)return;
  if(model)scene.remove(model);model=next;scene.add(model);selected=id;
  floor.visible=id!==worldId;ocean.visible=waves.visible=id===worldId;
  // Dock geometry includes submerged support piles; lower the display floor for inspection.
  floor.position.y=id==='SM_Dock_01'?-1.92:-.015;
  frameModel();const item=manifest.assets.find(a=>a.id===id),isWorld=id===worldId;
  $('#scene-kicker').textContent=isWorld?'ACT I / THE COAST':`BATCH 01 / ${item.category.toUpperCase()}`;
  $('#scene-title').innerHTML=isWorld?'A quiet shore.<br>A divided<br><em>horizon.</em>':item.title;
  $('#scene-description').textContent=isWorld?'Salt-worn timber. A signal above the palms. Paperwork left behind. The first pieces of Puerto Chico, built to tell a story.':item.description;
  $('#stage-label').textContent=isWorld?'01 — PUERTO CHICO TEST CELL':`${item.tag} — ${item.triangles.toLocaleString()} TRIANGLES`;
  $('#download').href=`${base}${item.file}`;$('#download').innerHTML=`Download ${isWorld?'world':'model'} GLB <span>↓</span>`;
  $('#world').hidden=isWorld;
  document.querySelectorAll('.asset-card').forEach(el=>{el.classList.toggle('active',el.dataset.id===id);el.setAttribute('aria-pressed',String(el.dataset.id===id));});
  $('#loading').hidden=true;
  window.__viewerReady=id;
 }catch(e){console.error(e);$('#loading').textContent='Could not load the model. Refresh to try again.';throw e;}
}
function renderCards(filter='All'){
 const cards=manifest.assets.filter(i=>i.category!=='World'&&(filter==='All'||i.category===filter||(filter==='Props'&&i.category==='Story prop')));
 $('#assets').innerHTML=cards.map(a=>`<button class="asset-card ${selected===a.id?'active':''}" data-id="${a.id}" aria-pressed="${selected===a.id}"><div class="asset-image"><img src="${base}${a.preview}" alt="Rendered ${a.title.toLowerCase()} model" loading="lazy"><span>↗</span></div><span class="asset-tag">${a.tag}</span><div class="asset-title"><strong>${a.title}</strong><small>${(a.triangles/1000).toFixed(1)}K TRIS</small></div></button>`).join('');
 document.querySelectorAll('.asset-card').forEach(b=>b.onclick=async()=>{await select(b.dataset.id);$('.hero').scrollIntoView({behavior:'smooth',block:'start'});});
}
renderCards();
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCards(b.dataset.filter);});
$('#world').onclick=()=>select(worldId);$('#reset-camera').onclick=frameModel;
$('#rotate').onclick=()=>{spinning=!spinning;controls.autoRotate=spinning;$('#rotate').setAttribute('aria-pressed',String(spinning));};
function lighting(){night=!night;scene.background.set(night?0x253e45:0xcad0c1);scene.fog.color.copy(scene.background);sun.intensity=night?.6:4.2;sun.color.set(night?0xa9cbdc:0xffe0ad);hemi.intensity=night?1:2.9;fill.intensity=night?.4:1.1;$('#light span').textContent=night?'Dusk':'Dawn';}
$('#light').onclick=lighting;
$('#capture').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download=`${selected}.png`;a.href=renderer.domElement.toDataURL('image/png');a.click();};
function updateObjectives(){
 $('#objectives').innerHTML=tasks.map(t=>`<div class="objective ${completed.has(t.id)?'done':''}"><span>${completed.has(t.id)?'✓':'○'}</span>${t.label}</div>`).join('')+(completed.size===3?'<div class="objective"><span>→</span>Return to the end of the jetty</div>':'');
}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;toastTimer=setTimeout(()=>$('#toast').textContent='',7000);}
function setPause(value){paused=value;keys.clear();drag=null;$('#pause-panel').hidden=!value;}
async function enter(){
 if(play)return;
 await select(worldId);play=true;paused=false;controls.enabled=false;controls.autoRotate=false;
 document.body.classList.add('playing');$('#play-hud').hidden=false;resize();camera.fov=70;camera.updateProjectionMatrix();
 restart();
}
function restart(){completed.clear();player.set(0,1.7,9);yaw=0;pitch=0;setPause(false);updateObjectives();$('#pause-title').textContent='Take a breath.';$('#pause-text').textContent='A small exploration prototype. No combat, enemies, or saves yet.';$('#resume').textContent='Resume exploration ↗';toast('Find the manifest beside the cargo crates. Drag the mouse to look around.');}
function leave(){play=false;setPause(false);keys.clear();$('#play-hud').hidden=true;document.body.classList.remove('playing');controls.enabled=true;controls.autoRotate=spinning;camera.rotation.order='XYZ';frameModel();resize();}
function interact(){
 const t=interactionAt(player.x,player.z,completed,colliders);if(!t)return;
 if(t.id==='extract'){setPause(true);$('#pause-title').textContent='Evidence secured.';$('#pause-text').textContent='Assignment complete. You recovered the manifest and ledger, restored the signal, and made it back to the jetty. This is the end of Batch 01’s exploration test.';$('#resume').textContent='Keep exploring ↗';return;}
 completed.add(t.id);updateObjectives();toast(t.message);
}
$('#play').onclick=enter;$('#play-top').onclick=enter;$('#leave').onclick=leave;$('#return').onclick=leave;
$('#pause').onclick=()=>setPause(!paused);$('#resume').onclick=()=>setPause(false);$('#restart').onclick=restart;
window.addEventListener('keydown',e=>{
 if(!play)return;
 if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyE','Escape','Space'].includes(e.code))e.preventDefault();
 if(e.code==='Escape'&&!e.repeat){setPause(!paused);return;}
 if(paused)return;
 keys.add(e.code);if(e.code==='KeyE'&&!e.repeat)interact();
});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(play)setPause(true);});
renderer.domElement.addEventListener('pointerdown',e=>{if(play&&!paused){drag={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);}});
renderer.domElement.addEventListener('pointermove',e=>{if(!play||paused||!drag)return;yaw-=(e.clientX-drag.x)*.003;pitch=T.MathUtils.clamp(pitch-(e.clientY-drag.y)*.003,-1.35,1.35);drag={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener('pointerup',()=>drag=null);renderer.domElement.addEventListener('pointercancel',()=>drag=null);
function tickGame(dt){
 if(paused)return;
 yaw+=((keys.has('ArrowLeft')?1:0)-(keys.has('ArrowRight')?1:0))*dt*1.6;
 pitch=T.MathUtils.clamp(pitch+((keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0))*dt,-1.35,1.35);
 let f=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),s=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
 const norm=Math.hypot(f,s)||1,speed=(keys.has('ShiftLeft')||keys.has('ShiftRight')?5:2.7)*dt;
 f=f/norm*speed;s=s/norm*speed;
 const dx=-Math.sin(yaw)*f+Math.cos(yaw)*s,dz=-Math.cos(yaw)*f-Math.sin(yaw)*s;
 if(canMove(player.x+dx,player.z,colliders))player.x+=dx;
 if(canMove(player.x,player.z+dz,colliders))player.z+=dz;
 const y=surfaceHeight(player.x,player.z)+1.7;player.y=T.MathUtils.lerp(player.y,y,Math.min(1,dt*12));
 camera.position.copy(player);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
 const task=interactionAt(player.x,player.z,completed,colliders);$('#interact').hidden=!task;if(task)$('#interact').innerHTML=`<b>E</b> ${task.label}`;
 $('#coords').textContent=`${player.x.toFixed(1)} E / ${player.z.toFixed(1)} N`;
}
const clock=new T.Clock();
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.04);if(play)tickGame(dt);else controls.update();waves.children.forEach((w,i)=>{w.position.x+=Math.sin(i)*dt*.09;});renderer.render(scene,camera);});
const requestedAsset=new URLSearchParams(location.search).get('asset');
await select(manifest.assets.some(a=>a.id===requestedAsset)?requestedAsset:worldId);resize();
// Narrow, opt-in browser automation interface. Never active in the ordinary preview.
if(new URLSearchParams(location.search).has('qa'))window.__qa={select,enter,leave,setPause,restart,interact,state:()=>({play,paused,completed:[...completed],position:player.toArray(),selected,drawCalls:renderer.info.render.calls}),teleport:(x,z)=>{player.set(x,surfaceHeight(x,z)+1.7,z);},capture:()=>{renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');},camera:()=>({position:camera.position.toArray(),target:controls.target.toArray()})};
