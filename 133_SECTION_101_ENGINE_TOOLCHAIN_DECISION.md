# SECTION 101 — ENGINE & TOOLCHAIN DECISION

101.1 ENGINE: Unreal Engine 5, latest stable 5.x at project start (>= 5.6;
      prefer the newest release where Nanite Foliage, Nanite Skeletal Meshes,
      Substrate and MegaLights are production-supported — VERIFY each feature's
      maturity against release notes on day 0 and record the decision in
      docs/adr/0001-engine-version.md). Lock the version per milestone; upgrade
      only at milestone boundaries with a regression pass.
101.2 WHY UE5 (decision record): it is the only widely available engine whose
      shipping feature set already contains the photoreal pillars required —
      virtualized geometry (Nanite), fully dynamic GI + reflections (Lumen),
      virtual shadow maps, strand hair, Chaos physics/vehicles/destruction,
      Mass entity simulation, World Partition + HLOD, PCG, MetaHuman,
      Motion Matching (Pose Search), Niagara, MetaSounds — so the swarm spends
      effort on CONTENT and GAMEPLAY QUALITY instead of rebuilding an engine.
101.3 LANGUAGES: C++20 (engine modules), Blueprints (glue/tuning/UI),
      Python (editor automation, content validation), Houdini/Blender Python
      (DCC pipelines), HLSL only via Material Graph custom nodes or engine
      plugins, Verse: NOT used.
101.4 TOOLCHAIN (all required unless marked OPT):
      - Visual Studio 2022 (MSVC v14.4x, Win SDK 10.0.22621+), .NET 8 SDK
      - Git + Git LFS (binary assets) — or Perforce/Diversion (OPT, if a human
        owner prefers); `.gitattributes` tracks uasset/umap/fbx/exr/wav/etc.
      - Blender 4.x (modeling/retopo/rigging), Houdini Indie/Apprentice or
        Houdini Engine (PCG/city/destruction/VAT) , Substance 3D Painter/
        Designer OR Materialize/ComfyUI PBR generation (see 104.6),
        RizomUV/Blender UV, Gaea or World Creator (terrain, OPT),
        SpeedTree or Fab foliage (vegetation), Marvelous Designer (cloth, OPT)
      - Audio: Reaper, Wwise OR native MetaSounds (decision ADR-0002; default
        native MetaSounds + UE Audio Modulation), Sonniss GDC bundles
      - Capture/QA: Unreal Insights, RenderDoc, PIX, NVIDIA Nsight, Intel GPA,
        CSV Profiler, Gauntlet, Automation Driver, ffmpeg (video diffing)
101.5 PLUGINS (enable explicitly; each has an ADR line if shipped):
      Mover (or CMC w/ extensions), Pose Search, Motion Warping, Control Rig,
      IK Rig/Retargeter, Chaos Vehicles, Chaos Destruction (Geometry
      Collection), Chaos Cloth, Chaos Physical Animation/Control, Niagara,
      Niagara Fluids (smoke/water sims), Mass (Entity, Crowd, Traffic, AI,
      Gameplay, Movement), Smart Objects, State Tree, Gameplay Abilities,
      Gameplay Tags, Enhanced Input, Common UI, World Partition, PCG, Water,
      Landscape Patch, Procedural Content Generation Framework, Sequencer,
      Movie Render Graph, MetaHuman Creator/Animator, Live Link, Audio
      Modulation, MetaSounds, Audio Synesthesia, Steam Audio OR Project Acoustics
      (OPT), Online Subsystem (for achievements; optional), DLSS/FSR/XeSS
      plugins, Streamline (frame-gen), Hardware RT, Path Tracer (showcase).
101.6 NON-GOALS (explicit): multiplayer, VR, console SKUs at launch (code must
      not block them: no Windows-only hard dependencies in gameplay modules).
