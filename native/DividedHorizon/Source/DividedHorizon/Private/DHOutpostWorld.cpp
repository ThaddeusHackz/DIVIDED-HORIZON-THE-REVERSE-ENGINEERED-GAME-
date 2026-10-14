#include "DHOutpostWorld.h"
#include "DHMeshFormat.h"
#include "ProceduralMeshComponent.h"
#include "Components/BoxComponent.h"
#include "Materials/MaterialInterface.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
#include "Serialization/JsonSerializer.h"
#include "Dom/JsonObject.h"
#include "UObject/UObjectGlobals.h"

namespace
{
    bool JsonVector(const TSharedPtr<FJsonObject>& Object, const TCHAR* Key, FVector& Out)
    {
        const TArray<TSharedPtr<FJsonValue>>* Values = nullptr;
        if (!Object.IsValid() || !Object->TryGetArrayField(Key, Values) || Values->Num() != 3) return false;
        double X, Y, Z;
        if (!(*Values)[0]->TryGetNumber(X) || !(*Values)[1]->TryGetNumber(Y) || !(*Values)[2]->TryGetNumber(Z)) return false;
        Out = FVector(X, Y, Z);
        return !Out.ContainsNaN() && FMath::Abs(X) <= 1000000 && FMath::Abs(Y) <= 1000000 && FMath::Abs(Z) <= 1000000;
    }
}
ADHOutpostWorld::ADHOutpostWorld()
{
    PrimaryActorTick.bCanEverTick = false;
    Visuals = CreateDefaultSubobject<UProceduralMeshComponent>(TEXT("OutpostVisuals"));
    SetRootComponent(Visuals);
    Visuals->SetCollisionEnabled(ECollisionEnabled::NoCollision);
}

bool ADHOutpostWorld::BuildOutpost(FString& Error)
{
    if (bBuilt) return true;
    if (!VertexMaterial) VertexMaterial = LoadObject<UMaterialInterface>(nullptr, TEXT("/Game/Prototype/M_DHVertex.M_DHVertex"));
    if (!VertexMaterial) { Error = TEXT("Missing vertex material. Run tools/unreal/prepare_editor.py in Unreal."); return false; }
    const FString DataDirectory = FPaths::ProjectContentDir() / TEXT("PrototypeData");
    TArray<uint8> Bytes;
    if (!FFileHelper::LoadFileToArray(Bytes, *(DataDirectory / TEXT("world.dhmesh"))))
    { Error = TEXT("Missing world.dhmesh. Run npm run native:export, then repackage."); return false; }
    std::vector<DHMesh::Section> Sections; std::string ParseError;
    if (!DHMesh::Parse(Bytes.GetData(), Bytes.Num(), Sections, ParseError))
    { Error = UTF8_TO_TCHAR(ParseError.c_str()); return false; }
    FString Json;
    TSharedPtr<FJsonObject> Data;
    if (!FFileHelper::LoadFileToString(Json, *(DataDirectory / TEXT("mission.json")))
        || !FJsonSerializer::Deserialize(TJsonReaderFactory<>::Create(Json), Data) || !Data.IsValid())
    { Error = TEXT("Missing or malformed mission.json"); return false; }
    double Schema = 0;
    const TArray<TSharedPtr<FJsonValue>>* Tasks = nullptr;
    const TArray<TSharedPtr<FJsonValue>>* Boxes = nullptr;
    const TSharedPtr<FJsonObject>* Spawn = nullptr;
    const TSharedPtr<FJsonObject>* Exit = nullptr;
    if (!Data->TryGetNumberField(TEXT("schema"), Schema) || Schema != 1
        || !Data->TryGetArrayField(TEXT("objectives"), Tasks) || Tasks->Num() != 3
        || !Data->TryGetArrayField(TEXT("collision"), Boxes) || Boxes->Num() > 256
        || !Data->TryGetObjectField(TEXT("spawn"), Spawn) || !JsonVector(*Spawn, TEXT("position"), SpawnPosition)
        || !Data->TryGetObjectField(TEXT("extraction"), Exit) || !JsonVector(*Exit, TEXT("position"), ExtractionPosition))
    { Error = TEXT("Unsupported mission schema or missing data"); return false; }
    double ExitRange = 0;
    if (!(*Exit)->TryGetNumberField(TEXT("rangeCm"), ExitRange) || !FMath::IsFinite(ExitRange) || ExitRange < 50 || ExitRange > 1000)
    { Error = TEXT("Invalid extraction range"); return false; }
    ExtractionRange = static_cast<float>(ExitRange);
    TArray<FDHObjective> ParsedObjectives;
    const TCHAR* ExpectedIds[] = { TEXT("manifest"), TEXT("ledger"), TEXT("signal") };
    for (int32 I = 0; I < Tasks->Num(); ++I)
    {
        const TSharedPtr<FJsonObject>* Task = nullptr;
        FDHObjective Objective; double Range = 0, Index = -1;
        if (!(*Tasks)[I]->TryGetObject(Task) || !JsonVector(*Task, TEXT("position"), Objective.Position)
            || !(*Task)->TryGetStringField(TEXT("id"), Objective.Id) || Objective.Id != ExpectedIds[I]
            || !(*Task)->TryGetStringField(TEXT("label"), Objective.Label)
            || !(*Task)->TryGetStringField(TEXT("message"), Objective.Message)
            || !(*Task)->TryGetNumberField(TEXT("index"), Index) || Index != I
            || !(*Task)->TryGetNumberField(TEXT("rangeCm"), Range) || !FMath::IsFinite(Range) || Range < 50 || Range > 1000)
        { Error = TEXT("Invalid objective data"); return false; }
        Objective.RangeCm = static_cast<float>(Range); ParsedObjectives.Add(Objective);
    }
    TArray<FVector> Centers, Extents;
    for (const auto& Value : *Boxes)
    {
        const TSharedPtr<FJsonObject>* Box = nullptr; FVector Center, Extent;
        if (!Value->TryGetObject(Box) || !JsonVector(*Box, TEXT("center"), Center) || !JsonVector(*Box, TEXT("extent"), Extent)
            || Extent.X <= 0 || Extent.Y <= 0 || Extent.Z <= 0)
        { Error = TEXT("Invalid collision box"); return false; }
        Centers.Add(Center); Extents.Add(Extent);
    }
    // Validation is complete before any geometry or collision components are created.
    for (int32 S = 0; S < static_cast<int32>(Sections.size()); ++S)
    {
        const auto& Part = Sections[S];
        TArray<FVector> Vertices, Normals;
        TArray<FLinearColor> Colors;
        TArray<int32> Indices;
        Vertices.Reserve(Part.VertexCount); Normals.Reserve(Part.VertexCount); Colors.Reserve(Part.VertexCount);
        for (uint32 V = 0; V < Part.VertexCount; ++V)
        {
            const uint8* P = Bytes.GetData() + Part.VertexOffset + static_cast<SIZE_T>(V) * 40;
            Vertices.Emplace(DHMesh::F32(P), DHMesh::F32(P + 4), DHMesh::F32(P + 8));
            Normals.Emplace(DHMesh::F32(P + 12), DHMesh::F32(P + 16), DHMesh::F32(P + 20));
            Colors.Emplace(DHMesh::F32(P + 24), DHMesh::F32(P + 28), DHMesh::F32(P + 32), DHMesh::F32(P + 36));
        }
        Indices.Reserve(Part.IndexCount);
        for (uint32 I = 0; I < Part.IndexCount; ++I)
            Indices.Add(static_cast<int32>(DHMesh::U32(Bytes.GetData() + Part.IndexOffset + static_cast<SIZE_T>(I) * 4)));
        const TArray<FVector2D> UVs; const TArray<FProcMeshTangent> Tangents;
        Visuals->CreateMeshSection_LinearColor(S, Vertices, Indices, Normals, UVs, Colors, Tangents, false);
        UMaterialInstanceDynamic* Material = UMaterialInstanceDynamic::Create(VertexMaterial, this);
        Material->SetScalarParameterValue(TEXT("Roughness"), Part.Roughness);
        Material->SetScalarParameterValue(TEXT("Metallic"), Part.Metallic);
        Visuals->SetMaterial(S, Material);
    }
    for (int32 I = 0; I < Centers.Num(); ++I)
    {
        UBoxComponent* Box = NewObject<UBoxComponent>(this);
        AddInstanceComponent(Box); Box->SetupAttachment(Visuals);
        Box->SetRelativeLocation(Centers[I]); Box->SetBoxExtent(Extents[I]);
        Box->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
        Box->SetCollisionObjectType(ECC_WorldStatic);
        Box->SetCollisionResponseToAllChannels(ECR_Block);
        Box->SetGenerateOverlapEvents(false); Box->SetHiddenInGame(true); Box->RegisterComponent();
    }
    Objectives = MoveTemp(ParsedObjectives); bBuilt = true;
    return true;
}
