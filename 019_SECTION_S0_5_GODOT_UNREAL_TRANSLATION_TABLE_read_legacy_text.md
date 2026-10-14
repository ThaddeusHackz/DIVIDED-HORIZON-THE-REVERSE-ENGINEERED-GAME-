# SECTION S0.5 — GODOT → UNREAL TRANSLATION TABLE (read legacy text through this)

| LEGACY (Godot term) | UE5 EQUIVALENT |
|---------------------|----------------|
| project.godot / autoload singleton | .uproject / GameInstanceSubsystem, WorldSubsystem |
| EventBus signal | Gameplay Message Subsystem, multicast delegates, Gameplay Tags |
| CharacterBody3D | ACharacter + Mover (or CMC) with custom movement modes |
| VehicleBody3D | Chaos Vehicles (custom wheel/suspension model, Section 114) |
| Camera3D / CameraPivot | Gameplay Camera System / CameraComponent + physical camera settings |
| NavAgent / NavigationRegion3D | NavMesh + NavLinks + Smart Objects + Mass Navigation |
| FSM / behavior tree | StateTree (top-level) + Behavior Tree leaves + EQS |
| AnimTree | Animation Blueprint + Pose Search (Motion Matching) + Control Rig |
| Area3D / BondArea | Overlap volumes / Gameplay Ability System tasks / Mass processors |
| .tscn scenes | Levels + World Partition cells + Blueprint classes + Data Layers |
| GPUParticles3D | Niagara |
| ShaderMaterial / StandardMaterial3D | Material Graph, Substrate, Material Instances |
| DirectionalLight3D + SSAO | Directional Light + Lumen GI + VSM + Sky Atmosphere |
| Resource (.tres) | Data Assets, Data Tables, Primary Data Assets |
| GUT tests | Automation Spec + Functional Tests + Gauntlet |
| FastNoiseLite terrain | Landscape + heightfields (Gaea/Houdini/World Creator) + PCG |
| glTF import | FBX/USD/glTF via Interchange; Datasmith for DCC scenes |
| TTS voice placeholders | Final VO (studio/AI-cloned with consent) + MetaHuman Animator / audio-driven facial |
