#include "core.h"
#include "../generated/data.h"
#include <math.h>
#include <string.h>
#include <stddef.h>

#define PI 3.14159265358979323846f
#define GRID 61
#define CELLS (GRID*GRID)
#define MAX_EVENTS 48
#define SAVE_VERSION 2u

typedef struct {float x,z,yaw,hp,detect,wait,lost,lkx,lkz,walk,navtime,nx,nz;int state,patrol,first_shot;} Enemy;
typedef struct {
 float x,z,yaw,pitch,feet,vy,eye,hp,stamina,regen_delay,cooldown,reload,time,alert_time,reinforce_time,hurt_time,hit_marker,squad_delay;
 int phase,mask,kills,weapon,ammo[2],reserve[2],medkits,difficulty,message,save_serial,reinforcements,exhausted;
 uint32_t random;
 Enemy enemies[DH_ENEMIES];
} Game;
typedef struct {float type,x,y,z,tx,ty,tz,value;} Event;
typedef struct {uint32_t magic,version,size,checksum;Game game;} Save;
static Game g,checkpoint;
static Save save_buffer;
static Event events[MAX_EVENTS];static int event_count;
static float input_side,input_forward,input_yaw,input_pitch;static int input_buttons,last_buttons;
static unsigned char nav[CELLS];static int16_t distances[CELLS],queue[CELLS];
static float minf(float a,float b){return a<b?a:b;}static float maxf(float a,float b){return a>b?a:b;}static float clampf(float v,float a,float b){return minf(b,maxf(a,v));}
static float length2(float x,float z){return sqrtf(x*x+z*z);}
static float angle(float a){while(a>PI)a-=2*PI;while(a< -PI)a+=2*PI;return a;}
static float rng(void){uint32_t x=g.random;x^=x<<13;x^=x>>17;x^=x<<5;g.random=x;return (x&0xffffff)/16777216.f;}
static float ground(float x,float z){if(fabsf(x)<1.3f&&z>=10)return .428f;if(x> -6.2f&&x< -1.8f&&z> -4.8f&&z< -1.18f)return .685f;if(x> -4.65f&&x< -3.35f&&z>= -1.18f&&z< -.5f)return .36f;return 0;}
static int walkable(float x,float z){return (x*x+z*z<900&&z<=10)||(fabsf(x)<1.12f&&z>=9.5f&&z<21.9f);}
static int can_move(float x,float z,float radius){if(!walkable(x,z))return 0;for(int i=0;i<DH_BOX_COUNT;i++){const float*b=DH_BOXES[i];if(x>b[0]-radius&&x<b[1]+radius&&z>b[2]-radius&&z<b[3]+radius)return 0;}return 1;}
/* Ray slab intersection, in metres. Returns range+1 for a miss. */
static float ray_box(float ox,float oy,float oz,float dx,float dy,float dz,const float*b,float range){float near=0,far=range;float origins[3]={ox,oy,oz},dirs[3]={dx,dy,dz},mins[3]={b[0],b[4],b[2]},maxs[3]={b[1],b[5],b[3]};for(int k=0;k<3;k++){if(fabsf(dirs[k])<.000001f){if(origins[k]<mins[k]||origins[k]>maxs[k])return range+1;}else{float a=(mins[k]-origins[k])/dirs[k],c=(maxs[k]-origins[k])/dirs[k];if(a>c){float t=a;a=c;c=t;}near=maxf(near,a);far=minf(far,c);if(near>far)return range+1;}}return near;}
static float wall_distance(float x,float y,float z,float dx,float dy,float dz,float range){float best=range;for(int i=0;i<DH_BOX_COUNT;i++)best=minf(best,ray_box(x,y,z,dx,dy,dz,DH_BOXES[i],range));return best;}
static int visible(float x,float y,float z,float tx,float ty,float tz){float dx=tx-x,dy=ty-y,dz=tz-z,d=sqrtf(dx*dx+dy*dy+dz*dz);if(d<.02f)return 1;return wall_distance(x,y,z,dx/d,dy/d,dz/d,d+.1f)>=d-.04f;}
static void emit(float type,float x,float y,float z,float tx,float ty,float tz,float value){if(event_count<MAX_EVENTS)events[event_count++]=(Event){type,x,y,z,tx,ty,tz,value};}
static int alive_count(void){int n=0;for(int i=0;i<DH_ENEMIES;i++)if(g.enemies[i].state>0&&g.enemies[i].state<4)n++;return n;}
static int prompt(void){if(g.phase)return -1;const float eye=g.feet+g.eye;for(int i=0;i<3;i++){if(g.mask&(1<<i))continue;const float*t=DH_OBJECTIVES[i];float dx=t[0]-g.x,dy=t[1]-eye,dz=t[2]-g.z;float d=sqrtf(dx*dx+dy*dy+dz*dz);if(d<3&&(-sinf(g.yaw)*dx+sinf(g.pitch)*dy-cosf(g.yaw)*dz)>0&&visible(g.x,eye,g.z,t[0],t[1],t[2]))return i;}if(g.mask==7&&length2(g.x,g.z-19)<2.1f)return 3;return -1;}
static void remember(void){g.save_serial++;checkpoint=g;}
static void alert_at(float x,float z,float radius){for(int i=0;i<DH_ENEMIES;i++){Enemy*e=&g.enemies[i];if(e->state>0&&e->state<4&&length2(e->x-x,e->z-z)<radius){e->lkx=x;e->lkz=z;if(e->state<2)e->state=2;e->lost=7;}}if(g.alert_time<=0)g.alert_time=.001f;}
static void setup_enemy(int i,float x,float z){Enemy*e=&g.enemies[i];memset(e,0,sizeof(*e));e->x=x;e->z=z;e->hp=100;e->state=1;e->wait=.7f+i*.15f;e->first_shot=1;e->yaw=0;e->lkx=x;e->lkz=z;}
void dh_new(int difficulty){memset(&g,0,sizeof(g));g.x=0;g.z=19;g.feet=.428f;g.eye=1.7f;g.hp=100;g.stamina=100;g.ammo[0]=12;g.ammo[1]=30;g.reserve[0]=60;g.reserve[1]=90;g.medkits=2;g.random=0x5a17c3d9;g.difficulty=difficulty?1:0;for(int i=0;i<6;i++){setup_enemy(i,DH_PATROLS[i][0],DH_PATROLS[i][1]);g.enemies[i].yaw=atan2f(-(DH_PATROLS[i][2]-g.enemies[i].x),-(DH_PATROLS[i][3]-g.enemies[i].z));}for(int z=0;z<GRID;z++)for(int x=0;x<GRID;x++)nav[z*GRID+x]=(unsigned char)can_move(x-30,z-30,.30f);input_side=input_forward=0;input_buttons=last_buttons=0;input_yaw=input_pitch=0;event_count=0;checkpoint=g;}
void dh_input(float side,float forward,float yaw,float pitch,int buttons){input_side=isfinite(side)?clampf(side,-1,1):0;input_forward=isfinite(forward)?clampf(forward,-1,1):0;input_yaw=isfinite(yaw)?angle(clampf(yaw,-1000,1000)):g.yaw;input_pitch=isfinite(pitch)?clampf(pitch,-1.35f,1.35f):g.pitch;input_buttons=buttons&1023;}
void dh_pause(void){if(g.phase==0)g.phase=1;else if(g.phase==1)g.phase=0;input_side=input_forward=0;input_buttons=last_buttons=0;}
void dh_retry(void){g=checkpoint;g.phase=0;g.hp=100;g.stamina=100;g.cooldown=g.reload=0;g.hit_marker=0;g.vy=0;g.feet=ground(g.x,g.z);input_side=input_forward=0;input_yaw=g.yaw;input_pitch=g.pitch;input_buttons=last_buttons=0;event_count=0;}
static void reload_weapon(void){const int cap=g.weapon?30:12;if(g.reload<=0&&g.ammo[g.weapon]<cap&&g.reserve[g.weapon]>0){g.reload=g.weapon?2.2f:1.4f;emit(7,g.x,g.feet+g.eye,g.z,0,0,0,0);}}
static void fire(void){if(g.cooldown>0||g.reload>0)return;if(g.ammo[g.weapon]<=0){reload_weapon();return;}g.ammo[g.weapon]--;g.cooldown=60.f/(g.weapon?600.f:350.f);float sx=g.x,sy=g.feet+g.eye,sz=g.z;float spread=(input_buttons&DH_AIM)?.0015f:.006f;float yaw=g.yaw+(rng()-.5f)*spread,pitch=g.pitch+(rng()-.5f)*spread;float dx=-sinf(yaw)*cosf(pitch),dy=sinf(pitch),dz=-cosf(yaw)*cosf(pitch);float best=wall_distance(sx,sy,sz,dx,dy,dz,65);int target=-1,head=0;for(int i=0;i<DH_ENEMIES;i++){Enemy*e=&g.enemies[i];if(e->state==0||e->state==4)continue;float floor=ground(e->x,e->z);float body[6]={e->x-.29f,e->x+.29f,e->z-.24f,e->z+.24f,floor+.18f,floor+1.48f};float hit=ray_box(sx,sy,sz,dx,dy,dz,body,65);if(hit<best){best=hit;target=i;head=0;}float skull[6]={e->x-.17f,e->x+.17f,e->z-.16f,e->z+.16f,floor+1.48f,floor+1.83f};hit=ray_box(sx,sy,sz,dx,dy,dz,skull,65);if(hit<best){best=hit;target=i;head=1;}}
 emit(1,sx,sy,sz,sx+dx*best,sy+dy*best,sz+dz*best,(float)g.weapon);
 if(target>=0){Enemy*e=&g.enemies[target];float damage=(g.weapon?28.f:24.f)*(head?2.5f:1);if(!g.weapon&&best>25)damage*=.7f;e->hp=maxf(0,e->hp-damage);e->state=3;e->detect=1;e->lkx=g.x;e->lkz=g.z;e->lost=8;e->wait=maxf(e->wait,.35f);g.hit_marker=.16f;emit(2,sx+dx*best,sy+dy*best,sz+dz*best,0,0,0,head?2:1);if(e->hp<=0){e->state=4;g.kills++;g.reserve[g.weapon]+=g.weapon?10:6;}}
 else if(best<65)emit(2,sx+dx*best,sy+dy*best,sz+dz*best,0,0,0,0);
 alert_at(g.x,g.z,28);g.pitch=minf(1.35f,g.pitch+(g.weapon?.015f:.010f));input_pitch=g.pitch;
}
static int grid_index(float x,float z){int ix=(int)floorf(x+30.5f),iz=(int)floorf(z+30.5f);return ix>=0&&ix<GRID&&iz>=0&&iz<GRID?iz*GRID+ix:-1;}
static void route(Enemy*e,float tx,float tz){int target=grid_index(tx,tz),start=grid_index(e->x,e->z);if(start<0){e->nx=tx;e->nz=tz;return;}if(target<0||!nav[target]){float best=1e9f;int found=-1;for(int z=0;z<GRID;z++)for(int x=0;x<GRID;x++){int id=z*GRID+x;if(nav[id]){float d=(x-30-tx)*(x-30-tx)+(z-30-tz)*(z-30-tz);if(d<best){best=d;found=id;}}}target=found;}if(target<0){e->nx=e->x;e->nz=e->z;return;}for(int i=0;i<CELLS;i++)distances[i]=-1;int first=0,last=0;queue[last++]=(int16_t)target;distances[target]=0;while(first<last){int at=queue[first++];if(at==start)break;int adjacent[4]={at-1,at+1,at-GRID,at+GRID};for(int k=0;k<4;k++){int n=adjacent[k];if(n<0||n>=CELLS||!nav[n]||distances[n]>=0||(k<2&&n/GRID!=at/GRID))continue;distances[n]=(int16_t)(distances[at]+1);queue[last++]=(int16_t)n;}}int best=start;int adjacent[4]={start-1,start+1,start-GRID,start+GRID};for(int k=0;k<4;k++){int n=adjacent[k];if(n>=0&&n<CELLS&&distances[n]>=0&&(k>=2||n/GRID==start/GRID)&&(distances[best]<0||distances[n]<distances[best]))best=n;}e->nx=best%GRID-30;e->nz=best/GRID-30;if(best==start&&length2(tx-e->x,tz-e->z)<1.5f){e->nx=tx;e->nz=tz;}}
static void move_enemy(Enemy*e,float tx,float tz,float speed,float dt){e->navtime-=dt;if(e->navtime<=0){route(e,tx,tz);e->navtime=.5f;}float dx=e->nx-e->x,dz=e->nz-e->z,d=length2(dx,dz);if(d<.07f)return;float step=minf(d,speed*dt);float nx=e->x+dx/d*step,nz=e->z+dz/d*step;if(can_move(nx,e->z,.27f))e->x=nx;if(can_move(e->x,nz,.27f))e->z=nz;e->yaw=angle(e->yaw+angle(atan2f(-dx,-dz)-e->yaw)*minf(1,dt*7));e->walk+=step;}
static void update_enemy(int i,float dt){Enemy*e=&g.enemies[i];if(!e->state||e->state==4)return;float d=length2(g.x-e->x,g.z-e->z),ey=ground(e->x,e->z)+1.55f;float target_y=g.feet+((input_buttons&DH_CROUCH)?.68f:1.12f);int sight=d<22&&visible(e->x,ey,e->z,g.x,target_y,g.z);float facing=d>.01f?(-sinf(e->yaw)*(g.x-e->x)-cosf(e->yaw)*(g.z-e->z))/d:1;
 int sees=sight&&(e->state==3||d<4||facing>.55f);
 if(sees){e->detect=clampf(e->detect+dt*(d<5?2.1f:.9f)*((input_buttons&DH_CROUCH)?.48f:1),0,1);e->lkx=g.x;e->lkz=g.z;if(e->detect>=1&&e->state!=3){e->state=3;e->wait=.65f;e->first_shot=1;alert_at(g.x,g.z,9);}e->lost=7;}
 else{e->detect=maxf(0,e->detect-dt*.24f);e->lost=maxf(0,e->lost-dt);}
 e->wait=maxf(0,e->wait-dt);
 if(e->state==3){if(!sees&&e->lost<=0){e->state=2;e->lost=5;}
  if(sees&&d<19){e->yaw=angle(e->yaw+angle(atan2f(-(g.x-e->x),-(g.z-e->z))-e->yaw)*minf(1,dt*7));if(e->wait<=0&&g.squad_delay<=0){int hit=!e->first_shot&&rng()<(g.difficulty?.62f:.40f);float amount=hit?(g.difficulty?8.f:4.f):0;e->first_shot=0;e->wait=.95f+(i%3)*.12f;g.squad_delay=.26f;emit(3,e->x,ey,e->z,g.x+(hit?0:.8f),target_y,g.z,amount);if(hit){g.hp=maxf(0,g.hp-amount);g.hurt_time=0;emit(8,g.x,g.feet+g.eye,g.z,0,0,0,amount);}}if(i%2&&d>5&&e->wait>.65f)move_enemy(e,g.x+(i%3-1)*3,g.z-2,1.1f,dt);}
  else move_enemy(e,e->lkx,e->lkz,2.2f,dt);
 }else if(e->state==2){if(length2(e->lkx-e->x,e->lkz-e->z)>.8f)move_enemy(e,e->lkx,e->lkz,1.9f,dt);else e->yaw=angle(e->yaw+dt*.7f);if(e->lost<=0){e->state=1;e->detect=0;}}
 else{int p=i%6;float tx=DH_PATROLS[p][e->patrol?0:2],tz=DH_PATROLS[p][e->patrol?1:3];if(length2(tx-e->x,tz-e->z)<.7f){e->patrol=!e->patrol;e->wait=1.2f;}if(e->wait<=0)move_enemy(e,tx,tz,1.2f,dt);}
}
void dh_tick(float dt){if(g.phase||!isfinite(dt)||dt<=0)return;dt=minf(dt,.05f);int pressed=input_buttons&~last_buttons;last_buttons=input_buttons;g.time+=dt;g.hurt_time+=dt;g.yaw=input_yaw;g.pitch=input_pitch;g.cooldown=maxf(0,g.cooldown-dt);g.squad_delay=maxf(0,g.squad_delay-dt);g.hit_marker=maxf(0,g.hit_marker-dt);
 if(g.reload>0){g.reload=maxf(0,g.reload-dt);if(g.reload==0){int need=(g.weapon?30:12)-g.ammo[g.weapon];int taken=need<g.reserve[g.weapon]?need:g.reserve[g.weapon];g.ammo[g.weapon]+=taken;g.reserve[g.weapon]-=taken;}}
 if((pressed&DH_PISTOL)&&!g.reload)g.weapon=0;
 if((pressed&DH_RIFLE)&&!g.reload){if(g.mask&1)g.weapon=1;else g.message=5;}
 float side=input_side,forward=input_forward,n=length2(side,forward);if(n>1){side/=n;forward/=n;}
 int crouch=(input_buttons&DH_CROUCH)!=0,sprint=(input_buttons&DH_SPRINT)&&!crouch&&n>.1f&&!g.exhausted&&!(input_buttons&DH_AIM);
 if(sprint){g.stamina=maxf(0,g.stamina-dt*(100.f/9.f));g.regen_delay=1.8f;if(g.stamina==0)g.exhausted=1;}else{g.regen_delay=maxf(0,g.regen_delay-dt);if(g.regen_delay==0)g.stamina=minf(100,g.stamina+14*dt);if(g.stamina>=20)g.exhausted=0;}
 float speed=crouch?1.3f:(sprint?6.2f:3.4f);if(input_buttons&DH_AIM)speed*=.65f;
 float dx=(-sinf(g.yaw)*forward+cosf(g.yaw)*side)*speed*dt,dz=(-cosf(g.yaw)*forward-sinf(g.yaw)*side)*speed*dt;
 if(can_move(g.x+dx,g.z,.24f)){g.x+=dx;}
 if(can_move(g.x,g.z+dz,.24f)){g.z+=dz;}
 float floor=ground(g.x,g.z);if((pressed&DH_JUMP)&&g.feet<=floor+.015f&&!crouch)g.vy=4.8f;
 g.vy-=9.8f*dt;g.feet+=g.vy*dt;if(g.feet<floor){g.feet=floor;g.vy=0;}g.eye+=( (crouch?1.05f:1.7f)-g.eye)*minf(1,dt*12);
 if(pressed&DH_RELOAD)reload_weapon();
 if((input_buttons&DH_FIRE)&&(g.weapon|| (pressed&DH_FIRE)))fire();
 if((pressed&DH_HEAL)&&g.medkits>0&&g.hp<100){g.hp=minf(100,g.hp+45);g.medkits--;g.message=6;emit(6,g.x,g.feet+g.eye,g.z,0,0,0,45);}
 if(!g.difficulty&&g.hurt_time>8&&g.hp<60)g.hp=minf(60,g.hp+dt*3);
 if(g.alert_time>0){g.alert_time+=dt;if(!(g.mask&4)&&g.alert_time>12&&g.reinforcements<2){g.reinforce_time+=dt;if(g.reinforce_time>8||g.reinforcements==0){int i=6+g.reinforcements;setup_enemy(i,i==6?-4:4,-26);g.enemies[i].state=2;g.enemies[i].lkx=g.x;g.enemies[i].lkz=g.z;g.enemies[i].lost=20;g.reinforcements++;g.reinforce_time=0;g.message=7;}}}
 for(int i=0;i<DH_ENEMIES;i++)update_enemy(i,dt);
 if(g.hp<=0){g.phase=2;return;}
 if(pressed&DH_INTERACT){int p=prompt();if(p>=0&&p<3){g.mask|=1<<p;g.message=p+1;if(p==0){g.weapon=1;g.reload=0;}if(p==1)g.medkits++;emit(4,g.x,g.feet+g.eye,g.z,0,0,0,(float)p);remember();}else if(p==3){g.phase=3;g.message=4;emit(5,g.x,g.feet+g.eye,g.z,0,0,0,0);remember();}}
}
float dh_get(int field){switch(field){case 0:return g.x;case 1:return g.feet+g.eye;case 2:return g.z;case 3:return g.yaw;case 4:return g.pitch;case 5:return g.hp;case 6:return g.stamina;case 7:return (float)g.ammo[g.weapon];case 8:return (float)g.reserve[g.weapon];case 9:return g.reload;case 10:return (float)g.weapon;case 11:return (float)g.phase;case 12:return (float)g.mask;case 13:return (float)g.kills;case 14:return g.alert_time;case 15:return (float)prompt();case 16:return g.time;case 17:return (float)g.message;case 18:return (float)g.medkits;case 19:return (float)alive_count();case 20:return (float)g.difficulty;case 21:return g.hit_marker;case 22:return (float)g.save_serial;default:return 0;}}
float dh_enemy(int i,int field){if(i<0||i>=DH_ENEMIES)return 0;Enemy*e=&g.enemies[i];switch(field){case 0:return e->x;case 1:return e->z;case 2:return e->yaw;case 3:return e->hp;case 4:return (float)e->state;case 5:return e->detect;case 6:return ground(e->x,e->z);case 7:return e->walk;default:return 0;}}
int dh_events(void){return event_count;}float dh_event(int i,int f){if(i<0||i>=event_count||f<0||f>7)return 0;const Event*e=&events[i];switch(f){case 0:return e->type;case 1:return e->x;case 2:return e->y;case 3:return e->z;case 4:return e->tx;case 5:return e->ty;case 6:return e->tz;default:return e->value;}}void dh_clear_events(void){event_count=0;}
static uint32_t checksum(const void*data,size_t size){const unsigned char*p=data;uint32_t h=2166136261u;for(size_t i=0;i<size;i++){h^=p[i];h*=16777619u;}return h;}
int dh_save(void){memset(&save_buffer,0,sizeof(save_buffer));save_buffer.magic=0x32485344;save_buffer.version=SAVE_VERSION;save_buffer.size=sizeof(Game);save_buffer.game=checkpoint;save_buffer.checksum=checksum(&save_buffer.game,sizeof(Game));return (int)sizeof(save_buffer);}
uintptr_t dh_save_pointer(void){return (uintptr_t)&save_buffer;}
int dh_load(int size){if(size!=(int)sizeof(Save)||save_buffer.magic!=0x32485344||save_buffer.version!=SAVE_VERSION||save_buffer.size!=sizeof(Game)||checksum(&save_buffer.game,sizeof(Game))!=save_buffer.checksum)return 0;Game*t=&save_buffer.game;
 if(!isfinite(t->x)||!isfinite(t->z)||!can_move(t->x,t->z,.20f)||!isfinite(t->yaw)||fabsf(t->yaw)>PI+.01f||!isfinite(t->pitch)||fabsf(t->pitch)>1.36f||!isfinite(t->hp)||t->hp<0||t->hp>100||!isfinite(t->stamina)||t->stamina<0||t->stamina>100||!isfinite(t->time)||t->time<0||t->time>604800||t->mask<0||t->mask>7||t->weapon<0||t->weapon>1||t->phase<0||t->phase>3||t->difficulty<0||t->difficulty>1||t->medkits<0||t->medkits>20||!t->random)return 0;
 if((t->phase==3&&t->mask!=7)||t->kills<0||t->kills>8||t->reinforcements<0||t->reinforcements>2||t->save_serial<0||t->save_serial>4)return 0;
 const float scalar[]={t->feet,t->vy,t->eye,t->regen_delay,t->cooldown,t->reload,t->alert_time,t->reinforce_time,t->hurt_time,t->hit_marker,t->squad_delay};for(unsigned i=0;i<sizeof(scalar)/sizeof(scalar[0]);i++)if(!isfinite(scalar[i])||fabsf(scalar[i])>100000)return 0;
 for(int i=0;i<2;i++)if(t->ammo[i]<0||t->ammo[i]>(i?30:12)||t->reserve[i]<0||t->reserve[i]>1000)return 0;
 for(int i=0;i<DH_ENEMIES;i++){Enemy*e=&t->enemies[i];const float values[]={e->x,e->z,e->yaw,e->hp,e->detect,e->wait,e->lost,e->lkx,e->lkz,e->walk,e->navtime,e->nx,e->nz};for(unsigned j=0;j<sizeof(values)/sizeof(values[0]);j++)if(!isfinite(values[j])||fabsf(values[j])>100000)return 0;if(e->state<0||e->state>4||e->hp<0||e->hp>100||fabsf(e->x)>31||fabsf(e->z)>31||e->detect<0||e->detect>1)return 0;}
 int difficulty=t->difficulty;Game restored=*t;dh_new(difficulty);g=restored;g.phase=g.phase==3?3:0;checkpoint=g;input_yaw=g.yaw;input_pitch=g.pitch;return 1;}
void dh_debug_position(float x,float z){if(isfinite(x)&&isfinite(z)&&can_move(x,z,.20f)){g.x=x;g.z=z;g.feet=ground(x,z);g.vy=0;}}
void dh_debug_enemy(int i,float x,float z,float yaw){if(i>=0&&i<DH_ENEMIES&&isfinite(x)&&isfinite(z)&&can_move(x,z,.20f)){setup_enemy(i,x,z);g.enemies[i].yaw=angle(clampf(yaw,-1000,1000));}}
void dh_debug_health(float health){if(isfinite(health))g.hp=clampf(health,0,100);}
