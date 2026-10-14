# Native foundation — source-only progress report

Date: 2026-10-14

## Delivered source

- UE 5.6-targeted `.uproject`, module, Game/Editor targets and input/packaging settings.
- First-person character, sprint stamina, walk/crouch/jump, HUD, visibility-aware interactions, mission completion, versioned progress save and restart confirmation.
- Pause clears held sprint/walk/jump/crouch inputs; leaving the small walk area recovers to the harbor approach.
- Deterministic GLB conversion to a staged 20-section / 92,138-triangle native mesh, with explicit metre-to-centimetre axis conversion and primary collision data.
- Strict shared C++ mesh validation before Unreal component allocation.
- Editor setup for a dedicated map, materials, player start, lighting and prototype water.
- Windows build/cook/package script that checks exit codes and a fresh preparation marker, plus an optional manual self-hosted Windows CI recipe.
- Native source ZIP includes original GLBs/PNGs, generated data, source, tooling, documentation, dependency notices and scoped evidence. It contains no executable, engine binary or cooked content.

## Verified here

| Check | Status |
|---|---|
| JavaScript test suite, now including native conversion | 11/11 passed |
| Portable C++ mission rules and real binary mesh parser | Compiled with g++ C++20 and passed |
| Malformed/truncated mesh, bad counts/schema/indices/NaN rejection | Passed portable tests |
| Deterministic native geometry output and source SHA-256 | Passed |
| Python editor-script syntax | Passed syntax compilation only |
| Original Batch 01 GLBs | Still valid: 9/9, zero errors/warnings |
| Original master prompt | Unchanged and generator check passed |

Evidence: `docs/evidence/native-foundation/export.json`, `portable-cpp-tests.json`, `javascript-tests.txt`.

## Not verified / blocked

**None of the Unreal-dependent source has been compiled in this environment.** The C++ compiler tests deliberately include only `DHMissionRules.h` and `DHMeshFormat.h`, not engine classes.

The following are all pending: UHT and Unreal module compilation; Editor Python API execution; material graph/lighting; native coordinate/normal/face-culling appearance; runtime movement/interactions/save behavior; visibility/collision tests inside Unreal; cooking/staging; the PowerShell script; self-hosted CI; packaging; Windows clean-machine launch and gameplay; GPU performance; signing/security review.

No engine or cloud builder has been installed, licensed or connected. No workflow has been dispatched. No `.exe` was created. Existing screenshots show the browser implementation only.

## Deviations from final brief

Procedural runtime geometry and box collision are a prototype handoff strategy, not production Nanite static meshes or a finished Unreal art pipeline. Rendering is conventional movable-light prototype rendering, not the final Nanite/Lumen/Substrate stack. Input is a minimal legacy mapping, not final rebinding/accessibility. No full-body animations, Motion Matching, combat, AI, city, streaming world or production save system.

## Immediate next gate

Provision an authorized Windows UE5.6 installation or a trusted, self-hosted Windows runner, then run `tools/unreal/build.ps1 -PrepareOnly`. Fix the first actual compiler/editor failure, complete the native checklist, package and perform a clean-machine Windows launch. A packaged receipt must remain `PACKAGED_NOT_LAUNCH_VERIFIED` until launch/playthrough evidence exists.
