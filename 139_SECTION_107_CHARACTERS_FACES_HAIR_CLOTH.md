# SECTION 107 — CHARACTERS, FACES, HAIR & CLOTH

107.1 HERO CHARACTERS (Ren, Tobias, Marisol, El Sereno, bosses): MetaHuman
      Creator base → sculpt/customize in Blender/ZBrush to original designs;
      LOD0 ~120k tris body+head; 8K skin across UDIM tiles (albedo, normal,
      cavity, roughness, SSS, micro-normals); 4 wrinkle-map states; eyes with
      refractive cornea, caustics fake, wetness meniscus; teeth/tongue; strand
      hair (groom) with physics and wetness; eyebrows/lashes strands.
107.2 NPC CAST: 25 named NPCs at hero-lite (MetaHuman + custom costume), 240
      crowd archetypes (Section 144) built from 32 body bases × 120 heads ×
      costume-piece kit (12 slots) with color/pattern masks; per-NPC voice +
      facial set. Crowd LODs per 104.7.
107.3 FACIAL ANIMATION: audio-driven facial animation for all VO (MetaHuman
      Animator / audio-to-face) + authored emotional layer (brow/eyes/blink/
      saccades); hero cinematics use performance capture (face + body);
      saccades/micro-expressions/blink rates procedural; gaze IK (44.3).
107.4 CLOTH: Chaos Cloth for poncho, jackets, skirts, flags; wind-coupled;
      collision capsules per body; wet cloth darkens + drags (shader+sim param);
      gear (straps, holster) physics via Chaos Physical Animation.
107.5 SKIN & DAMAGE STATES: dirt/sweat/blood/wetness layers (Substrate) per
      character; wound decals by hit zone; scars persist for hero per NG+;
      sun-tan progression over game-time (subtle).
107.6 BODY VARIETY & FIT: size/height/mass variance ±10%; clothing morph/
      retarget correct across 32 bases; no clipping gate (automated pose sweep
      across 20 animations × all costume pieces, Section 144).
107.7 ANIMALS: wildlife (boar, chanchos, capybara-likes, birds, reef fish,
      crocs, jaguars (2 bosses-lite), lizards, snakes, bats, crabs, monkeys) via
      skeletal meshes + fur groom-lite, motion matching for quadrupeds (DB >= 1 h
      each quadruped class), species list Section 151.
107.8 POSE & SILHOUETTE: 43.4 silhouette rules still bind (hats, coats, poncho).
