# SECTION S0.7 — THE QUALITY BAR, STATED AS NUMBERS

Every adjective in this document is backed by a number somewhere in
Sections 101–136. The headline numbers:

| DIMENSION | MEASUREMENT | v2 TARGET |
|-----------|-------------|-----------|
| Geometry | unique Nanite tris on screen | 20–50 M visible, <= 4 ms raster budget T3 |
| Materials | texel density (hero / world) | 1024 px/m hero · 512 px/m props · 256 px/m terrain detail |
| Lighting | GI | fully dynamic Lumen; no baked dependency; HW RT on T4+ |
| Shadows | resolution | VSM 16k virtual, contact shadows on characters |
| Characters | hero LOD0 | ~120k tris + strand hair, 8K/4K-UDIM skin |
| Animation | locomotion | Motion Matching DB >= 4 h mocap-class, foot slide <= 1 cm avg |
| Latency | input → photon | <= 50 ms @ 60 FPS (T3), <= 30 ms @ 120 (T5) |
| Gunplay | firearms | 12 firearms, 1,728-row penetration table, per-weapon patterns |
| AI | simultaneous combatants | 24 full-fidelity + 200 Mass-LOD in combat zone |
| World | playable area | 140 km2 footprint (36 island + 64 city + 40 sea) |
| Streaming | hitch | zero loading screens inside an act; no hitch > 33 ms in traversal |
| Life | population | 1,500+ simultaneous Mass agents in city core (LOD'd) |
| Weather | states | 12, blendable, all Lumen/Niagara/Audio-integrated |
| Stability | soak | 4 h no crash; < 5% memory growth |
