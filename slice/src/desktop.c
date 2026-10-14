#include "raylib.h"
#include "raymath.h"
#include "rlgl.h"
#include "core.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifndef DH_SLICE_VERSION
#define DH_SLICE_VERSION "development"
#endif

#define W 1280
#define H 800
#define PI_F 3.14159265358979323846f
static const Color CREAM={238,233,209,255},DH_GOLD={213,190,129,255},INK={27,52,41,245},JADE={70,101,78,255};
static Model world,sentry,pistol,rifle;
static Sound sfx[6];static int audio_ready=0,sound_on=1;
static Camera3D camera;
static char save_path[1024];
static int front=1,started=0,difficulty=1,last_message=0,save_serial=0;
static float yaw=0,pitch=0,accumulator=0,recoil=0,hurt=0,message_time=0,mouse_grace=0;
static char message[512];
typedef struct {Vector3 from,to;float ttl;int type;} Tracer;
static Tracer tracers[64];
static const char*labels[3]={"Recover the cargo manifest","Read the inspector's ledger","Disable the harbor signal"};
static const char*messages[8]={"","Manifest recovered. Libertad unlocked: press 2. Find the ledger inside the hut.","Ledger secured. Field kit recovered. The next step is the signal mast.","Signal disabled. No further backup. Return to the south jetty with the records.","Evidence secured. This completes the current combat slice.","Recover the cargo manifest to unlock the Libertad rifle.","Field treatment applied.","Backup is approaching from the north. Disable the mast's signal."};
static const char*vs="#version 330\nin vec3 vertexPosition;in vec3 vertexNormal;in vec4 vertexColor;uniform mat4 mvp;uniform mat4 matModel;out vec3 pos;out vec3 normal;out vec4 tint;void main(){pos=(matModel*vec4(vertexPosition,1)).xyz;normal=normalize(mat3(matModel)*vertexNormal);tint=vertexColor;gl_Position=mvp*vec4(vertexPosition,1);}";
static const char*fs="#version 330\nin vec3 pos;in vec3 normal;in vec4 tint;uniform vec4 colDiffuse;uniform vec3 eye;out vec4 finalColor;void main(){float diffuse=max(dot(normalize(normal),normalize(vec3(-.5,1.,.4))),0.);vec3 color=colDiffuse.rgb*tint.rgb*(.43+.8*diffuse);color=pow(max(color,vec3(0)),vec3(.4545));float fog=smoothstep(65.,180.,distance(eye,pos));finalColor=vec4(mix(color,vec3(.70,.76,.68),fog),1.);}";
static void notify(const char*text){snprintf(message,sizeof(message),"%s",text);message_time=6;}
static void play_sound(int id,float volume){if(audio_ready&&sound_on){SetSoundVolume(sfx[id],volume);PlaySound(sfx[id]);}}
static void paths(void){const char*home=getenv("APPDATA");if(home&&strlen(home)<850){char dir[1000];snprintf(dir,sizeof(dir),"%s/DividedHorizonSlice",home);MakeDirectory(dir);snprintf(save_path,sizeof(save_path),"%s/checkpoint-v2.sav",dir);}else snprintf(save_path,sizeof(save_path),"checkpoint-v2.sav");}
static int load_progress(void){if(!FileExists(save_path))return 0;int count=0;unsigned char*bytes=LoadFileData(save_path,&count);int size=dh_save(),ok=0;if(bytes&&count==size){memcpy((void*)dh_save_pointer(),bytes,(size_t)size);ok=dh_load(size);}if(bytes)UnloadFileData(bytes);return ok;}
static void save_progress(void){int size=dh_save();if(!SaveFileData(save_path,(void*)dh_save_pointer(),size))notify("Checkpoint could not be written. In-session retry remains available.");}
static void begin(int resume){if(resume){if(!load_progress()){notify("Checkpoint is incompatible or corrupt. Start a new operation.");return;}}else dh_new(difficulty);front=0;started=1;yaw=dh_get(3);pitch=dh_get(4);last_message=0;save_serial=(int)dh_get(22);DisableCursor();mouse_grace=.25f;notify("Insertion complete. Recover the cargo manifest beside the crates.");}
static void retry(void){dh_retry();yaw=dh_get(3);pitch=dh_get(4);last_message=0;save_serial=(int)dh_get(22);DisableCursor();mouse_grace=.25f;notify("Checkpoint restored. Reassess your approach.");}
static int button(Rectangle r,const char*text,int primary,int enabled){int hover=CheckCollisionPointRec(GetMousePosition(),r);Color bg=primary?DH_GOLD:INK;if(!enabled)bg=(Color){47,64,49,200};if(hover&&enabled)bg=primary?(Color){232,212,163,255}:JADE;DrawRectangleRec(r,bg);DrawRectangleLinesEx(r,1,Fade(DH_GOLD,.5f));DrawText(text,(int)r.x+18,(int)r.y+(int)(r.height-18)/2,18,primary?INK:(enabled?CREAM:GRAY));return enabled&&hover&&IsMouseButtonPressed(MOUSE_BUTTON_LEFT);}
static void assign_shader(Model*m,Shader shader){for(int i=0;i<m->materialCount;i++)m->materials[i].shader=shader;}
static void process_events(void){for(int i=0;i<dh_events();i++){int type=(int)dh_event(i,0);if(type==1||type==3){for(int j=0;j<64;j++)if(tracers[j].ttl<=0){tracers[j].from=(Vector3){dh_event(i,1),dh_event(i,2),dh_event(i,3)};tracers[j].to=(Vector3){dh_event(i,4),dh_event(i,5),dh_event(i,6)};tracers[j].ttl=type==1?.06f:.11f;tracers[j].type=type;break;}if(type==1){recoil=.04f;play_sound(dh_get(10)?1:0,.55f);}else play_sound(1,.12f);}if(type==2&&dh_event(i,7)>0)play_sound(2,.4f);if(type==7)play_sound(3,.5f);if(type==6)play_sound(4,.5f);if(type==4||type==5)play_sound(5,.55f);if(type==8)hurt=.4f;}dh_clear_events();}
static int input_mask(void){int b=0;if(IsMouseButtonDown(MOUSE_BUTTON_LEFT)||IsKeyDown(KEY_F))b|=DH_FIRE;if(IsMouseButtonDown(MOUSE_BUTTON_RIGHT))b|=DH_AIM;if(IsKeyDown(KEY_LEFT_SHIFT))b|=DH_SPRINT;if(IsKeyDown(KEY_LEFT_CONTROL)||IsKeyDown(KEY_C))b|=DH_CROUCH;if(IsKeyDown(KEY_R))b|=DH_RELOAD;if(IsKeyDown(KEY_E))b|=DH_INTERACT;if(IsKeyDown(KEY_H))b|=DH_HEAL;if(IsKeyDown(KEY_SPACE))b|=DH_JUMP;if(IsKeyDown(KEY_ONE))b|=DH_PISTOL;if(IsKeyDown(KEY_TWO))b|=DH_RIFLE;return b;}
static void draw_world(int gameplay,Shader shader,int eye_loc){if(gameplay){camera.position=(Vector3){dh_get(0),dh_get(1),dh_get(2)};Vector3 forward={-sinf(yaw)*cosf(pitch),sinf(pitch),-cosf(yaw)*cosf(pitch)};camera.target=Vector3Add(camera.position,forward);float wanted=IsMouseButtonDown(MOUSE_BUTTON_RIGHT)?51:68;camera.fovy+=(wanted-camera.fovy)*fminf(1,GetFrameTime()*12);}else{camera.position=(Vector3){37,23,42};camera.target=(Vector3){-2,2,-6};camera.fovy=43;}float eye[3]={camera.position.x,camera.position.y,camera.position.z};SetShaderValue(shader,eye_loc,eye,SHADER_UNIFORM_VEC3);
 BeginMode3D(camera);rlDisableBackfaceCulling();DrawPlane((Vector3){0,-.72f,0},(Vector2){700,700},(Color){62,126,115,255});DrawModel(world,(Vector3){0,0,0},1,WHITE);
 for(int i=0;i<DH_ENEMIES;i++){int state=(int)dh_enemy(i,4);if(!state)continue;float y=dh_enemy(i,6)+(state==4?.14f:sinf(dh_enemy(i,7)*6)*.024f);sentry.transform=state==4?MatrixRotateX(-PI_F/2):MatrixIdentity();DrawModelEx(sentry,(Vector3){dh_enemy(i,0),y,dh_enemy(i,1)},(Vector3){0,1,0},dh_enemy(i,2)*RAD2DEG,(Vector3){1,1,1},WHITE);}
 for(int i=0;i<64;i++)if(tracers[i].ttl>0)DrawLine3D(tracers[i].from,tracers[i].to,tracers[i].type==1?DH_GOLD:(Color){211,142,88,255});
 if(gameplay&&dh_get(11)!=3){Vector3 forward=Vector3Normalize(Vector3Subtract(camera.target,camera.position)),right=Vector3Normalize(Vector3CrossProduct(forward,(Vector3){0,1,0})),up=Vector3CrossProduct(right,forward);int aiming=IsMouseButtonDown(MOUSE_BUTTON_RIGHT);Vector3 pos=Vector3Add(camera.position,Vector3Add(Vector3Scale(forward,.44f-recoil),Vector3Add(Vector3Scale(right,aiming?.025f:.21f),Vector3Scale(up,aiming?-.16f:-.23f))));Model*m=dh_get(10)?&rifle:&pistol;float tilt=dh_get(9)>0?-.45f:0;m->transform=MatrixMultiply(MatrixRotateX(pitch+recoil+tilt),MatrixRotateY(yaw));DrawModel(*m,pos,1.25f,WHITE);}
 rlEnableBackfaceCulling();EndMode3D();}
static void hud(float scale){int width=GetScreenWidth(),height=GetScreenHeight();int mask=(int)dh_get(12);DrawRectangle(25,25,(int)(340*scale),(int)(222*scale),Fade(INK,.9f));DrawText("DIVIDED HORIZON / LA ADUANA",42,42,(int)(18*scale),DH_GOLD);for(int i=0;i<3;i++){char row[120];snprintf(row,sizeof(row),"[%c] %s",mask&(1<<i)?'X':' ',labels[i]);DrawText(row,42,85+i*(int)(28*scale),(int)(15*scale),mask&(1<<i)?(Color){164,192,130,255}:CREAM);}DrawText(mask==7?"RETURN TO THE SOUTH JETTY":dh_get(14)>0?"PATROLS ALERTED":"UNDETECTED",42,183,(int)(14*scale),DH_GOLD);DrawText(TextFormat("%d guards active",(int)dh_get(19)),42,208,(int)(13*scale),CREAM);
 DrawLine(width/2-6,height/2,width/2+6,height/2,CREAM);DrawLine(width/2,height/2-6,width/2,height/2+6,CREAM);if(dh_get(21)>0)DrawText("X",width/2-7,height/2-10,22,DH_GOLD);
 int p=(int)dh_get(15);if(p>=0){const char*label=p==3?"[E] Secure the evidence":TextFormat("[E] %s",labels[p]);int textwidth=MeasureText(label,19);DrawRectangle(width/2-textwidth/2-16,(int)(height*.63)-12,textwidth+32,44,INK);DrawText(label,width/2-textwidth/2,(int)(height*.63),19,CREAM);}
 DrawText(TextFormat("HEALTH %03d",(int)ceilf(dh_get(5))),30,height-110,17,CREAM);DrawRectangle(30,height-82,190,5,(Color){32,54,40,255});DrawRectangle(30,height-82,(int)(190*dh_get(5)/100),5,CREAM);DrawText("STAMINA",30,height-63,11,DH_GOLD);DrawRectangle(30,height-45,(int)(190*dh_get(6)/100),3,DH_GOLD);DrawText(TextFormat("H  FIELD KITS %d",(int)dh_get(18)),30,height-26,12,CREAM);
 DrawText(dh_get(10)?"W05 / LIBERTAD":"W01 / CULEBRA",width-230,height-114,14,DH_GOLD);DrawText(TextFormat("%02d / %d",(int)dh_get(7),(int)dh_get(8)),width-235,height-86,40,CREAM);DrawText(dh_get(9)>0?TextFormat("RELOADING %.1fs",dh_get(9)):dh_get(10)?"AUTOMATIC":"SEMI-AUTOMATIC",width-230,height-34,12,DH_GOLD);
 DrawText("WASD move | Shift sprint | Ctrl crouch | Space jump | Mouse / F fire | Right-click aim | R reload | E interact",250,height-28,12,CREAM);
 if(message_time>0){int size=15;int tw=MeasureText(message,size);if(tw>width-80)size=12;DrawRectangle(25,height-170,width-50,40,Fade(INK,.85f));DrawText(message,40,height-158,size,CREAM);}
 if(hurt>0)DrawRectangleLinesEx((Rectangle){0,0,(float)width,(float)height},8,Fade((Color){151,67,43,255},hurt));}
static void menu(void){int width=GetScreenWidth(),height=GetScreenHeight();float x=width*.075f,y=height*.18f;DrawRectangleGradientH(0,0,(int)(width*.75f),height,(Color){23,46,35,249},(Color){24,46,32,15});DrawText("DIVIDED HORIZON",(int)x,35,24,CREAM);DrawText("COMBAT SLICE " DH_SLICE_VERSION " / NOT THE FINISHED GAME",width-380,40,11,DH_GOLD);DrawText("ACT I / ISLA SOMBRA",(int)x,(int)y,13,DH_GOLD);DrawText("Follow the",(int)x,(int)y+42,52,CREAM);DrawText("paper trail.",(int)x,(int)y+99,52,DH_GOLD);DrawText("Infiltrate La Aduana. Recover the records.",(int)x,(int)y+176,17,CREAM);DrawText("Silence the signal before backup arrives.",(int)x,(int)y+202,17,CREAM);
 float by=y+250;if(button((Rectangle){x,by,360,45},difficulty?"DIFFICULTY: STANDARD":"DIFFICULTY: STORY",0,1))difficulty=!difficulty;
 if(button((Rectangle){x,by+55,360,48},"Begin operation   >",1,1)||IsKeyPressed(KEY_ENTER))begin(0);
 if(button((Rectangle){x,by+113,360,45},"Continue checkpoint   >",0,FileExists(save_path)))begin(1);
 if(button((Rectangle){x,by+168,360,40},sound_on?"Sound effects: ON":"Sound effects: OFF",0,audio_ready))sound_on=!sound_on;
 DrawText("Original prototype assets | Unreal remains the final production target",(int)x,height-35,12,CREAM);if(message_time>0)DrawText(message,(int)x,height-65,14,DH_GOLD);}
static void paused_menu(void){int width=GetScreenWidth(),height=GetScreenHeight(),phase=(int)dh_get(11);DrawRectangle(0,0,width,height,Fade((Color){15,34,24,255},.74f));float x=width/2.f-240,y=height/2.f-210;DrawRectangle((int)x,(int)y,480,420,INK);DrawRectangleLinesEx((Rectangle){x,y,480,420},1,Fade(DH_GOLD,.6f));DrawText(phase==2?"Operation interrupted.":phase==3?"Evidence secured.":"Hold your position.",(int)x+28,(int)y+28,29,CREAM);DrawText(TextFormat("%dm %ds / %d guards defeated",(int)dh_get(16)/60,(int)dh_get(16)%60,(int)dh_get(13)),(int)x+28,(int)y+80,15,DH_GOLD);DrawText(phase==2?"Try another approach from the last checkpoint.":phase==3?"Records secured. The current slice is complete.":"Checkpoint saves happen at each objective.",(int)x+28,(int)y+114,15,CREAM);
 if(phase==1&&button((Rectangle){x+28,y+157,424,45},"Resume operation",1,1)){dh_pause();DisableCursor();mouse_grace=.25f;}
 if(phase==2&&button((Rectangle){x+28,y+157,424,45},"Retry last checkpoint",1,1))retry();
 if(phase==3&&button((Rectangle){x+28,y+157,424,45},"Start another operation",1,1))begin(0);
 if(button((Rectangle){x+28,y+213,424,43},"Restart operation",0,1))begin(0);
 if(button((Rectangle){x+28,y+266,424,43},"Return to briefing",0,1)){front=1;EnableCursor();}
 if(button((Rectangle){x+28,y+319,424,43},sound_on?"Sound effects: ON":"Sound effects: OFF",0,audio_ready))sound_on=!sound_on;
 DrawText("Esc resumes a paused operation. Alt+F4 exits.",(int)x+28,(int)y+382,13,CREAM);}
static int self_test(void){dh_new(1);int ok=dh_get(7)==12&&dh_get(5)==100;dh_input(0,0,0,0,DH_FIRE);dh_tick(1/60.f);ok=ok&&dh_get(7)==11;int size=dh_save();ok=ok&&dh_load(size);FILE*f=fopen("self-test.txt","w");if(f){fprintf(f,"Shared simulation: %s\nThis diagnostic does NOT test window creation, GPU rendering, audio or gameplay on the display.\n",ok?"PASS":"FAIL");fclose(f);}return ok?0:1;}
int main(int argc,char**argv){ChangeDirectory(GetApplicationDirectory());if(argc>1&&strcmp(argv[1],"--self-test")==0)return self_test();paths();SetConfigFlags(FLAG_WINDOW_RESIZABLE|FLAG_MSAA_4X_HINT);InitWindow(W,H,"DIVIDED HORIZON - La Aduana | Combat Slice " DH_SLICE_VERSION);SetWindowMinSize(1024,720);SetExitKey(KEY_NULL);SetTargetFPS(60);
 if(!FileExists("assets/L_PuertoChico_Combat.glb")){while(!WindowShouldClose()){BeginDrawing();ClearBackground(INK);DrawText("Missing assets. Extract the entire ZIP before running the game.",35,70,22,CREAM);DrawText("Keep the assets folder next to DividedHorizon-Slice.exe.",35,115,18,DH_GOLD);EndDrawing();}CloseWindow();return 2;}
 world=LoadModel("assets/L_PuertoChico_Combat.glb");sentry=LoadModel("assets/SM_Cosecha_Sentry_01.glb");pistol=LoadModel("assets/SM_Culebra_W01.glb");rifle=LoadModel("assets/SM_Libertad_W05.glb");if(world.meshCount<=0||sentry.meshCount<=0||pistol.meshCount<=0||rifle.meshCount<=0){CloseWindow();return 3;}
 Shader shader=LoadShaderFromMemory(vs,fs);shader.locs[SHADER_LOC_MATRIX_MODEL]=GetShaderLocation(shader,"matModel");int eye_loc=GetShaderLocation(shader,"eye");assign_shader(&world,shader);assign_shader(&sentry,shader);assign_shader(&pistol,shader);assign_shader(&rifle,shader);
 InitAudioDevice();audio_ready=IsAudioDeviceReady();if(audio_ready){const char*names[6]={"shot","rifle","impact","reload","heal","objective"};for(int i=0;i<6;i++)sfx[i]=LoadSound(TextFormat("assets/audio/%s.wav",names[i]));}
 camera=(Camera3D){.position={37,23,42},.target={-2,2,-6},.up={0,1,0},.fovy=43,.projection=CAMERA_PERSPECTIVE};dh_new(difficulty);EnableCursor();
 while(!WindowShouldClose()){
  float dt=fminf(GetFrameTime(),.08f);message_time=fmaxf(0,message_time-dt);recoil=fmaxf(0,recoil-dt*.16f);hurt=fmaxf(0,hurt-dt*.5f);for(int i=0;i<64;i++)tracers[i].ttl=fmaxf(0,tracers[i].ttl-dt);
  if(IsKeyPressed(KEY_F11))ToggleFullscreen();
  if(!front&&IsKeyPressed(KEY_ESCAPE)){dh_pause();if(dh_get(11)==0){DisableCursor();mouse_grace=.25f;}else EnableCursor();}
  if(!front&&!IsWindowFocused()&&dh_get(11)==0){dh_pause();EnableCursor();}
  if(!front&&dh_get(11)==0){Vector2 delta=GetMouseDelta();if(mouse_grace>0){mouse_grace-=dt;delta=(Vector2){0,0};}float sensitivity=IsMouseButtonDown(MOUSE_BUTTON_RIGHT)?.0012f:.0023f;yaw-=delta.x*sensitivity;pitch=Clamp(pitch-delta.y*sensitivity,-1.35f,1.35f);yaw+=((IsKeyDown(KEY_LEFT)?1:0)-(IsKeyDown(KEY_RIGHT)?1:0))*dt*1.5f;float side=(float)IsKeyDown(KEY_D)-(float)IsKeyDown(KEY_A),forward=(float)IsKeyDown(KEY_W)-(float)IsKeyDown(KEY_S);int mask=input_mask();accumulator=fminf(accumulator+dt,.12f);while(accumulator>=1/60.f&&dh_get(11)==0){dh_input(side,forward,yaw,pitch,mask);dh_tick(1/60.f);yaw=dh_get(3);pitch=dh_get(4);accumulator-=1/60.f;}if(dh_get(11)!=0)EnableCursor();}
  int msg=(int)dh_get(17);if(msg>0&&msg<8&&msg!=last_message){notify(messages[msg]);last_message=msg;}if((int)dh_get(22)>save_serial){save_progress();save_serial=(int)dh_get(22);}process_events();
  BeginDrawing();ClearBackground((Color){179,195,173,255});draw_world(!front,shader,eye_loc);if(front)menu();else{hud(Clamp(GetScreenWidth()/1280.f,.85f,1.5f));if(dh_get(11)!=0)paused_menu();}EndDrawing();
 }
 (void)started; /* No network services, telemetry, account login or external content. */
 if(audio_ready){for(int i=0;i<6;i++)UnloadSound(sfx[i]);CloseAudioDevice();}
 // Shader is shared across models; let CloseWindow release graphics context resources.
 CloseWindow();return 0;
}
