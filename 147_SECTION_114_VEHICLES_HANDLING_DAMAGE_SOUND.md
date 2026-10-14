# SECTION 114 — VEHICLES: HANDLING, DAMAGE, SOUND

114.1 MODEL: Chaos Vehicles with custom extensions: multi-sample tire model
      (brush-tire: slip-ratio/slip-angle curves per surface × wetness),
      anti-roll bars, limited-slip diff, turbo/boost, automatic gearbox with
      shift logic, engine torque curves per vehicle (12 vehicles, Part V/S69
      numbers bind), aerodynamic drag/downforce, weight transfer, ABS/TCS
      assists (toggle), handbrake drift with sideslip thresholds (S69: drift
      when slip > 0.35), arcade-to-sim slider (difficulty option).
114.2 BOATS/JET-SKI: buoyancy multi-point, hydrodynamic drag, planing, wake
      VFX, propeller cavitation audio, throttle/trim; waves affect handling.
114.3 AIRCRAFT (Act III optional [LOVE]): light plane + helicopter with
      simplified flight model; gunship boss uses scripted path + physics.
114.4 DAMAGE: zone-based: 24 zones per car (Section 143 ledger); deformation
      via mesh morph/vertex-shader crumple + part detach (hood, doors, bumpers,
      mirrors, wheels) via Chaos Geometry Collection or swap-to-damaged SMs;
      glass shatter stages (3); tire burst; fluid leaks; engine smoke →
      fire → explosion (S69 thresholds); damage affects handling (alignment
      pull, power loss, steering slop).
114.5 SOUND: MetaSounds engine model: RPM-layered granular loops (16 layers),
      load/throttle crossfade, turbo spool/whine, gear-shift pops, tire squeal
      per surface, wind noise by speed, interior/exterior filter, collision
      layers by material, horn, radio (S32/S78), doppler on passes.
114.6 CAMERA & FEEL: chase camera with speed-dependent FOV/distance, look-
      behind, cockpit view with full interior model; steering wheel IK with
      hand-over-hand animation; camera shake from road surface; body roll.
114.7 ENTER/EXIT: walk-up MM + door open (motion-warped), carjack variants (4),
      NPC pull-out, passengers, seat shuffle, lean-out drive-by (aim with
      weapon IK), vehicle-weapon mounts on select V11/V12.
114.8 TRAFFIC AI: Mass Traffic with lane-following, signal compliance,
      overtaking, yielding to sirens, panic reaction, parked-vehicle doors,
      collisions with consequences (minor fender-bender chatter + insurance
      comedy hooks).
