#!/usr/bin/env python3
"""Original deterministic, synthesized prototype SFX. No sampled/licensed audio."""
import math,random,struct,wave
from pathlib import Path
out=Path('prototype/public/assets/batch-02/audio');out.mkdir(parents=True,exist_ok=True)
for name,duration in [('shot',.19),('rifle',.13),('impact',.09),('reload',.28),('heal',.42),('objective',.5)]:
 rng=random.Random(101);samples=[];rate=22050
 for i in range(int(duration*rate)):
  t=i/rate;u=t/duration
  if name in ('shot','rifle'):v=((rng.random()*2-1)*.7+math.sin(t*(95-t*120)*math.tau)*.3)*math.exp(-u*8)
  elif name=='impact':v=(rng.random()*2-1)*math.exp(-u*14)*.5
  elif name=='reload':v=(rng.random()*2-1)*(.8 if t<.035 or .17<t<.2 else .02)*(1-u)
  else:v=math.sin(t*(440 if name=='heal' else 660)*math.tau)*math.sin(math.pi*u)**2*.24
  samples.append(struct.pack('<h',int(max(-1,min(1,v*.38))*32767)))
 with wave.open(str(out/f'{name}.wav'),'wb')as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(samples))
 print(name)
