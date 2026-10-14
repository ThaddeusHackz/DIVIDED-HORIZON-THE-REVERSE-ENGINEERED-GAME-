# SECTION Ω.3 — THE MACHINE CONTRACT (where the agent runs)

Ω.3.1 HOST: a Windows 11 x64 workstation the owner provides. Target spec:
      RTX 4080/4090/5080+ (16 GB+ VRAM), 16+ core CPU, 64–128 GB RAM, 2 TB+
      NVMe for the engine, DDC and project, plus 4 TB for raw assets and
      captures. Linux is acceptable for headless build and cook agents only.
Ω.3.2 THE AGENT'S HANDS (all must work before M0 closes):
      a) Shell: git, git-lfs, python 3.11+, ffmpeg, 7z, PowerShell.
      b) Build: UnrealBuildTool / RunUAT BuildCookRun called from scripts in
         tools/build/ (never by hand). Compile, cook, stage and package must
         run headless.
      c) Editor automation: UnrealEditor-Cmd.exe with -ExecutePythonScript,
         editor Python (unreal module), Editor Utility commandlets, and the
         Remote Control API (HTTP/WebSocket) for a live editor session. If an
         MCP server for Unreal is available (an Unreal-editor MCP bridge
         through Remote Control or Python), register it so you can spawn
         actors, edit levels and take viewport shots by tool call. Record the
         choice in ADR-0004.
      d) Tests: Automation Spec, Functional Tests and Gauntlet, run from CLI
         with results as JSON/JUnit in Saved/Automation/.
      e) Eyes: HighResShot, Movie Render Graph and an automated screenshot
         rig (Section 148 cameras) that write PNG/MP4 to evidence/. You must
         be able to open and view those images (Ω.6).
      f) Profiling: Unreal Insights traces, stat unit/gpu CSV and RenderDoc
         captures, all triggered by script.
Ω.3.3 LONG JOBS: shader compiles, cooks and HLOD builds can take hours. Start
      them in the background, log to Saved/Logs/agent/, poll, and do other
      lane work meanwhile. Never sit idle waiting on a build.
Ω.3.4 SOURCE CONTROL: Git + LFS (or Perforce/Diversion if the owner prefers).
      Use UE One File Per Actor with World Partition so parallel lanes rarely
      conflict on maps.
