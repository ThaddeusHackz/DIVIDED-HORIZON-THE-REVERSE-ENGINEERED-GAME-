# SECTION 102 — REPOSITORY, MODULES & CODE STANDARDS

102.1 REPO LAYOUT (Git LFS for content):
   /DividedHorizon.uproject
   /Source
     /DHCore        GameInstance/World subsystems, save, settings, data registry,
                    tags, message bus, time-of-day + weather controller, telemetry
     /DHMovement    Mover modes, traversal (mantle/vault/climb/swim/zip/glide),
                    motion-matching glue, foot IK, warping providers
     /DHCombat      weapons, ballistics, damage, hit reactions, melee/takedown,
                    explosives, fire, destruction hooks, aim assist, recoil
     /DHAI          StateTree tasks, perception, cover/Smart Objects, squad
                    director, EQS contexts, wildlife, dog companion
     /DHVehicle     Chaos vehicle model, damage/deformation, radio, boats/air
     /DHWorld       streaming rules, PCG graphs glue, ecology, population,
                    traffic, events, wanted/law, persistence
     /DHMission     objective system, triggers, checkpoints, dialogue runtime
     /DHUI          CommonUI layer: HUD, map, menus, photo mode, accessibility
     /DHAudio       MetaSounds glue, propagation, mix states, dynamic music
     /DHTools       editor utilities, validators, batch importers, Python bridge
     /DHTests       Automation specs, functional test actors, Gauntlet configs
   /Plugins         3rd-party + internal plugins (each with README + license)
   /Content
     /Art           /Characters /Creatures /Weapons /Vehicles /Props /Architecture
                    /Landscape /Foliage /Materials /Decals /Textures /VFX
     /Animation     /MotionMatching /Weapons /Traversal /Vehicles /Takedowns
                    /Facial /Cinematic /Retarget
     /Audio         /Weapons /Foley /Ambience /Music /VO /Radio /Vehicles
     /Maps          IslaSombra (WP), Meridian (WP), Interiors, Sandbox, TestRange
     /Data          DataAssets, DataTables, JSON imports (balance numbers 10.4)
     /UI            /Widgets /Fonts /Icons
   /Saved, /Intermediate, /DerivedDataCache, /Binaries  → gitignored
   /tools           build.sh/.ps1, validate_content.py, gen scripts, CI configs
   /docs            ADRs, reports/MX_report.md, LICENSES.md, CHANGELOG.md
102.2 NAMING (enforced by validator): SM_ static mesh, SK_ skeletal, M_/MI_/MF_
      materials/instances/functions, T_ texture (suffix _BC _N _ORM _E _H _M),
      NS_ Niagara, ABP_ anim BP, PSD_ pose-search DB, AS_/AM_/BS_ anim assets,
      CR_ control rig, IKR_ IK rig, BP_ blueprint, DA_ data asset, DT_ table,
      WP_/L_ maps, MS_ MetaSound, SC_ sound cue, SW_ sound wave, A_ audio attn.
102.3 C++ STANDARDS: Epic coding standard; UCLASS/USTRUCT reflection for all
      tunables; no raw new/delete; TObjectPtr; async loading via
      StreamableManager/AssetManager; no blocking loads on game thread; tick
      only where required (prefer timers, Mass processors, event-driven);
      `SCOPED_NAMED_EVENT` + `TRACE_CPUPROFILER_EVENT_SCOPE` in every system
      update; no hard references from gameplay modules to content (soft only).
102.4 ACTOR/COMPONENT LAYOUT (replaces legacy §84):
   PLAYER  ADHPlayerCharacter : ACharacter/Mover
     ├ USkeletalMeshComponent Body (full-body, first-person capable)
     ├ UDHFirstPersonArmsComponent (FP arms proxy, shared skeleton)
     ├ UDHMovementComponent, UDHTraversalComponent, UDHFootIKComponent
     ├ UDHWeaponManager → ADHWeapon[] (skeletal, attachments as child comps)
     ├ UDHHealthComponent, UDHStaminaComponent, UDHStatusEffects
     ├ UDHInteractionComponent, UDHCompanionBond (Poncho)
     ├ UCameraComponent + UDHCameraDirector (FP/TP blend, recoil, sway)
     └ UDHClothHandle (poncho cloth: Chaos Cloth asset)
   ENEMY   ADHAICharacter : ACharacter + UStateTreeAIComponent, UAIPerception,
           UDHSquadMember, UDHCoverUser (SmartObject), UDHHitReactionComponent,
           UPhysicalAnimationComponent, UDHLootDropper, UDHBarkComponent
   VEHICLE ADHVehicle : AChaosWheeledVehiclePawn (or custom) + seats[],
           UDHDamageModel (zone deform + part detach), UDHRadioComponent,
           UDHVehicleAudio (MetaSound), UDHVehicleLights
   CROWD   Mass entities (fragments: Transform, Velocity, Appearance, Schedule,
           Panic, Faction) → ISM → skeletal LOD actors within 25–40 m
   WORLD   ADHWorldController: time-of-day, weather, ecology, events, law
102.5 DATA-DRIVEN RULE (10.4 stays): balance/economy/loot/spawn tables are
      DataAssets + JSON-importable DataTables. Hot-reload in editor; validated
      by tools/validate_content.py in CI (schema + range checks).
