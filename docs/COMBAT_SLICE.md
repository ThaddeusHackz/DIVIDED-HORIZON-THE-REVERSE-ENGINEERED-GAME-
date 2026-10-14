# DIVIDED HORIZON — La Aduana combat slice 0.3.1

**This is an unfinished playable slice, not the full game.**

This delivery adds actual combat and a compiled Windows x64 executable. It follows the master brief's §133.3(c) fallback: an explicitly labeled interim slice alongside the UE5 source foundation. **Unreal remains the final production target. This executable uses raylib, not Unreal.**

## Maintenance release 0.3.1

Refreshed Windows packaging, version label, build provenance and integrity checks. No new gameplay or final-art milestone is claimed. See [Windows player guide](WINDOWS_PLAY.md).

## Play on Windows

1. Download `DIVIDED_HORIZON_Windows_Combat_Slice_0.3.1.zip`.
2. Extract the **entire ZIP** to a folder. Do not run the executable inside the ZIP preview.
3. Run `DividedHorizon-Slice.exe`. Keep `assets/` alongside it.
4. Choose **Begin operation**, or continue a saved checkpoint.

No Node.js, Python, Godot, Unreal, account, API key or generation credits are needed to run this Windows package. It expects **64-bit Windows and a working OpenGL 3.3 graphics driver**. Its imported DLLs are Windows system libraries; the OpenGL driver is loaded at runtime.

**Important verification limit:** the `.exe` was successfully cross-compiled and inspected as a Windows x64 PE executable, but **has not been launched on Windows in this workspace**. That means native window creation, GPU appearance, input, audio and a clean-machine launch remain unverified. It is unsigned; Windows may show an unknown-publisher/SmartScreen warning. No antivirus certification or malware-scan claim is made. Do not disable security software to run it.

`Run-Diagnostics.bat` runs a small simulation diagnostic and writes `self-test.txt`. This does not certify rendering, audio or the full game. `BUILD_STATUS.json` and `SHA256SUMS.txt` describe the actual build and hashes.

## Play in the live preview

The Arena live preview now opens the combat game instead of the asset gallery. Choose **Begin operation**. The original gallery remains at `/asset-lab.html`.

For a slower browser/GPU, add `?quality=low` to disable shadows and reduce rendering cost. Keyboard and mouse are required for gameplay; the briefing fits a phone screen but no touch movement controls are supplied.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look; browser captures the mouse on entry/click |
| Drag / arrow keys | Browser look fallback / keyboard turning |
| Left mouse or F | Fire |
| Right mouse | Aim |
| R | Reload |
| 1 / 2 | Culebra pistol / Libertad rifle |
| Shift | Sprint using stamina |
| Ctrl or C | Crouch |
| Space | Jump |
| E | Interact when prompted |
| H | Use a field kit |
| Escape | Pause/resume |
| F11 | Toggle fullscreen in the Windows version |

Browser mouse capture may be restricted inside an embed. Drag to look and use F to fire if necessary. Sound and reduced-flash settings are available in the browser pause menu. The Windows renderer uses restrained tracer/hit feedback, not full-screen flashes.

## Mission

- Begin at the south jetty with the **W01 Culebra**: 12-round magazine, 24 base damage, 1.4-second reload, semi-automatic fire.
- Recover the cargo manifest beside the crates. This unlocks the **W05 Libertad** rifle: 30 rounds, 28 base damage, 2.2-second reload, automatic fire.
- Read the ledger inside the customs hut; recover an extra field kit.
- Disable the mast signal. Until then, an alerted outpost can call in **at most two** reinforcements.
- Return to the end of the south jetty to secure the evidence.

Six original prototype sentries patrol the outpost. They use facing/range/line-of-sight detection, investigate gunfire, search last-known positions, follow grid routes around primary obstacles, and return fire. They have reaction delays and deliberately miss their first attack. Incoming shots are rate-limited across the squad. These are simple game AI systems, **not** the final UE StateTree/EQS/Mass implementation.

Walls and primary props occlude bullets. Headshots receive the brief's 2.5× multiplier. There are ammunition limits, timed reloads, damage, death, field treatment, stamina and checkpoint retry. Eliminating every guard is not required to extract. Story difficulty reduces incoming damage and grants limited delayed health recovery.

Checkpoints save when an objective is completed. In the browser they use local storage; on Windows they use `%APPDATA%/DividedHorizonSlice/checkpoint-v2.sav` (with a local fallback if APPDATA is unavailable). Saves use a version, bounded state validation and checksum. They are prototype checkpoints, not a production save system or a cryptographic anti-tamper mechanism. Corrupt/incompatible data is rejected without loading it.

## New 3D content — Batch 02

Six additional original GLB assets and a larger assembled outpost:

- Culebra pistol (W01)
- Libertad rifle (W05)
- La Cosecha sentry prototype
- Sandbag cover
- Field generator
- Corrugated harbor container
- Expanded Puerto Chico combat world: **155,900 triangles**, roughly a 60 m playable land diameter with the south jetty

These remain **untextured procedural prototype art**. The sentry is not a production character rig: there is no skeletal locomotion, polished aiming/reload animation, facial work or ragdoll. Weapons have temporary presentation without production first-person arm animation. No final photoreal, Nanite, Lumen or art-lock gate is claimed.

The new PNGs and gameplay screenshots are **actual browser renders of the delivered assets**, not Windows or Unreal screenshots. The Windows renderer uses simpler lighting and a different HUD; only the simulation and model data are shared.

## What is genuinely shared and tested

`slice/src/core.c` implements movement, collision, shooting, reloads, hit zones, AI, damage, mission progression and checkpoint rules. The **same C file** is compiled into:

- WebAssembly for the browser renderer.
- Native code linked into the Windows raylib application.

Local tests include a complete scripted Standard-difficulty playthrough using normal movement, aim, fire, reload, healing and interaction inputs—**no teleport, invulnerability, enemy deletion or direct objective-state edits**. It completes the mission in about 24 simulated seconds with perfect bot aim, defeats seven guards and extracts. This is not a human playtime estimate.

The same **1,439 recorded input frames** were replayed in a Linux-native C executable, reaching the same mission completion and guard count. This verifies the shared simulation across those two targets, **not a Windows launch or the native graphics layer**.

Additional tests cover semi-auto fire, reload transfer, headshots, wall occlusion, enemy return fire, pause, healing, mission unlocks, checkpoint validation and shore boundaries. See `docs/evidence/combat-slice/` for exact evidence and scope.

## Build from source

Browser use with the checked-in WebAssembly and model assets:

```sh
npm ci
npm run dev
npm run build
```

Rebuild the fallback on **Linux x64** (Node.js, Python 3, npm, GCC/Clang and objdump required):

```sh
npm ci
npm run slice:setup          # pinned Zig compiler and raylib 5.5; verifies package/source integrity
npm run slice:assets         # geometry, collision data/header and original synthesized SFX
npm run slice:core           # the shared C -> WebAssembly build
npm test
npm run slice:playthrough
npm run slice:test-native
npm run slice:windows        # cross-compile the actual Windows executable + copy required assets
npm run slice:package
```

Optional browser checks/previews require the dev server on port 5173:

```sh
npm run slice:test-browser
npm run slice:previews
```

Pinned raylib source commit: `c1ab645ca298a2801097931d1079b10ff7eb9df8` (5.5). Toolchain: `@oven/zig-linux-x64@0.12.0-dev.1286`. These are reproducible compatibility choices, not claims to be the newest versions. Upstream MinGW compilation emits bit-field warnings; project C checks are run separately with warnings treated as errors. Raylib and its bundled dependency notices are preserved in the Windows package.

Godot's official binary download redirected to a host unavailable to this environment, so it was not used. Raylib was built from source available through the allowed GitHub/npm paths. No service credits or temporary accounts were involved.

## Still a long way from the original game

Not implemented: the full island or Meridian city; the campaign; vehicles; companion Poncho; the full armory; authentic animations; final textures/photoreal environments; advanced ballistics/penetration; destructible worlds; large-scale simulation/streaming; audio production; production settings/accessibility/localization; performance-tier certification; Windows launch QA; or a UE5 shipping build.

The UE5 `.uproject` remains a separate, earlier **uncompiled source foundation** under `native/`. The new combat core has **not** yet been integrated or verified there. The fallback does not silently replace the required final engine.

Next substantive milestones: Windows launch feedback/fixes, an authored encounter/mission expansion, production-quality character/weapon animation, and a provisioned UE build environment for the final-engine migration. This delivery is progress toward those milestones—not a declaration that the game is done.
