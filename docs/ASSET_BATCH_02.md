# Batch 02 — review before further final-art production

This batch already powers the prototype combat slice. It is **not** the new v3 photoreal
art target, and no new expansion batch is approved by this delivery.

## View
- Start `npm run dev`, then open `/review.html`: all seven actual-model PNGs, raw GLB/PNG
  downloads, triangle counts, disclosures and links to the rendered 3D scene.
- `prototype/public/assets/batch-02/previews/` contains the individual PNGs.
- Each `.glb` beside the manifest can be opened in a compatible 3D viewer/DCC.
- Drive: use the Combat Slice 0.3 folder inside DIVIDED HORIZON GAME ASSETS.

## Included
Culebra pistol, Libertad rifle, Cosecha sentry placeholder, sandbag cover, field generator,
harbor container and the assembled Puerto Chico combat world. Original procedural code
is in `tools/slice/assets.mjs` with its shared library in `tools/assets/library.mjs`.
No Tripo accounts, credits, model downloads or copied commercial-game art were used.

Units: metres; Y-up in GLB. All seven models are placeholders. No production UVs, skinning,
animation, authored PBR texture set or Nanite conversion. Weapons are game-only models,
not engineering drawings. Runtime collisions are separate prototype data.

## Reproduce / inspect
```sh
npm ci
npm run slice:assets
npm run dev
# In another terminal:
npm run slice:previews
npm run slice:validate
npm run test:asset-review
```
All generators are local; no API keys or external art services required. The source ZIP
is source-only: `npm run slice:package-source` works without a staged Windows binary.
The separately delivered Windows ZIP is still the earlier cross-compiled fallback,
not an Unreal build and not Windows-launch-verified. This delivery does not replace it.

## Review request
For each model: **keep / change / reject**, followed by the required change. Review
silhouette, proportions, readability and layout now—not a promise of final fidelity.
H7 feedback goes in our conversation; the review page does not collect or send data.

Evidence: [structural report](evidence/batch-02/validation.json),
[visual review](evidence/batch-02/review.md), [browser checks](evidence/batch-02/browser-review.json).
The world preview's former water-only capture has been fixed and regression-tested.
