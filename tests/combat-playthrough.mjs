import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createCore,BUTTON as B } from '../prototype/src/core-bridge.mjs';
const config=JSON.parse(await fs.readFile('prototype/public/assets/batch-02/combat.json'));
const c=await createCore(await fs.readFile('prototype/public/slice-core.wasm'));
const box=config.boxes;
function free(x,z){return ((x*x+z*z<888&&z<=9.5)||(Math.abs(x)<.9&&z>=9&&z<21.6))&&!box.some(b=>x>b[0]-.29&&x<b[1]+.29&&z>b[2]-.29&&z<b[3]+.29);}
function pathTo(x,z,tx,tz){const start=[Math.round(x*2),Math.round(z*2)],goal=[Math.round(tx*2),Math.round(tz*2)],queue=[start],parent=new Map([[start.join(','),null]]);let found;
 for(let i=0;i<queue.length;i++){const p=queue[i];if(Math.hypot(p[0]-goal[0],p[1]-goal[1])<=1){found=p;break;}for(const[d,e]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=[p[0]+d,p[1]+e],k=n.join(',');if(!parent.has(k)&&free(n[0]/2,n[1]/2)){parent.set(k,p);queue.push(n);}}}
 assert(found,'Objective has a collision-respecting route');const path=[];while(found){path.push([found[0]/2,found[1]/2]);found=parent.get(found.join(','));}return path.reverse().slice(1);
}
function sight(s,point){const o=[s.x,s.y,s.z],d=point.map((v,i)=>v-o[i]);return !box.some(b=>{const min=[b[0],b[4],b[2]],max=[b[1],b[5],b[3]];let enter=0,exit=1;for(let i=0;i<3;i++){if(Math.abs(d[i])<1e-8){if(o[i]<min[i]||o[i]>max[i])return false;}else{const a=(min[i]-o[i])/d[i],v=(max[i]-o[i])/d[i];enter=Math.max(enter,Math.min(a,v));exit=Math.min(exit,Math.max(a,v));if(enter>exit)return false;}}return true;});}
const goals=[[3,7],[-4,-2.5],[7,-4.8],[0,19]];const timeline=[],replay=[];let goal=0,path=pathTo(0,19,...goals[0]),lastMask=0,minHealth=100,shots=0;
for(let frame=0;frame<18000&&c.get(11)===0;frame++){
 const s=c.state();minHealth=Math.min(minHealth,s.health);while(path.length&&Math.hypot(path[0][0]-s.x,path[0][1]-s.z)<.04)path.shift();
 let target=null,nearest=60;for(let i=0;i<8;i++){if(c.enemy(i,4)===0||c.enemy(i,4)===4)continue;const p=[c.enemy(i,0),c.enemy(i,6)+1.65,c.enemy(i,1)];const d=Math.hypot(p[0]-s.x,p[2]-s.z);if(d<nearest&&sight(s,p)){nearest=d;target=p;}}
 let yaw=s.yaw,pitch=0,mask=0,side=0,forward=0;
 if(target){yaw=Math.atan2(-(target[0]-s.x),-(target[2]-s.z));pitch=Math.atan2(target[1]-s.y,Math.hypot(target[0]-s.x,target[2]-s.z));mask|=B.AIM;if(s.weapon||frame%12===0)mask|=B.FIRE;}
 const close=Math.hypot(goals[goal][0]-s.x,goals[goal][1]-s.z)<.6;
 if(close){if(goal<3){const p=config.objectives[goal];yaw=Math.atan2(-(p.x-s.x),-(p.z-s.z));pitch=Math.atan2(p.y-s.y,Math.hypot(p.x-s.x,p.z-s.z));}mask&=~B.FIRE;if(frame%2===0)mask|=B.INTERACT;}
 else if(path.length){const dx=path[0][0]-s.x,dz=path[0][1]-s.z,d=Math.hypot(dx,dz);if(!target)yaw=Math.atan2(-dx,-dz);side=(Math.cos(yaw)*dx-Math.sin(yaw)*dz)/d;forward=(-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/d;}
 if(s.ammo===0&&frame%2===0)mask|=B.RELOAD;if(s.health<55&&s.medkits>0&&frame%2===0)mask|=B.HEAL;
 replay.push([side,forward,yaw,pitch,mask]);c.input(side,forward,yaw,pitch,mask);c.tick(1/60);for(const e of c.events())if(e[0]===1)shots++;
 if(c.get(12)!==lastMask){lastMask=c.get(12);timeline.push({seconds:+c.get(16).toFixed(2),mask:lastMask,health:c.get(5),kills:c.get(13)});goal++;path=pathTo(c.get(0),c.get(2),...goals[goal]);}
}
const report={scope:'Automated playthrough of the shared C/WASM simulation using ordinary movement, aiming, fire, reload, healing and interaction inputs. No teleport, god mode, enemy deletion or direct objective mutation.',passed:c.get(11)===3,difficulty:'Standard',result:c.state(),minimumHealth:minHealth,shots,timeline};
await fs.writeFile('docs/evidence/combat-slice/simulation-playthrough.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));assert(report.passed,'The bot must complete the operation through actual game rules');

const recorded=Buffer.alloc(4+replay.length*20);recorded.writeUInt32LE(replay.length);replay.forEach((v,i)=>{for(let f=0;f<4;f++)recorded.writeFloatLE(v[f],4+i*20+f*4);recorded.writeUInt32LE(v[4],4+i*20+16);});await fs.writeFile("docs/evidence/combat-slice/playthrough-inputs.bin",recorded);
