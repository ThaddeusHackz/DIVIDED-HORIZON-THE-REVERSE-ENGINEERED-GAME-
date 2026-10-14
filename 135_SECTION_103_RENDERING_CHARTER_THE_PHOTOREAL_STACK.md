# SECTION 103 — RENDERING CHARTER (THE PHOTOREAL STACK)

103.1 GEOMETRY: Nanite for ALL opaque static geometry (architecture, props,
      rocks, landscape-adjacent meshes, foliage trunks/branches/leaves where
      Nanite Foliage is available). Non-Nanite allowed only for: skinned
      meshes without Nanite skeletal support, translucency, WPO-heavy assets
      not yet Nanite-compatible (document each in the validator whitelist).
      Displacement: Nanite tessellation/displacement on terrain-blend hero
      surfaces (cobble, bark, rock faces) where supported.
103.2 GLOBAL ILLUMINATION & REFLECTIONS: Lumen (software on T1–T3, hardware RT
      on T4–T5 for reflections/GI), Lumen Reflections for water/wet asphalt;
      screen-space fallbacks only on T0. MegaLights (where production-ready)
      for the neon city at night: hundreds of shadow-casting emissive/area
      lights on screen without per-light cost explosions. Emissive meshes from
      signs/windows feed Lumen; all night city lighting is physically motivated.
103.3 SHADOWS: Virtual Shadow Maps everywhere; directional sun at 16k virtual;
      local lights with VSM; contact shadows + capsule shadows on characters;
      distance-field shadows for far-terrain fallback on T1.
103.4 MATERIALS: Substrate (layered: clear coat car paint, wet asphalt film,
      skin SSS + fuzz for fabrics, rough-dielectric glass, anisotropic brushed
      metal). Master materials: M_Master_Opaque, _Foliage, _Landscape, _Skin,
      _Hair, _Cloth, _Glass, _Water, _Decal, _Emissive, _Vehicle_Paint (24
      total, permutation budget in Section 155). Virtual Textures (RVT) for
      terrain/road blending; SVT for large atlases; Nanite-friendly
      masked/programmable raster only where unavoidable.
103.5 ATMOSPHERE: Sky Atmosphere + Volumetric Clouds (3 cloud layers, weather-
      blended) + Exponential Height Fog w/ volumetric fog + Local Fog Volumes
      (mist in jungle valleys, harbor haze) + Sky Light real-time capture.
      Rain: Niagara + GPU-driven wetness (global wetness parameter in M_*),
      puddle mask via RVT height, ripples, lens droplets (post). Heterogeneous
      Volumes for smoke/fire/explosions on T3+; sprite fallback on T0–T2.
103.6 UPSCALING & AA: TSR default; DLSS 4 / FSR 4 / XeSS 2 selectable; Frame
      Generation optional (never enabled in automated perf gates; reported
      separately); DLAA/TSR native for T5; Temporal stability budget: no
      visible ghosting on foliage/wires at 100% test-pan (screenshot-diff
      gate Section 148).
103.7 POST: physically based camera — aperture/shutter/ISO driven exposure
      with auto-exposure histogram, eye adaptation (tuned: 1.2 s dark→bright),
      bloom (convolution on T4+), lens flares (subtle), chromatic aberration
      (<= 0.15, user option), film grain (<= 0.2, option), vignette (<= 0.15),
      color grading via ACES-like OCIO tone-mapper + per-act LUTs from 43.1
      color scripts, HDR10/Dolby Vision output (scRGB) with calibration UI.
103.8 WATER: Water plugin + custom far-ocean FFT cascades (T3+), Gerstner
      fallback (T0–T2); shoreline foam, wake/bow-wave sim via RT, underwater
      volumetric with caustics + god rays; river flow maps authored via splines;
      refraction/SSS through Substrate water (Section 128).
103.9 HAIR/FUR: Groom (strand-based) for hero + 40 close-range NPCs; cards for
      crowd; fur for wildlife via groom-lite; wet-hair response.
103.10 DECALS: DBuffer/Nanite-aware decals: bullet holes (per-surface 16
      variants), blood (wet/dry), scorch, mud, puddle splashes; decal budget by
      tier; RVT "world-space grime" under props for contact realism.
103.11 CAMERA/LENS LANGUAGE: Cine Camera with real focal lengths; gameplay FOV
      slider 70–110 (horizontal) with lens-correct distortion at edges (<= 2%);
      motion blur per-object + camera at 180° shutter equivalent, optional.
103.12 SHADER/PSO: PSO precaching enabled; shader compile hitch gate = zero
      stutter > 33 ms after first-run warmup scene; bundled PSO cache for
      Shipping; compile step part of build (Section 133).
103.13 RENDER-FEATURE TIER MAP (binding):
   T0 SM5, no Lumen, baked-ish ambient fallbacks, sprite smoke, cards-only hair
   T1 SM6, Lumen software low-res, VSM low, TSR-Perf, reduced Nanite budget
   T2 SM6, Lumen software med, VSM med, strands on hero only
   T3 SM6, Lumen software high + HW reflections optional, VSM high, strands 40 NPC
   T4 SM6, Lumen HW GI/reflections, VSM epic, heterogeneous volumes, MegaLights
   T5 as T4 + path-traced showcase mode (photo mode + trailer), 4K native
