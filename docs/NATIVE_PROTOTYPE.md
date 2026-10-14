# DIVIDED HORIZON — native Unreal prototype foundation

> Historical batch/foundation guide. For the newer compiled raylib Windows combat slice and its verification limits, see [COMBAT_SLICE.md](COMBAT_SLICE.md). The UE5 source remains uncompiled.

**Status: source delivered; Unreal compilation and Windows launch are NOT verified.**

This is the next step after Batch 01, not another art batch and not a finished `.exe`. The browser prototype remains the only implementation that has been run end-to-end here. No screenshot in this repository is presented as an Unreal render.

## What was added

- `native/DividedHorizon/DividedHorizon.uproject` and a real runtime C++ module, plus Game and Editor target rules.
- Source for a first-person `ACharacter`: jog, walk modifier, sprint/stamina, crouch, jump and look controls.
- Native objective selection using range, view direction and a visibility trace. Hut walls block the trace.
- Source for the manifest → ledger → signal → extraction exercise (the three collection steps may be done in any order).
- Native Canvas HUD, pause/resume and a two-press restart confirmation.
- A versioned prototype `USaveGame` slot for objective progress, including invalid-schema/mask rejection. Player position is deliberately not saved.
- Return-to-shore recovery outside the small playable area. This is not swimming or a full physics world.
- A strict portable mesh reader, a deterministic GLB-to-native converter, editor setup, Windows packaging script and manual self-hosted CI recipe.

**Implementation is not verification:** the Unreal-dependent classes, material/map creation and PowerShell packaging script have not been compiled or executed in this Linux workspace.

## Engine baseline and prerequisites

The source baseline is **UE 5.6**. This is a compatibility target, **not a claim that 5.6 is the latest release or a verified production version**. The final engine version still needs a production decision after release-note and feature review.

For the native build, the owner needs:

1. A Windows x64 machine with an authorized UE 5.6 installation and accepted Epic terms.
2. Visual Studio 2022 C++ game-development components and the Windows SDK/toolchain accepted by that UE installation. UnrealBuildTool provides the authoritative compatibility check.
3. Node.js 22.12+ and `npm ci` at the repository/archive root.
4. Adequate disk/RAM and a DX12 GPU for Editor/playtesting. No hardware performance tier has been measured for this prototype.

The workspace has no Unreal installation, Windows host or provisioned cloud builder. The CI workflow below has **not been dispatched**.

## Windows steps

From PowerShell at the repository/archive root:

```powershell
npm ci

# Compile the Editor module and create/save the dedicated prototype map/materials.
.\tools\unreal\build.ps1 -EngineRoot 'C:\Program Files\Epic Games\UE_5.6' -PrepareOnly
```

If preparation succeeds, open `native\DividedHorizon\DividedHorizon.uproject` in the same engine and run the checklist below in Play-in-Editor. **Compilation may expose integration errors that cannot be checked without Unreal; preserve the first failing log rather than assuming this source was already compiled.**

The editor script creates only `/Game/Maps/L_PuertoChico`, `/Game/Prototype/M_DHVertex` and the prototype water material. Existing map/material assets are loaded and preserved rather than silently overwritten. To intentionally rebuild those editor assets, back them up and remove them manually first. A partial failed preparation can leave intermediate assets: inspect the saved failure log and existing graph/map before retrying.

To build a complete Development package:

```powershell
.\tools\unreal\build.ps1 -EngineRoot 'C:\Program Files\Epic Games\UE_5.6' -Configuration Development
```

For a later Shipping test, use `-Configuration Shipping`. A different engine requires `-AllowDifferentEngine` and a deliberate compatibility review; the 5.6 target include order is not automatically upgraded.

The script:

1. Verifies the engine files/version and Node dependencies.
2. Converts the existing validated GLB into staged native mesh/mission data.
3. Compiles the real `DividedHorizonEditor` target via UnrealBuildTool.
4. Runs the full Editor with `prepare_editor.py`; checks a newly generated success marker so an editor exit code of zero cannot conceal preparation failure.
5. Uses UAT `BuildCookRun` to compile, cook the map, stage, pak, archive and include prerequisites.
6. Requires an actual executable and pak content before writing a receipt and SHA-256 inventory.

Default output: `artifacts/DividedHorizon-Win64/`. Deliver the **entire UAT output directory**, not just the `.exe`. A successful script labels its receipt **PACKAGED_NOT_LAUNCH_VERIFIED**. It does not claim a clean-machine launch. No signing certificate is configured; an unsigned build may display Windows SmartScreen warnings.

Logs: `native/DividedHorizon/Saved/Logs/` and `Saved/DHContentPreparationFailure.log`.

## Controls (intended native behavior; engine testing pending)

| Input | Action |
|---|---|
| WASD / mouse | Move / look |
| Arrow left/right | Keyboard turning |
| Left Shift | Sprint while moving; 100 stamina over 9 seconds |
| Left Alt | Walk modifier |
| Left Control | Hold crouch |
| Space | Jump |
| E | Interact when the prompt appears |
| Escape | Pause/resume |
| R, then R within 3 seconds | Confirm resetting this prototype's saved assignment |

Native movement source uses the brief's 1.6 m/s walk, 3.4 m/s jog, 6.2 m/s sprint and 1.3 m/s crouch values. Regen begins after 1.8 seconds at 14 stamina/second. There are no arms/body animations, Motion Matching, vaulting or camera-feel approval. Legacy input bindings are an explicit prototype simplification, not the final remappable input/accessibility system.

The native save slot is `DH_PuertoChico_Prototype_v1` in Unreal's platform save directory. It stores a schema, a three-bit objective mask and extraction state. A normal restart resumes objectives at the harbor approach; it does not restore world destruction or player position. Save errors are reported in the HUD. There is no cloud save, autosave history or migration ladder beyond schema rejection.

## Asset path: no manual glTF importer required for this slice

```sh
npm run native:export
```

This converts the existing `L_PuertoChico_Prototype.glb`, checks its recorded SHA-256, and writes:

- `Content/PrototypeData/world.dhmesh`: **20 material sections, 92,138 triangles**, 12,162,548 bytes.
- `Content/PrototypeData/mission.json`: centimetre coordinates, objectives, spawn, extraction and collision boxes.

These are generated files, excluded from Git but included in the native-source ZIP. Unreal's `DirectoriesToAlwaysStageAsUFS` stages them into the package. Runtime code consumes them through `FFileHelper`, which supports staged UFS/pak files.

The converter maps GLB metres to Unreal centimetres as **X = −glTF Z, Y = glTF X, Z = glTF Y**. Normals are transformed without the 100× scale. Linear base colors are multiplied into vertex colors. Source triangle order is preserved across the handedness conversion; the prototype material is also two-sided. **Native face orientation, normals, lighting and imported appearance still require the engine visual check.**

The procedural-mesh route is temporary: no Nanite, authored UVs, LODs, baked static meshes, advanced water or production-ready photoreal rendering are claimed. Primary collision is separate box geometry; small decorative props are not all solid. The native rear hut wall is widened to match the visual shell, and floor/step/desk heights are carried across.

## Locally verified scope

```sh
npm run native:export
npm test                    # 11 JavaScript tests, including the original prototype tests
npm run native:test         # g++/clang++ C++20 tests; NOT an Unreal module build
```

Verified locally:

- Native coordinate conversion and deterministic byte output.
- Same 92,138 source triangles preserved in the native mesh.
- Finite mission/collision values and the three expected objective IDs.
- All 256 possible mission-mask values, invalid/repeated objective indices and save-schema consistency in the shared C++ rules.
- Successful parsing of the real exported world by the shared C++ mesh reader.
- Rejection of truncated buffers, invalid format/version/counts, NaN vertices, out-of-bounds indices and trailing bytes.
- Editor Python syntax only, not its Unreal API calls.

Evidence: `docs/evidence/native-foundation/`. Tests are deliberately labeled **engine-independent**.

## Native acceptance checklist — ALL PENDING

- [ ] UE5.6 Editor and Game targets compile with no unresolved UHT/compiler/linker errors.
- [ ] Preparation produces the saved map and working vertex-color/water materials.
- [ ] Runtime and packaged UFS data load with correct axes, dimensions, normals and colors.
- [ ] Player spawns above the ground, walks the dock and steps into the hut without snagging or falling through.
- [ ] Primary walls/props block movement and ledger interaction through walls is impossible.
- [ ] All three objectives, extraction, pause/resume, jump/crouch/sprint and reset confirmation work.
- [ ] Releasing a movement/sprint key while paused does not leave held input stuck.
- [ ] New process restores objective progress; invalid and unwritable-save cases show an error without crashing.
- [ ] UAT packages all required binaries/content; game launches on a clean Windows machine without the Editor.
- [ ] Frame-time/memory measurements and visual art review are recorded separately.

## Optional owner-provisioned CI

`.github/workflows/native-windows.yml` is **manual-only**. It requires a trusted, self-hosted Windows runner labeled `unreal-5.6`, PowerShell 7, an installed licensed engine/toolchain, and repository variable `UE_ROOT`. This workflow is not an online Unreal service and does not install or license Unreal for you. Do not run untrusted fork code on that host.

It archives the packaged directory and logs; it does not certify a clean-machine gameplay test. No paid cloud resource was requested or provisioned in this session.
