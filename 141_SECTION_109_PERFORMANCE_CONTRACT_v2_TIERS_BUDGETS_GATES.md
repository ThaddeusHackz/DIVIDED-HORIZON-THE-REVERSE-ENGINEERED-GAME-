# SECTION 109 — PERFORMANCE CONTRACT v2 (TIERS, BUDGETS, GATES)

109.1 HARDWARE TIERS (gates):
   T0 COMPAT   GTX 960/iGPU-class — 720p, SM5, 30 FPS best-effort (NOT a gate)
   T1 MIN      GTX 1060 6GB / RX 580 — 1080p, TSR-Perf (720p internal), 30 FPS
   T2 REC-LOW  GTX 1660S/RTX 2060 — 1080p, TSR-Quality, 45–60 FPS
   T2H DECK    Steam-Deck-class — 800p, FSR, 40 FPS locked
   T3 REC      RTX 3070 / RX 6800 — 1440p, TSR-Quality/DLSS-Q, 60 FPS avg
   T4 ENTH     RTX 4080 / RX 7900 XT — 4K, DLSS-Q/TSR-Q, 60 FPS avg; 1440p 120
   T5 HALO     RTX 5090-class — 4K native/DLAA 60–90, 120 w/ upscaling
   CPU baseline: i7-class 6c/12t @ 3.5+ GHz (T1–T3); 8c+ recommended T4+.
   RAM: 16 GB min, 32 GB rec. Storage: SSD REQUIRED for T2+, HDD supported at T1
   (streaming budgets reduced). VRAM: 6 GB (T1) / 8 GB (T3) / 16 GB (T5).
109.2 FRAME BUDGET (T3 @ 60 FPS = 16.67 ms; GPU pass budgets, ms):
   Nanite visibility+raster 2.6 · Base/material pass 2.4 · Lumen GI 2.8 ·
   Lumen reflections 1.2 · VSM 2.2 · Volumetric fog/clouds 0.9 ·
   Translucency + VFX 1.1 · Post + TSR 1.8 · Hair/strands 0.5 · UI 0.3 ·
   Headroom 0.87 ms. CPU (game thread 10 ms, render thread 9 ms, RHI 8 ms).
   Budget table per tier/scene: Section 147. Overbudget = blocking bug.
109.3 CPU BUDGET (game thread @ T3, ms): Character/anim 2.4 · AI (24 full +
   Mass) 2.0 · Physics (Chaos) 1.8 · Vehicles 0.8 · World sim (traffic, ped,
   ecology) 1.5 · Gameplay/UI/audio 1.0 · Headroom 0.5. Worker-thread offload
   mandatory for animation (parallel eval), Mass, Chaos, audio DSP.
109.4 MEMORY: (T3) total process <= 14 GB; GPU VRAM <= 7.2 GB; streaming pool
   cap 3.5 GB textures, Nanite pool 1 GB; leaks: <5% growth over 4 h soak.
109.5 STREAMING & HITCH: zero loading screens inside an act; traversal at 160
   km/h (aircraft) without pop: HLOD + Nanite; hitch gate: no frame > 33 ms
   during 1-hour scripted traversal route; first-minute shader warmup scene.
   World Partition load range: 1.2 km (T3), 0.8 km (T1), 2 km (T5).
109.6 TIER PLEDGE (replaces old-laptop pledge; print in README): "Every tier
   has a number, and we publish it. If your hardware meets a tier and misses
   its number, it's a bug — file it." (Report tables via built-in Benchmark.)
109.7 INSTANCE BUDGETS (visible, T3): Nanite instances 400k · foliage 2.5M
   (clustered) · dynamic lights w/ shadows 64 (MegaLights: 500+ unshadowed-
   cost) · skinned characters full 60, LOD'd 400 · Niagara systems 120,
   particles 1.2M GPU · decals 8,000 · physics bodies active 1,500 · audio
   voices 128 (virtual 512).
109.8 SCALABILITY GROUPS: r.ViewDistance, Shadow, GI, Reflections, PostProcess,
   Texture, Effects, Foliage, Shading, Landscape, Nanite, Hair, Crowd, Traffic,
   Water, Volumetrics — each 0..4 (Low..Cinematic), mapped per tier; first-run
   benchmark recommends tier; user can override each (exposed in UI, S50).
109.9 PROFILING RITUAL: nightly automated run — 12 traversal routes × 4 weather ×
   3 TODs × 3 tiers produce CSV + Insights traces; dashboard regressions >3%
   fail the nightly; top-10 offenders auto-assigned as tasks (Section 149).
