# Batch 02 visual review — 2026-10-14
Reviewer: AI assistant; **H7 owner/playtester approval still pending**.
Source: actual 1080×800 browser GLB renders in `prototype/public/assets/batch-02/previews/`.
All seven images were opened and inspected. This is neither a concept-art board nor an Unreal capture.

## Capture defect → fix → recapture
The original world PNG contained water/sky but no world geometry. Inspecting props hid
the cached world, and later cloning it preserved `visible=false`. Explicitly mark the
inspection clone visible. Re-rendered all seven PNGs, reopened the world PNG, and
confirmed the island, hut, containers, mast and dock are visible. Browser regression
checks the prop→world sequence and verifies foreground warm land/prop pixels (>5%;
observed 20.51% at the test viewport). This heuristic catches the blank-water bug only;
it is not a generic render or photorealism quality score.

## Assessment against v3 / S156 intent
| Asset | What reads as fake / missing | Production decision | Owner |
|---|---|---|---|
| Culebra | Rounded block construction, floating-looking sights, no mechanism detail/textured finish | Reject for final weapon; keep scale-test placeholder | WEAPONS/ART |
| Libertad | Uniform slabs, underdeveloped grip/action/optic, flat material response | Reject for final weapon; keep scale-test placeholder | WEAPONS/ART |
| Sentry | Block anatomy and featureless face, stiff pose, no skin/cloth detail or rig | Reject for production human; replace through licensed MetaHuman pipeline | CHARACTERS |
| Sandbags | Repeated pillow-shaped blocks, no seam/tie/fabric, implausibly regular stacking | Reject final art; keep cover blockout | ENVIRONMENT |
| Generator | Flat control disks/slats, no labels/fasteners/assembly detail, no wear variation | Reject final art; keep equipment blockout | ENVIRONMENT |
| Container | Uniform panels/paint; simplified hinges/locks; no fine weathering | Reject final art; keep cover footprint | ENVIRONMENT |
| World | Repeated palms, faceted shore/rocks, sparse dressing and simple water, abrupt island edges | Reject photoreal/Golden Slice claim; keep encounter test cell | WORLD/ART |

All seven GLBs pass structural validation (0 errors, 0 warnings), but have no UV
attributes, skins or animation clips. No texel-density or production rig pass is possible.

## Top three fixes / order
1. Review original silhouettes/layout with the owner before producing another batch.
2. Replace final-art humans/locomotion through evaluated MetaHuman/Game Animation Sample
   foundations and original design, not higher-poly procedural blocks or Tripo hero characters.
3. Create physically authored, UV'd PBR prop kits with assembly detail and material variation;
   evaluate licensed Megascans/PCG sources for the environment on the provisioned UE host.

Current gate: **NOT ART-LOCKED**. No S156 formal score, H7 score or benchmark win is invented.
Missing Ω.6 deliverables: golden-hour/noon/night Unreal stills, weather views where relevant,
and a 10-second Movie Render Graph clip for motion. The review page screenshot only verifies
presentation/readability, not game quality. See state/KNOWN_ISSUES.md for accountable defects.
