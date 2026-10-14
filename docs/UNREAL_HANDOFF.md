# Unreal Engine handoff — Batch 01

> Historical batch/foundation guide. For the newer compiled raylib Windows combat slice and its verification limits, see [COMBAT_SLICE.md](COMBAT_SLICE.md). The UE5 source remains uncompiled.

> **Update:** A native source foundation and automatic GLB-to-procedural-mesh path now exist. See [NATIVE_PROTOTYPE.md](NATIVE_PROTOTYPE.md). The manual static-mesh import guidance below remains optional and unverified; no Windows build is claimed.

## Engine decision

The master brief explicitly specifies **Unreal Engine 5**. This delivery does not replace that production decision with Three.js or Godot. The browser implementation exists only to inspect the asset kit and play a small reconnaissance exercise immediately.

No Unreal Editor, Epic installation, licensed cloud editor, Visual Studio/Windows SDK, or Windows test machine is available in the current workspace. An exact UE5 production version has **not** been selected or validated. A human must acquire the engine and accept its terms. Verify feature maturity against the release notes before locking a version; this batch does not assert that any particular feature is production-ready in the latest release.

## Import procedure (requires verification in your installed UE5 release)

1. Create a disposable UE5 test project on Windows. Enable the Interchange/glTF import support appropriate to that installed release.
2. Import the **individual** `SM_*.glb` files from `prototype/public/assets/batch-01/` into a dedicated `/Game/DividedHorizon/Prototype/Batch01` content folder.
3. Inspect import results: some configurations create multiple static meshes or scene actors because each GLB contains several material-batched primitives. Do not assume the importer will create a single mesh automatically.
4. Check scale against a 100 cm engine reference cube. glTF uses metres and Y-up; the importer should convert this to Unreal's centimetres and Z-up. **Do not add a blanket 100× scale after a correct automatic conversion.**
5. Check the hut doorway width, the 6 m dock length, the 1.75 m desk width, material slots, normals, two-sided palm leaf rendering, and pivot placement. Dock piles deliberately extend underground/underwater.
6. Generate appropriate simple collision or author custom collision. Do not use a single bounding box across the hut doorway. The JSON rectangles are browser-only collision data, not Unreal collision meshes.
7. Generate lightmap UVs if required for the chosen lighting workflow. These assets do not carry authored texture/lightmap UVs. Review Nanite suitability per asset rather than assuming it is configured or necessary.
8. Assemble individual actors using the module layout. Confirm the importer's axis conversion and heading using the known dock/hut orientation and record that mapping before scripting placement. Convert metre translations to centimetres only where that conversion has not already been applied by the importer. Do not blindly reuse glTF yaw as Unreal yaw.
9. Add Unreal-native water, sky, lights, player collision and gameplay. Those browser effects are not in the GLB.
10. Import the combined `L_PuertoChico_Prototype.glb` only as a layout/visual reference if needed. It is geometry batched by material, **not a World Partition map** or a fully authored Unreal level.

## Before a real Windows executable can be delivered

- A working UE5 `.uproject` with game modules/Blueprint gameplay and an explicit map list.
- Imported content, approved materials, collision, player spawn, game mode, UI, and validated mission logic.
- A licensed/configured Windows UE5 build environment, compatible compiler and SDK.
- Successful Win64 package/cook/stage using the selected UE release's build tooling.
- Clean-machine launch and a complete mission playthrough on Windows.
- Runtime dependencies, notices, checksums, and the complete packaged directory alongside the executable.

A lone `.exe` without its required engine libraries and content is not a deliverable. Renaming the browser page or shipping a browser launcher would not satisfy the brief's UE5 shipping requirement. No such workaround is claimed here.

## Recommended next production slice

After reviewing Batch 01's shapes and environment direction:

1. Lock and provision the UE5 version; create the real playable project.
2. Replace one prototype hero prop (the customs hut) with UV-mapped, textured, physically calibrated production art.
3. Import and validate a 40 m outpost slice with proper capsule collision and first-person movement.
4. Implement the three interactions natively and package a Win64 test build.
5. Record actual import, visual, performance and Windows-launch evidence before expanding the world.
