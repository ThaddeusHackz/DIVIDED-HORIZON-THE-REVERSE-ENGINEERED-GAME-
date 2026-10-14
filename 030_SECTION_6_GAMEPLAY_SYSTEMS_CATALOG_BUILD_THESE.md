# SECTION 6 — GAMEPLAY SYSTEMS CATALOG (BUILD THESE)

6.1 PLAYER MOVEMENT (feel is PRIORITY #1)
   - Walk/run/sprint with acceleration curves; crouch; slide down slopes.
   - Jump + mantle/vault (1.2 m step, 2.2 m vault, 4 m ledge grab).
   - Swim on surface + dive (breath meter); ladder climb; ziplines (island).
   - Wingsuit-lite glide from high falls (island skill unlock) — lift/drag model.
   - Fall damage with roll-to-cancel window.
   - Camera: 60 FPS game feel, coyote time 120 ms, jump buffer 150 ms.

6.2 COMBAT
   - Weapons: semi-auto pistol, SMG, assault rifle, shotgun, sniper (scoped),
     bow (silent), thrown (molotov, grenade, smoke). Slots: 2 primaries + sidearm
     + 2 throwables. Loot ammo from enemies/crates.
   - Ballistics: hitscan for guns with tracer + impact FX; projectile for bow
     and throwables. Damage zones: head x2.5, torso x1.0, limb x0.7.
   - Recoil patterns per weapon; hipfire vs ADS (sensitivity scale).
   - Enemy feedback: hit react anim, damage numbers optional (settings),
     killcam-lite slowmo on last kill of an encounter (toggleable).

6.3 STEALTH SYSTEM
   - Detection meter per enemy (suspicion → search → alert → combat).
   - Noise model: footsteps by surface, silenced vs unsilenced, bodies alert.
   - Tagging (binoculars/drone-lite): tagged enemies visible through walls at
     low opacity for 60 s.
   - Takedowns (front/back, ledge, from water), body hiding (bushes/containers).
   - Last-known-position: enemies investigate where they lost you.

6.4 ENEMY AI (behavior tree / state machine hybrid)
   States: PATROL → SUSPICIOUS → SEARCH → COMBAT → FLEE(suppress) → DEAD.
   - Patrol graphs with wait/look/phone-idle variety; vision cone + hearing.
   - Combat: cover points, flanking routes, grenade flush-outs at squad size>=3,
     reinforcements from nearest garrison (max 2 waves), morale break for
     outmatched grunts (island cultists fight to death; city gangers flee).
   - Factions: LA COSECHA (cult, island), CARTEL DEL FARO (city traffickers),
     MERIDIAN PD (city law). Hostility matrix per faction.

6.5 WANTED / HEAT SYSTEM (city) — "REPUTAZIONE"
   0-5 stars. Witnesses call it in; cameras in downtown add heat passively.
   Response ladder: 0 idle · 1 patrol cars seek · 2 cruisers + roadblocks ·
   3 SWAT vans + SMG units · 4 helicopter spotlight + spike strips ·
   5 armored units + shoot-on-sight everywhere.
   Escape: break line of sight + distance + 20 s timer (cone on minimap shows
   search zone). Bribe/launder at "El Banco Menor" after cooldown.
   Island equivalent: cult ALERT LEVEL per region (garrisons reinforce nearby
   outposts after loud attacks; stealth keeps alert low).

6.6 VEHICLES
   Classes: compact, muscle car, van, pickup, taxi (stealable), police cruiser
   (stealable = +2 heat), motorcycle, boat (island), dinghy, jet-ski-lite.
   - Arcade handling model (grip/drift/boost-by-downforce, NO sim physics).
   - Damage model: deformation proxies + smoke/fire at thresholds, explode.
   - Radio: 3 stations (Section 14) with working volume knob logic.
   - Traffic AI: spline following, gap acceptance, stop at lights, panic flee
     at gunfire (scatter impulse), parked car population at night near venues.
   - Enter/exit/steal animation states (carjack with driver pull-out).

6.7 WORLD LIFE & SYSTEMS
   - Day/night cycle 24 min real-time default (slider in settings).
   - Weather: clear → overcast → rain (island monsoon bursts) with wet-surface
     shader darken + particle rain + thunder audio.
   - Wildlife island: wandering herbivores, bird flocks (boids-lite), fish.
   - Civilians city: sidewalk graphs, panic states, 911 flee-to-cover.
   - Economy: two currencies (ISLAND: contraband bars; CITY: dollars). Shops,
     black-market weapons locker, safehouse stash, outfit changes.

6.8 PROGRESSION & SKILLS
   Three trees: SHADOW (stealth), FURY (combat), GHOST (survival/mobility).
   Skill points from levels (XP from all activities) + challenge completions.
   24 skills total (8/tree), e.g., "Double Takedown", "Hold Breath x2",
   "Glider Boost", "Scavenge x2", "Fast Search", "Hotwire".
   Crafting (island): health kits, molotovs, special arrows from hunted hides.

6.9 MISSIONS & STORY (original — Section 7)
   8 story missions + 3 finale missions = 11 total, each 10–20 min first play.
   Mission structure: cutscene-lite (camera pans + text cards + TTS voice lines),
   objectives with waypoint UI, checkpoints every stage, fail states with retry.

6.10 SIDE CONTENT
   Island: 12 outpost liberations, 3 stronghold assaults, 8 relic hunts
   (puzzle-lite platforming), 6 delivery races (vehicle/timer), 15 collectibles
   ("Corridas de la Suerte" cards with lore).
   City: 10 odd jobs (chase/hit/delivery/getaway), 5 street races, 6 robbery
   mini-missions (mini-games: hack panel timed-QTE-lite, drill timer, loot),
   10 collectibles (graffiti tags — walk up, snap photo for XP).
   Total target: 8–12 hours first playthrough.

6.11 UX SYSTEMS
   - Main menu: Continue / New Game / Load / Settings / Extras / Quit.
   - Settings: display (fullscreen, resolution, vsync, quality preset Low-Ultra,
     FOV slider 70–110), audio (master/music/SFX/voice sliders), gameplay
     (aim assist strength, difficulty Explorer/Normal/Hardcore, hints toggle),
     controls (full rebind, gamepad auto-detect with glyphs).
   - HUD: health + armor segments, ammo, minimap, compass optional, objective
     tracker, stealth eye indicator, heat stars (city)/alert meter (island).
   - Pause menu actually pauses (including world audio duck).
   - Save: 3 slots + autosave on mission stage/outpost capture/travel; JSON saves
     in user:// (never in install dir).
