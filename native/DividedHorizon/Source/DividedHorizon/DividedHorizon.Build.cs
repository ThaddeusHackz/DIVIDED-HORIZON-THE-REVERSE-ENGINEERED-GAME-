using UnrealBuildTool;
public class DividedHorizon : ModuleRules
{
    public DividedHorizon(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new string[] {
            "Core", "CoreUObject", "Engine", "InputCore", "Json", "ProceduralMeshComponent"
        });
    }
}
