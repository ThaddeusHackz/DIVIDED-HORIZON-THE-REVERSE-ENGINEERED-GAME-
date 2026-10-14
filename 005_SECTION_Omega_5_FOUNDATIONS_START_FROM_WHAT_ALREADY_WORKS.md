# SECTION Ω.5 — FOUNDATIONS: START FROM WHAT ALREADY WORKS

Before writing gameplay code, evaluate and import these free Epic resources
(verify that each exists for your engine version, and log its license in
LICENSES.md). They are starting points to extend and replace, never final
content shipped untouched.
  Ω.5.1 GAME ANIMATION SAMPLE PROJECT → seed for Section 111 locomotion:
        Motion Matching (Pose Search) databases, traversal (vault, mantle,
        hurdle), and hundreds of mocap animations. Retarget to the Ren
        MetaHuman with IK Retargeter. This replaces "build MM v0 from
        scratch" in M1.
  Ω.5.2 CITY SAMPLE → seed for Meridian (Sections 106, 124): procedural
        city-kit approach, Mass crowds, Mass traffic with zone graph,
        drivable Chaos vehicles and the World Partition/HLOD setup. Study the
        architecture, reuse the systems, re-dress everything in the Meridian
        style (Latin-American coastal city, art deco plus brutalist plus
        favela hillside). The original sample city layout must NOT ship as
        Meridian.
  Ω.5.3 ELECTRIC DREAMS / PCG SAMPLES → seed for Section 105 PCG biome
        graphs (rainforest, beach, mangrove, cane fields).
  Ω.5.4 MEGASCANS (Fab) → surfaces, rocks, debris, vegetation, decals:
        primary source for photoreal materials (Section 104).
  Ω.5.5 METAHUMAN → every human: Ren, El Sereno, Marisol, Hands, Tobias, the
        bosses, and crowd archetypes through MetaHuman variation and the
        Section 144 costume ledger. Use MetaHuman Animator (video or
        audio-driven) for facial performance and lip-sync.
  Ω.5.6 LYRA (study only) → Gameplay Ability System, Enhanced Input, Common UI
        and modular game-feature patterns. Copy patterns, not the project.
  Ω.5.7 WATER PLUGIN plus marketplace ocean solutions → Section 128.
  Ω.5.8 ACCEPTANCE: by the end of M1 the project must run a MetaHuman Ren with
        Motion Matching through a traversal course, in a Megascans-dressed
        test range, under Lumen. If that takes longer than about a week of
        agent time, you are rebuilding something Epic already ships.
