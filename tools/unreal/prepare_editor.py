"""Run with UnrealEditor-Cmd -ExecutePythonScript=... after compiling the Editor target.
Creates ONLY this project's dedicated prototype map/materials; no third-party assets.
This UE-dependent script cannot be validated by the Linux source-only test suite.
"""
import json
import traceback
from pathlib import Path
import unreal

ROOT = Path(unreal.Paths.project_dir()).resolve()
SAVED = ROOT / 'Saved'
MARKER = SAVED / 'DHContentPrepared.json'
MATERIAL = '/Game/Prototype/M_DHVertex'
LEVEL = '/Game/Maps/L_PuertoChico'


def require(value, message):
    if not value:
        raise RuntimeError(message)
    return value


def make_material():
    existing = unreal.load_asset(MATERIAL)
    if existing:
        return existing  # Existing artist edits are not silently overwritten.
    tools = unreal.AssetToolsHelpers.get_asset_tools()
    material = require(tools.create_asset('M_DHVertex', '/Game/Prototype', unreal.Material, unreal.MaterialFactoryNew()), 'Material creation failed')
    material.set_editor_property('two_sided', True)
    editing = unreal.MaterialEditingLibrary
    color = editing.create_material_expression(material, unreal.MaterialExpressionVertexColor, -600, -100)
    tint = editing.create_material_expression(material, unreal.MaterialExpressionVectorParameter, -600, 100)
    tint.set_editor_property('parameter_name', 'Tint')
    tint.set_editor_property('default_value', unreal.LinearColor(1, 1, 1, 1))
    multiply = editing.create_material_expression(material, unreal.MaterialExpressionMultiply, -300, 0)
    require(editing.connect_material_expressions(color, 'RGB', multiply, 'A'), 'Vertex color connection failed')
    require(editing.connect_material_expressions(tint, 'RGB', multiply, 'B'), 'Tint connection failed')
    require(editing.connect_material_property(multiply, '', unreal.MaterialProperty.MP_BASE_COLOR), 'Base color connection failed')
    for name, value, prop, y in [('Roughness', .85, unreal.MaterialProperty.MP_ROUGHNESS, 250), ('Metallic', 0., unreal.MaterialProperty.MP_METALLIC, 400)]:
        node = editing.create_material_expression(material, unreal.MaterialExpressionScalarParameter, -300, y)
        node.set_editor_property('parameter_name', name)
        node.set_editor_property('default_value', value)
        require(editing.connect_material_property(node, '', prop), name + ' connection failed')
    editing.recompile_material(material)
    require(unreal.EditorAssetLibrary.save_loaded_asset(material), 'Material save failed')
    return material


def prepare():
    SAVED.mkdir(exist_ok=True)
    MARKER.unlink(missing_ok=True)
    require((ROOT / 'Content/PrototypeData/world.dhmesh').is_file(), 'Run npm run native:export before editor preparation')
    data = json.loads((ROOT / 'Content/PrototypeData/mission.json').read_text())
    require(data['schema'] == 1, 'Unsupported mission schema')
    material = make_material()
    actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
    levels = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
    require(actors and levels, 'This script needs a full Editor session, not the Python commandlet')
    created = False
    if unreal.EditorAssetLibrary.does_asset_exist(LEVEL):
        require(levels.load_level(LEVEL), 'Existing prototype map could not be loaded')
    else:
        require(levels.new_level(LEVEL), 'New level creation failed')
        created = True
        def spawn(kind, location, rotation=None, label=None):
            actor = require(actors.spawn_actor_from_class(kind, unreal.Vector(*location), rotation or unreal.Rotator()), 'Actor creation failed: ' + str(kind))
            if label:
                actor.set_actor_label(label)
            return actor
        spawn(unreal.PlayerStart, data['spawn']['position'], label='DH_PlayerStart')
        sun = spawn(unreal.DirectionalLight, [0, 0, 1200], unreal.Rotator(-38, -35, 0), 'DH_DawnSun')
        light = sun.get_component_by_class(unreal.DirectionalLightComponent)
        light.set_mobility(unreal.ComponentMobility.MOVABLE)
        light.set_editor_property('intensity', 8.0)
        light.set_editor_property('atmosphere_sun_light', True)
        sky = spawn(unreal.SkyLight, [0, 0, 700], label='DH_SkyLight')
        sky_component = sky.get_component_by_class(unreal.SkyLightComponent)
        sky_component.set_mobility(unreal.ComponentMobility.MOVABLE)
        sky_component.set_editor_property('real_time_capture', True)
        spawn(unreal.SkyAtmosphere, [0, 0, 0], label='DH_Atmosphere')
        spawn(unreal.ExponentialHeightFog, [0, 0, -200], label='DH_CoastalHaze')
        # The static plane is only a visual water surface; swimming is not implemented.
        water = spawn(unreal.StaticMeshActor, [0, 0, -72], label='DH_PrototypeOcean')
        water.set_actor_scale3d(unreal.Vector(500, 500, 1))
        mesh = water.get_component_by_class(unreal.StaticMeshComponent)
        mesh.set_static_mesh(require(unreal.load_asset('/Engine/BasicShapes/Plane'), 'Engine plane missing'))
        mesh.set_collision_enabled(unreal.CollisionEnabled.NO_COLLISION)
        tools = unreal.AssetToolsHelpers.get_asset_tools()
        water_path = '/Game/Prototype/MI_DHWater'
        instance = unreal.load_asset(water_path) or tools.create_asset('MI_DHWater', '/Game/Prototype', unreal.MaterialInstanceConstant, unreal.MaterialInstanceConstantFactoryNew())
        require(instance, 'Water material creation failed')
        unreal.MaterialEditingLibrary.set_material_instance_parent(instance, material)
        unreal.MaterialEditingLibrary.set_material_instance_vector_parameter_value(instance, 'Tint', unreal.LinearColor(.037, .21, .17, 1))
        unreal.MaterialEditingLibrary.set_material_instance_scalar_parameter_value(instance, 'Roughness', .45)
        mesh.set_material(0, instance)
        require(unreal.EditorAssetLibrary.save_loaded_asset(instance), 'Water material save failed')
    require(levels.save_current_level(), 'Map save failed')
    # Only a real saved map/material should satisfy the packaging preflight.
    require((ROOT / 'Content/Maps/L_PuertoChico.umap').is_file(), 'Saved map file not found')
    require((ROOT / 'Content/Prototype/M_DHVertex.uasset').is_file(), 'Saved material file not found')
    MARKER.write_text(json.dumps({'schema': 1, 'level': LEVEL, 'material': MATERIAL, 'createdMap': created,
                                  'status': 'CONTENT_SAVED_NOT_PLAYTESTED'}, indent=2))
    unreal.log('DH: prototype content prepared; runtime and visual verification still required.')


if __name__ == '__main__':
    try:
        prepare()
    except Exception:
        SAVED.mkdir(exist_ok=True)
        MARKER.unlink(missing_ok=True)
        (SAVED / 'DHContentPreparationFailure.log').write_text(traceback.format_exc())
        unreal.log_error(traceback.format_exc())
    finally:
        # Some editor failures exit with code 0. build.ps1 additionally requires the marker.
        unreal.SystemLibrary.quit_editor()
