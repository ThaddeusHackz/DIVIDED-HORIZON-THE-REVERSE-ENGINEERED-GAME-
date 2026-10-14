# SECTION Ω.1 — WHAT v3 FIXES (audit of v2)

  V1  CONTEXT OVERLOAD. v2 is ~100,000 lines (~3 million tokens). No model can
      hold it, and the ~92,000 machine-generated ledger lines crowd out the
      ~2,000 lines that actually steer the build. v3 adds START_HERE (the brief,
      ~2,500 lines) and moves everything else into library/ files that you open
      by section number. Ledgers are lookup tables: never read them start to end.
  V2  NONEXISTENT TOOLS. v2 refers to tools/build_prompt.py, prompt_src/ and
      tools/gen_v2/. You do not have them. Treat the ledgers as finished data,
      and regenerate any ledger you need with your own deterministic script
      under tools/ledgers/.
  V3  NO MACHINE CONTRACT. v2 never says which computer you run on or how a
      text-based agent drives a graphical editor. Ω.3 and Ω.4 define both.
  V4  REINVENTING SOLVED PROBLEMS. v2 plans to build locomotion, crowds,
      traffic, cities and photoreal humans from scratch. Epic ships free,
      production-grade foundations for all of them. Ω.5 makes them day-0 inputs.
  V5  BLIND SELF-REVIEW. v2 requires evidence but never says how a coding agent
      looks at a frame. Ω.6 adds a capture → vision-review → fix loop.
  V6  SCALE BEFORE QUALITY. v2's milestones allow world scale-up to overlap
      unfinished quality slices. Ω.7 makes the SLICE LAW strict.
  V7  BENCHMARKS NAMED, NOT DEFINED. "Like GTA VI / GTA V / Far Cry 3" gets
      broken into measurable, legal targets in Ω.8.
  V8  SESSION AMNESIA. Long builds span hundreds of sessions. Ω.9 defines the
      state files every session reads first and updates last.
  V9  CHARACTER LIKENESS. Generated faces can drift toward real celebrities.
      Ω.10 forbids real-person likeness and defines the cast-design pipeline.
