# Batch 01 delivery report — Puerto Chico

Date: 2026-10-14  
Scope: First environment asset review batch, not a completed game milestone.

## Done

- Eight original, independently downloadable procedural GLB models.
- One assembled 92,138-triangle coastal outpost test cell and JSON placement data.
- Nine actual model/world PNG renders, plus gallery and playtest screenshots.
- Interactive model viewer: orbit/zoom, rotation, dawn/dusk, PNG capture and GLB download.
- Desktop browser exploration exercise: movement/sprint, primary prop/wall collision, three interactions, extraction, pause, restart and exit.
- Collision line-of-sight checks prevent reading the ledger through hut walls. The desk is placed on the raised hut floor.
- Editable source, manifest/checksums, dependency notices, reproducible asset export and Unreal handoff documentation.
- Google Drive delivery folder with individual models and previews; permissions left unchanged.

## Verification evidence

| Check | Result | Evidence |
|---|---|---|
| Khronos glTF structure | 9/9 files; zero errors, zero warnings | `docs/evidence/batch-01/validation.json` |
| Geometry/gameplay unit suite | 8/8 passed | `docs/evidence/batch-01/unit-tests.txt` |
| Browser smoke/integration | 15 checks passed; no page errors or failed asset responses | `docs/evidence/batch-01/browser-tests.json` |
| Deterministic regeneration | 9/9 GLB hashes identical after regeneration | `docs/evidence/batch-01/reproducibility.txt` |
| Static browser build | `npm run build` succeeded | Reproducible via the locked dependency install |
| Master brief integrity | `python3 tools/build_prompt.py --check` passed; 100,689 lines | Existing prompt left unchanged |
| Desktop/mobile layout | Captured in actual Chromium | `asset-lab.png`, `mobile-gallery.png`, `playtest.png` |

Browser tests execute real UI controls, keyboard movement, interactions, pause/restart and downloads. A test-only positioning hook is used to place the player near each objective; separate flood-fill tests establish reachability from spawn through collision. This is **not** a human playthrough or an Unreal functional test.

## Scope deviations / unfinished work

- No Smailpro/Tripo accounts or credits used. Art was produced locally, with provenance recorded.
- Browser rendering is a temporary review path, not the mandated UE5 production game.
- All 8 art assets and the world remain **prototype quality**. No final photoreal textures, authored UVs, LODs, wind, rigs, animation, physics assets or engine imports are claimed.
- No `.uproject`, native gameplay, Windows executable, installer or Windows launch test exists.
- No combat, enemies, vehicles, city, complete island, campaign, audio or save system.
- No REA installation or code execution; its public README review established that reverse engineering was not needed for this task.

## Quality and performance gates

| Gate | Status |
|---|---|
| Prototype GLB structural validation | PASS |
| Prototype navigation and objective logic | PASS within the automated test scope |
| Art lock / G-PH placeholder gate | NOT PASSED — all supplied art is prototype |
| Blind Bench / photoreal comparison | NOT RUN |
| UE5 import / Nanite / Lumen validation | NOT RUN |
| Windows launch / native packaging | BLOCKED — build and test environment unavailable |
| T1–T5 frame-time/memory budgets | NOT MEASURED |
| Shipping legal/compliance signoff | NOT RUN; provenance and third-party notices supplied only |

No FPS targets or comparative quality claims are inferred from Linux headless software rendering.

## Size and delivery

- Nine GLBs: approximately 8.25 MiB combined.
- Source asset directory including PNG previews: approximately 9.8 MiB on disk.
- Static browser distribution: approximately 11 MiB on disk.
- Package tooling writes the final ZIP byte count and SHA-256 to `artifacts/`; archives/build outputs are ignored by Git and delivered through Drive instead.
- Source files, GLBs and modest preview/evidence PNGs remain in the working branch. No `node_modules`, browser binary or cache is committed.

Drive: [Asset root](https://drive.google.com/drive/folders/1S0_Uj1N3R7fSdse6sUPr4slaPxCSdw74) / [Batch 01](https://drive.google.com/drive/folders/1VrsezSia_cpv1t6p3DPbQoW16o4s9WES).

## Next / asks of the owner

1. Review this first batch's composition, shapes, prop selection and scale before generating a second batch.
2. Provision an authorized UE5 installation and Windows build/test machine for the native game path.
3. Lock a UE release after verification, then build one textured hero asset and a native first-person outpost slice.
4. Deliver a real packaged Win64 test build only after a clean-machine launch/playthrough succeeds.
