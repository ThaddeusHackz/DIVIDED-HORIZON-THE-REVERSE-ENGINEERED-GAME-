# SECTION 104 — MATERIAL, SCAN & ASSET PIPELINE (PHOTOREAL SOURCES)

104.1 SOURCE HIERARCHY (attempt in this order per asset; first that meets the
      gate wins; record pipeline id in asset metadata `DH_SourceMethod`):
   P1  PHOTOGRAMMETRY / SCAN LIBRARIES — Fab/Quixel Megascans (surfaces, 3D
       scans, atlases, vegetation), other CC0/CC-BY scan libraries
       (Poly Haven, ambientCG — CC0), own captured scans when a human supplies
       photos. Best for rocks, surfaces, vegetation, debris, set dressing.
   P2  HAND/PROCEDURAL AUTHORING — Blender/Houdini modeling with PBR-calibrated
       textures (Substance/Designer/Materialize). Best for architecture kits,
       signs, vehicles, weapons (hard-surface), props needing variation.
   P3  GENERATIVE ASSISTED — image→PBR-map generators, text/image→3D
       generators (for blockout/hero prop base meshes), upscalers, texture
       synthesis. ALWAYS followed by retopo/cleanup + PBR calibration + a
       human-auditable provenance record; generated assets containing
       recognizable third-party IP are rejected. (License/AI-disclosure: 135.4)
   P4  MARKETPLACE HERO PACKS — Fab vehicles/characters/weapons only when the
       license allows redistribution in a shipped game and assets are
       re-skinned/modified to our art direction; logged in LICENSES.md.
   P5  PLACEHOLDER — allowed only at M0–M3; must carry `DH_Placeholder=true`;
       zero placeholders permitted in Release Candidate build (gate G-PH).
104.2 TEXEL DENSITY LAW: hero (weapons, hands, faces) 1024–2048 px/m;
      characters' body 512–1024; vehicles 512–768; architecture 256–512
      (trim sheets + unique hero faces); terrain detail 256 (RVT 4 cm/px near,
      blended to 32 cm/px far); foliage leaf atlases 256–512 px/m. A validator
      measures texel density and fails assets outside ±30% of class.
104.3 PBR CALIBRATION (albedo ranges, sRGB 0–255 for base color, measured):
      charcoal 50 · fresh asphalt 55–75 · worn asphalt 75–95 · dry dirt 85–120 ·
      wet dirt 45–70 · concrete 120–150 · brick 100–140 · bark 40–80 ·
      leaves 40–70 (bright young 60–90) · sand 150–190 · snow N/A ·
      skin (light) 170–220 · skin (dark) 55–115 · clean white paint <= 240 ·
      no albedo < 30 or > 240 except emissive. Roughness maps contain real
      variation (std-dev >= 0.06); metallic only 0/1 + edge-wear gradients.
      Validator script `validate_pbr.py` samples histograms; fails outside.
104.4 VARIATION & ANTI-TILING: world-aligned macro variation maps, per-instance
      random color/roughness via Custom Primitive Data, 4 decal "grime" layers,
      stochastic tiling for terrain layers, vertex-paint/trim wear masks.
      Gate: 50 m screenshot test shows no repeat pattern at 10% contrast boost.
104.5 MODULAR KITS: Architecture built from modular kits (walls, corners,
      balconies, shopfronts, roofs, AC units, cables, awnings...) on a 50 cm
      snap grid; every module has 3 wear levels and 2 graffiti/poster passes;
      kit piece count targets per district in Section 106.3.
104.6 TEXTURE GENERATION RULES (for P2/P3): 16-bit height, OpenGL/DirectX normal
      convention = DirectX, ORM packing (R=AO, G=Roughness, B=Metal), BC7
      for color/ORM, BC5 for normal, BC4 for masks; UDIM for characters
      (skin 4 tiles 4K). Streaming mip bias by tier; texture pool sized by
      tier (T1 2.5 GB, T3 6 GB, T5 10 GB).
104.7 LODs/NANITE BUDGETS: Nanite meshes 50k–2M tris hero, 5k–50k prop (Nanite
      handles LOD); non-Nanite skinned LOD chain 100%/50%/25%/10%/imposter;
      crowd LOD: LOD0 25k, LOD1 12k, LOD2 5k, LOD3 1.5k, impostor sprite.
104.8 COLLISION: simple collision primitives for props; complex-as-simple only
      for non-moving architecture; Chaos physical materials per surface type
      (Section 145) drive audio, VFX, decals, vehicle grip, AI noise.
104.9 ASSET DEFINITION OF DONE (validated automatically): naming ✔, pivot ✔,
      scale (1 uu = 1 cm) ✔, texel ✔, PBR ✔, collision ✔, physical material ✔,
      Nanite setting ✔, LOD/impostor ✔, source-method tag ✔, license row ✔,
      sound-surface tag ✔, destruction tier ✔, thumbnail ✔, placed-instance count
      within budget ✔.
