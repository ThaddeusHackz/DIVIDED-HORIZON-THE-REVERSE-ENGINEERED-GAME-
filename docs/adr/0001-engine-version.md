# ADR 0001 — Production engine retained; version provisioning blocked

Date: 2026-10-14  
Status: Production family accepted from the brief; exact version pending verification.

The repository is a production specification, not an existing playable UE5 project. Local inspection found the master prompt, prompt source and prompt-generation scripts, but no `.uproject`, playable content or engine installation.

Retain **Unreal Engine 5** as the production engine, following Part 0 and Sections 101–136. No claim is made that any engine is universally the most powerful, that it has a "greatest forensic scan", or that current preview rendering meets the brief's quality gates.

For Batch 01, create engine-neutral GLB source assets and an explicitly separate Three.js browser review prototype. This is an acknowledged scope deviation for review, not a migration or a UE5 replacement.

The environment could access GitHub and npm but had no direct network path to Smailpro or Tripo. No accounts were created, and no attempt was made to bypass generation quotas. All supplied art was authored through local procedural code.

Reviewed `morluto/rea`'s public GitHub metadata and README. It describes a reverse-engineering toolkit for binaries/apps and runtime analysis, not an online engine, 3D generator or Unreal build service. No code from REA was installed or executed: no binary reverse-engineering target exists in this batch. This README review is not a security audit of that repository.

A human-provisioned UE installation and Windows test/build environment remain prerequisites for engine validation and a genuine executable. Follow `docs/UNREAL_HANDOFF.md` before claiming a native build.

## Native foundation follow-up

A UE 5.6-targeted source baseline now exists under `native/DividedHorizon/`, with an explicit source-only status. This provisional target is not a latest-version claim or an engine-verified production lock. ProceduralMeshComponent and conventional movable-light rendering are temporary prototype deviations; Nanite/Lumen/animation gates remain unpassed. See `docs/NATIVE_PROTOTYPE.md`.
