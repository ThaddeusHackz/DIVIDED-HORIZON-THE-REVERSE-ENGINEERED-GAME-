# SECTION 11 — CODE STANDARDS (v2 — C++/Blueprint)

- Gameplay-critical and per-frame code in C++ (UE5 modules); Blueprints for
  content glue, tuning and designer iteration. One responsibility per class;
  files over ~500 lines are split. Follow Epic's coding standard + Section 102.
- Decoupling via Gameplay Message Subsystem / delegates / Gameplay Tags; data
  via DataAssets + DataTables + JSON import (10.4 data-driven rule still holds).
- No per-frame allocations in hot paths; pooling for projectiles/decals/VFX;
  Mass/ISM for crowds; budgeted tick groups; Insights trace scopes on every
  system (Section 109).
- Every system ships with an automation test (Functional Test / Gauntlet /
  Automation Spec) — Section 134. Comment WHY for tricky physics/animation.
