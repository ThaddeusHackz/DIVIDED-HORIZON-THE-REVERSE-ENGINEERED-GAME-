# SECTION 19 — FAILURE PROTOCOL (WHEN YOU HIT A WALL)

If a system can't be completed in the environment (no export templates, no GPU
for profiling, pack download blocked):
  1. DO NOT fake it (no stub named like the real thing without saying so).
  2. Implement the DOWNGRADED but working version (box car > missing car).
  3. Log it in the milestone report: BLOCKED — reason — workaround used —
     what the user should do (e.g., run `build.ps1` on their PC).
  4. Keep the game runnable (P5). A milestone is late or downsized, never broken.
