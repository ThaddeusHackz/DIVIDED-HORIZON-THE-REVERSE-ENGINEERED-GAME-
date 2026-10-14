// The exact same C simulation is linked into the Windows raylib executable.
export const BUTTON={FIRE:1,SPRINT:2,CROUCH:4,RELOAD:8,INTERACT:16,AIM:32,HEAL:64,JUMP:128,PISTOL:256,RIFLE:512};
export async function createCore(bytes){
 let api;
 const result=await WebAssembly.instantiate(bytes,{wasi_snapshot_preview1:{random_get:(ptr,len)=>{
  if(!api)return 1;
  const view=new Uint8Array(api.memory.buffer,ptr,len);
  // Only libc startup uses this; gameplay randomness is deterministic in the C core.
  for(let offset=0;offset<view.length;offset+=65536)crypto.getRandomValues(view.subarray(offset,Math.min(offset+65536,view.length)));
  return 0;
 }}});
 api=result.instance.exports;api._initialize();api.dh_new(1);
 return {
  api, get:i=>api.dh_get(i),enemy:(i,f)=>api.dh_enemy(i,f),
  input:(x,z,yaw,pitch,buttons)=>api.dh_input(x,z,yaw,pitch,buttons),tick:dt=>api.dh_tick(dt),
  events(){const items=[];for(let i=0;i<api.dh_events();i++)items.push(Array.from({length:8},(_,f)=>api.dh_event(i,f)));api.dh_clear_events();return items;},
  save(){const size=api.dh_save();return new Uint8Array(api.memory.buffer,api.dh_save_pointer(),size).slice();},
  load(data){const size=api.dh_save();if(data.length!==size)return false;new Uint8Array(api.memory.buffer,api.dh_save_pointer(),size).set(data);return Boolean(api.dh_load(size));},
  state(){return {x:api.dh_get(0),y:api.dh_get(1),z:api.dh_get(2),yaw:api.dh_get(3),pitch:api.dh_get(4),health:api.dh_get(5),stamina:api.dh_get(6),ammo:api.dh_get(7),reserve:api.dh_get(8),reload:api.dh_get(9),weapon:api.dh_get(10),phase:api.dh_get(11),mask:api.dh_get(12),kills:api.dh_get(13),alert:api.dh_get(14),prompt:api.dh_get(15),time:api.dh_get(16),message:api.dh_get(17),medkits:api.dh_get(18),alive:api.dh_get(19),difficulty:api.dh_get(20),hit:api.dh_get(21),checkpoint:api.dh_get(22)};}
 };
}
