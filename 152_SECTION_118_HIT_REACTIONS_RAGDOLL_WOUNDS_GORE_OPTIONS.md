# SECTION 118 — HIT REACTIONS, RAGDOLL, WOUNDS & GORE OPTIONS

118.1 LAYERS: (a) additive hit flinch by zone+direction (8 directional bins ×
      12 zones in Section 142: HIT REACTION MATRIX), (b) partial ragdoll via
      Physical Animation Component blending spine/limbs by impulse, (c) full
      ragdoll on kill with pre-kill death anim blends (forward/back/left/right/
      falling-from-height/in-water/in-vehicle), (d) stumble MM for heavy
      hits, (e) limp/injury gait after leg hits (injured MM DB).
118.2 RAGDOLL QUALITY: per-archetype physics assets with constraint limits
      tuned (no hyperextended elbows/knees), damping by surface; ragdoll
      settling sleep after 4 s; no jitter gate; stacking bodies behave;
      corpse cap 16 (11.3) with cleanup fade; cloth/gear attached stable.
118.3 WOUNDS: localized decals (entry/exit) on skin/cloth via projected decal
      on skeletal mesh (Substrate), blood types (spray, pool, drip, smear on
      walls); wound persistence on hero; dismemberment NOT in base game;
      GORE REDUCED option (default ON for T0, OFF for T3+ with mature flag).
118.4 REACTIONS TO NON-BULLETS: explosion shove (radius-based impulse,
      ear-ring audio, tinnitus filter on hero), fire panic (run + roll),
      vehicle impact (launch via capsule-to-ragdoll switch at > 18 km/h),
      fall damage (landing MM + ragdoll if > 10 m), drowning, electrocution
      (OPT).
118.5 NPC CIVILIAN REACTIONS: panic, hands-up, hide behind cover, call
      police (phone animation), film with phones, flee along graph, freeze;
      reaction depends on weapon-type and proximity (gunshot 80 dB falloff).
