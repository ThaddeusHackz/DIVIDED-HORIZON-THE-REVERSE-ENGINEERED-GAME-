# SECTION 113 — FIRST-PERSON BODY & WEAPON HANDLING RIG

113.1 FULL-BODY FP: the player body is one skeletal mesh; FP camera on head
      bone with neck blending; arms rendered via FP-FOV material (separate
      FOV param) so weapons don't distort at 110° FOV; shadow cast by full
      body in VSM; look-down shows legs + feet; vehicle seats show full body.
113.2 WEAPON RIG: per-weapon Control Rig: hand IK (left support hand placement
      per weapon socket), trigger finger curl, magwell hand-to-magazine IK,
      charging handle animation, bolt/slide physics (moving parts driven by
      state machine + springs), safety, shell ejection socket, ADS alignment
      (sight picture centered on reticle with < 0.5 mm error), sight rail
      compatibility for attachments.
113.3 WEAPON SWAY/INERTIA: weapon lags camera with spring-damper (mass-based
      per weapon), sway from breathing (sinusoid + noise), stamina-shaken
      when tired, walking cycle bob synced to footfalls, sprint low-ready
      pose, weapon collision avoidance (raise muzzle near walls: 0.6 m probe).
113.4 RELOAD SYSTEM: tactical vs empty reloads, cancelable phases with
      notifies (mag out / new mag in / bolt release), procedural magazine
      physics (drop mag with Chaos), shotgun shell-by-shell interruptible,
      revolver speedloader, ammo count diegetic (mag weight, HUD optional).
113.5 CLOTHING & GEAR: holsters, slings, straps animated; when sprinting gear
      bounces (physical animation); poncho cloth sim reacts to ADS/aim.
113.6 ANIMATION NOTIFIES: standardized notify set for gameplay/audio/VFX:
      Footstep(L/R,Surface), Foley(Cloth/Gear), ShellEject, MagOut, MagIn,
      BoltRelease, HandOnSurface, Impact, Grunt(type), Breath, Whoosh,
      MotionWarpWindow, SoundDuck, CameraShake(id), RumblePattern(id).
      Validator ensures required notifies exist in every clip class.
