#ifndef DH_CORE_H
#define DH_CORE_H
#include <stdint.h>
#define DH_ENEMIES 8
#define DH_FIRE 1
#define DH_SPRINT 2
#define DH_CROUCH 4
#define DH_RELOAD 8
#define DH_INTERACT 16
#define DH_AIM 32
#define DH_HEAL 64
#define DH_JUMP 128
#define DH_PISTOL 256
#define DH_RIFLE 512
/* get(): X, eyeY, Z, yaw, pitch, health, stamina, ammo, reserve, reload,
 weapon, phase(0 play/1 pause/2 dead/3 win), objective mask, kills, alert,
 prompt(-1/0 manifest/1 ledger/2 signal/3 extract), seconds, message,
 medkits, live guards, difficulty(0 story/1 standard), hit marker, checkpoint serial. */
void dh_new(int difficulty);
void dh_input(float side,float forward,float yaw,float pitch,int buttons);
void dh_tick(float dt);
void dh_pause(void);
void dh_retry(void);
float dh_get(int field);
float dh_enemy(int enemy,int field); /* x,z,yaw,health,state,detection,ground,step */
int dh_events(void);
float dh_event(int event,int field); /* type,x,y,z,tx,ty,tz,value; 1 fire,2 impact,3 guardfire,4 objective,5 win,6 heal,7 reload,8 hurt */
void dh_clear_events(void);
int dh_save(void);
uintptr_t dh_save_pointer(void);
int dh_load(int size);
void dh_debug_position(float x,float z);
void dh_debug_enemy(int i,float x,float z,float yaw);
void dh_debug_health(float health);
#endif
