# v3 alignment — M0 begins; no production milestone passed
Date: 2026-10-14 · Owner upload: 525182ac83a8f7c0764b52296f6d5a7d46dd475d

## 1. Plan: M0 → M4
- **M0:** verified UE workstation, storage, module/CI foundation, license inventory, build/cook/boot/test/capture pipeline. Extend the current skeleton only after checking the latest stable engine and sample compatibility.
- **M1:** evaluate Game Animation Sample Motion Matching/Pose Search and traversal, retarget original MetaHuman Ren, test in a Megascans-dressed Lumen range. Check Mover maturity before choosing it.
- **M2:** four-weapon range with authored handling, penetration, reactions and cover AI; study Lyra GAS/Enhanced Input/Common UI patterns, not a wholesale game copy.
- **M3:** final-quality 1 km² island slice using evaluated Electric Dreams/PCG, licensed surfaces, Water solution, one outpost with three approaches, one mast and wildlife.
- **M4:** 12 original Meridian blocks, study City Sample Mass traffic/crowds, Chaos vehicles and streaming; original dressing/layout and complete steal/chase/escape activity.
- **No M6 final-art expansion** until both slices meet Ω.7, Art Lock, Ω.8 comparisons and S109 budgets. These are gate-driven stages, not promised delivery dates.

## 2. Human asks
[Exact checklist](../state/HUMAN_ASKS.md): H1 workstation/UE/EULA blocks engine execution;
H4 storage blocks production binary workflow. H2 licensed Fab content and H3 MetaHuman
block their sample/content integrations. H5 optional tool budgets default to no spend;
H6 consented voices, H7 independent reviews, H8 signing are later dependencies.
Local tests, original model review, tooling and documentation continue meanwhile.

## 3. Day-0 version / maturity status
Production engine family: UE5. Current source targets **5.6 provisionally**, not “latest”.
No installed UE or official current-release verification is available on this host.
The permitted network endpoints do not include Epic/Fab. Do not infer a current stable
version or maturity from the date, a prompt, or older training knowledge.

| Feature | Maturity on final selected version | Required verification before production use |
|---|---|---|
| Nanite foliage | UNVERIFIED | Official maturity, wind/deformation, overdraw and T3/T5 capture |
| Nanite skeletal | UNVERIFIED | Support restrictions, animation/cloth compatibility and fallback |
| Substrate | UNVERIFIED | Shipping readiness, materials migration and shader/perf costs |
| MegaLights | UNVERIFIED | Shipping readiness, platform support and budget comparison |
| Mover | UNVERIFIED | Stability, traversal/sample compatibility; compare CharacterMovement fallback |
| Motion Matching / Pose Search | UNVERIFIED for locked version | Sample compatibility, databases, retarget and foot-slide test |
| MetaHuman Creator / Animator | UNVERIFIED for locked version | Entitlements, plugin versions, grooming and performance capture |

This is an explicit incomplete day-0 verification table, not a maturity certification.

## 4. Repository/tools
Existing native/DividedHorizon source and tools/unreal build/preparation remain separate
from the playable fallback. Added docs/state/*, tools/build/preflight.py and a local
engine-config template. Use tools/slice for prototype captures/validation and source
packaging. Future production tools/build, tools/test, tools/capture and tools/review
must invoke the real editor/Automation/Gauntlet/Movie Render Graph on H1, not substitute
browser screenshots. [ADR 0004](../adr/0004-editor-automation.md) records the proposed bridge.

## 5. Risks and measurements (S136.3)
| Risk | Measurement / exit evidence |
|---|---|
| R1 engine access | Preflight inventory, installed version, compiler log and actual boot video |
| R2/R11 content scale | Current placeholders counted; block district expansion until slice gates |
| R3/R6/R7/R8 perf/hitches | T1–T5 Insights/pass budgets, shader/streaming traces, physics spike tests |
| R4/R9 animation/uncanny humans | Licensed sample integration; foot sliding ≤1 cm target; human face review |
| R5 integration | Isolated changes, portable regression tests, trusted manual native builds |
| R10 rights | Per-asset license text/hash, provenance; no claim Fab is currently free |
| R12 saves | Existing corruption/replay checks plus future UE migration and soak tests |

## Status and deviations
Browser/raylib work is a playable prototype only; the highest tier has not been delivered.
Batch 02 props/character are placeholders, not compliant final hero assets. No third-party
sample art was imported. No paid resource was provisioned. M0 CI/boot gate remains open.

Performance T1–T5: **not measured**. Blind Bench: **not run**. Art Lock: **not passed**.
See [state](../state/STATE.md), [evidence](../evidence/M0-v3/), and [next tasks](../state/NEXT.md).
