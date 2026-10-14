# SECTION 115 — ANIMATION PRODUCTION PIPELINE

115.1 SKELETON STANDARD: one master humanoid skeleton (UE5 Mannequin-compatible
      naming) for player/NPCs; IK Rig + Retargeter for all sources; twist/
      corrective bones; fingers full; face via MetaHuman facial rig; animals
      have species skeletons + retarget families (quad-small/quad-large/bird).
115.2 CAPTURE STRATEGY (priority order): (1) human-supplied professional
      mocap (if the owner has studio access) — locomotion/combat/takedowns/
      cinematics; (2) licensed mocap libraries (verify redistribution in
      shipped games); (3) inertial suit capture (ownership by the project);
      (4) monocular video-to-mocap + manual cleanup for long-tail clips;
      (5) procedural/ML-synthesized motion (diffusion motion models) for
      variations — always validated by the same gates and cleaned by animators.
115.3 CLEANUP & QA: automatic: foot-contact detection, sliding score, jitter
      (jerk) threshold, self-penetration test, loop seam test, pose pop test,
      root-motion drift, retarget reach test; manual: 20% sample per batch.
115.4 ANIMATION DATA LEDGER: every clip has an ID (ANM-xxxx), class, frames,
      fps (30 source → 60 runtime resample), notifies, compression (ACL),
      retarget tags, memory budget: total animation memory <= 600 MB (T3)
      via ACL + curve compression; streaming for cinematics.
115.5 CINEMATIC CAPTURE: Sequencer + Live Link; hero scenes use face+body
      capture; crowd/background via MM-driven actors; Movie Render Graph for
      trailers/in-engine cutscenes at 24/30 fps with motion blur and DoF.
115.6 EMOTE/GESTURE SET: 120 conversational gestures × 5 intensity layers as
      additive clips + procedural head/eye saccade; radio/phone/walkie hand
      poses; 60 emotional facial states × 12 visemes blend (Section 141).
115.7 ML ASSISTS (allowed, optional): ML Deformer for muscle/cloth corrective
      shapes on hero characters; learned foot-IK refinement; motion in-betweening
      for transitions; all ML assets version-locked with training data
      provenance in docs/adr.

═══════════════════════════════════════════════════════════════════════════