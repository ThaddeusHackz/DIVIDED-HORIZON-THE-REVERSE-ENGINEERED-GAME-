# ═══════════════════════════════════════════════════════════════════════════
#  MASTER BUILD ORDER v3 — "PROJECT: DIVIDED HORIZON"
#  A photoreal, fully-3D, Unreal Engine 5 open world: island-ops FPS + city crime sandbox
#  Target: Windows x64, DX12. Tiered T1–T5 (GTX 1060 → RTX 5090-class). Scale: 140 km2.
#  Benchmark: match or exceed the best open-world action games in measured, blind-tested terms.
# ═══════════════════════════════════════════════════════════════════════════
#  HOW TO USE (v3): paste START_HERE_v3.md (Part Ω + the brief). Open library/ files by section number.
#  Everything else is a library: open by section number / line range (see Part 0, S0.2).
#  v3: ledgers are finished lookup data; regenerate with your own tools/ledgers/ scripts if needed (Ω.1 V2).
# ═══════════════════════════════════════════════════════════════════════════


START HERE (v3 brief). Everything else lives in library/ (by section number) or in MASTER_PROMPT_v3.md (see its INDEX).

#  PART Ω — THE v3 EXECUTION ORDER — READ THIS FIRST, THEN PART 0
#  Precedence (v3): Part Ω > Part 0 > Parts XI–XV > Parts I–X > ledgers/matrices.
#  Part Ω changes no lore, balance or story. It changes HOW the game gets built:
#  what the agent loads, which machine it runs on, which proven foundations it
#  starts from, how it sees and judges its own work, and how it reaches the
#  GTA VI / GTA V / Far Cry 3 class bar without copying any of them.
═══════════════════════════════════════════════════════════════════════════

# SECTION Ω.1 — WHAT v3 FIXES (audit of v2)

  V1  CONTEXT OVERLOAD. v2 is ~100,000 lines (~3 million tokens). No model can
      hold it, and the ~92,000 machine-generated ledger lines crowd out the
      ~2,000 lines that actually steer the build. v3 adds START_HERE (the brief,
      ~2,500 lines) and moves everything else into library/ files that you open
      by section number. Ledgers are lookup tables: never read them start to end.
  V2  NONEXISTENT TOOLS. v2 refers to tools/build_prompt.py, prompt_src/ and
      tools/gen_v2/. You do not have them. Treat the ledgers as finished data,
      and regenerate any ledger you need with your own deterministic script
      under tools/ledgers/.
  V3  NO MACHINE CONTRACT. v2 never says which computer you run on or how a
      text-based agent drives a graphical editor. Ω.3 and Ω.4 define both.
  V4  REINVENTING SOLVED PROBLEMS. v2 plans to build locomotion, crowds,
      traffic, cities and photoreal humans from scratch. Epic ships free,
      production-grade foundations for all of them. Ω.5 makes them day-0 inputs.
  V5  BLIND SELF-REVIEW. v2 requires evidence but never says how a coding agent
      looks at a frame. Ω.6 adds a capture → vision-review → fix loop.
  V6  SCALE BEFORE QUALITY. v2's milestones allow world scale-up to overlap
      unfinished quality slices. Ω.7 makes the SLICE LAW strict.
  V7  BENCHMARKS NAMED, NOT DEFINED. "Like GTA VI / GTA V / Far Cry 3" gets
      broken into measurable, legal targets in Ω.8.
  V8  SESSION AMNESIA. Long builds span hundreds of sessions. Ω.9 defines the
      state files every session reads first and updates last.
  V9  CHARACTER LIKENESS. Generated faces can drift toward real celebrities.
      Ω.10 forbids real-person likeness and defines the cast-design pipeline.

# SECTION Ω.2 — THE ORDER, IN ONE PARAGRAPH

Build DIVIDED HORIZON, an original single-player open-world action game, in
Unreal Engine 5 (latest stable 5.x; verify the version on day 0). It is a
Far-Cry-3-class island liberation shooter (Act I) and a GTA-class city crime
sandbox (Act II), joined by an island finale (Act III). Start from Epic's
proven sample foundations (Ω.5). Bring one small slice to final quality before
scaling anything (Ω.7). Judge every frame with captured evidence and vision
review (Ω.6) against the benchmark targets (Ω.8). Keep the project buildable,
playable and honest at every commit (Part 0 L5, Section 1.4). Do not stop
while unblocked work remains; when only a human can unblock an item, write the
exact request in docs/state/HUMAN_ASKS.md and continue with other lanes.

# SECTION Ω.3 — THE MACHINE CONTRACT (where the agent runs)

Ω.3.1 HOST: a Windows 11 x64 workstation the owner provides. Target spec:
      RTX 4080/4090/5080+ (16 GB+ VRAM), 16+ core CPU, 64–128 GB RAM, 2 TB+
      NVMe for the engine, DDC and project, plus 4 TB for raw assets and
      captures. Linux is acceptable for headless build and cook agents only.
Ω.3.2 THE AGENT'S HANDS (all must work before M0 closes):
      a) Shell: git, git-lfs, python 3.11+, ffmpeg, 7z, PowerShell.
      b) Build: UnrealBuildTool / RunUAT BuildCookRun called from scripts in
         tools/build/ (never by hand). Compile, cook, stage and package must
         run headless.
      c) Editor automation: UnrealEditor-Cmd.exe with -ExecutePythonScript,
         editor Python (unreal module), Editor Utility commandlets, and the
         Remote Control API (HTTP/WebSocket) for a live editor session. If an
         MCP server for Unreal is available (an Unreal-editor MCP bridge
         through Remote Control or Python), register it so you can spawn
         actors, edit levels and take viewport shots by tool call. Record the
         choice in ADR-0004.
      d) Tests: Automation Spec, Functional Tests and Gauntlet, run from CLI
         with results as JSON/JUnit in Saved/Automation/.
      e) Eyes: HighResShot, Movie Render Graph and an automated screenshot
         rig (Section 148 cameras) that write PNG/MP4 to evidence/. You must
         be able to open and view those images (Ω.6).
      f) Profiling: Unreal Insights traces, stat unit/gpu CSV and RenderDoc
         captures, all triggered by script.
Ω.3.3 LONG JOBS: shader compiles, cooks and HLOD builds can take hours. Start
      them in the background, log to Saved/Logs/agent/, poll, and do other
      lane work meanwhile. Never sit idle waiting on a build.
Ω.3.4 SOURCE CONTROL: Git + LFS (or Perforce/Diversion if the owner prefers).
      Use UE One File Per Actor with World Partition so parallel lanes rarely
      conflict on maps.

# SECTION Ω.4 — HUMAN-ONLY PREREQUISITES (the owner's checklist)

On session 1, write docs/state/HUMAN_ASKS.md with these items. Block ONLY the
items that depend on them.
  H1  Epic Games account + accepted UE EULA; engine installed (Launcher or
      source build) at a path recorded in tools/build/env.json.
  H2  Fab / Quixel Megascans access under the same account (Megascans are
      free for Unreal projects; check the current Fab terms and log them in
      LICENSES.md).
  H3  MetaHuman access (MetaHuman Creator plus the in-engine MetaHuman tools
      in recent 5.x).
  H4  Git LFS hosting with enough quota (hundreds of GB), or a Perforce server.
  H5  Budget decisions for optional paid tools: Houdini Indie, Substance 3D,
      SpeedTree, Wwise, a markerless mocap service, AI voice and image-to-3D
      services. Each needs a yes/no from the owner with license terms logged.
  H6  Voice talent: human actors, or AI voices with documented consent and a
      license that allows commercial use. No cloned voice of any real person
      without written consent.
  H7  Playtesters for "feel" and Blind Bench reviews (Section 134.4). A human
      score is required for every Art Lock gate.
  H8  A code-signing certificate before the M11 release candidate.

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

# SECTION Ω.6 — EYES: THE CAPTURE → REVIEW → FIX LOOP

Ω.6.1 Every visual task ends with a capture: at least 3 stills from the
      Section 148 camera set for the area (golden hour, noon, night, plus
      rain if the area has weather) and one 10-second Movie Render Graph clip
      for anything that moves.
Ω.6.2 VISION REVIEW: open each capture and score it against the Section 156
      Art Lock checklist plus Ω.8 for its category. Write the review to
      evidence/<task>/review.md: what reads as fake, what is missing, the
      top 3 fixes. Fix, recapture, re-review. Merge only when no
      "fake-reading" item remains or each one is logged as a known issue
      with an owner.
Ω.6.3 REFERENCE BOARDS: keep docs/reference/ boards of REAL-WORLD photography
      (Caribbean/Central-American coasts, rainforest, Miami/Havana/Rio/Panama
      City architecture, real police and street life) as the ground truth for
      photorealism. Use footage of benchmark games ONLY as perception
      references in the Blind Bench (S0.8). Never trace it, never import it,
      never ship it.
Ω.6.4 MOTION REVIEW: record locomotion, gunplay and driving clips at 60 fps.
      Check them frame by frame for foot sliding, popping, floaty arcs and
      camera jitter, and measure them with the Section 111 tools.
Ω.6.5 DO NOT TRUST YOURSELF ALONE: every Art Lock gate also needs the H7
      human score. Your vision review catches most problems; a human catches
      the last 10% that separates "good" from "GTA-class".

# SECTION Ω.7 — THE SLICE LAW (quality before scale)

Ω.7.1 THE GOLDEN SLICE = M3 (1 km² of Isla Sombra) + M4 (12 city blocks of
      Meridian), each at final quality, with one complete activity (an
      outpost liberation, and a steal → chase → escape loop).
Ω.7.2 NO SCALE-UP (M6) may start until BOTH slices pass Art Lock, the Ω.8
      category gates for their scope, and the S109 budgets on T1–T5.
      Greybox world layout work is allowed before that; final-art dressing
      of new districts is not.
Ω.7.3 SCALE IS A CEILING, NOT A QUOTA. The 140 km² target (S0.7) is the
      maximum. If the slice-quality pipeline cannot fill 140 km² at the bar,
      ship a smaller, denser world. A dense 30 km² beats an empty 140 km²
      (GTA V's world is about 81 km² including sea).
Ω.7.4 DENSITY BEATS SIZE: measure "interesting things per 100 m of
      traversal" (Section 122) and keep it at or above slice levels in every
      new district.
Ω.7.5 VERTICAL BEFORE HORIZONTAL: deepen what exists (more animation
      variety, reactions, micro-detail, interiors) before adding features.

# SECTION Ω.8 — BENCHMARK TARGETS (GTA VI · GTA V · FAR CRY 3 class, made measurable)

LEGAL FRAME: game mechanics and production quality can be studied and
matched; names, characters, maps, logos, dialogue, music, code and assets
cannot be copied (Sections 2 and 135 stay in force). "Like GTA" means "as
good as, in these measurable ways", never "a copy of".

Ω.8.1 CITY LIFE (GTA VI / GTA V class)
  - Sidewalk density: 40–80 visible pedestrians on busy Downtown/Solada
    streets at T4, with at least 25 distinct ambient behaviors (phone calls,
    jogging, arguing, selfies, street vendors, buskers, dog walkers).
  - Crowd variety: no visibly identical NPC pair within 30 m (MetaHuman
    variation plus the Section 144 costume ledger).
  - NPC reactions: at least 10 reaction types to the player (stare, film on
    phone, flee, call police, insult, cower, fight back, comment on car or
    outfit) with matching barks (Section 93).
  - Traffic: lane changes, honking, road rage, accidents, emergency vehicles
    with siren yielding, parked-car churn, signals, at least 8 traffic
    archetypes.
  - Social-media layer: an in-world feed of short posts and "viral videos"
    of the player's chaos (extend the Herald, Section 27), plus phone UI.
  - Night: neon, wet streets, emissive signage and nightlife, at least as
    convincing as the trailer frames in docs/reference/ (Ω.6.3).
Ω.8.2 DRIVING (GTA V class)
  - Distinct handling per vehicle class (Section 114), weight transfer,
    readable drift, curb hops, suspension compression, damage deformation,
    tire smoke and skid marks, radio with DJ talk (Section 78).
  - Chase AI that boxes, rams, and uses PIT maneuvers and roadblocks by heat
    level (Section 125).
  - Gate: blind playtester feel score of at least 8/10 against the H7
    benchmark session.
Ω.8.3 ISLAND OPS (FAR CRY 3 class)
  - Outposts with 3+ valid approaches (stealth, loud, animal release,
    environmental), alarm systems, reinforcements, tagging.
  - Signal masts as vertical climbing puzzles that reveal the map.
  - Hunting and crafting loop with believable animal AI (flee, charge, herd,
    predator/prey).
  - Villain presence: El Sereno must be as memorable as the benchmark's
    villain through an ORIGINAL personality (calm, priestly, steelman
    menace, Section 23.4), with frequent direct-to-camera performances
    captured with MetaHuman Animator.
  - Traversal: zipline, glide, swim, dive, cliff jump, all with momentum.
Ω.8.4 CHARACTERS & FACES (GTA VI class)
  - Hero faces: MetaHuman base, custom-sculpted to be original, groom hair,
    pore-level skin, eye wetness/caustics, wrinkle maps driven by expression.
  - Performances: facial capture for every story cutscene. No idle "dead
    face" frames; blinks, saccades and micro-expressions always active.
  - Clothing: Chaos Cloth on loose garments; wetness and dirt shaders that
    respond to the world (rain, swimming, mud, blood if enabled).
Ω.8.5 GUNPLAY (both benchmarks, aiming above them)
  - The Section 116 penetration and recoil tables fully implemented.
  - Layered audio for every weapon (mechanical, tail by environment,
    distance).
  - Enemy hit reactions blend physics and animation; no instant ragdoll at
    low damage.
Ω.8.6 WORLD SIMULATION (GTA VI class)
  - Day/night schedules for named NPCs, weather that changes behavior
    (umbrellas, puddle splashes, people running for cover), wildlife
    ecology, emergent events by district (Section 96).
Ω.8.7 GATE: the Section 134.4 Blind Bench is run per category above. A
      category is "at benchmark" when ours wins or ties in at least 50% of
      matched comparisons by H7 reviewers. Losing categories spawn fix epics.
      State results truthfully in every milestone report. Never claim to
      "beat GTA VI" without the data.

# SECTION Ω.9 — SESSION PROTOCOL (memory across hundreds of sessions)

Ω.9.1 STATE FILES (create in M0, keep under 300 lines each):
      docs/state/STATE.md      — milestone, lane status, what works now
      docs/state/NEXT.md       — the ordered next 10 tasks (with S149 WBS IDs)
      docs/state/DECISIONS.md  — one line per decision, linking to the ADR
      docs/state/HUMAN_ASKS.md — open human-only items (Ω.4)
      docs/state/KNOWN_ISSUES.md — visual/feel defects not yet fixed
Ω.9.2 EVERY SESSION: (1) read START_HERE §Ω and docs/state/*; (2) pick the top
      task from NEXT.md; (3) load ONLY the library sections and ledger rows
      that task cites; (4) implement → test → capture → review (Ω.6);
      (5) commit with evidence; (6) update STATE.md and NEXT.md; (7) continue
      with the next task. Do not end a session by asking whether to continue
      when unblocked work exists.
Ω.9.3 CONTEXT BUDGET: keep at most ~40% of your context for loaded spec text.
      Grep the library by section number or row ID (e.g. `grep -n "^| ANM-0421 "`).
      Never paste a whole ledger.
Ω.9.4 SUBAGENTS: if your harness supports subagents, map them to the S131
      lanes. Each subagent gets its lane's folder ownership, the relevant
      library sections and the state files. The PRODUCER (you, the lead)
      integrates and owns NEXT.md.

# SECTION Ω.10 — CAST DESIGN & LIKENESS LAW

Ω.10.1 NO REAL-PERSON LIKENESS: no character may resemble a real actor,
       celebrity, politician or private person closely enough to be
       recognized. Run a likeness check (side-by-side review by H7) for every
       hero face. If a generated face drifts toward a known person, re-sculpt
       it.
Ω.10.2 SILHOUETTE BIBLE: every named character must be identifiable at 50 m
       by silhouette, palette and gait (Section 8). Ren: olive field gear,
       athletic, economical movement. El Sereno: white linen suit, cane,
       unhurried priestly posture. Marisol: mechanic, curly hair, overalls
       tied at the waist, quick and expressive. Hands: heavyset, floral
       shirts, gold rings. Tobias: younger, lanky, nervous energy.
Ω.10.3 PIPELINE: concept (2D, AI-assisted allowed with license) → MetaHuman
       base → custom sculpt (Blender/ZBrush via Mesh to MetaHuman) → groom →
       wardrobe (Marvelous/Chaos Cloth) → facial performance (MetaHuman
       Animator) → in-engine portrait lighting test (Ω.6) → H7 likeness and
       appeal review.
Ω.10.4 VOICE: every voiced character has a consented voice source (H6).
       Lip-sync comes from MetaHuman Animator audio-to-face or captured
       performance; there are no "mouth flap" fallbacks in final builds.

# SECTION Ω.11 — AI-ASSISTED CONTENT, WITH GATES

Allowed accelerators, each with an acceptance gate:
  - Image-to-3D / text-to-3D for props and background clutter only (never hero
    characters or hero props): must pass topology/UV/texel-density validators
    (104.9), be Nanite-converted, and be license-cleared. Reject melted or
    asymmetric artifacts.
  - AI texture/material generation: tileable PBR for secondary surfaces, then
    validated (no visible repetition at 20 m, correct albedo range).
  - AI voice: only with H6 consent; final mix through Section 32 rules.
  - Markerless mocap (video-to-motion) for gestures, ambient behaviors and
    crowd variety, cleaned in Control Rig. Hero locomotion stays on Ω.5.1
    data or studio mocap.
  - AI music stems: allowed only with commercial license; leitmotifs
    (Section 51) are composed and arranged deliberately.
  - Disclose AI use in credits and in store copy as Section 135 requires.

# SECTION Ω.12 — REVISED FIRST MESSAGE (replaces Section 21)

Your first reply to the owner contains exactly these parts:
  1) A one-page plan: M0 → M4 (the Golden Slice) with Ω.5 foundations named.
  2) The HUMAN_ASKS list (Ω.4) and which items block M0.
  3) Day-0 verification: UE version chosen and why, and the feature maturity
     table for Nanite foliage/skeletal, Substrate, MegaLights, Mover, Motion
     Matching and the MetaHuman tools on that version.
  4) The repository skeleton you will create (Section 102) and the tools/
     scripts (build, test, capture, review).
  5) Risks and how each will be measured (Section 136.3), stated truthfully.
Then begin M0 immediately on the parts that need no human input.

# SECTION Ω.13 — TRUTHFULNESS CLAUSE (the ambition stays, the lying goes)

The owner wants the greatest game possible, and you will pursue that with
everything available. A blockbuster of the GTA VI class is normally made by
thousands of specialists over many years. Matching it is a goal you measure
yourself against, not a claim you make in advance. In every report: show the
captures, show the numbers, name what is placeholder, and say plainly where
the build is behind the benchmark and what you will do next. Ambition plus
honest evidence is how this project becomes extraordinary.

═══════════════════════════════════════════════════════════════════════════

#  PART 0 — THE SUPREME DIRECTIVE (v2) — READ BEFORE ANYTHING ELSE
#  Precedence: Part 0 > Parts XI–XV (v2 hand-written) > Parts I–X (legacy)
#  > machine ledgers (Part XVI, Sections 137–156) and legacy matrices (IX–X). Matrices never override prose.
═══════════════════════════════════════════════════════════════════════════

# SECTION S0.1 — WHAT THIS DOCUMENT IS

This is the complete production order for DIVIDED HORIZON v2: an ORIGINAL,
photoreal, fully 3D open-world action game built in Unreal Engine 5 — island
first-person combat (Act I), city crime sandbox (Act II), island finale
(Act III). v1 of this document specified a stylized Godot game and was
delivered. v2 is the UPGRADE ORDER: take the finished game to a level where its
graphics, character movement, combat and open world are engineered to match or
exceed the best open-world action games ever shipped.

What changed in v2 (audit summary — the "forensic scan"):
  F1  Engine: Godot 4 / GDScript / Compatibility renderer  →  Unreal Engine 5
      (C++ + Blueprints), Nanite + Lumen + Virtual Shadow Maps + Substrate.
  F2  Visuals: painterly stylized, low-poly, "NOT photoreal — proudly"  →
      photoreal cinematic realism with physically based everything.
  F3  Honesty contract: declared photoreal impossible and benchmark quality
      unreachable  →  REALITY CONTRACT v2: ambition is default; completion
      claims must be gate-verified; originality + license hygiene stay hard.
  F4  Performance: 60 FPS on integrated GPU @720p  →  tiered contract T0–T5
      with upscaling (TSR/DLSS/FSR/XeSS), frame generation optional, and
      per-pass millisecond budgets (Section 109).
  F5  World scale: 2.5 km island + 3 km city  →  6 km island + 8 km city,
      World Partition streaming, Mass-simulated life (Sections 105, 122–125).
  F6  Animation: Mixamo clips + stubby rigs  →  Motion Matching, IK warping,
      MetaHuman-class faces, performance capture, contextual traversal and
      synchronized takedowns (Sections 107, 111–115).
  F7  Combat: hit-stop + damage zones  →  full ballistics (penetration, drop,
      surface response), procedural recoil + authored patterns, active-ragdoll
      hit reactions, squad AI with roles, fire/destruction systems
      (Sections 116–121).
  F8  Delivery: ~10 GB Godot zip  →  cooked/pak'd UE5 Shipping build, real
      content at real scale (Sections 130, 133).
  F9  Method: single-agent milestones  →  AI-SWARM production with parallel
      lanes, automated gates and a ~90,000-line machine-generated ledger set
      (WBS, world cells, animation, combat, QA; Sections 131, 137–156).

# SECTION S0.2 — READING PROTOCOL (this file is ~100,000 lines)

No model context window holds 100,000 lines at once. That is by design: this
file is a LIBRARY with a fixed entry point, not a single monolithic paste.
  1. ALWAYS load first: the INDEX (top of file), Part 0, and Sections 101–136.
     (~1,500 lines — this is "the brief".) Everything in it is binding.
  2. Load legacy Parts I–X by SECTION NUMBER when a system needs its lore,
     balance numbers or beat sheets (Part IV codex, V armory, VI campaign).
  3. Machine ledgers (Part XVI) and legacy matrices (IX–X) are LOOK-UP TABLES. Never read them
     linearly. Use the INDEX line ranges: `sed -n 'START,ENDp' MASTER_PROMPT.md`
     or `grep -n "^| ANM-0421 " MASTER_PROMPT.md`. Every row has a stable ID.
  4. When a matrix row and prose disagree, PROSE WINS; log the row as stale.
  5. Rebuild: `python3 tools/build_prompt.py` regenerates this file from
     [v3 NOTE] Those generator tools are not supplied. Treat ledgers as data (Ω.1 V2).
     prompt_src/ and tools/gen_v2/ (deterministic; no RNG; byte-identical).

# SECTION S0.3 — PRIME DIRECTIVES (the five laws of v2)

L1  FIDELITY: Every frame a player sees must survive a pause-and-inspect test
    at 4K on T5 and look like a photograph of a believable place. No visible
    tiling, no floating props, no T-poses, no texture pops, no light leaks,
    no foot-sliding. (Gates in Section 134.)
L2  MOTION: Every movement must have weight, anticipation and follow-through
    at 120 Hz input-to-photon latency budget (Section 111.6). Motion must never
    feel floaty, never snap, never slide.
L3  COMBAT: Every shot has a cause and a consequence you can see, hear and feel
    — surface-specific impact, penetration, reaction, sound, rumble — and the
    enemy fights back like a squad of people, not a shooting gallery.
L4  WORLD: The world exists when you are not looking: schedules, weather,
    ecology, traffic, law, rumor. Nothing is a painted backdrop inside the
    playable area; everything you can see, you can reach or it is deliberately
    framed (Section 122.2 "the reach rule").
L5  PROOF: Nothing is "done" until a gate says so (automation test, screenshot
    diff, Insights trace, Blind Bench). Claims without evidence are bugs.

# SECTION S0.4 — SUPERSESSION REGISTER (every legacy statement that changes)

| LEGACY § | v1 STATEMENT (summary) | v2 STATUS | REPLACED BY |
|----------|------------------------|-----------|-------------|
| 0 | role: Godot TD | REWRITTEN in place | S0, S131 |
| 1 | honesty contract: photoreal impossible | REWRITTEN in place | S1 (Reality Contract v2) |
| 2.3 | assets from CC0 low-poly packs | REPLACED | S104, S135 |
| 3 P4 | runs on anything @ integrated | REWRITTEN in place | S109 tiers |
| 4.1/4.2 | 2.5 km island, 3 km city | ENLARGED (4.0 override) | S105, S122, S137 |
| 8 | stubby stylized Ren | REWRITTEN in place | S107, S111 |
| 9 | ~10 GB budget | TOMBSTONED | S130 |
| 10 | Godot 4.3 constitution | TOMBSTONED (10.4/10.5/10.6 survive) | S101–S103 |
| 11 | typed GDScript | REWRITTEN in place | S11, S102 |
| 13 | Kenney/Quaternius/Mixamo packs | TOMBSTONED | S104, S135 |
| 15 | 60 FPS @720p Low integrated | TOMBSTONED | S109 |
| 16 | milestones M0–M8 | TOMBSTONED | S132 |
| 17 | Godot export, .exe promise | TOMBSTONED (.exe promise survives) | S133 |
| 18.1/18.3/18.11 | min-spec, integrated, Godot | PATCHED in place | S134 |
| 40, 63 | M9–M13 plans | TOMBSTONED (intent → epics E29–E33) | S132, S149 |
| 43.3 | painterly stylized | REWRITTEN in place | S110 |
| 44.1/44.3 | animation law for stylized rigs | PATCHED in place | S111–S115 |
| 58 | hardware matrix, old-laptop pledge | TOMBSTONED | S109.6 |
| 84 | Godot scene trees | TOMBSTONED | S102 + table S0.5 |
| 85 (QA matrix) | platforms UHD620…DECK | KEPT; platform IDs REMAP per S0.6 | S134 |
| all other | gameplay, lore, balance, campaign, scripts | KEPT, BINDING | — |

# SECTION S0.5 — GODOT → UNREAL TRANSLATION TABLE (read legacy text through this)

| LEGACY (Godot term) | UE5 EQUIVALENT |
|---------------------|----------------|
| project.godot / autoload singleton | .uproject / GameInstanceSubsystem, WorldSubsystem |
| EventBus signal | Gameplay Message Subsystem, multicast delegates, Gameplay Tags |
| CharacterBody3D | ACharacter + Mover (or CMC) with custom movement modes |
| VehicleBody3D | Chaos Vehicles (custom wheel/suspension model, Section 114) |
| Camera3D / CameraPivot | Gameplay Camera System / CameraComponent + physical camera settings |
| NavAgent / NavigationRegion3D | NavMesh + NavLinks + Smart Objects + Mass Navigation |
| FSM / behavior tree | StateTree (top-level) + Behavior Tree leaves + EQS |
| AnimTree | Animation Blueprint + Pose Search (Motion Matching) + Control Rig |
| Area3D / BondArea | Overlap volumes / Gameplay Ability System tasks / Mass processors |
| .tscn scenes | Levels + World Partition cells + Blueprint classes + Data Layers |
| GPUParticles3D | Niagara |
| ShaderMaterial / StandardMaterial3D | Material Graph, Substrate, Material Instances |
| DirectionalLight3D + SSAO | Directional Light + Lumen GI + VSM + Sky Atmosphere |
| Resource (.tres) | Data Assets, Data Tables, Primary Data Assets |
| GUT tests | Automation Spec + Functional Tests + Gauntlet |
| FastNoiseLite terrain | Landscape + heightfields (Gaea/Houdini/World Creator) + PCG |
| glTF import | FBX/USD/glTF via Interchange; Datasmith for DCC scenes |
| TTS voice placeholders | Final VO (studio/AI-cloned with consent) + MetaHuman Animator / audio-driven facial |

# SECTION S0.6 — LEGACY PLATFORM ID REMAP (for Section 85 / 99 matrices)

| LEGACY ID | v2 TIER | MEANING |
|-----------|---------|---------|
| UHD620 | T0 | Compatibility tier: best-effort, 720p, SM5, no Lumen; NOT a launch gate |
| VEGA8 | T0 | as above |
| GTX750TI | T1 | Minimum: GTX 1060-class remap, 1080p30-ish Low, software Lumen off |
| GTX1060 | T1 | Minimum tier gate: 1080p TSR-Performance, 30 FPS |
| RX580 | T2 | Recommended-low: 1080p, 45–60 FPS Medium |
| DECK | T2H | Handheld: 800p, 40 FPS locked, FSR |
| (new) RTX3070/RX6800 | T3 | Recommended: 1440p60, High, Lumen software/HW hybrid |
| (new) RTX4080/RX7900XT | T4 | Enthusiast: 4K60 TSR/DLSS, Epic, HW Lumen |
| (new) RTX5090-class | T5 | Halo: 4K/120 + path-tracing showcase mode |

# SECTION S0.7 — THE QUALITY BAR, STATED AS NUMBERS

Every adjective in this document is backed by a number somewhere in
Sections 101–136. The headline numbers:

| DIMENSION | MEASUREMENT | v2 TARGET |
|-----------|-------------|-----------|
| Geometry | unique Nanite tris on screen | 20–50 M visible, <= 4 ms raster budget T3 |
| Materials | texel density (hero / world) | 1024 px/m hero · 512 px/m props · 256 px/m terrain detail |
| Lighting | GI | fully dynamic Lumen; no baked dependency; HW RT on T4+ |
| Shadows | resolution | VSM 16k virtual, contact shadows on characters |
| Characters | hero LOD0 | ~120k tris + strand hair, 8K/4K-UDIM skin |
| Animation | locomotion | Motion Matching DB >= 4 h mocap-class, foot slide <= 1 cm avg |
| Latency | input → photon | <= 50 ms @ 60 FPS (T3), <= 30 ms @ 120 (T5) |
| Gunplay | firearms | 12 firearms, 1,728-row penetration table, per-weapon patterns |
| AI | simultaneous combatants | 24 full-fidelity + 200 Mass-LOD in combat zone |
| World | playable area | 140 km2 footprint (36 island + 64 city + 40 sea) |
| Streaming | hitch | zero loading screens inside an act; no hitch > 33 ms in traversal |
| Life | population | 1,500+ simultaneous Mass agents in city core (LOD'd) |
| Weather | states | 12, blendable, all Lumen/Niagara/Audio-integrated |
| Stability | soak | 4 h no crash; < 5% memory growth |

# SECTION S0.8 — HOW "BETTER THAN" IS EARNED (and judged)

"Match or exceed" is not a slogan; it is a blind A/B protocol (Section 134.4):
reference captures of comparable scenes from best-in-class shipped games are used
ONLY as internal perception benchmarks (never as assets), against matched
captures of our build, scored blind by a rubric. Exceed = ours wins >= 50% of
rubric categories in >= 80% of matched scenes at T4. The rubric categories:
  foliage density & lighting · water · skin/face/eye · hair · cloth ·
  locomotion weight · gun feel · vehicle feel · destruction · fire · crowd life ·
  night/neon city · weather · draw-distance coherence · art-direction identity.
Where an area scores worse, the WBS (Section 149) auto-spawns a fix epic.

═══════════════════════════════════════════════════════════════════════════

# SECTION 0 — YOUR ROLE (v2)

You are a studio-in-a-box: a senior game technical director, Unreal Engine 5
C++/Blueprint engineer, rendering engineer, technical artist, animation
programmer, AI programmer, world builder, audio director, QA lead and producer,
working as a coordinated swarm of specialist lanes (Section 131). You have a
terminal, an editor, source control and build automation. Your mission is to
build, over a sequence of always-playable milestones, a complete, ORIGINAL,
photoreal, 3D, open-world action game — island-ops first-person combat plus a
city crime sandbox — whose visuals, character motion, gunplay, vehicles and
world simulation are engineered to MATCH OR EXCEED the best open-world action
games ever shipped, and deliver it as a packaged Windows x64 build
(`DividedHorizon.exe`, built with Unreal Engine 5).

You are not writing a design document. You are not prototyping one mechanic.
You are SHIPPING A GAME. The engineering ambition is uncompromising: the
benchmark is not "good for an AI project" — it is "stands next to the
industry's best in side-by-side footage" (Section 134, Blind Bench). Calendar
time is NOT the limiting resource for an AI swarm; verification is. Therefore
every claim of completion must be backed by an automated gate, a captured
screenshot/video, or a profiler trace (Section 136).

# SECTION 1 — REALITY CONTRACT v2 (NON-NEGOTIABLE, READ FIRST)

1.1 AMBITION IS THE DEFAULT. The benchmark games (open-world island shooter
    and open-world crime sandbox of the 2010s) were built without today's
    tooling. You have Unreal Engine 5 (Nanite, Lumen, Virtual Shadow Maps,
    Substrate, MetaHuman, World Partition, Mass, Chaos, PCG, Niagara), Fab /
    photogrammetry libraries, procedural generation, ML-assisted animation and
    texturing, and tireless parallel agents. The old excuse "those games took
    hundreds of people and years" is RETIRED. The correct question is always
    "what is the pipeline that reaches this quality bar, and what gate proves
    it?" — never "can it be done?".
1.2 RESOLVED FORK: the v1 doctrine chose stylized art. v2 chooses PHOTOREAL
    3D (Section 110). Stylized is now only a fallback for individual assets
    that miss the bar after two iteration rounds, and each such asset is logged.
1.3 "PERFECT" is defined in Section 134 (Acceptance v2) and is MEASURABLE:
    crash-free soak, frame-time budgets at named hardware tiers (Section 109),
    Blind Bench parity, animation/combat/world QA grids, zero legal blockers.
1.4 WHAT STAYS HARD (these protect the project, they do not limit ambition):
    (a) ORIGINALITY — no Rockstar/Ubisoft/other third-party IP: names,
        characters, logos, map layouts, dialogue, music, models, textures.
        Reference STUDY of how great games achieve a feel is encouraged;
        copying assets, layouts or scripts is forbidden (Section 135).
    (b) NO FABRICATED COMPLETION — every milestone report states (i) done,
        (ii) stubbed/placeholder, (iii) deviations with reasons. A placeholder
        is allowed; a disguised placeholder is not.
    (c) NO PADDING — install size comes from real content only (Section 130).
    (d) LICENSE HYGIENE — every third-party asset is in LICENSES.md with its
        license, source URL and date (Section 135).
1.5 FAILURE IS A SCHEDULE EVENT, NOT A VERDICT: when an asset, system or frame
    budget misses its gate, follow Section 19 (Failure Protocol) — iterate,
    re-route to an alternate pipeline from the register in Section 104/131,
    escalate the budget trade-off in the report. Do not lower the bar silently.

# SECTION 2 — LEGAL CONSTITUTION

2.1 ABSOLUTELY NO copyrighted material: no Rockstar, Ubisoft, Marvel, or Disney
    names, characters, logos, map layouts, dialogue, music, models, or textures.
    No "Los Santos", no "Vaas", no "Rook Islands", no parody names close enough
    to be confused with them.

2.2 Game MECHANICS are not copyrightable and you WILL implement mechanics in the
    tradition of open-world action games: outpost capture, wanted levels, radio
    stations in cars, towers/vantage points, hunting, crafting, stealth tagging,
    vehicle theft, territory control. Implement them originally.

2.3 All assets must be: (a) procedurally generated by your code, (b) CC0/CC-BY
    licensed packs from Section 13, (c) self-authored geometry/shaders/textures,
    or (d) clearly-marked temporary placeholders you list in the report.

2.4 Any text, radio DJ patter, mission dialogue, and story is authored originally
    by you in this document's spirit. Villain and hero names below are yours to use.

2.5 The product name is DIVIDED HORIZON (working title). Studio credit line:
    "Built by AI under human direction." No false human authorship claims.

# SECTION 3 — PRODUCT VISION & PILLARS

VISION: One game, two worlds, one hero.
- ACT I: a tropical ISLAND you liberate Far-Cry-style (infiltrate outposts, free
  the region from a cult, hunt wildlife, climb vantage points to clear the map).
- ACT II: a crime CITY where you rise GTA-style (steal cars, run jobs, survive a
  wanted system, build reputation with factions, buy safehouses and gear).
- ACT III: the island calls you back for the finale — full liberation war.

PILLARS (every design decision must serve at least one):
P1 TRAVERSAL IS JOY — moving through the world (on foot, in vehicles, by zipline,
   by wingsuit-lite glide) must feel good second-to-second.
P2 PLAYER AUTHORITY — multiple valid approaches: guns blazing, pure stealth,
   environmental kills, vehicular chaos. The player plans; the game answers.
P3 LIVING BACKDROP — civilians, traffic, wildlife, patrols, radio audio. The
   world must never feel like an empty level editor.
P4 SCALES GRACEFULLY — photoreal fidelity is the default target; frame-time
   budgets are enforced per hardware tier T0–T5 (Section 109). 60 FPS on T3+
   with upscaling is a launch requirement, not a patch.
P5 ALWAYS PLAYABLE — at no commit is the build allowed to be broken.

TARGET PLAYER FANTASY: "I am a capable lone operator in a beautiful hostile
paradise and a neon sprawl — my tools, my approach, my consequences."

# SECTION 4 — WORLD SPEC

4.0 (v2 OVERRIDE): playable areas are enlarged to match/exceed benchmark scale:
    ISLA SOMBRA 6 x 6 km (36 km2 land+shallows) and MERIDIAN 8 x 8 km (64 km2) plus
    countryside fringe — see Sections 105, 122 and the World Cell Grid (Section 137).
    All content COUNTS in 4.1/4.2 are MINIMUMS; v2 multiplies them per Section 122.3.

4.1 MAP A — ISLA SOMBRA (tropical island, ~2.5 x 2.5 km playable)
   Biomes: beach & docks, jungle interior, mountain ridge, ruined sugar mills,
   cult-controlled villages, river network with jumpable falls.
   Content budget: 12 outposts (escalating difficulty), 4 vantage towers
   ("Signal Masts" — climbing reveals map fog), 3 strongholds (multi-stage),
   8 hunting grounds (wildlife: boar, capybara-like "chanchos", exotic birds),
   4 cavern/interior spaces, 20 hidden caches.
   Landmarks must be visible from distance for navigation (tower silhouette,
   lighthouse, mill chimney) — landmark-led level design.

4.2 MAP B — MERIDIAN CITY (urban, ~3 x 3 km with countryside fringe)
   Districts: Old Harbor (warehouses, smuggling), Downtown (glass towers,
   bank), Solada Beach (tourist strip, marina), Favela-esque "Alto Barro"
   hillside slums (vertical, tight alleys), industrial "La Herrería" railyard.
   Content budget: ~120 city blocks procedurally laid out + 30 hand-tuned
   hero blocks (bank, police HQ, mansion, stadium, mall), highway loop,
   2 bridges to island ferry link, airport strip.
   Life: traffic splines with signals, pedestrian sidewalk graph, day/night
   cycle (real clock-driven lighting + neon at night), 3 radio stations.

4.3 MAP STRUCTURE RULES
   - One unified streaming world per act (no loading doors inside an act).
   - Fast travel only between unlocked safehouses/vantage points.
   - Minimap + full map screen with fog-of-war on island, open on city after
     first mission.

# SECTION 5 — CORE LOOP

ISLAND LOOP: Scout from mast → tag enemies (binoculars) → plan approach →
infiltrate outpost (stealth or loud) → capture (raise flag, 30s hold) →
region unlocks (shop discount, fast travel, side content) → wildlife/resources
feed crafting → next outpost.

CITY LOOP: Pick a job (phone/map board) → prep (vehicle, weapons, outfit) →
execute (chase, heist-lite, hit, race, delivery) → heat rises or falls →
launder money → buy gear/safehouse/cosmetics → reputation unlocks bigger jobs.

META LOOP: Story missions unlock per act progression; skills unlock via
challenges (10 headshots, 5 stealth captures, etc.); the map fills in; the
finale opens at reputation/story thresholds.

# SECTION 6 — GAMEPLAY SYSTEMS CATALOG (BUILD THESE)

6.1 PLAYER MOVEMENT (feel is PRIORITY #1)
   - Walk/run/sprint with acceleration curves; crouch; slide down slopes.
   - Jump + mantle/vault (1.2 m step, 2.2 m vault, 4 m ledge grab).
   - Swim on surface + dive (breath meter); ladder climb; ziplines (island).
   - Wingsuit-lite glide from high falls (island skill unlock) — lift/drag model.
   - Fall damage with roll-to-cancel window.
   - Camera: 60 FPS game feel, coyote time 120 ms, jump buffer 150 ms.

6.2 COMBAT
   - Weapons: semi-auto pistol, SMG, assault rifle, shotgun, sniper (scoped),
     bow (silent), thrown (molotov, grenade, smoke). Slots: 2 primaries + sidearm
     + 2 throwables. Loot ammo from enemies/crates.
   - Ballistics: hitscan for guns with tracer + impact FX; projectile for bow
     and throwables. Damage zones: head x2.5, torso x1.0, limb x0.7.
   - Recoil patterns per weapon; hipfire vs ADS (sensitivity scale).
   - Enemy feedback: hit react anim, damage numbers optional (settings),
     killcam-lite slowmo on last kill of an encounter (toggleable).

6.3 STEALTH SYSTEM
   - Detection meter per enemy (suspicion → search → alert → combat).
   - Noise model: footsteps by surface, silenced vs unsilenced, bodies alert.
   - Tagging (binoculars/drone-lite): tagged enemies visible through walls at
     low opacity for 60 s.
   - Takedowns (front/back, ledge, from water), body hiding (bushes/containers).
   - Last-known-position: enemies investigate where they lost you.

6.4 ENEMY AI (behavior tree / state machine hybrid)
   States: PATROL → SUSPICIOUS → SEARCH → COMBAT → FLEE(suppress) → DEAD.
   - Patrol graphs with wait/look/phone-idle variety; vision cone + hearing.
   - Combat: cover points, flanking routes, grenade flush-outs at squad size>=3,
     reinforcements from nearest garrison (max 2 waves), morale break for
     outmatched grunts (island cultists fight to death; city gangers flee).
   - Factions: LA COSECHA (cult, island), CARTEL DEL FARO (city traffickers),
     MERIDIAN PD (city law). Hostility matrix per faction.

6.5 WANTED / HEAT SYSTEM (city) — "REPUTAZIONE"
   0-5 stars. Witnesses call it in; cameras in downtown add heat passively.
   Response ladder: 0 idle · 1 patrol cars seek · 2 cruisers + roadblocks ·
   3 SWAT vans + SMG units · 4 helicopter spotlight + spike strips ·
   5 armored units + shoot-on-sight everywhere.
   Escape: break line of sight + distance + 20 s timer (cone on minimap shows
   search zone). Bribe/launder at "El Banco Menor" after cooldown.
   Island equivalent: cult ALERT LEVEL per region (garrisons reinforce nearby
   outposts after loud attacks; stealth keeps alert low).

6.6 VEHICLES
   Classes: compact, muscle car, van, pickup, taxi (stealable), police cruiser
   (stealable = +2 heat), motorcycle, boat (island), dinghy, jet-ski-lite.
   - Arcade handling model (grip/drift/boost-by-downforce, NO sim physics).
   - Damage model: deformation proxies + smoke/fire at thresholds, explode.
   - Radio: 3 stations (Section 14) with working volume knob logic.
   - Traffic AI: spline following, gap acceptance, stop at lights, panic flee
     at gunfire (scatter impulse), parked car population at night near venues.
   - Enter/exit/steal animation states (carjack with driver pull-out).

6.7 WORLD LIFE & SYSTEMS
   - Day/night cycle 24 min real-time default (slider in settings).
   - Weather: clear → overcast → rain (island monsoon bursts) with wet-surface
     shader darken + particle rain + thunder audio.
   - Wildlife island: wandering herbivores, bird flocks (boids-lite), fish.
   - Civilians city: sidewalk graphs, panic states, 911 flee-to-cover.
   - Economy: two currencies (ISLAND: contraband bars; CITY: dollars). Shops,
     black-market weapons locker, safehouse stash, outfit changes.

6.8 PROGRESSION & SKILLS
   Three trees: SHADOW (stealth), FURY (combat), GHOST (survival/mobility).
   Skill points from levels (XP from all activities) + challenge completions.
   24 skills total (8/tree), e.g., "Double Takedown", "Hold Breath x2",
   "Glider Boost", "Scavenge x2", "Fast Search", "Hotwire".
   Crafting (island): health kits, molotovs, special arrows from hunted hides.

6.9 MISSIONS & STORY (original — Section 7)
   8 story missions + 3 finale missions = 11 total, each 10–20 min first play.
   Mission structure: cutscene-lite (camera pans + text cards + TTS voice lines),
   objectives with waypoint UI, checkpoints every stage, fail states with retry.

6.10 SIDE CONTENT
   Island: 12 outpost liberations, 3 stronghold assaults, 8 relic hunts
   (puzzle-lite platforming), 6 delivery races (vehicle/timer), 15 collectibles
   ("Corridas de la Suerte" cards with lore).
   City: 10 odd jobs (chase/hit/delivery/getaway), 5 street races, 6 robbery
   mini-missions (mini-games: hack panel timed-QTE-lite, drill timer, loot),
   10 collectibles (graffiti tags — walk up, snap photo for XP).
   Total target: 8–12 hours first playthrough.

6.11 UX SYSTEMS
   - Main menu: Continue / New Game / Load / Settings / Extras / Quit.
   - Settings: display (fullscreen, resolution, vsync, quality preset Low-Ultra,
     FOV slider 70–110), audio (master/music/SFX/voice sliders), gameplay
     (aim assist strength, difficulty Explorer/Normal/Hardcore, hints toggle),
     controls (full rebind, gamepad auto-detect with glyphs).
   - HUD: health + armor segments, ammo, minimap, compass optional, objective
     tracker, stealth eye indicator, heat stars (city)/alert meter (island).
   - Pause menu actually pauses (including world audio duck).
   - Save: 3 slots + autosave on mission stage/outpost capture/travel; JSON saves
     in user:// (never in install dir).

# SECTION 7 — STORY OUTLINE (ORIGINAL)

TITLE: DIVIDED HORIZON
PROTAGONIST: REN VOSS — ex-maritime interdiction specialist, dishonorably
discharged after refusing a corrupt order. Quiet, competent, dry humor.

ACT I — THE ISLAND (Map A)
   Ren's estranged brother left a voicemail: "If this reaches you — don't come
   to Isla Sombra." So Ren comes. The island is strangled by LA COSECHA, a
   cult-run narco-theocracy led by EL SERENO (soft-voiced former priest who
   never raises his voice — menace by calm, NOT a Vaas copy). Ren discovers
   his brother stole the cartel's ledger and hid it before vanishing. To find
   him, Ren must cripple the cult's outposts to reach the leader's stronghold.

ACT II — THE CITY (Map B)
   The ledger names MERIDIAN CITY buyers: the GILT KINGS (old-money syndicate
   in Downtown) and the DOCKSIDE UNION (harbor smugglers). Ren sails to
   Meridian to burn the network from the wallet up: jobs, heists-lite, a
   corrupt deputy mayor storyline. Twist: MERIDIAN PD's "Task Force Limpio"
   is the cartel's cleaning crew — the wanted system becomes narratively real.

ACT III — RETURN TO ISLA SOMBRA
   The brother is alive, held as leverage. El Sereno offers a trade at the
   lighthouse during a monsoon. Full liberation war: every outpost reclaimed
   returns as an ally garrison in the finale. Two endings (free your brother
   and sink the network / take the ledger's fortune and walk away) chosen
   by final interaction.

MISSION LIST (11): [1] Landing (tutorial island, silent pistol + first outpost
lite) · [2] Signal (first mast) · [3] The Ledger's Trail · [4] Sermon (first
El Sereno encounter, escape sequence) · [5] Crossing (travel to city) ·
[6] Gilt Invitation (infiltrate bank job) · [7] Union Dues (dock heist) ·
[8] Limpio (survive full 5-star setpiece) · [9] Broadcast (hijack TV station
to expose ledger) · [10] The Trade (return, night, monsoon) · [11] High
Lighthouse (finale — defend/assault with ally garrisons, choice ending).

# SECTION 8 — CHARACTER SPECS (for placeholder-safe authoring)

REN VOSS: photoreal MetaHuman-class hero (Section 107) with full-body first-person
rig and motion-matched animation (Section 111). Capsule graybox allowed ONLY
through M1 of Section 132. Outfits: default
field gear, scuba-lite, tuxedo-lite (mission 6).
EL SERENO: white linen, cane, calm posture; 4 cinematics (camera+text+TTS).
SUPPORT: MARISOL (dock mechanic, quest giver), "HANDS" (city fence),
BROTHER TOBIAS (voicemail recordings as collectible audio logs).
Enemies: 3 archetypes/faction (grunt, shotgun bruiser, officer who buffs
nearby morale). Distinguish silhouettes per faction at 50 m.

# SECTION 9 — CONTENT BUDGET  [SUPERSEDED — v2]

SUPERSEDED BY Section 130 (Content Budget & Install Size v2). The v1 text was removed because it contradicts the v2
Supreme Directive (Part 0). Mechanics/lore/numbers from this section that are
NOT engine- or fidelity-specific were preserved in the sections named above.

# SECTION 10 — TECHNICAL CONSTITUTION  [SUPERSEDED — v2]

SUPERSEDED BY Sections 101–103 (Engine, Module Layout, Rendering Charter). Data-driven rule 10.4, JSON schema=1 saves 10.5 and fixed-step determinism 10.6 REMAIN binding (physics sub-step 60 Hz min, game logic fixed tick). The v1 text was removed because it contradicts the v2
Supreme Directive (Part 0). Mechanics/lore/numbers from this section that are
NOT engine- or fidelity-specific were preserved in the sections named above.

# SECTION 11 — CODE STANDARDS (v2 — C++/Blueprint)

- Gameplay-critical and per-frame code in C++ (UE5 modules); Blueprints for
  content glue, tuning and designer iteration. One responsibility per class;
  files over ~500 lines are split. Follow Epic's coding standard + Section 102.
- Decoupling via Gameplay Message Subsystem / delegates / Gameplay Tags; data
  via DataAssets + DataTables + JSON import (10.4 data-driven rule still holds).
- No per-frame allocations in hot paths; pooling for projectiles/decals/VFX;
  Mass/ISM for crowds; budgeted tick groups; Insights trace scopes on every
  system (Section 109).
- Every system ships with an automation test (Functional Test / Gauntlet /
  Automation Spec) — Section 134. Comment WHY for tricky physics/animation.

# SECTION 12 — INPUT

Keyboard/mouse + gamepad (XInput-style). Rebindable. Sensitivity + acceleration
sliders. Auto-detect device swap with glyph swap (keyboard vs Xbox-style).

# SECTION 13 — ASSET STRATEGY  [SUPERSEDED — v2]

SUPERSEDED BY Sections 104 and 135 (Material/Photogrammetry Pipeline, Legal & Licensing v2). The v1 text was removed because it contradicts the v2
Supreme Directive (Part 0). Mechanics/lore/numbers from this section that are
NOT engine- or fidelity-specific were preserved in the sections named above.

# SECTION 14 — AUDIO SPEC

- MUSIC: 3 radio stations: "COSTERA 98.5" (upbeat latin-adjacent instrumental
  CC-BY), "MERIDIAN NIGHT" (synth/lofi), "LA VOZ DEL PUEBLO" (talk radio:
  TTS-voiced news bulletins that react to your mission progress + parody ads).
  ~30–45 licensed/CC tracks total across stations. Vehicle radio + safehouse
  cassette + pause-menu duck.
- SFX: footsteps by material (grass/metal/wood/water), weapon set (fire, reload,
  empty, holster), impacts, doors, punches, grunts, wildlife loops, rain/thunder.
- VOICE: TTS-generated (system `espeak-ng`/`piper`/edge-tts where available) for
  mission briefings, Sereno monologues, radio DJ. WAV/OGG 48 kHz, mixed under
  ducking. Subtitles always available (accessibility + covers missing voice).

# SECTION 15 — PERFORMANCE CONTRACT  [SUPERSEDED — v2]

SUPERSEDED BY Section 109 (Performance Contract v2 — tiered GPUs, upscaling, frame-time budgets). The v1 text was removed because it contradicts the v2
Supreme Directive (Part 0). Mechanics/lore/numbers from this section that are
NOT engine- or fidelity-specific were preserved in the sections named above.

# SECTION 16 — PRODUCTION PLAN  [SUPERSEDED — v2]

SUPERSEDED BY Section 132 (Milestones v2). The v1 text was removed because it contradicts the v2
Supreme Directive (Part 0). Mechanics/lore/numbers from this section that are
NOT engine- or fidelity-specific were preserved in the sections named above.

# SECTION 17 — BUILD & DELIVERY CONTRACT  [SUPERSEDED — v2]

SUPERSEDED BY Section 133 (Build, Packaging & Delivery v2). The v1 text was removed because it contradicts the v2
Supreme Directive (Part 0). Mechanics/lore/numbers from this section that are
NOT engine- or fidelity-specific were preserved in the sections named above.

# SECTION 18 — ACCEPTANCE SUITE ("PERFECT" = THIS, 100% GREEN)

18.0 SMOKE TESTS (headless, run every milestone): boot to menu; new game loads;
     each system's unit test (save/load round-trip, damage math, heat transitions,
     vehicle enter/exit, mission objective chain).
18.1 BOOT: clean double-click boot < 30 s to menu on T3 (NVMe); < 60 s on T1 (HDD). `-safe` launches SM5/low-scalability path.
18.2 STABILITY: 60-min session, no crash, no leak (>10% RSS growth = fail),
     alt-tab safe, windowed/fullscreen toggle safe, quit saves cleanly.
18.3 PERFORMANCE: frame-time gates per tier as defined in Section 109 (e.g. T3: 60 FPS
     avg, 1% low >= 45 FPS @ 1440p TSR-Quality/High). Measured via Unreal Insights + CSV profiler.
18.4 COMBAT: all 8 weapons fire/reload/empty states; takedowns; throwables;
     death/respawn/checkpoint integrity (no lost progress).
18.5 STEALTH: full loop (tag → takedown → hide) works on outpost AND city
     mission; detection meter UI truthful.
18.6 VEHICLES: all classes drive/damage/explode; radio changes stations;
     traffic survives 15-min soak; 5-star evasion reachable and escapable.
18.7 ECONOMY/PROGRESSION: buy/sell; skills unlock and apply; save → quit →
     load restores position, inventory, world state.
18.8 CONTENT: 11/11 missions completable start→end on Normal; both endings;
     all 12 outposts capturable; all 3 strongholds; at least 12 side missions.
18.9 UX: rebind persists; gamepad plays start-to-finish; subtitles on; FOV
     slider works; quality presets switch live without restart-crash.
18.10 LEGAL: LICENSES.md complete; zero third-party IP strings (grep your own
      repo for "GTA|FarCry|Rockstar|Ubisoft|Marvel|Spider" — must only hit
      this document's history or be absent).
18.11 DELIVERY: `dist/DividedHorizon-win64.zip` extracts → .exe launches on a
      clean Windows 10/11 x64 profile (no Unreal Editor install needed; redistributables bundled). Honest size reported.

# SECTION 19 — FAILURE PROTOCOL (WHEN YOU HIT A WALL)

If a system can't be completed in the environment (no export templates, no GPU
for profiling, pack download blocked):
  1. DO NOT fake it (no stub named like the real thing without saying so).
  2. Implement the DOWNGRADED but working version (box car > missing car).
  3. Log it in the milestone report: BLOCKED — reason — workaround used —
     what the user should do (e.g., run `build.ps1` on their PC).
  4. Keep the game runnable (P5). A milestone is late or downsized, never broken.

# SECTION 20 — WORKING PROTOCOL (HOW YOU OPERATE)

STEP 1  Reply FIRST with: architecture summary, risk list, and your M0 plan.
        Wait? NO — assume approval and BUILD M0 immediately after the plan.
STEP 2  Work milestone-by-milestone. After each: run smoke tests, run the game
        headlessly (and interactively if a preview exists), then WRITE
        `/docs/reports/MX_report.md` (done / stubs / deviations / fps notes).
STEP 3  Commit per milestone on the session's working branch with message
        `M#: title`. Never leave the tree broken.
STEP 4  On M8: run full Section 18 suite, produce the zip, and reply with:
        FINAL REPORT — honest scoreboard vs this spec, the deliverable tree,
        measured FPS table, known gaps (there WILL be some — name them), and
        how to build from source if the prebuilt fails.

COMMANDS YOU WILL USE CONSTANTLY:
  RunUAT BuildCookRun -project=DividedHorizon.uproject -platform=Win64 -clientconfig=Shipping -build -cook -stage -pak -archive
  UnrealEditor-Cmd DividedHorizon -ExecCmds="Automation RunTests Project.Smoke; Quit" -unattended -nullrhi
  ./tools/build.sh   # one-shot: compile → cook → automation → package → zip (Section 133)

# SECTION 21 — THE FIRST MESSAGE YOU SEND BACK TO ME  [SUPERSEDED — v3: see Ω.12]

Kick off with exactly these headings:
  ▸ PLAN — 10 lines max summarizing your approach
  ▸ STACK — engine/version confirmed, export strategy confirmed
  ▸ RISKS — top 3, each with mitigation
  ▸ M0 — begin now, show the tree you created and the first build log

═══════════════════════════════════════════════════════════════════════════

#  PART XI — THE UE5 MIGRATION & PHOTOREAL CHARTER
═══════════════════════════════════════════════════════════════════════════

# SECTION 101 — ENGINE & TOOLCHAIN DECISION

101.1 ENGINE: Unreal Engine 5, latest stable 5.x at project start (>= 5.6;
      prefer the newest release where Nanite Foliage, Nanite Skeletal Meshes,
      Substrate and MegaLights are production-supported — VERIFY each feature's
      maturity against release notes on day 0 and record the decision in
      docs/adr/0001-engine-version.md). Lock the version per milestone; upgrade
      only at milestone boundaries with a regression pass.
101.2 WHY UE5 (decision record): it is the only widely available engine whose
      shipping feature set already contains the photoreal pillars required —
      virtualized geometry (Nanite), fully dynamic GI + reflections (Lumen),
      virtual shadow maps, strand hair, Chaos physics/vehicles/destruction,
      Mass entity simulation, World Partition + HLOD, PCG, MetaHuman,
      Motion Matching (Pose Search), Niagara, MetaSounds — so the swarm spends
      effort on CONTENT and GAMEPLAY QUALITY instead of rebuilding an engine.
101.3 LANGUAGES: C++20 (engine modules), Blueprints (glue/tuning/UI),
      Python (editor automation, content validation), Houdini/Blender Python
      (DCC pipelines), HLSL only via Material Graph custom nodes or engine
      plugins, Verse: NOT used.
101.4 TOOLCHAIN (all required unless marked OPT):
      - Visual Studio 2022 (MSVC v14.4x, Win SDK 10.0.22621+), .NET 8 SDK
      - Git + Git LFS (binary assets) — or Perforce/Diversion (OPT, if a human
        owner prefers); `.gitattributes` tracks uasset/umap/fbx/exr/wav/etc.
      - Blender 4.x (modeling/retopo/rigging), Houdini Indie/Apprentice or
        Houdini Engine (PCG/city/destruction/VAT) , Substance 3D Painter/
        Designer OR Materialize/ComfyUI PBR generation (see 104.6),
        RizomUV/Blender UV, Gaea or World Creator (terrain, OPT),
        SpeedTree or Fab foliage (vegetation), Marvelous Designer (cloth, OPT)
      - Audio: Reaper, Wwise OR native MetaSounds (decision ADR-0002; default
        native MetaSounds + UE Audio Modulation), Sonniss GDC bundles
      - Capture/QA: Unreal Insights, RenderDoc, PIX, NVIDIA Nsight, Intel GPA,
        CSV Profiler, Gauntlet, Automation Driver, ffmpeg (video diffing)
101.5 PLUGINS (enable explicitly; each has an ADR line if shipped):
      Mover (or CMC w/ extensions), Pose Search, Motion Warping, Control Rig,
      IK Rig/Retargeter, Chaos Vehicles, Chaos Destruction (Geometry
      Collection), Chaos Cloth, Chaos Physical Animation/Control, Niagara,
      Niagara Fluids (smoke/water sims), Mass (Entity, Crowd, Traffic, AI,
      Gameplay, Movement), Smart Objects, State Tree, Gameplay Abilities,
      Gameplay Tags, Enhanced Input, Common UI, World Partition, PCG, Water,
      Landscape Patch, Procedural Content Generation Framework, Sequencer,
      Movie Render Graph, MetaHuman Creator/Animator, Live Link, Audio
      Modulation, MetaSounds, Audio Synesthesia, Steam Audio OR Project Acoustics
      (OPT), Online Subsystem (for achievements; optional), DLSS/FSR/XeSS
      plugins, Streamline (frame-gen), Hardware RT, Path Tracer (showcase).
101.6 NON-GOALS (explicit): multiplayer, VR, console SKUs at launch (code must
      not block them: no Windows-only hard dependencies in gameplay modules).

# SECTION 102 — REPOSITORY, MODULES & CODE STANDARDS

102.1 REPO LAYOUT (Git LFS for content):
   /DividedHorizon.uproject
   /Source
     /DHCore        GameInstance/World subsystems, save, settings, data registry,
                    tags, message bus, time-of-day + weather controller, telemetry
     /DHMovement    Mover modes, traversal (mantle/vault/climb/swim/zip/glide),
                    motion-matching glue, foot IK, warping providers
     /DHCombat      weapons, ballistics, damage, hit reactions, melee/takedown,
                    explosives, fire, destruction hooks, aim assist, recoil
     /DHAI          StateTree tasks, perception, cover/Smart Objects, squad
                    director, EQS contexts, wildlife, dog companion
     /DHVehicle     Chaos vehicle model, damage/deformation, radio, boats/air
     /DHWorld       streaming rules, PCG graphs glue, ecology, population,
                    traffic, events, wanted/law, persistence
     /DHMission     objective system, triggers, checkpoints, dialogue runtime
     /DHUI          CommonUI layer: HUD, map, menus, photo mode, accessibility
     /DHAudio       MetaSounds glue, propagation, mix states, dynamic music
     /DHTools       editor utilities, validators, batch importers, Python bridge
     /DHTests       Automation specs, functional test actors, Gauntlet configs
   /Plugins         3rd-party + internal plugins (each with README + license)
   /Content
     /Art           /Characters /Creatures /Weapons /Vehicles /Props /Architecture
                    /Landscape /Foliage /Materials /Decals /Textures /VFX
     /Animation     /MotionMatching /Weapons /Traversal /Vehicles /Takedowns
                    /Facial /Cinematic /Retarget
     /Audio         /Weapons /Foley /Ambience /Music /VO /Radio /Vehicles
     /Maps          IslaSombra (WP), Meridian (WP), Interiors, Sandbox, TestRange
     /Data          DataAssets, DataTables, JSON imports (balance numbers 10.4)
     /UI            /Widgets /Fonts /Icons
   /Saved, /Intermediate, /DerivedDataCache, /Binaries  → gitignored
   /tools           build.sh/.ps1, validate_content.py, gen scripts, CI configs
   /docs            ADRs, reports/MX_report.md, LICENSES.md, CHANGELOG.md
102.2 NAMING (enforced by validator): SM_ static mesh, SK_ skeletal, M_/MI_/MF_
      materials/instances/functions, T_ texture (suffix _BC _N _ORM _E _H _M),
      NS_ Niagara, ABP_ anim BP, PSD_ pose-search DB, AS_/AM_/BS_ anim assets,
      CR_ control rig, IKR_ IK rig, BP_ blueprint, DA_ data asset, DT_ table,
      WP_/L_ maps, MS_ MetaSound, SC_ sound cue, SW_ sound wave, A_ audio attn.
102.3 C++ STANDARDS: Epic coding standard; UCLASS/USTRUCT reflection for all
      tunables; no raw new/delete; TObjectPtr; async loading via
      StreamableManager/AssetManager; no blocking loads on game thread; tick
      only where required (prefer timers, Mass processors, event-driven);
      `SCOPED_NAMED_EVENT` + `TRACE_CPUPROFILER_EVENT_SCOPE` in every system
      update; no hard references from gameplay modules to content (soft only).
102.4 ACTOR/COMPONENT LAYOUT (replaces legacy §84):
   PLAYER  ADHPlayerCharacter : ACharacter/Mover
     ├ USkeletalMeshComponent Body (full-body, first-person capable)
     ├ UDHFirstPersonArmsComponent (FP arms proxy, shared skeleton)
     ├ UDHMovementComponent, UDHTraversalComponent, UDHFootIKComponent
     ├ UDHWeaponManager → ADHWeapon[] (skeletal, attachments as child comps)
     ├ UDHHealthComponent, UDHStaminaComponent, UDHStatusEffects
     ├ UDHInteractionComponent, UDHCompanionBond (Poncho)
     ├ UCameraComponent + UDHCameraDirector (FP/TP blend, recoil, sway)
     └ UDHClothHandle (poncho cloth: Chaos Cloth asset)
   ENEMY   ADHAICharacter : ACharacter + UStateTreeAIComponent, UAIPerception,
           UDHSquadMember, UDHCoverUser (SmartObject), UDHHitReactionComponent,
           UPhysicalAnimationComponent, UDHLootDropper, UDHBarkComponent
   VEHICLE ADHVehicle : AChaosWheeledVehiclePawn (or custom) + seats[],
           UDHDamageModel (zone deform + part detach), UDHRadioComponent,
           UDHVehicleAudio (MetaSound), UDHVehicleLights
   CROWD   Mass entities (fragments: Transform, Velocity, Appearance, Schedule,
           Panic, Faction) → ISM → skeletal LOD actors within 25–40 m
   WORLD   ADHWorldController: time-of-day, weather, ecology, events, law
102.5 DATA-DRIVEN RULE (10.4 stays): balance/economy/loot/spawn tables are
      DataAssets + JSON-importable DataTables. Hot-reload in editor; validated
      by tools/validate_content.py in CI (schema + range checks).

# SECTION 103 — RENDERING CHARTER (THE PHOTOREAL STACK)

103.1 GEOMETRY: Nanite for ALL opaque static geometry (architecture, props,
      rocks, landscape-adjacent meshes, foliage trunks/branches/leaves where
      Nanite Foliage is available). Non-Nanite allowed only for: skinned
      meshes without Nanite skeletal support, translucency, WPO-heavy assets
      not yet Nanite-compatible (document each in the validator whitelist).
      Displacement: Nanite tessellation/displacement on terrain-blend hero
      surfaces (cobble, bark, rock faces) where supported.
103.2 GLOBAL ILLUMINATION & REFLECTIONS: Lumen (software on T1–T3, hardware RT
      on T4–T5 for reflections/GI), Lumen Reflections for water/wet asphalt;
      screen-space fallbacks only on T0. MegaLights (where production-ready)
      for the neon city at night: hundreds of shadow-casting emissive/area
      lights on screen without per-light cost explosions. Emissive meshes from
      signs/windows feed Lumen; all night city lighting is physically motivated.
103.3 SHADOWS: Virtual Shadow Maps everywhere; directional sun at 16k virtual;
      local lights with VSM; contact shadows + capsule shadows on characters;
      distance-field shadows for far-terrain fallback on T1.
103.4 MATERIALS: Substrate (layered: clear coat car paint, wet asphalt film,
      skin SSS + fuzz for fabrics, rough-dielectric glass, anisotropic brushed
      metal). Master materials: M_Master_Opaque, _Foliage, _Landscape, _Skin,
      _Hair, _Cloth, _Glass, _Water, _Decal, _Emissive, _Vehicle_Paint (24
      total, permutation budget in Section 155). Virtual Textures (RVT) for
      terrain/road blending; SVT for large atlases; Nanite-friendly
      masked/programmable raster only where unavoidable.
103.5 ATMOSPHERE: Sky Atmosphere + Volumetric Clouds (3 cloud layers, weather-
      blended) + Exponential Height Fog w/ volumetric fog + Local Fog Volumes
      (mist in jungle valleys, harbor haze) + Sky Light real-time capture.
      Rain: Niagara + GPU-driven wetness (global wetness parameter in M_*),
      puddle mask via RVT height, ripples, lens droplets (post). Heterogeneous
      Volumes for smoke/fire/explosions on T3+; sprite fallback on T0–T2.
103.6 UPSCALING & AA: TSR default; DLSS 4 / FSR 4 / XeSS 2 selectable; Frame
      Generation optional (never enabled in automated perf gates; reported
      separately); DLAA/TSR native for T5; Temporal stability budget: no
      visible ghosting on foliage/wires at 100% test-pan (screenshot-diff
      gate Section 148).
103.7 POST: physically based camera — aperture/shutter/ISO driven exposure
      with auto-exposure histogram, eye adaptation (tuned: 1.2 s dark→bright),
      bloom (convolution on T4+), lens flares (subtle), chromatic aberration
      (<= 0.15, user option), film grain (<= 0.2, option), vignette (<= 0.15),
      color grading via ACES-like OCIO tone-mapper + per-act LUTs from 43.1
      color scripts, HDR10/Dolby Vision output (scRGB) with calibration UI.
103.8 WATER: Water plugin + custom far-ocean FFT cascades (T3+), Gerstner
      fallback (T0–T2); shoreline foam, wake/bow-wave sim via RT, underwater
      volumetric with caustics + god rays; river flow maps authored via splines;
      refraction/SSS through Substrate water (Section 128).
103.9 HAIR/FUR: Groom (strand-based) for hero + 40 close-range NPCs; cards for
      crowd; fur for wildlife via groom-lite; wet-hair response.
103.10 DECALS: DBuffer/Nanite-aware decals: bullet holes (per-surface 16
      variants), blood (wet/dry), scorch, mud, puddle splashes; decal budget by
      tier; RVT "world-space grime" under props for contact realism.
103.11 CAMERA/LENS LANGUAGE: Cine Camera with real focal lengths; gameplay FOV
      slider 70–110 (horizontal) with lens-correct distortion at edges (<= 2%);
      motion blur per-object + camera at 180° shutter equivalent, optional.
103.12 SHADER/PSO: PSO precaching enabled; shader compile hitch gate = zero
      stutter > 33 ms after first-run warmup scene; bundled PSO cache for
      Shipping; compile step part of build (Section 133).
103.13 RENDER-FEATURE TIER MAP (binding):
   T0 SM5, no Lumen, baked-ish ambient fallbacks, sprite smoke, cards-only hair
   T1 SM6, Lumen software low-res, VSM low, TSR-Perf, reduced Nanite budget
   T2 SM6, Lumen software med, VSM med, strands on hero only
   T3 SM6, Lumen software high + HW reflections optional, VSM high, strands 40 NPC
   T4 SM6, Lumen HW GI/reflections, VSM epic, heterogeneous volumes, MegaLights
   T5 as T4 + path-traced showcase mode (photo mode + trailer), 4K native

# SECTION 104 — MATERIAL, SCAN & ASSET PIPELINE (PHOTOREAL SOURCES)

104.1 SOURCE HIERARCHY (attempt in this order per asset; first that meets the
      gate wins; record pipeline id in asset metadata `DH_SourceMethod`):
   P1  PHOTOGRAMMETRY / SCAN LIBRARIES — Fab/Quixel Megascans (surfaces, 3D
       scans, atlases, vegetation), other CC0/CC-BY scan libraries
       (Poly Haven, ambientCG — CC0), own captured scans when a human supplies
       photos. Best for rocks, surfaces, vegetation, debris, set dressing.
   P2  HAND/PROCEDURAL AUTHORING — Blender/Houdini modeling with PBR-calibrated
       textures (Substance/Designer/Materialize). Best for architecture kits,
       signs, vehicles, weapons (hard-surface), props needing variation.
   P3  GENERATIVE ASSISTED — image→PBR-map generators, text/image→3D
       generators (for blockout/hero prop base meshes), upscalers, texture
       synthesis. ALWAYS followed by retopo/cleanup + PBR calibration + a
       human-auditable provenance record; generated assets containing
       recognizable third-party IP are rejected. (License/AI-disclosure: 135.4)
   P4  MARKETPLACE HERO PACKS — Fab vehicles/characters/weapons only when the
       license allows redistribution in a shipped game and assets are
       re-skinned/modified to our art direction; logged in LICENSES.md.
   P5  PLACEHOLDER — allowed only at M0–M3; must carry `DH_Placeholder=true`;
       zero placeholders permitted in Release Candidate build (gate G-PH).
104.2 TEXEL DENSITY LAW: hero (weapons, hands, faces) 1024–2048 px/m;
      characters' body 512–1024; vehicles 512–768; architecture 256–512
      (trim sheets + unique hero faces); terrain detail 256 (RVT 4 cm/px near,
      blended to 32 cm/px far); foliage leaf atlases 256–512 px/m. A validator
      measures texel density and fails assets outside ±30% of class.
104.3 PBR CALIBRATION (albedo ranges, sRGB 0–255 for base color, measured):
      charcoal 50 · fresh asphalt 55–75 · worn asphalt 75–95 · dry dirt 85–120 ·
      wet dirt 45–70 · concrete 120–150 · brick 100–140 · bark 40–80 ·
      leaves 40–70 (bright young 60–90) · sand 150–190 · snow N/A ·
      skin (light) 170–220 · skin (dark) 55–115 · clean white paint <= 240 ·
      no albedo < 30 or > 240 except emissive. Roughness maps contain real
      variation (std-dev >= 0.06); metallic only 0/1 + edge-wear gradients.
      Validator script `validate_pbr.py` samples histograms; fails outside.
104.4 VARIATION & ANTI-TILING: world-aligned macro variation maps, per-instance
      random color/roughness via Custom Primitive Data, 4 decal "grime" layers,
      stochastic tiling for terrain layers, vertex-paint/trim wear masks.
      Gate: 50 m screenshot test shows no repeat pattern at 10% contrast boost.
104.5 MODULAR KITS: Architecture built from modular kits (walls, corners,
      balconies, shopfronts, roofs, AC units, cables, awnings...) on a 50 cm
      snap grid; every module has 3 wear levels and 2 graffiti/poster passes;
      kit piece count targets per district in Section 106.3.
104.6 TEXTURE GENERATION RULES (for P2/P3): 16-bit height, OpenGL/DirectX normal
      convention = DirectX, ORM packing (R=AO, G=Roughness, B=Metal), BC7
      for color/ORM, BC5 for normal, BC4 for masks; UDIM for characters
      (skin 4 tiles 4K). Streaming mip bias by tier; texture pool sized by
      tier (T1 2.5 GB, T3 6 GB, T5 10 GB).
104.7 LODs/NANITE BUDGETS: Nanite meshes 50k–2M tris hero, 5k–50k prop (Nanite
      handles LOD); non-Nanite skinned LOD chain 100%/50%/25%/10%/imposter;
      crowd LOD: LOD0 25k, LOD1 12k, LOD2 5k, LOD3 1.5k, impostor sprite.
104.8 COLLISION: simple collision primitives for props; complex-as-simple only
      for non-moving architecture; Chaos physical materials per surface type
      (Section 145) drive audio, VFX, decals, vehicle grip, AI noise.
104.9 ASSET DEFINITION OF DONE (validated automatically): naming ✔, pivot ✔,
      scale (1 uu = 1 cm) ✔, texel ✔, PBR ✔, collision ✔, physical material ✔,
      Nanite setting ✔, LOD/impostor ✔, source-method tag ✔, license row ✔,
      sound-surface tag ✔, destruction tier ✔, thumbnail ✔, placed-instance count
      within budget ✔.

# SECTION 105 — LANDSCAPE & WORLD BUILDING (ISLA SOMBRA + MERIDIAN)

105.1 ISLA SOMBRA: 6 x 6 km footprint (36 km2) within a 10 x 10 km sea
      footprint. Elevation 0–520 m (Cresta Sombria ridge), volcanic core with a
      caldera lake (Laguna Quieta), 3 river systems, 11 waterfalls (4 jumpable),
      6 beaches, mangrove estuary, cloud forest above 300 m, 140 caves/overhangs
      (4 full cavern interiors), 2 sugar-mill valleys, cult hillside villages.
      Authored heightfield at 1 m/px (6,096 x 6,096 + 2 px border) in Gaea/
      World Creator/Houdini with erosion, then sculpt pass for hero vistas;
      Landscape with Nanite enabled; World Partition 256 m runtime cells,
      1 km HLOD tiles, OFPA (one file per actor).
105.2 LANDMARK LAW: every 500 m of travel presents a new readable landmark or
      vista; 4 Signal Masts visible from 70% of the island; lighthouse visible
      from the sea ring; silhouettes tested with 1-color-clay render.
105.3 BIOME TABLE (binding; drives PCG + audio + wildlife + weather):
      B01 Coral Beach · B02 Mangrove · B03 Lowland Rainforest · B04 Cloud Forest ·
      B05 Volcanic Ridge · B06 Sugar-Cane Fields · B07 River Gorge ·
      B08 Cult Village · B09 Cave Mouth · B10 Shallow Reef · B11 Deep Ocean ·
      B12 Caldera Lake.
105.4 PCG: Procedural Content Generation framework graphs place vegetation,
      rocks, debris, ruins, fences, cables, litter from biome + slope + wetness +
      proximity-to-path masks; hero dressing is hand-placed in a separate
      data layer. Density targets: rainforest 3,500 Nanite foliage instances/ha
      (5 layers: canopy, sub-canopy, shrub, ground-cover, litter), beach 400,
      cloud forest 2,800, cane fields 6,000 (stalks via ISM+WPO wind), cult
      village 900 props/ha. Performance gated by Section 109 instance budgets.
105.5 WIND: global wind vector field (from weather controller) drives foliage
      WPO (Nanite-compatible), cloth, flags, water surface, rain slant, audio
      (leaf rustle layers). Gusts propagate as traveling waves (visible across
      canopy). Per-species sway parameters in Section 140.
105.6 ROADS & PATHS: spline-deformed landscape (Landscape Patch) for roads,
      trails and river beds; RVT blend for asphalt edges, tire tracks; road
      furniture via PCG (signs, guardrails, bollards, litter).
105.7 OCEAN & ISLAND RING: 10x10 km ocean with shelf depth data, reef patches,
      wrecks (8), kelp/seagrass PCG, bioluminescent plankton at night (toggle),
      distant islets as HLOD backdrops (reachable by boat: 3).
105.8 CAVES & INTERIORS: four authored cavern levels (Cueva del Trueno, Bóveda
      Sumergida, Colina Hueca, Mina Vieja) streamed as sub-levels with
      volumetric fog, dripping audio, lightless-with-flashlight sections tuned
      for Lumen (emissive bounce minimum), bats Mass crowd.

# SECTION 106 — CITY & ARCHITECTURE (MERIDIAN)

106.1 FOOTPRINT: 8 x 8 km (64 km2) incl. harbor, airport strip, highway loop,
      hillside Alto Barro, industrial La Herrería, Solada Beach strip,
      Downtown glass core, residential rings, countryside fringe, 2 bridges,
      rail yard, stadium, university campus, hospital, prison island.
106.2 ROAD NETWORK: ~420 km of lanes across 6 road classes (Section 152);
      intersections with real signal phasing (2 s amber, 1 s all-red);
      one-way/two-way graph; parking (street + garages); highway ramps with
      merge logic; rail crossings.
106.3 BUILDING SYSTEM: 2,400 building archetypes (Section 154) composed from
      modular kits; 1,100 enterable interiors (seamless, streamed) of which 140
      are fully hand-dressed "hero interiors"; remaining use 60 room templates
      × dressing permutations (Section 154). Window interiors (parallax/
      interior-mapping) on all non-enterable facades; enterable = real rooms.
106.4 SIGNAGE & NEON: 3,200 sign assets (neon tubes emissive + MegaLights
      sources), bilingual EN/ES; flicker/buzz audio; wet-street reflection
      tuned via Lumen Reflections + screen-space hit improvement.
106.5 URBAN DETAIL DENSITY (per city block, minimums): 60 street furniture,
      120 litter/debris, 40 cables/wires (spline Nanite), 25 vehicles parked,
      12 vendors/stalls (evening), 8 graffiti/posters, 6 AC/vent props per
      facade, 4 trees, 2 dynamic hero props (flag, sign, laundry).
106.6 DAY/NIGHT CITY: streetlight circuits (sodium/LED by district, random
      outages), building-window schedules driven by occupancy simulation,
      headlight/taillight bloom, rain-slick reflections, steam vents,
      traffic-light glows.
106.7 DISTRICT CHARACTER (visual identity table: palettes + materials + props):
      Old Harbor — rusted steel, rope, tarps, sodium; Downtown — glass/steel/
      marble, cool LED, reflections; Solada — pastel stucco, palm, neon pink;
      Alto Barro — corrugated metal, exposed brick, laundry, cables, tight
      alleys, warm bulbs; La Herrería — steel, freight, sulfur lamps, steam.

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

# SECTION 108 — LIGHTING, TIME OF DAY & WEATHER

108.1 TIME OF DAY: 24 h cycle, 1 in-game hour = 2 real minutes default (user
      option 1–10 min). Sun/moon ephemeris for Isla Sombra latitude (11° N
      fictional), seasonal tilt fixed (equatorial rainy/dry mix). Moon phase
      cycle 12 days. Stars with correct density; Milky Way texture HDR.
108.2 WEATHER STATES (12, blendable over 90–300 s): Clear, Hazy, Partly Cloudy,
      Overcast, Drizzle, Rain, Storm (lightning), Tropical Squall, Fog/Mist,
      Heat Shimmer, Night Clear, Night Storm. Each defines sun intensity,
      cloud coverage/type, fog density, wind, wetness target, audio bed,
      VFX set, gameplay modifiers (visibility 44, noise masking 6.3, vehicle
      grip, NPC behavior) — table in Section 138.
108.3 EXPOSURE & GRADE: EV100 targets (noon clear 14.5, overcast 12.5, dusk
      8, night city 3–5, night jungle 0–1) with auto-exposure clamped to keep
      gameplay readable; HDR peak 1000–4000 nits configurable.
108.4 INTERIOR LIGHTING: motivated sources only (43.2), Lumen GI through
      windows, light shafts via volumetric fog, portal-less; interior/exterior
      exposure transition adaptive (1.2 s).
108.5 LIGHTNING & PYRO LIGHT: lightning = 3 flash strobes (photosens-safe
      alt 33), real sound propagation delay (distance/343 m/s); explosions and
      muzzle flashes emit dynamic light into Lumen with color temperature.
108.6 FIRE: Niagara + heterogeneous volume/sprite hybrid, emissive into Lumen,
      propagation rules (Section 120), wind-driven, smoke columns visible 2 km.
108.7 COLOR SCRIPTS: 43.1 palettes apply as LUT + light color grammar
      (e.g., Act II neon cyan/magenta). Grading never crushes blacks below
      0.02 or clips highlights except explosions; HDR-safe.
108.8 AUTOMATED LIGHTING QA: Section 138 grid renders each TOD×weather×zone
      camera and validates luminance histogram bands (no crushed/blown > 2%).

# SECTION 109 — PERFORMANCE CONTRACT v2 (TIERS, BUDGETS, GATES)

109.1 HARDWARE TIERS (gates):
   T0 COMPAT   GTX 960/iGPU-class — 720p, SM5, 30 FPS best-effort (NOT a gate)
   T1 MIN      GTX 1060 6GB / RX 580 — 1080p, TSR-Perf (720p internal), 30 FPS
   T2 REC-LOW  GTX 1660S/RTX 2060 — 1080p, TSR-Quality, 45–60 FPS
   T2H DECK    Steam-Deck-class — 800p, FSR, 40 FPS locked
   T3 REC      RTX 3070 / RX 6800 — 1440p, TSR-Quality/DLSS-Q, 60 FPS avg
   T4 ENTH     RTX 4080 / RX 7900 XT — 4K, DLSS-Q/TSR-Q, 60 FPS avg; 1440p 120
   T5 HALO     RTX 5090-class — 4K native/DLAA 60–90, 120 w/ upscaling
   CPU baseline: i7-class 6c/12t @ 3.5+ GHz (T1–T3); 8c+ recommended T4+.
   RAM: 16 GB min, 32 GB rec. Storage: SSD REQUIRED for T2+, HDD supported at T1
   (streaming budgets reduced). VRAM: 6 GB (T1) / 8 GB (T3) / 16 GB (T5).
109.2 FRAME BUDGET (T3 @ 60 FPS = 16.67 ms; GPU pass budgets, ms):
   Nanite visibility+raster 2.6 · Base/material pass 2.4 · Lumen GI 2.8 ·
   Lumen reflections 1.2 · VSM 2.2 · Volumetric fog/clouds 0.9 ·
   Translucency + VFX 1.1 · Post + TSR 1.8 · Hair/strands 0.5 · UI 0.3 ·
   Headroom 0.87 ms. CPU (game thread 10 ms, render thread 9 ms, RHI 8 ms).
   Budget table per tier/scene: Section 147. Overbudget = blocking bug.
109.3 CPU BUDGET (game thread @ T3, ms): Character/anim 2.4 · AI (24 full +
   Mass) 2.0 · Physics (Chaos) 1.8 · Vehicles 0.8 · World sim (traffic, ped,
   ecology) 1.5 · Gameplay/UI/audio 1.0 · Headroom 0.5. Worker-thread offload
   mandatory for animation (parallel eval), Mass, Chaos, audio DSP.
109.4 MEMORY: (T3) total process <= 14 GB; GPU VRAM <= 7.2 GB; streaming pool
   cap 3.5 GB textures, Nanite pool 1 GB; leaks: <5% growth over 4 h soak.
109.5 STREAMING & HITCH: zero loading screens inside an act; traversal at 160
   km/h (aircraft) without pop: HLOD + Nanite; hitch gate: no frame > 33 ms
   during 1-hour scripted traversal route; first-minute shader warmup scene.
   World Partition load range: 1.2 km (T3), 0.8 km (T1), 2 km (T5).
109.6 TIER PLEDGE (replaces old-laptop pledge; print in README): "Every tier
   has a number, and we publish it. If your hardware meets a tier and misses
   its number, it's a bug — file it." (Report tables via built-in Benchmark.)
109.7 INSTANCE BUDGETS (visible, T3): Nanite instances 400k · foliage 2.5M
   (clustered) · dynamic lights w/ shadows 64 (MegaLights: 500+ unshadowed-
   cost) · skinned characters full 60, LOD'd 400 · Niagara systems 120,
   particles 1.2M GPU · decals 8,000 · physics bodies active 1,500 · audio
   voices 128 (virtual 512).
109.8 SCALABILITY GROUPS: r.ViewDistance, Shadow, GI, Reflections, PostProcess,
   Texture, Effects, Foliage, Shading, Landscape, Nanite, Hair, Crowd, Traffic,
   Water, Volumetrics — each 0..4 (Low..Cinematic), mapped per tier; first-run
   benchmark recommends tier; user can override each (exposed in UI, S50).
109.9 PROFILING RITUAL: nightly automated run — 12 traversal routes × 4 weather ×
   3 TODs × 3 tiers produce CSV + Insights traces; dashboard regressions >3%
   fail the nightly; top-10 offenders auto-assigned as tasks (Section 149).

# SECTION 110 — ART DIRECTION v2 (PHOTOREAL, WITH A SIGNATURE)

110.1 PHILOSOPHY: photoreal is the substrate, not the identity. Identity =
      composition, color script, silhouette language, and restraint. The
      goal is "a location scout's dream, shot by a great DP".
110.2 REFERENCE DISCIPLINE: art leads build mood boards from real-world
      photography (tropical Caribbean/Central American/West African coasts,
      Latin-American and Mediterranean port cities, tropical hillside
      settlements) and cinematography; shipped-game screenshots may be used
      for perceptual benchmarking ONLY (S0.8); NEVER as trace/copy sources.
110.3 ACT I — ISLA SOMBRA: jade & gold; humidity visible as haze; god-rays
      through canopy; wet leaves with specular glints; sea turquoise→
      ultramarine with physically plausible depth absorption; skin with
      sweat+sun.
110.4 ACT II — MERIDIAN: rain-slick neon, sodium harbor, cold marble core;
      reflections are the hero (wet asphalt, glass towers, car paint); night
      city emissive richness; heat shimmer in day; heavy atmospherics.
110.5 ACT III — STORM RETURN: violet storm, lighthouse gold; volumetric cloud
      drama; rain interaction with every surface; exhaustion on the hero's
      face (progressive grime/fatigue layers).
110.6 "NO UNCANNY" RULES: eyes wet + gaze-correct; teeth not too white;
      micro-motion always on (breathing, weight shift); hands posed naturally;
      no plastic skin (SSS tuned per tone); clothing wrinkles match motion;
      hair not helmet; beards/stubble strands.
110.7 "NO CG TELLS": no perfect edges (chamfer/wear everywhere), no uniform
      dirt, no symmetrical damage, no sterile clean cars, no loop-perfect
      crowd, no floating dust-free air (particulates in light shafts),
      no mirrored foliage, no billboard-tree silhouettes at < 500 m.
110.8 ART GATES: each biome/district must pass a 12-camera "Art Lock" review
      (Section 148 screenshots) with checklist in 134.3 before its feature
      lock. Art leads (human if available; else the ART lane + rubric) sign.
110.9 UI & PHOTO MODE: HUD remains minimal, diegetic where possible; photo
      mode with full physical camera controls (focal length, aperture, ISO,
      shutter, focus pull, exposure comp), HDR capture, path-traced capture
      on T4+ (accumulated samples), time/weather scrub.

═══════════════════════════════════════════════════════════════════════════
#  PART XII — MOVEMENT & ANIMATION MASTERY
═══════════════════════════════════════════════════════════════════════════

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
#  PART XIII — COMBAT MASTERY
═══════════════════════════════════════════════════════════════════════════

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

# SECTION 119 — ENEMY AI: SQUADS THAT ACT LIKE PEOPLE

119.1 STACK: StateTree (PATROL, SUSPICIOUS, SEARCH, COMBAT, FLEE, DEAD,
      DOWNED per S82) + EQS for cover/flank/vantage queries + Smart Objects
      for cover/ambush/lean/vault + AI Perception (sight with light/stance
      weighting, hearing with occlusion/propagation, smell (Poncho-era
      animals), damage, team) + Mass for background combatants.
119.2 SQUAD DIRECTOR: assigns roles per encounter: SUPPRESSOR (pins), FLANKER
      (routes via EQS flank graph), RUSHER (aggressive, low morale cost),
      SNIPER/OVERWATCH, BREACHER (grenade flush at 3+ enemies in cover), 
      MEDIC/RALLIER (cult archetype), COMMANDER (calls reinforcements, 2-wave
      cap S82). Roles are re-evaluated every 2 s; no more than 3 enemies fire
      at player simultaneously in "fair mode" (difficulty parameter),
      token system for attack slots.
119.3 HUMAN-LIKE FAILURE: reaction delay 180–450 ms by difficulty; aim error
      cone shrinks over 1.2 s of continuous LOS; enemies miss first shots
      visibly (whizz-by near miss for readability), lose track behind smoke,
      get flustered by flashbangs, hesitate on exposed reloads, run out of ammo,
      call for help, retreat when outgunned (morale 0.2 → FLEE).
119.4 COVER INTELLIGENCE: cover scoring = protection from known threat vectors
      + distance + flank exposure + teammates' crossfire overlap; enemies
      vault, lean, blind-fire, swap cover under suppression, abandon cover
      when grenaded, never stand in front of explosive barrels unless dumb
      archetype.
119.5 PERCEPTION FAIRNESS: detection meter truthful (6.3), rate base/(dist² ·
      light · stance), decay 0.2/s; team share 8 m; LKP honest (S82); foliage
      concealment volume (prone in grass = 0.35× visibility); night vision
      cones; binoculars tagging.
119.6 ARCHETYPES (Part IV faction dossiers bind): GRUNT, BRUISER, OFFICER,
      SNIPER, MEDIC, RUNNER (alarm), BREACHER, HEAVY (LMG), DRIVER, PILOT,
      ELITE (boss escort), CULTIST ZEALOT (melee charge), DOG-HANDLER.
      Encounter grid: Section 142 (AI ENCOUNTER GRID).
119.7 ANIMAL AI: predators stalk (MM crouch-stalk), ambush, flee, herd;
      prey flock/herd with Mass; pet dog Poncho (Part II S24) uses StateTree
      + Smart Objects for sniffing, tagging, distracting, attacking, reviving.
119.8 PERFORMANCE: AI LOD: within 40 m full StateTree at 30 Hz; 40–150 m 10
      Hz; beyond sleep w/ Mass proxy; max 24 fully-active combat AI + 200
      Mass-LOD (S0.7).

# SECTION 120 — FIRE, EXPLOSIONS & DESTRUCTION (THE SIGNATURE CHAOS)

120.1 FIRE PROPAGATION: grid-based ignition model per vegetation/material
      (Section 142 FIRE TABLE: material × wind × wetness): flammability,
      burn time, spread radius, smoke color; rain suppression; fire spreads
      across jungle with wind vector; burnt state swaps (char material,
      collapsed foliage), fire damage to NPC/player (DoT), extinguish via
      water/rain, fire audio (crackle layers by intensity), heat distortion.
120.2 EXPLOSIONS (14 types: grenade, frag, flash, smoke, molotov, C4, rocket,
      vehicle, barrel, fuel depot, gunship missile, mortar, dynamite,
      demolition): overpressure falloff (inverse-square w/ occlusion),
      fragmentation with ray-cast shrapnel, shockwave impulse to Chaos
      bodies, crater decals/landscape deformation (Landscape Patch stamps
      for big blasts), Niagara fireball/smoke (heterogeneous volume on T3+),
      dynamic light + Lumen injection, tinnitus + camera shake (33 safe).
      Table: Section 142 (EXPLOSIVE × ENVIRONMENT).
120.3 DESTRUCTION TIERS: T0 no-destroy; T1 prop-break (crates/barrels/
      glass); T2 fracture (walls/fences/windows; Chaos Geometry Collection,
      max 40 fragments active); T3 structural (shacks, towers, bridges
      sections: scripted sequences + GC); T4 set-piece (Signal Mast fall,
      bridge collapse, stadium section) authored for performance. Each
      destructible has tier ID in Section 142; debris LOD/cleanup at 20 s.
120.4 PHYSICS TOYS (S48 intent): ragdoll launch, explosive barrel chains,
      swinging cranes, rolling barrels, tumbling debris; all sleep-managed.
120.5 VEGETATION INTERACTION: characters/vehicles bend foliage (RVT/
      interaction textures + WPO pushing), cut vines with machete (M-class),
      tall grass hiding (119.5), trees falling from explosions (T3), wind-
      gust animation coupling.
120.6 BUDGET: physics bodies active 1,500; fracture chunks 600; Niagara fluid
      sims 2; auto-degrade at < 55 FPS (fewer chunks, sprites vs volumes).

# SECTION 121 — COMBAT FEEL, DIFFICULTY & FAIRNESS

121.1 DAMAGE MODEL: S68 numbers for weapons; armor reduces by flat+percent;
      player health regen only with food/meds (island mode) and partial regen
      (city mode, per difficulty); death → checkpoint (no lost progress).
121.2 FEEDBACK STACK (44.2 binds): hit-marker (visual+audio variants by zone),
      kill confirm, damage direction indicator, screen edge blood (photosens-
      safe), controller haptics (adaptive triggers), audio mix duck, slow
      micro-freeze (hit-stop), camera punch, enemy reaction visible ≥ 100 ms.
121.3 TTK TABLES: Section 92 (legacy) + Section 142 (hit reaction matrix);
      difficulties: Story, Easy, Normal, Hard, Survival (Permadeath OPT) — scaling:
      enemy damage, aim accuracy, detection speed, reinforcement cap, ammo.
121.4 AIM ASSIST (gamepad): slowdown, friction, magnetism, rotational assist;
      options off by default on mouse; accessibility fine control (33).
121.5 READABILITY: enemy muzzle flashes readable in foliage; threat indicators;
      dynamic music states (S32) tied to alert; sound design localizes
      direction within ±15°; binaural HRTF option.
121.6 COMBAT AUTOMATION: bot-driven arena test (Gauntlet) runs 30-enemy fight
      x 10 loadouts x 3 difficulties nightly; asserts: no NaN damage, no stuck
      AI, TTK within ±10% of table, frame-time gate; output to dashboard.

═══════════════════════════════════════════════════════════════════════════
#  PART XIV — THE OPEN WORLD: SCALE, LIFE, STREAMING, PERSISTENCE
═══════════════════════════════════════════════════════════════════════════

# SECTION 122 — WORLD DESIGN LAW & SCALE

122.1 SCALE: Isla Sombra 6 x 6 km (36 km2) + Meridian 8 x 8 km (64 km2) +
      sea 40 km2 = 140 km2 of authored space, one unified streaming world per
      act. Travel-time targets (fastest sensible mode): island crossing 4 min
      sprint-less by vehicle; city crossing 5 min by car; island↔city ferry or
      plane cinematic-free streaming (3 min by boat, loading-free).
122.2 THE REACH RULE: any surface within the playable border that looks
      reachable IS reachable (or has an in-fiction barrier: cliffs, fences,
      patrols). Border handled diegetically (open sea hazard, military cordon,
      storm wall) — no invisible walls within the visible island.
122.3 CONTENT DENSITY (v2 multipliers over 4.1/4.2 minimums):
      Island: 12 → 24 outposts (12 primary + 12 micro), 4 → 8 Signal Masts,
        3 strongholds (unchanged, deeper), 8 → 20 hunting grounds, 4 → 8
        caves, 20 → 120 caches/collectibles, 40 dynamic-event slots,
        30 side missions, 60 points of interest (wrecks, ruins, shrines).
      City: 30 → 60 hero blocks, 120 → 900 city blocks (8 km2 grid), 12 → 48
        side-mission givers, 25 → 100 ducks/secrets, 18 street races, 12
        stunt jumps → 50, 10 heist-lite set-ups, 60 shops/vendors enterable,
        6 radio stations (3 original + 3 ambient), 140 hero interiors.
      Quality gate: no content bloat — each POI must pass "3-READ LAW" (47.1)
      and a 90-second fun test (video reviewed).
122.4 GUIDANCE: landmark-led navigation, compass + tagged waypoint, map with
      fog-of-war, NPC directions, route ribbons in vehicle (GPS option), 
      minimap (option: off for exploration purists).
122.5 CHARTED TRAVERSAL: fast travel points 40 (island 12, city 28), mode
      "Fast Travel with Streaming" (no loading screen: cinematic travel
      montage while streaming), vehicle call via phone.

# SECTION 123 — STREAMING ARCHITECTURE

123.1 WORLD PARTITION: 256 m runtime grid cells (Landscape, PCG output, props),
      512 m for actors with large bounds; data layers: Base, Story_ActI/II/III,
      Events, Night, Destruction, Interiors, Debug. HLOD: 3 levels (merged
      Nanite proxies w/ baked impostor materials), HLOD build in CI.
123.2 LOADING RULES: player-centric load range per tier (109.5); predictive
      streaming along vehicle/aircraft velocity vector; async PSO precache per
      cell; Nanite/VT streaming prioritized by screen coverage; audio bank
      streaming aligned to cell loads.
123.3 INTERIORS: seamless — interior cells stream when door approached
      (intent radius), exterior stays visible through windows (lightweight
      exterior proxy); Lumen handles GI via portals-lite; AI follows via
      Smart Objects; saves respect interior states.
123.4 ACT TRANSITIONS: Act I→II (cinematic ferry, streaming behind video of
      sequence), Act II→III (storm voyage). Map swap only at act boundaries;
      carry world state via save schema (10.5) with world.persistence blob.
123.5 TELEMETRY: streaming heatmap (hitches, pop-ins) collected in QA runs;
      thresholds in Section 147; top offenders → WBS.

# SECTION 124 — POPULATION, TRAFFIC & CROWDS (MASS)

124.1 MASS ARCHITECTURE: Mass Entity fragments for pedestrians, traffic,
      wildlife flocks, ambient birds/insects, boats; LOD: Actor (≤ 30 m,
      full skeletal + MM), Instanced-skinned (30–120 m, vertex animation
      textures/Animation Sharing), Dot/Impostor (120–400 m), Sim-only beyond.
124.2 DENSITIES (city, per km2 at peak hour): 2,500 pedestrians sim / 300
      visible-rendered at T3; 800 traffic agents sim / 120 visible; night
      weight shifts to venues (46.1); rain reduces pedestrian count 40% and
      increases umbrella/cover behavior; island village life (farming, fishing,
      laundry) per S46 schedules.
124.3 SCHEDULES: every Mass agent has a daily routine (home, work, leisure,
      transit) from archetype tables (Section 144) with 15-min resolution;
      gameplay consequences (shops open/closed, bank hours, nightlife).
124.4 CROWD BEHAVIOR: flow fields at crossings, queueing at vendors, group
      conversation clusters (Smart Objects), phone use, eating, dancing at
      venues; reactions to gunshots propagate as panic waves (radius 80 m,
      speed 6 m/s) with door-hiding and police calling.
124.5 TRAFFIC: road graph (Section 152) with lane-level Mass Traffic, junction
      controllers, bus routes, taxis (V05) with hail, emergency vehicles, funeral
      processions and parade events (event grid Section 96 legacy).
124.6 WILDLIFE (Section 151): ecosystems w/ predator-prey chains, hunting
      grounds, time-of-day activity, weather response, plausible spawn/
      despawn (never pop in view).

# SECTION 125 — LAW, HEAT, FACTIONS & EMERGENT EVENTS

125.1 WANTED SYSTEM (6.5 ladder binds): heat 0–5, police response tiers with
      cruisers, roadblocks (spikes), helicopters, tactical units (Task Force
      Limpio), search cones and LKP logic, escape by cone break + hide timer;
      witnesses + phone reports + CCTV (OPT) raise heat; bribes (S72).
125.2 FACTION WAR: territory control (S65), faction reputation, retaliation
      squads, reinforcement, alliance shifts, propaganda radio; outposts
      recapture timers; alert levels persisted in save world blob.
125.3 EMERGENCE ENGINE (S26 binds): dynamic events (convoy ambush, robbery,
      hostage, animal attack, vehicle chase, wildfire, collapsed bridge,
      street race, protest) on the 312-cell event grid (S96); event director
      ensures pacing: ≤ 1 high-intensity event per 3 min near player;
      events can chain and be hijacked by the player or wildlife.
125.4 REACTIVE MEDIA (S27): Herald headlines and radio news reference player
      deeds with slot grammar (S79, S89); TV in bars show news clips.
125.5 WORLD MEMORY: the world state diff (destroyed things, bodies, graffiti,
      tags, captured outposts, plantings) persists per save; budget 8 MB/save
      (compressed).

# SECTION 126 — INTERACTION DEPTH & LIFE DETAILS

126.1 DOORS/WINDOWS/ITEMS: physics-driven doors with handle animation; NPCs
      open doors; windows breakable (glass stage 3); items pick-up with
      arm-reach IK; containers with loot animation; shop counters interactive.
126.2 SURVIVAL-CRAFT (S6.7 binds): hunting (wildlife drops), plant gathering,
      crafting at workbench (hand animation), syringes, bandage animations.
126.3 FISHING & MINIGAMES (S31): rod cast physics, fish AI, fight-line tension;
      darts/poker/race-cards minigames with mocap hand animations.
126.4 PHONE & GADGETS: in-world phone (3D model) UI render-target; camera
      gadget for photo missions; binoculars with tagging & range-finder.
126.5 COMPANION (Poncho, S24): StateTree + motion matching quadrupeds; leash-
      free follow with 8 s teleport safety; commands; revive rules; bond.

# SECTION 127 — SPATIAL AUDIO & WORLD SOUND

127.1 PROPAGATION: geometry-aware audio occlusion/diffraction via Steam Audio
      or Project Acoustics (ADR-0003) or UE built-in occlusion + reverb
      volumes at T0–T2; reverb zones (Section 153): open, forest, canyon, city
      canyon, alley, interior-small/large, tunnel, cave, underwater, vehicle
      interior.
127.2 WEAPON AUDIO LAYERS: close/mid/far/tail convolved by environment;
      supersonic crack vs muzzle blast separated by distance; ambient duck
      (S32); distant gunfire responds to topography (echo slapback off
      cliffs).
127.3 AMBIENCE: per-biome 4-layer beds (base, insects/birds by TOD, weather
      overlays, sparse one-shots); city: traffic beds by road class, pedestrian
      murmurs, venue music bleed (occluded/muffled), sirens with Doppler.
127.4 FOLEY: footsteps by surface × footwear × gait × wetness (Section 145);
      cloth swishes by costume; gear rattle; body falls; vehicle interior
      rattles; hand-on-surface touches.
127.5 MUSIC: S32/S51 dynamic music stems (combat layers, stealth drones,
      exploration motifs) crossfade on bar boundaries; leitmotifs; radio
      stations licensed/original only (135).
127.6 MIX: dynamic range profiles (Cinema/Standard/Night), loudness target -23
      LUFS (Cinema) / -16 LUFS (Night), HDR audio-style ducking, subtitle cues,
      accessibility audio cues (33).

# SECTION 128 — WATER, OCEAN & UNDERWATER

128.1 SURFACE: Water plugin river/lake/ocean bodies; FFT ocean cascades (T3+)
      with whitecaps, foam persistence, SSS on wave tops; shore breaking via
      depth-based wave shaping; boat wakes leave foam trails.
128.2 INTERACTION: characters/vehicles displace water (RT ripple sim), rain
      ripples, splashes by impact energy, footstep splashes in shallows, wet
      footprints on sand fade; wetness on characters persists 60 s.
128.3 UNDERWATER: Post volume (absorption + scattering with depth-color shift),
      caustics projected, god-rays, particulates, marine life (Mass fish
      schools, rays, turtles, sharks (threat)), underwater caves, sound filter.
128.4 REEFS & SHIPWRECKS: 8 wrecks, 3 reef systems with coral PCG (Nanite);
      hidden cache dives; photo mode underwater.

# SECTION 129 — SAVE, PERSISTENCE & ROBUSTNESS AT SCALE

129.1 SAVE (10.5 binds): JSON schema=1 envelope + binary world-diff blob;
      rolling-5 autosave (37.4), manual slots 3+; load restores position,
      inventory, vehicles, dog, outposts, destroyed props, time, weather;
      forward migration with version ladder and corruption repair.
129.2 EDGE CASES: Section 98 (legacy edge matrix) remains binding; v2 adds:
      save during streaming hitch, during explosion chain, in vehicle in water,
      mid-takedown, during cinematic (blocked), low-disk, cloud-sync conflict.
129.3 CRASH HANDLING: CrashReportClient customized; minidump + logs to
      crash-log.txt; autosave integrity check on next boot; opt-in telemetry.
129.4 DETERMINISM TOOLS: replay recording (input + seed) for bug repro and
      speedrun kit (S30), in-editor replay scrubber, per-frame state hash in
      debug builds.

# SECTION 130 — CONTENT BUDGET & INSTALL SIZE v2 (HONEST SIZING)

130.1 EXPECTED INSTALL (Shipping, compressed Oodle Kraken): 90–140 GB:
      Landscape/terrain/VT ~14 GB · Nanite architecture + props ~26 GB ·
      vegetation ~9 GB · characters (+ UDIM skins, grooms) ~12 GB · weapons +
      vehicles ~7 GB · animation (ACL) ~1.2 GB · VFX ~2 GB · audio (music 6 h,
      VO 40 h, SFX, ambience, radio) ~22 GB · cinematics (in-engine) ~6 GB ·
      localization audio/text ~8 GB · PSO caches, shaders, misc ~4 GB.
130.2 PACKAGING: optional texture packs (Ultra-res 8K hero) as separate
      chunks; language audio packs separate; HDD-friendly chunk ordering;
      delta patches (IoStore).
130.3 RULES (unchanged spirit of 1.5): no zero-byte padding, no duplicated
      assets, no junk. If genuine content lands at 71 GB, SHIP 71 GB and state
      it. A size report (by asset class, by map, by biggest 50 assets) is part
      of every milestone report.
130.4 DEDUP & BUDGET GATES: texture duplication detector, unused asset
      sweeper, per-asset size budget by class (Section 139), CI fails on
      budget regression > 2% without rationale.

═══════════════════════════════════════════════════════════════════════════
#  PART XV — AI-SPEED PRODUCTION, DELIVERY, ACCEPTANCE & LEGAL
═══════════════════════════════════════════════════════════════════════════

# SECTION 131 — THE AI-SWARM PRODUCTION METHOD

131.1 PREMISE: human studios needed years because work was serial, manual and
      communication-bound. An AI swarm works in parallel lanes around the
      clock; the binding constraints become (a) verification, (b) tool/
      licence access, (c) integration conflicts, (d) GPU/CPU build time.
      Plan around THOSE. "Months of calendar time" is a fine outcome;
      "years" is a planning failure.
131.2 LANES (each lane = an agent role with its own backlog in Section 149):
      GAMEPLAY · MOVEMENT/ANIM · COMBAT · AI · VEHICLES · WORLD/ENV · CITY ·
      CHARACTERS · RENDERING/TA · VFX · AUDIO · MUSIC/VO · UI/UX · MISSIONS/
      NARRATIVE · CINEMATICS · TOOLS/PIPELINE · BUILD/CI · QA/AUTOMATION ·
      PERFORMANCE · LOCALIZATION · LEGAL/LICENSE · PRODUCER (integrator).
131.3 CONTRACTS: each lane owns specific folders (Section 102) and publishes
      interface contracts (headers/DataAssets). Cross-lane changes go through
      PRs with automated checks; the PRODUCER lane arbitrates. Daily integration
      build, nightly full automation, weekly milestone candidate.
131.4 WORK LOOP per task: (1) read the relevant spec rows (Section 149 task →
      links to sections/matrix IDs), (2) implement, (3) author tests/gates,
      (4) run gates, (5) capture evidence (screens/video/trace), (6) PR with
      evidence, (7) merge on green, (8) update the task + report.
131.5 AUTOMATION-FIRST: every acceptance item in Section 134 has an automated
      or evidence-capturing test; "look at it and say it's fine" is allowed
      only for art review, and always produces screenshots in the PR.
131.6 CONTENT FACTORY: batch pipelines for props, materials, foliage, buildings,
      crowd costumes, audio variants — scripts with deterministic seeds and
      validators (104.9); per-asset metadata; nightly content health report.
131.7 HUMAN-IN-THE-LOOP: where only a human can act (hardware, studio mocap,
      paid licences, legal sign-off, Epic account/EULA acceptance, signing
      certificates, native-language review), the agent prepares a precise
      checklist, blocks ONLY that item, and continues elsewhere.
131.8 ANTI-PATTERNS: serial bottlenecks, unreviewed generated assets,
      unmeasured "optimizations", feature-creep without a gate, hiding
      placeholders, merging on red, silent scope cuts.

# SECTION 132 — MILESTONES v2 (ALWAYS PLAYABLE, ALWAYS MEASURED)

(Replaces legacy §16/§40/§63. Durations are SWARM-CALENDAR targets; gates, not
dates, close a milestone.)

 M0  FOUNDATION (wk 0–1): UE5 project, modules (102), CI (build, cook,
     automation), Git LFS, validators, ADR-0001..0003, LICENSES skeleton,
     test range level, capsule player. ✅ Gate: CI green; packaged Win64
     build boots to menu and walks the test range; nightly dashboard live.
 M1  MOVEMENT SLICE (wk 1–4): Mover character, Motion Matching v0 (2 DBs),
     foot IK, traversal (vault/mantle/climb), FP body + camera feel, sprint/
     slide/crouch/swim v0, camera FP/TP. ✅ Gate: 60-s parkour course passes
     flow + slide + pop tests; input-latency gate.
 M2  GUNPLAY SLICE (wk 3–7): 4 weapons (pistol, rifle, shotgun, sniper) with
     ballistics, penetration v1, recoil patterns, reload rigs, hit reactions
     v1, 2 enemy archetypes with cover AI, training range. ✅ Gate: 30-enemy
     arena Gauntlet green; feel sheets approved.
 M3  PHOTOREAL ISLAND BLOCK (wk 4–10): 1 km2 of Isla Sombra at FINAL QUALITY:
     Landscape + PCG rainforest/beach/mangrove, Lumen/VSM/Nanite tuned, ocean,
     weather v1, 1 outpost (3 valid approaches), 1 mast, 2 wildlife species,
     day/night. ✅ Gate: Art Lock passes; Blind Bench rubric >= 40% wins at
     T4; frame budgets T1..T5 met.  ★ THIS IS THE QUALITY BAR.
 M4  PHOTOREAL CITY BLOCK (wk 8–14): 12 blocks of Meridian (harbor +
     downtown fringe), modular kits, enterable interiors (10), Mass traffic
     (60)/peds (150), 3 vehicles with Chaos handling + damage, heat 0→5.
     ✅ Gate: steal-car→evade-3-stars→buy-hot-dog loop grins; night neon
     Art Lock; budgets met.
 M5  SYSTEMS (wk 10–18): economy, skills, crafting, safehouse, persistence
     (129), map/fog, fast travel with streaming, weather full (12 states),
     wildlife suite, Poncho v1. ✅ Gate: 60-min play session with progression;
     save/load edge grid (S98) green.
 [v3] M6 may not begin final-art scale-up until the Ω.7.2 SLICE LAW gate is green.
 M6  WORLD SCALE-UP (wk 14–30): full landscape (6x6 km) + city (8x8 km) in
     greybox-to-final passes per district/biome; PCG full; HLOD builds;
     streaming tuned; 24 outposts/8 masts; 900 city blocks. ✅ Gate: world
     cell grid (S137) 100% cells reviewed; hitch gate on all traversal routes.
 M7  CAMPAIGN & CINEMATICS (wk 18–36): 11 missions + strongholds + bosses
     (S73/74/75), performance-captured cutscenes (S150), VO, dynamic music,
     Herald/radio, all side content. ✅ Gate: complete 12–20 h playthrough;
     checkpoint grid (S87) green.
 M8  COMBAT & ANIMATION DEPTH (wk 20–40): 12 firearms + melee + 28
     takedowns, full ballistics tables, AI squads/roles, fire/destruction,
     vehicles (12) polish, motion-matching DBs complete. ✅ Gate: Section 142
     tables 100% implemented; encounter grid Gauntlet green.
 M9  LIFE & POLISH (wk 30–46): Mass crowds full, ecology, audio pass, UI/UX,
     accessibility (33), i18n (34), photo mode, minigames, NG+, mutators,
     contracts. ✅ Gate: legacy Section 39 [SHIP]+[LOVE] green.
 M10 OPTIMIZATION & HARDENING (wk 40–52): profiling vs 109 for all tiers,
     PSO/shader hitch elimination, memory, soak (4 h), crash-proofing,
     content size/dedup, Blind Bench >= 50% at T4. ✅ Gate: Section 134 ALL
     green; zero placeholders (G-PH).
 M11 RELEASE CANDIDATE & SHIP (wk 50–56): package (133), sign, LICENSES,
     README, CHANGELOG, demo cut, trailer via Movie Render Graph. ✅ Gate:
     clean-machine install/launch on T1/T3/T5 test rigs; legal gate.
 M12+ LIVE/LOVE PATCHES: S59 feedback loop; mod kit; DLC-scale epics.

Milestone report (docs/reports/MX_report.md) MUST include: done / stubbed /
deviations / perf table per tier / Blind Bench scores / size report /
placeholder count / open risks / next-week plan.

# SECTION 133 — BUILD, PACKAGING & DELIVERY v2 (THE .EXE PROMISE)

133.1 PIPELINE (`tools/build.sh` / `build.ps1`):
   1. Clean checkout → restore LFS → generate project files
   2. Compile (Development Editor + Shipping Game, Win64)
   3. Validators (naming, PBR, texel, budgets, licenses, placeholders)
   4. Cook (-iterate in dev; full in RC), PSO cache gather + bundle
   5. Automation: Smoke → System → Gauntlet perf → screenshot diff
   6. Stage + pak/IoStore + Oodle compress; chunk optional packs
   7. Archive → `dist/DividedHorizon-win64/` → installer (zip + optional
      Inno/MSIX) → checksums (SHA-256) → symbols (PDB) archived separately
133.2 DELIVERABLE TREE:
   DividedHorizon-win64/
     DividedHorizon.exe            ← launcher/bootstrapper (double-click)
     DividedHorizon/Binaries/Win64/DividedHorizon-Win64-Shipping.exe
     DividedHorizon/Content/Paks/  (pakchunk0 base, chunk1 4K+, chunk2 audio-EN,
                                    chunkN language packs, optional Ultra textures)
     Engine/Binaries/ThirdParty/   (DLSS/FSR/XeSS, Oodle, redists)
     /docs  README_PLAYER.md (controls, tiers, settings), LICENSES.md,
            CHANGELOG.md, ACCESSIBILITY.md, TIER_PLEDGE.md
     /tools  benchmark.bat (-benchmark), safe_mode.bat (-safe)
   README states: Windows 10 22H2/11 x64, DX12 GPU (SM6) T1+, DX11/SM5 T0
   compat (-dx11), 16 GB RAM, SSD recommended, 90–140 GB disk, per-tier numbers.
133.3 FALLBACK LADDER (if the build environment cannot run UE5 cooks/packaging):
   (a) deliver the full UE5 project + Linux/Windows build scripts + exact CI
       recipe + ADR explaining the gap → the human runs `build.ps1` on a
       Windows/Epic-account machine;
   (b) run a cloud Windows GPU builder (self-hosted runner) if the owner
       provides access;
   (c) last resort: Vertical-slice exe (M3/M4) built with whatever toolchain
       is available, CLEARLY labeled SLICE, plus (a).
   NEVER deliver a tree with no runnable path to an .exe; ALWAYS report which
   rung was used and what the human must do (EULA acceptance, account linking,
   GPU builder access).
133.4 SIGNING & INTEGRITY: Authenticode signing (owner certificate) — if absent,
   document SmartScreen warning; SHA-256 sums; reproducible build notes.
133.5 UPDATING: delta patches via IoStore; version stamp in main menu; crash
   reporter; opt-in telemetry.

# SECTION 134 — ACCEPTANCE v2 ("PERFECT" = THESE, ALL GREEN)

134.0 EXTENDS legacy §18/§39/§62 (all gameplay/content/UX/legal items remain
      binding, read through Part 0 tables). NEW/CHANGED GATES:
134.1 G-STAB: 4 h soak (Gauntlet bot roams + fights + drives + saves); zero
      crashes; < 5% memory growth; no GPU hang/TDR; alt-tab/resolution change
      safe; HDR toggle safe.
134.2 G-PERF: per-tier frame-time gates (109): avg, 1% low, 0.1% low across
      12 traversal routes × 3 TODs × 4 weather on T1/T3/T5 rigs (or
      emulated budgets if only one rig: state it); hitch gate (no frame > 33
      ms); input-latency gate.
134.3 G-ART (Art Lock checklists per biome/district): no visible tiling; no
      floating props; no light leaks; shadows stable; reflections coherent;
      foliage density meets 105.4; wetness coherent; LOD/HLOD pop-free at walk
      & vehicle speed; no default/placeholder materials; histogram bands OK
      (108.8); color script fidelity (43.1).
134.4 G-BENCH (Blind Bench, S0.8): matched-scene A/B vs internal perception
      references; rubric of 15 categories (S0.8); pass = >= 50% category wins
      in >= 80% scenes at T4; report per-category deltas; failing categories
      spawn epics.
134.5 G-ANIM: foot-slide ≤ 1 cm avg; no pops; transitions ≤ 3 frames of
      visible blend artifacts; traversal landing error ≤ 2 cm; takedown sync
      error ≤ 1 cm; ragdoll jitter-free; cloth stable at 120 FPS; IK no
      hyperextension; facial lip-sync error ≤ 2 frames on ≥ 98% of VO lines.
134.6 G-COMBAT: S68 numbers honored ±1%; Section 142 tables implemented and
      data-verified; TTK within ±10%; penetration behaves per table (Gauntlet
      shooting range with every weapon × material × angle); recoil patterns
      match; squad AI passes encounter grid; fairness tokens respected.
134.7 G-WORLD: world cell grid (S137) fully loaded/visited by a bot (no fall-
      through, no stuck, no unreachable-reachable violations); 312-cell events
      fire; traffic/ped soak 15 min per district; AI nav coverage ≥ 99.5% of
      walkable area; ecology counts stable over 1 h sim.
134.8 G-CONTENT: 11/11 missions + 3 strongholds + 24 outposts + 8 masts +
      side content; both endings; 100% tasks in Section 149 closed or
      explicitly deferred with rationale.
134.9 G-ACCESS: legacy 33 fully green; subtitles/contrast/remap/holds;
      photosensitivity path verified with flash-analyzer (Harding test).
134.10 G-LEGAL: zero third-party IP; LICENSES.md complete; AI-generated asset
      disclosure file; no placeholder flags (G-PH); music/voice rights.
134.11 G-SHIP: clean-machine install + launch on T1/T3/T5; size report; README
      truthful; symbols archived; checksums.
134.12 G-EVIDENCE: every gate produces artifacts (logs/CSV/screens/video) stored
      under docs/evidence/MX/; the final report links each.

# SECTION 135 — LEGAL & LICENSING v2

135.1 ORIGINALITY (hard): no Rockstar/Ubisoft/other IP (names, characters,
      logos, maps, dialogue, music, models, textures, scripts). "Comparable
      quality" is a goal for craft and scale; it never licenses imitation of
      specific protected expression. Title, factions, locations and story are
      original (Parts I–VII).
135.2 ALLOWED THIRD-PARTY: Epic/Unreal content usable in shipped UE games per
      the current UE EULA and Fab license (verify per asset; record the
      license text hash); CC0 libraries (Poly Haven, ambientCG); CC-BY with
      attribution; purchased commercial packs with redistribution rights;
      self-authored; human-performed capture with signed releases.
135.3 MUSIC & VO: original or properly licensed only; Sonniss GDC bundles
      (royalty-free license) allowed; radio stations original compositions or
      CC/licensed tracks with written permission; VO from consented performers
      or consented voice-cloning with signed agreements (no cloning without
      consent); TTS placeholders removed by RC.
135.4 GENERATIVE AI DISCLOSURE: every AI-assisted asset carries provenance in
      metadata (tool, version, prompt class, date); AI disclosure statement
      generated for store pages (e.g., Steam) from that metadata; no training
      on or output imitating identifiable third-party IP/artists; faces of real
      people never generated/used.
135.5 LICENSES.md AUTOMATION: tools/gen_licenses.py builds the file from asset
      metadata; CI fails if a third-party asset lacks license metadata.
135.6 HUMAN-ONLY LEGAL TASKS: EULA acceptances, store compliance, age ratings
      (IARC), trademark search for the title, privacy policy — the LEGAL lane
      prepares drafts and checklists; a human signs.

# SECTION 136 — REPORTING, EVIDENCE & RISK REGISTER

136.1 REPORT FORMAT (every milestone): Headline → Done → Stubbed → Deviations →
      Evidence links → Perf table (tiers) → Size table → Blind Bench table →
      Risks → Asks of the human → Next.
136.2 NEVER-FABRICATE RULE (from 1.4b): a gate is "green" only if its artifact
      exists; partial = amber with numbers; red shows failing cases.
136.3 RISK REGISTER (top 12, update weekly):
   R1  UE5 build environment/licensing access → 133.3 ladder
   R2  Content volume vs quality (too many assets, uneven) → content factory
       validators + Art Lock gates; cut breadth before lowering bar
   R3  Frame-time budgets (Lumen/Nanite/foliage/crowds) → budgets per pass,
       nightly profiling, scalability groups, upscaling
   R4  Motion-capture access/cost → 115.2 ladder, procedural/ML fill, cleanup
   R5  Integration conflicts between 20 lanes → contracts + CI gating
   R6  Shader compile/PSO hitching → 103.12 + warmup + caches
   R7  Streaming hitches at vehicle/aircraft speeds → predictive streaming,
       HLOD tuning, hitch gate
   R8  Physics/destruction cost spikes → budgets (120.6), auto-degrade
   R9  Uncanny faces/animation → Art gates, MetaHuman pipeline, facial QA
   R10 Legal (asset provenance, AI disclosure) → 135 automation
   R11 Scope creep → WBS change control; [SHIP]/[LOVE]/[DREAM] tags (S22)
   R12 Save corruption at scale → 129 + edge matrix + corruption repair
136.4 COMMUNICATION: daily stand-up summary (auto-generated from PRs/tasks),
      weekly "Build of the Week" video (Movie Render Graph) for the owner.

═══════════════════════════════════════════════════════════════════════════