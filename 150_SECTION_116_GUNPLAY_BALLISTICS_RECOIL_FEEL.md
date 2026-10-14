# SECTION 116 — GUNPLAY: BALLISTICS, RECOIL, FEEL

116.1 BALLISTIC MODEL: hybrid — hitscan with lag-compensated ballistic
      simulation for distances > 60 m: muzzle velocity per ammo (9mm 360 m/s,
      .44 440, 5.56 910, 7.62x51 840, 12ga slug 450, pellets 380 + spread),
      gravity drop, drag (G1 coefficient per ammo), wind deflection (weather
      controller), travel time visible via tracers at 1 of 3 rounds.
      Table: Section 142 (BALLISTIC DROP 25 m steps to 600 m).
116.2 PENETRATION & SURFACE RESPONSE: each impact resolves: surface (Chaos
      physical material, Section 145), angle of incidence (3 bins), ammo
      penetration rating vs material thickness → {stop, penetrate(energy loss),
      ricochet(angle), shatter}; spawns decals, particles, sounds, AI noise
      events, damage to destructibles; penetrates soft cover (wood, drywall,
      foliage) and not hard cover (concrete, engine block). Table: Section 142
      (Weapon × Material × Angle = 1,728 rows).
116.3 RECOIL: layered — (a) authored vertical/horizontal pattern per weapon
      (30-shot patterns in Section 142), (b) procedural noise scaled by
      stance/stamina/movement, (c) camera kick vs weapon kick separation
      (weapon kicks more than view), (d) recovery curves (return-to-aim 65%),
      (e) attachment modifiers. Controller mode: aim assist slowdown within 25%
      recoil deviation.
116.4 SPREAD/BLOOM: first-shot accuracy bonus after 250 ms idle; movement
      spread multipliers (walk ×1.4, sprint-fire ×2.4, crouch ×0.8, ADS ×0.4,
      prone ×0.6); hipfire cone visible by dynamic crosshair (option).
116.5 HIT REGISTRATION: server-style authoritative hit resolution even in
      single-player (for future co-op); hitboxes: 15 bones per humanoid (head,
      neck, chest, stomach, pelvis, 2 upper-arms, 2 forearms, 2 thighs, 2
      calves) mapped to damage zones (head ×2.5/torso ×1/limb ×0.7 per S68,
      neck ×2.0 (OPT)); Chaos physics asset per archetype.
116.6 WEAPON CLASSES & FEEL TARGETS (S68 numbers bind; this section binds the
      FEEL implementation): pistol — snappy, low muzzle rise, crisp slide
      animation; revolver — heavy rise, slow hammer, big muzzle light; SMG —
      high RPM chatter, climb + drift pattern; AR/carbine — balanced; LMG —
      weighty ramp-up; shotgun — chest thump, pump cycle, pellet spread with
      per-pellet decals; DMR/sniper — scope breath, bolt cycle, heavy kick,
      bullet-time-free tracer; bow/crossbow (OPT [LOVE]) — draw tension, arrow
      physics with stick/penetrate; flamethrower — fluid fire, fuel
      gauge. Each has: 6 audio layers (mech, crack, body, tail, distant, foley),
      3 muzzle flash variants, shell physics, barrel heat shimmer, ADS
      animation, inspect animation.
116.7 ATTACHMENTS (25): optics (red dot, holo, 2x, 4x, 8x scope, thermal-
      lite), barrels (suppressor, compensator, long), grips (vertical, angled),
      mags (extended, fast), stocks, lasers, flashlights; stats in Section 142.
      Attachment swaps are visible on the model (modular weapon meshes +
      sockets) and change handling (mass ↔ sway).
116.8 FEEL VERIFICATION: 44.2 impact table + per-weapon "feel sheet": video
      capture of 10 s sustained fire, 5 shots ADS, reload — reviewed against
      rubric (kick readability, sound punch, tracer clarity, hit confirmation).
