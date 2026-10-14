using UnrealBuildTool;
public class DividedHorizonEditorTarget : TargetRules
{
    public DividedHorizonEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;
        ExtraModuleNames.Add("DividedHorizon");
    }
}
