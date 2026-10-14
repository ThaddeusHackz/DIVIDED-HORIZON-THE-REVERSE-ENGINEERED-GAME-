# SECTION 112 — TRAVERSAL: CLIMB, VAULT, MANTLE, SWIM, ZIP, GLIDE

112.1 CONTEXTUAL TRAVERSAL: ledge/obstacle probing (multi-trace +
      sphere sweeps + heightfield queries) classifies: step-up (<0.5 m),
      vault (0.5–1.2 m), mantle (1.2–2.2 m), hang-climb (2.2–3.2 m with
      hang), wall-run-lite (OPT), ladder, pipe-climb, rope-climb, cliff-climb
      (marked climbable surfaces), rappel (island cliffs), window-enter (city).
      Each uses MOTION WARPING to land hands/feet on the detected geometry with
      ≤ 2 cm error; animation sets in Section 141 (traversal clip ledger).
112.2 SWIM & WATER: surface swim, dive, underwater movement (6-DOF), surfacing
      with breath, water entry/exit animations across 12 heights, buoyancy,
      wading drag, hands-touch-water IK, swim wake via RT; boat board/leave.
112.3 ZIPLINE: verlet-sway cable (48), rider hang IK, speed physics with
      slope, dismount on timer/impact; 14 ziplines on island; city cranes (OPT).
112.4 GLIDE/WINGSUIT-LITE (Act I): launch from mast/cliff, lift/drag model with
      tunable glide ratio 3:1, turn banking animation, camera FOV/roll, landing
      flare; cloth wind-coupled; 6 designed glide corridors.
112.5 PARKOUR FLOW (city): sprint-vault chain with momentum preservation;
      slide (crouch-sprint, 1.2 s, gunfire-enabled), roll, wall-jump NOT
      included; stairs/rooftop route validation via nav links; "flow score"
      telemetry in tests (no dead-stops in standard routes).
112.6 CONTEXTUAL INTERACTIONS: doors (physics/animated), windows, gates,
      crates, levers, ATMs, vendors, vehicles, dog petting, fishing — each
      has approach MM + motion-warped interaction clip; interaction prompt
      within 0.25 s of eligibility; no stuck states (QA grid Section 141/148).
112.7 COVER: Smart-Object cover nodes (low/high/corner/window), auto-snap
      when sprinting into cover, blind-fire (inaccurate), lean-peek with
      camera, hand IK to surface, vault-over-cover.
