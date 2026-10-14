# SECTION 20 — WORKING PROTOCOL (HOW YOU OPERATE)

STEP 1  Reply FIRST with: architecture summary, risk list, and your M0 plan.
        Wait? NO — assume approval and BUILD M0 immediately after the plan.
STEP 2  Work milestone-by-milestone. After each: run smoke tests, run the game
        headlessly (and interactively if a preview exists), then WRITE
        `/docs/reports/MX_report.md` (done / stubs / deviations / fps notes).
STEP 3  Commit per milestone on the session's working branch with message
        `M#: title`. Never leave the tree broken.
STEP 4  On M8: run full Section 18 suite, produce the zip, and reply with:
        FINAL REPORT — honest scoreboard vs this spec, the deliverable tree,
        measured FPS table, known gaps (there WILL be some — name them), and
        how to build from source if the prebuilt fails.

COMMANDS YOU WILL USE CONSTANTLY:
  RunUAT BuildCookRun -project=DividedHorizon.uproject -platform=Win64 -clientconfig=Shipping -build -cook -stage -pak -archive
  UnrealEditor-Cmd DividedHorizon -ExecCmds="Automation RunTests Project.Smoke; Quit" -unattended -nullrhi
  ./tools/build.sh   # one-shot: compile → cook → automation → package → zip (Section 133)
