# SECTION 117 — MELEE, TAKEDOWNS & CONTEXTUAL CLOSE COMBAT

117.1 MELEE: three weapon classes (M01 Cortesía, M02 Llave de Marisol, M03
      Bastón del Sereno per S68) + unarmed; light/heavy swings with
      anticipation/follow-through; melee hit detection via swept hitboxes on
      weapon mesh (per-frame trace in active window); hit-stop (44.2), camera
      punch, stagger states on enemies (light/heavy/knockdown).
117.2 TAKEDOWNS (28 types, Section 142): silent back, silent front, ledge
      (pull-off), water (drown), cover-over-wall, crouch-stealth from foliage,
      vehicle (window), aerial (from zipline/jump), knife throw, dog-assisted
      (Poncho), and 18 weapon-specific brutal/comedic variants; each
      SYNCHRONIZED: motion warping aligns attacker/victim to 1 cm; dual-actor
      animation sets with notifies for blood/foley/cloth; victim ragdoll
      hand-off blend at finish.
117.3 STEALTH ENTRY RULES: takedown eligibility cones (rear ±50°, front 30°
      only when enemy unaware in SUSPICIOUS <0.35 meter), quiet movement
      MM crouch (footstep noise 0.3×), body hide (drag anim + shadow
      volumes), bodies discovered by patrols → alert (S82).
117.4 CLOSE-QUARTERS SHOTGUN/PISTOL: "shove-and-shoot" contextual (E) moves, 
      enemy grab-as-shield (OPT [LOVE], 5 s), weapon-strip disarm.
