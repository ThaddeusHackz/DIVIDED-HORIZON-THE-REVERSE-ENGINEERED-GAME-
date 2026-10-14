#include "core.h"
#include <assert.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <math.h>
int main(int argc,char**argv){
 assert(argc==2);dh_new(1);assert(dh_get(7)==12);dh_input(0,0,0,0,DH_FIRE);dh_tick(1/60.f);assert(dh_get(7)==11);
 dh_pause();float seconds=dh_get(16);for(int i=0;i<100;i++)dh_tick(1/60.f);assert(dh_get(16)==seconds);dh_pause();
 int bytes=dh_save();assert(dh_load(bytes));((unsigned char*)dh_save_pointer())[20]^=0xff;assert(!dh_load(bytes));
 dh_new(1);FILE*f=fopen(argv[1],"rb");assert(f);uint32_t count=0;assert(fread(&count,4,1,f)==1);assert(count<18001);
 for(uint32_t i=0;i<count;i++){float input[4];uint32_t buttons;assert(fread(input,4,4,f)==4);assert(fread(&buttons,4,1,f)==1);dh_input(input[0],input[1],input[2],input[3],(int)buttons);dh_tick(1/60.f);dh_clear_events();}
 fclose(f);assert(dh_get(11)==3);assert(dh_get(12)==7);assert(dh_get(13)==7);assert(fabsf(dh_get(16)-23.98314f)<.05f);
 printf("PASS: native C replay of %u ordinary-input frames completes all three objectives and extraction; 7 guards defeated.\n",count);
 printf("PASS: ammunition, pause, checksum rejection. Renderer and Windows launch are not exercised by this Linux test.\n");return 0;
}
