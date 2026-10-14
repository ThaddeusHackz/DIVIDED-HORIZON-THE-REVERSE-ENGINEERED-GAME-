# SECTION Ω.9 — SESSION PROTOCOL (memory across hundreds of sessions)

Ω.9.1 STATE FILES (create in M0, keep under 300 lines each):
      docs/state/STATE.md      — milestone, lane status, what works now
      docs/state/NEXT.md       — the ordered next 10 tasks (with S149 WBS IDs)
      docs/state/DECISIONS.md  — one line per decision, linking to the ADR
      docs/state/HUMAN_ASKS.md — open human-only items (Ω.4)
      docs/state/KNOWN_ISSUES.md — visual/feel defects not yet fixed
Ω.9.2 EVERY SESSION: (1) read START_HERE §Ω and docs/state/*; (2) pick the top
      task from NEXT.md; (3) load ONLY the library sections and ledger rows
      that task cites; (4) implement → test → capture → review (Ω.6);
      (5) commit with evidence; (6) update STATE.md and NEXT.md; (7) continue
      with the next task. Do not end a session by asking whether to continue
      when unblocked work exists.
Ω.9.3 CONTEXT BUDGET: keep at most ~40% of your context for loaded spec text.
      Grep the library by section number or row ID (e.g. `grep -n "^| ANM-0421 "`).
      Never paste a whole ledger.
Ω.9.4 SUBAGENTS: if your harness supports subagents, map them to the S131
      lanes. Each subagent gets its lane's folder ownership, the relevant
      library sections and the state files. The PRODUCER (you, the lead)
      integrates and owns NEXT.md.
