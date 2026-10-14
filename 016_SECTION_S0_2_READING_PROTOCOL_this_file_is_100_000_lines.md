# SECTION S0.2 — READING PROTOCOL (this file is ~100,000 lines)

No model context window holds 100,000 lines at once. That is by design: this
file is a LIBRARY with a fixed entry point, not a single monolithic paste.
  1. ALWAYS load first: the INDEX (top of file), Part 0, and Sections 101–136.
     (~1,500 lines — this is "the brief".) Everything in it is binding.
  2. Load legacy Parts I–X by SECTION NUMBER when a system needs its lore,
     balance numbers or beat sheets (Part IV codex, V armory, VI campaign).
  3. Machine ledgers (Part XVI) and legacy matrices (IX–X) are LOOK-UP TABLES. Never read them
     linearly. Use the INDEX line ranges: `sed -n 'START,ENDp' MASTER_PROMPT.md`
     or `grep -n "^| ANM-0421 " MASTER_PROMPT.md`. Every row has a stable ID.
  4. When a matrix row and prose disagree, PROSE WINS; log the row as stale.
  5. Rebuild: `python3 tools/build_prompt.py` regenerates this file from
     [v3 NOTE] Those generator tools are not supplied. Treat ledgers as data (Ω.1 V2).
     prompt_src/ and tools/gen_v2/ (deterministic; no RNG; byte-identical).
