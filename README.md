# DIVIDED HORIZON — Playable Combat Slice 0.3 
### A first-person combat prototype with a browser-playable slice

Play La Aduana: a compact mission featuring enemy patrols,
stealth and combat, objectives, checkpoints, and extraction.

The prototype shares a C simulation between its browser
WebAssembly version and Windows raylib fallback. A separate
Unreal Engine 5 source foundation supports the production direction.

**Status:** prototype in active development—not a finished game
or a verified Unreal shipping build.

**The full game is not finished.** This repository now contains a playable combat slice, original 3D assets, a compiled Windows fallback build pipeline, and a separate UE5 source foundation.

## Current production order: v3

Read [START_HERE_v3.md](START_HERE_v3.md) first. The owner's new Part Ω overrides earlier execution plans: **UE5 production, T5 aspirational fidelity, Epic foundation evaluation, and Golden Slice quality before scale**. The current browser/raylib slice is not final art or a passed Unreal milestone.

- [M0→M4 plan and version-verification gaps](docs/reports/V3_ALIGNMENT.md)
- [Current state](docs/state/STATE.md) · [Next ten tasks](docs/state/NEXT.md) · [Human prerequisites](docs/state/HUMAN_ASKS.md)
- [Batch 02 review guide](docs/ASSET_BATCH_02.md) — open `/review.html` in the live preview for model pictures and GLB downloads.
- `npm run build:preflight` inventories the host; `npm run test:preflight` checks the inventory logic. A passing portable check is never an Unreal/Windows launch certification.

## Play / download

- **Live preview:** the main page now opens **La Aduana**, a first-person combat mission.
- **Local browser:** `npm ci`, then `npm run dev`. Batch 02 review is at `/review.html`; Batch 01 remains at `/asset-lab.html`.
- **Windows:** [download the package](https://github.com/ThaddeusHackz/GAME/releases/tag/v0.3.1-prototype), extract the complete `DIVIDED_HORIZON_Windows_Combat_Slice_0.3.1.zip`, then run `DividedHorizon-Slice.exe` alongside its `assets/` folder. See [player/build guide](docs/COMBAT_SLICE.md).
- **Latest Windows mirror:** [0.3.1 package, optional source, checksums and guide](https://drive.google.com/drive/folders/1eFBDncJic9QaOUTZ-CELvRi83HHKyfMz).
- **Drive deliveries:** [DIVIDED HORIZON GAME ASSETS](https://drive.google.com/drive/folders/1S0_Uj1N3R7fSdse6sUPr4slaPxCSdw74).

**Windows status:** the executable is cross-compiled for Windows x64 and its PE format/dependencies are checked. It has **not** been launched on Windows here. It uses raylib under the brief's explicit fallback ladder; it is **not an Unreal executable**. Unreal remains the final production target.

## Working slice features

Culebra pistol and unlockable Libertad rifle; ammo/reload/headshots; wall-occluded shooting; six sentry patrols and up to two reinforcements; detection/search/return fire; grid routing; health/field kits; sprint/crouch/jump; three objectives and extraction; death/retry; versioned checkpoints; pause; original prototype sound effects.

WASD move · Mouse/F fire · Right-click aim · R reload · E interact · H heal · Shift sprint · Ctrl crouch · Space jump · 1/2 weapons · Escape pause.

`slice/src/core.c` is shared by the browser WebAssembly build and the Windows executable. An automated, non-cheating mission run and its native-C input replay are recorded in [combat evidence](docs/evidence/combat-slice/).

## Content and tools

| Path | Contents |
|---|---|
| `prototype/public/assets/batch-01/` | Original eight-piece environment kit and review world |
| `prototype/public/assets/batch-02/` | Six new combat/cover assets, expanded world, data and SFX |
| `slice/src/` | Shared simulation and standalone Windows renderer/application |
| `tools/slice/` | Pinned toolchain setup, asset/WASM/Windows builds, packaging |
| `native/DividedHorizon/` | Separate UE5.6-targeted C++ foundation — **not compiled here** |
| `docs/COMBAT_SLICE.md` | Controls, builds, verification scope and remaining work |

Checks: `npm test`, `npm run slice:playthrough`, `npm run slice:test-native`, `npm run assets:validate`, `npm run build`. Cross-build steps and required Linux tools are documented in the guide. Native renderer and Windows launch testing remain pending.

**Still missing:** final photoreal art, proper character/weapon animation, full island/city, campaign, vehicles, large-world simulation, advanced ballistics/destruction, production polish/performance/accessibility, and a UE5 shipping build. The original brief below is a target, not a completion claim.

---

# DIVIDED HORIZON — Master Build Order v2

`MASTER_PROMPT.md` is the preserved legacy v2 production prompt (superseded in execution order by v3) for an original, photoreal, Unreal Engine 5 open-world action game
(island-ops FPS + city crime sandbox). It is **generated** and ~100,000 lines long.

| Path | What it is |
|------|-----------|
| `MASTER_PROMPT.md` | The assembled v2 prompt (index at the top, Part 0 = Supreme Directive) |
| `prompt_src/00_part0_supreme_directive.md` | v2 audit, supersession register, Godot→UE5 table, quality bar |
| `prompt_src/legacy_parts_I-X.md` | v1 doctrine (lore, balance, campaign, scripts), patched for v2 |
| `prompt_src/11…15_*.md` | v2 hand-written brief: UE5 photoreal charter, movement/animation, combat, open world, production |
| `tools/gen_v2/*.py` | Deterministic generators for the ledgers (Sections 137–156) |
| `tools/build_prompt.py` | Assembles everything into `MASTER_PROMPT.md` (`--check` verifies it is current) |
| `tools/gen_annex.py` | Original v1 generator for legacy Part IX (output frozen in `legacy_parts_I-X.md`) |
| `tools/patch_legacy_v2*.py` | One-shot v1→v2 migration scripts, kept for auditability |

Rebuild: `python3 tools/build_prompt.py` · Verify: `python3 tools/build_prompt.py --check`

**Reading it:** no model context holds 100k lines. Load the index, Part 0 and Sections 101–136 first (~1,500 lines);
treat Sections 137–156 and legacy Parts IX–X as look-up tables (`sed -n 'N,Mp'` using the index, or `grep` by row ID).
