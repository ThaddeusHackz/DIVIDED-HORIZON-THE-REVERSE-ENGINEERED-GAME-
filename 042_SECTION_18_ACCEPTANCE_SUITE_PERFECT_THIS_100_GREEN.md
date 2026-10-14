# SECTION 18 — ACCEPTANCE SUITE ("PERFECT" = THIS, 100% GREEN)

18.0 SMOKE TESTS (headless, run every milestone): boot to menu; new game loads;
     each system's unit test (save/load round-trip, damage math, heat transitions,
     vehicle enter/exit, mission objective chain).
18.1 BOOT: clean double-click boot < 30 s to menu on T3 (NVMe); < 60 s on T1 (HDD). `-safe` launches SM5/low-scalability path.
18.2 STABILITY: 60-min session, no crash, no leak (>10% RSS growth = fail),
     alt-tab safe, windowed/fullscreen toggle safe, quit saves cleanly.
18.3 PERFORMANCE: frame-time gates per tier as defined in Section 109 (e.g. T3: 60 FPS
     avg, 1% low >= 45 FPS @ 1440p TSR-Quality/High). Measured via Unreal Insights + CSV profiler.
18.4 COMBAT: all 8 weapons fire/reload/empty states; takedowns; throwables;
     death/respawn/checkpoint integrity (no lost progress).
18.5 STEALTH: full loop (tag → takedown → hide) works on outpost AND city
     mission; detection meter UI truthful.
18.6 VEHICLES: all classes drive/damage/explode; radio changes stations;
     traffic survives 15-min soak; 5-star evasion reachable and escapable.
18.7 ECONOMY/PROGRESSION: buy/sell; skills unlock and apply; save → quit →
     load restores position, inventory, world state.
18.8 CONTENT: 11/11 missions completable start→end on Normal; both endings;
     all 12 outposts capturable; all 3 strongholds; at least 12 side missions.
18.9 UX: rebind persists; gamepad plays start-to-finish; subtitles on; FOV
     slider works; quality presets switch live without restart-crash.
18.10 LEGAL: LICENSES.md complete; zero third-party IP strings (grep your own
      repo for "GTA|FarCry|Rockstar|Ubisoft|Marvel|Spider" — must only hit
      this document's history or be absent).
18.11 DELIVERY: `dist/DividedHorizon-win64.zip` extracts → .exe launches on a
      clean Windows 10/11 x64 profile (no Unreal Editor install needed; redistributables bundled). Honest size reported.
