# DIVIDED HORIZON — Batch 01

> Historical batch/foundation guide. For the newer compiled raylib Windows combat slice and its verification limits, see [COMBAT_SLICE.md](COMBAT_SLICE.md). The UE5 source remains uncompiled.

## Puerto Chico / La Aduana · Original prototype environment kit

**Delivery date:** 14 October 2026  
**Status:** Prototype, awaiting visual review. Not approved for final production.  
**Production engine target:** Unreal Engine 5, as required by the repository's v2 brief.  
**Preview implementation:** Three.js / WebGL, not Unreal Engine.

### What is included

| File | Model | Triangles |
|---|---|---:|
| `SM_CustomsHut_01.glb` | Timber customs station with open doorway and shuttered window | 2,128 |
| `SM_Dock_01.glb` | Repeatable 6 m jetty segment, piles, mooring hardware | 9,464 |
| `SM_SignalMast_01.glb` | Lattice tower, ladder, dish and service cabinet | 2,444 |
| `SM_CargoCrate_01.glb` | Reinforced timber cargo crate | 756 |
| `SM_FuelDrum_01.glb` | Ribbed fuel drum with caps and geometric rust accents | 1,876 |
| `SM_Checkpoint_01.glb` | Footed timber checkpoint barrier | 888 |
| `SM_CoastalPalm_01.glb` | Curved palm with individual geometric leaflets | 3,742 |
| `SM_EvidenceDesk_01.glb` | Inspector's desk with ledger, notices, lamp and ink | 704 |
| `L_PuertoChico_Prototype.glb` | Assembled test cell, terrain and repeated kit pieces | 92,138 |

All models use **metres, Y-up**, ground-based origins, and metallic-roughness PBR material factors. Dock piles intentionally extend below the pivot. The world uses a roughly 40 m central outpost area with a larger surrounding terrain mesh. It is **not** the 6 km island specified for the final game.

The PNG previews are **real renders of these GLBs**, not concept art or substitutes for missing models. `manifest.json` records bounds, file sizes, triangle counts, SHA-256 checksums, scope and provenance. `world-layout.json` preserves individual module placements and the browser collision rectangles.

### How to view or play

1. Open the Arena live preview **Divided Horizon — Asset Lab**.
2. Click a model card to orbit, zoom, switch dawn/dusk lighting, rotate, save a PNG, or download its GLB.
3. Click **Enter the outpost** to try the exploration assignment.
4. On a desktop keyboard: **WASD** moves, **Shift** sprints, **E** interacts, **Escape** pauses. Drag the mouse to look; arrow keys also turn/look.
5. Recover the manifest near the cargo crates, read the ledger inside the hut, and restore the mast's signal. Return to the end of the jetty to secure the evidence.

The image gallery is responsive on phones; **playtest movement requires a keyboard**. No pointer-lock permission is required, so the prototype works in the embedded preview.

To run locally (Node.js 22.12+):

```sh
npm ci
npm run dev
```

To build a static browser distribution:

```sh
npm run build
# Serve prototype/dist over HTTP; opening index.html as file:// is not supported.
```

### Source and reproduction

- `tools/assets/library.mjs`: original procedural geometry, materials and world assembly.
- `tools/assets/generate.mjs`: GLB exporter and manifest generation; batches meshes by material.
- `prototype/src/`: gallery, renderer, movement, collision, interactions and mission logic.
- `tools/assets/render-previews.mjs`: headless rendering from the actual exported GLBs.
- `tools/assets/validate.mjs`: Khronos glTF validation and checksum checks.
- `tests/`: geometry, navigation, objectives, and real-browser interaction checks.

```sh
npm run assets:generate
npm run assets:validate
npm test
# With npm run dev already listening on port 5173:
npm run test:browser
npm run assets:previews
```

Browser tests use packaged headless Chromium on Linux. On other hosts, install the Playwright browser with `npx playwright install chromium`, or set `CHROMIUM_PATH` to an existing browser executable. The renderer helper uses bundled NSS libraries when needed on minimal Linux hosts. All browser tooling is development-only.

### Unreal handoff

See [UNREAL_HANDOFF.md](UNREAL_HANDOFF.md). The GLBs are portable source assets, **not** `.uasset`/`.umap` files. Geometry is material-batched for viewing: use the individual GLBs and `world-layout.json` to assemble editable actors rather than treating the combined world GLB as the final level.

### Explicit limitations

- **No Windows `.exe` has been built or tested.** No Unreal project, cooked content, installer or engine runtime is included in this batch.
- These are untextured procedural prototypes, not the brief's photoreal final assets. No high-resolution texture maps, authored UVs, lightmap UVs, LOD chain, Nanite validation, foliage wind, rigs, animation, or destructible meshes are supplied.
- No combat, NPCs, vehicles, climbing, jumping, swimming, audio, persistence, full island, city, streaming world, or campaign implementation.
- Browser collision uses lightweight rectangles and a constrained walk area, not an engine physics simulation. It covers the main walls, checkpoint, mast and cargo props; small decorative objects are not all solid.
- The preview water, sky, lights and moving offshore lines are viewer effects; they are not embedded in the world GLB.
- The desk lamp is static geometry, not an active light. Dusk is a viewer lighting preset, not a dynamic world simulation.
- Structural validation is not art approval, engine compatibility certification, security certification, or a frame-rate benchmark.

### Provenance and brief alignment

All supplied geometry was authored in this repository through AI-assisted procedural code. No Tripo account, temporary email account, credits, third-party models, scanned art, downloaded textures or copied game assets were used.

The kit follows the original brief's **Isla Sombra**, **Puerto Chico / La Aduana**, **jade-and-gold palette**, **signal-mast landmark**, **customs paperwork**, and **three-distance environmental storytelling** directions. The short browser assignment is an original prototype exercise inspired by those directions, not a claim to implement an existing campaign mission.

See [LICENSES.md](LICENSES.md), [reports/BATCH_01.md](reports/BATCH_01.md), and `docs/evidence/batch-01/` for dependencies, quality status and evidence.
