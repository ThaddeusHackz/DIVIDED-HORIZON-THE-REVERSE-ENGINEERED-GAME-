# SECTION 111 — LOCOMOTION (THE FEEL OF BEING THERE)

111.1 ARCHITECTURE: Mover/CMC-driven capsule with predicted root motion blend;
      animation = Motion Matching (Pose Search) as the base locomotion layer,
      then layered: Stride/Orientation/Slope Warping → Foot IK (two-bone +
      ground-normal alignment + pelvis offset) → Control Rig procedural layer
      (breathing, weight shift, hand IK) → additive hit/recoil/lean layers →
      Physical Animation (Chaos) for gear/ragdoll blend. Inertialization on all
      transitions (no crossfade pops, sub-frame-latency responses).
111.2 MOTION MATCHING DATABASES (Pose Search schemas; capture-class data):
      - Unarmed/relaxed, pistol-ready, rifle-ready, heavy-ready, stealth
        (crouch), injured/limp, swim-surface, swim-dive, wade, slope-heavy,
        stairs (up/down, 3 riser heights), ladder, rope, cover-left/right
        shuffle, vehicle-exit transitions, carrying (body/crate), dog-lead.
      - Coverage per DB: 16 directions × speeds (idle, 0.5, 1, 1.5, 2, 3, 4,
        5, 6 m/s) × turns (in-place 45/90/135/180), starts/stops/pivots,
        ≥ 25 min of clean capture per major DB; total MM data ≥ 4 h.
      - Sources: performance capture (human-supplied studio or optical/inertial
        suit), licensed mocap libraries (verified license), video-to-mocap
        (monocular) with manual cleanup, Epic's free Game Animation Sample
        Project as a technical reference ONLY when license allows use.
        Every clip passes the ANIM VALIDATOR (foot-contact labels, root drift,
        pop test, loop test). Matrix of clips: Section 141.
111.3 SPEEDS (binding): walk 1.6 m/s · jog 3.4 · sprint 6.2 (stamina) ·
      crouch-walk 1.3 · prone-crawl 0.8 (OPT) · swim surface 1.8 · dive 1.4 ·
      wade 1.0–1.6 by depth · ladder 1.1 · mantle auto speed varies by height.
      Accel/decel profiles via curves; turn-in-place at > 70° aim offset.
111.4 FOOT-SLIDE & CONTACT: measured, gated — avg slide <= 1.0 cm/step, max
      <= 3 cm, at every speed/direction/slope in the validator sweep; foot
      lock during pivot; toe-bend IK; heel-strike gait dust/particles by surface.
111.5 CAMERA: first-person (Acts I, III combat) uses full-body awareness with
      head-bob/sway tuned by surface and speed, weapon-inertia lag, breath
      sway, sprint cant, landing impact dip (spring-damper, variable
      amplitude by fall height), and strafing lean; third-person (city
      driving/on-foot option, cover) uses over-shoulder spring-arm with
      collision probe, FOV kick, look-ahead, aim-offset. FP⇄TP switch is
      seamless (no teleport). Camera shake via Camera Modifiers with
      photosens-safe alternates (33).
111.6 LATENCY: input sampled at render-start (late-latching), Reflex/Anti-Lag
      supported; input→photon gate measured with LDAT-class rig or in-engine
      markers: <= 50 ms at 60 FPS, <= 30 ms at 120 FPS on T3/T5.
111.7 STAMINA & BREATH: sprint drains 100 over 9 s, regen 1.8 s delay then
      14/s; breath hold (aim) 6 s; swim breath 40 s dive; HUD diegetic cue
      (breathing audio, vignette) before UI bar.
111.8 FALL & IMPACT: fall damage > 6 m; soft-landing roll (input window 180
      ms) cancels damage up to 10 m; landing MM transitions by speed;
      physics-driven camera dip; dust/foliage displacement on impact.
111.9 NETWORK-READY DISCIPLINE: movement code deterministic at fixed sub-step
      (10.6), so future co-op is not blocked even though not shipping now.
