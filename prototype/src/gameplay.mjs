export const tasks = [
 { id:'manifest', label:'Recover the cargo manifest', x:3, z:5, radius:2.6, message:'Machine parts. Three boats. No arrival dates. Someone has been rewriting the manifest.' },
 { id:'ledger', label:'Read the inspector’s ledger', x:-4, z:-3.7, radius:2.4, message:'Six weeks without wages. A list of medicine, and a name scratched out. Keep this page.' },
 { id:'signal', label:'Restore the harbor signal', x:7, z:-7, radius:2.6, message:'The coast is listening again. Get the evidence back to the jetty.' }
];
export function walkable(x,z){return (Math.hypot(x,z)<18&&z<=10)||(Math.abs(x)<1.12&&z>=9.5&&z<21.9);}
export function canMove(x,z,colliders,radius=.25){
 return walkable(x,z)&&!colliders.some(([minX,maxX,minZ,maxZ])=>x>minX-radius&&x<maxX+radius&&z>minZ-radius&&z<maxZ+radius);
}
export function surfaceHeight(x,z){
 if(Math.abs(x)<1.3&&z>=10)return .428;
 if(x>-6.2&&x<-1.8&&z>-4.8&&z<-1.18)return .685;
 if(x>-4.65&&x<-3.35&&z>=-1.18&&z<-.5)return .36;
 return 0;
}
export function clearSight(x,z,targetX,targetZ,colliders){
 return !colliders.some(([minX,maxX,minZ,maxZ])=>{
  // Ignore the target's own prop collider, but not intervening walls.
  if(targetX>=minX&&targetX<=maxX&&targetZ>=minZ&&targetZ<=maxZ)return false;
  let enter=0,exit=1;
  for(const [start,delta,min,max] of [[x,targetX-x,minX,maxX],[z,targetZ-z,minZ,maxZ]]){
   if(Math.abs(delta)<1e-8){if(start<min||start>max)return false;}
   else {const a=(min-start)/delta,b=(max-start)/delta;enter=Math.max(enter,Math.min(a,b));exit=Math.min(exit,Math.max(a,b));if(enter>exit)return false;}
  }
  return enter<=exit;
 });
}
export function interactionAt(x,z,done,colliders=[]){
 for(const task of tasks)if(!done.has(task.id)&&Math.hypot(task.x-x,task.z-z)<task.radius&&clearSight(x,z,task.x,task.z,colliders))return task;
 if(done.size===tasks.length&&Math.hypot(x,z-19)<2)return {id:'extract',label:'Secure the evidence · complete assignment'};
 return null;
}
