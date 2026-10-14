# ADR 0002 — Adopt v3 execution order without relabeling the prototype
Date: 2026-10-14 · Status: accepted

Owner upload `525182ac83a8f7c0764b52296f6d5a7d46dd475d` adds 100 files, including
`START_HERE_v3.md`, `MASTER_PROMPT_v3.md` and numbered section extracts.
Merged `origin/main` into the existing working branch; no source prompt was rewritten.
Precedence: Part Ω > Part 0 > XI–XV > I–X > ledgers.

- Production remains UE5; current 5.6-targeted foundation is provisional and uncompiled.
- T5 is the aspirational top visual tier, not a measured capability of this build.
- M0 is open. Browser/core/PE checks do not pass the Unreal boot gate.
- M6 final-art expansion is forbidden until both Golden Slices pass their gates.
- Retain prototype assets for design/interaction tests; no final-art or Art Lock labels.
- Evaluate licensed Epic foundations before new production gameplay systems.
- No disposable-account quota bypass. No purchases, account acceptance or remote runner provisioning performed.

Spec reconciliation: Ω.1 says the old generators are absent, but they exist in this
checkout. Preserve them for v2 integrity checking; do not run them over v3.
`library/` is not supplied: use numbered root extracts, START_HERE, then exact
section/row lookups in MASTER_PROMPT_v3. No redundant copy of the 100k-line library.
The WBS E01 rows cite S116–121 generically; their Foundation/CI prose is governed by
Ω.3–9 and S102/131–136. Record task progress separately rather than silently editing ledgers.
