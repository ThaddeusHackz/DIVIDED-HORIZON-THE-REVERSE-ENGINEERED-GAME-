# State — 2026-10-14
Milestone: **M0 open; Unreal boot gate blocked, not passed.**
Production brief: START_HERE_v3.md / MASTER_PROMPT_v3.md, owner commit 525182a.
Scope: T5 aspirational visual target; all required T1–T5 budgets unmeasured.

## Working now
- Browser combat and shared C simulation; 21 unit tests and 13 browser checks re-run successfully after v3 integration.
- Cross-compiled raylib Windows fallback delivered on Drive; Windows launch unverified.
- Batch 01 (9 GLBs) and Batch 02 (7 GLBs); original prototype geometry, not photoreal.
- Separate UE5.6-targeted project and manual build scripts, not compiled or run.

## Current lanes
- PRODUCER: v3 merged, precedence/Golden Slice restrictions adopted, state files created.
- ENGINE/CI: five read-only host-inventory tests pass; portable CI workflow added. This Linux host has no configured UE.
- ART/QA: seven Batch 02 previews delivered to Drive; all seven GLBs validate; seven review-browser checks pass. World capture defect fixed. H7 review pending.
- LEGAL: no third-party art imported; owner-side Epic/Fab/MetaHuman access remains unverified.

## Evidence boundaries
- `docs/evidence/M0-v3/preflight.json`: actual host inventory; BLOCKED is expected here.
- `docs/evidence/M0-v3/local-checks.json`: local test results and extracted-source ZIP smoke check.
- `docs/evidence/batch-02/drive-delivery.json`: seven PNG uploads plus 11,497,461-byte source archive; Drive checksums matched.
- `docs/evidence/combat-slice/`: prior scoped prototype tests; not Unreal evidence.
- `docs/evidence/batch-02/validation.json`: structural/manifest checks only.
- `docs/evidence/batch-02/review.md`: visible defects and review limitations.
- No T5 FPS, path tracing, Art Lock, Windows launch or Blind Bench pass is claimed.

## Next
Follow NEXT.md. Do not expand final-art districts or treat source-only UE delivery as a finished game.
